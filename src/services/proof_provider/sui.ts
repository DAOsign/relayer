import { Network, ProofProvider, ProofTypedMessage, SignedProof } from "./index";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock, Inputs } from "@mysten/sui.js/transactions";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { createContractPayload } from "../../utils/transformers";
import { bcs, hex2vec, serializeSigner, str2hex } from "./bcs";
import env from "../../env";
import { BCS } from "@mysten/bcs";

export class SuiProofProvider implements ProofProvider {
  network = Network.SUI;
  bagReference = env.SUI_BAG_ID;

  txb = new TransactionBlock();
  mnemonic = env.SUI_MNEMONIC;

  client: SuiClient;

  constructor(netType: "mainnet" | "testnet" | "devnet" | "localnet") {
    this.client = new SuiClient({ url: getFullnodeUrl(netType) });
  }

  public async get(proofCID: string): Promise<SignedProof> {
    const call = await this.client.call("get_proof_of_agreement", [this.bagReference, proofCID]);

    // @ts-ignore
    const mock: ProofTypedMessage = {};

    return { message: mock, proofCID: proofCID, signature: "" };
  }

  public async set(derivationPath: string = "m/44'/784'/1'/0'/0'", proof: SignedProof): Promise<string> {
    console.log("proof");
    console.dir(proof.message.types);

    const keypair = Ed25519Keypair.deriveKeypair(this.mnemonic, derivationPath);
    this.txb.setGasBudget(50000000);

    const contractPayload = createContractPayload(proof);

    if (contractPayload.message.name === "Proof-of-Authority") {
      const data = bcs.ser("ProofOfAuthority", {
        name: contractPayload.message.name,
        from: hex2vec(contractPayload.message.from),
        agreementCID: contractPayload.message.agreementCID,
        signers: serializeSigner(contractPayload.message.signers),
        app: contractPayload.message.app,
        timestamp: contractPayload.message.timestamp,
        metadata: contractPayload.message.metadata,
      });

      this.txb.moveCall({
        target: `${env.SUI_PACKAGE_ID}::${"application"}::${"store_proof_of_authority"}`,
        arguments: [
          this.txb.object(env.SUI_BAG_ID),
          this.txb.pure(data.toString("hex"), BCS.HEX),
          this.txb.pure(contractPayload.signature, BCS.HEX),
          this.txb.pure(str2hex(contractPayload.proofCID), BCS.HEX),
        ],
      });
    }

    if (contractPayload.message.name === "Proof-of-Signature") {
      const data = bcs.ser("ProofOfSignature", {
        name: contractPayload.message.name,
        signer: hex2vec(contractPayload.message.signer),
        authorityCID: contractPayload.message.authorityCID,
        app: contractPayload.message.app,
        timestamp: contractPayload.message.timestamp,
        metadata: contractPayload.message.metadata,
      });

      this.txb.moveCall({
        target: `${env.SUI_PACKAGE_ID}::${"application"}::${"store_proof_of_signature"}`,
        arguments: [
          this.txb.object(env.SUI_BAG_ID),
          this.txb.pure(data.toString("hex"), BCS.HEX),
          this.txb.pure(contractPayload.signature, BCS.HEX),
          this.txb.pure(str2hex(contractPayload.proofCID), BCS.HEX),
        ],
      });
    }

    if (contractPayload.message.name === "Proof-of-Agreement") {
      const data = bcs.ser("ProofOfAgreement", {
        authorityCID: contractPayload.message.authorityCID,
        signatureCIDs: contractPayload.message.signatureCIDs,
        app: contractPayload.message.app,
        timestamp: contractPayload.message.timestamp,
        metadata: contractPayload.message.metadata,
      });

      this.txb.moveCall({
        target: `${env.SUI_PACKAGE_ID}::${"application"}::${"store_proof_of_agreement"}`,
        arguments: [this.txb.object(env.SUI_BAG_ID), this.txb.pure(data.toString("hex"), BCS.HEX), this.txb.pure(str2hex(contractPayload.proofCID), BCS.HEX)],
      });
    }

    const receipt = await this.client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: this.txb,
      options: {
        showEffects: true,
      },
    });

    return receipt.digest;
  }
}

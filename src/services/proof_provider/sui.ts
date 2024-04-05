import { Network, ProofOfAgreementMessage, ProofOfAuthorityMessage, ProofOfSignatureMessage, ProofProvider, ProofTypedMessage, SignedProof } from "./index";
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

  public async set(derivationPath: string, proof: SignedProof): Promise<string> {
    console.log("proof");
    console.dir(proof.message.types);
    const txb = new TransactionBlock();

    const keypair = Ed25519Keypair.deriveKeypair(this.mnemonic, derivationPath);
    txb.setGasBudget(50000000);

    const contractPayload = createContractPayload(proof);

    if (contractPayload.message.name === "Proof-of-Authority") {
      const data = this.serializeProofOfAuthority(contractPayload.message);

      txb.moveCall({
        target: `${env.SUI_PACKAGE_ID}::${"application"}::${"store_proof_of_authority"}`,
        arguments: [
          txb.object(env.SUI_BAG_ID),
          txb.pure(data.toString("hex"), BCS.HEX),
          txb.pure(contractPayload.signature, BCS.HEX),
          txb.pure(str2hex(contractPayload.proofCID), BCS.HEX),
        ],
      });
    }

    if (contractPayload.message.name === "Proof-of-Signature") {
      const data = this.serializeProofOfSignature(contractPayload.message);

      txb.moveCall({
        target: `${env.SUI_PACKAGE_ID}::${"application"}::${"store_proof_of_signature"}`,
        arguments: [
          txb.object(env.SUI_BAG_ID),
          txb.pure(data.toString("hex"), BCS.HEX),
          txb.pure(contractPayload.signature, BCS.HEX),
          txb.pure(str2hex(contractPayload.proofCID), BCS.HEX),
        ],
      });
    }

    if (contractPayload.message.name === "Proof-of-Agreement") {
      const data = this.serializeProofOfAgreement(contractPayload.message);

      txb.moveCall({
        target: `${env.SUI_PACKAGE_ID}::${"application"}::${"store_proof_of_agreement"}`,
        arguments: [txb.object(env.SUI_BAG_ID), txb.pure(data.toString("hex"), BCS.HEX), txb.pure(str2hex(contractPayload.proofCID), BCS.HEX)],
      });
    }

    const receipt = await this.client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: txb,
      options: {
        showEffects: true,
      },
    });

    return receipt.digest;
  }

  private serializeProofOfAuthority(message: ProofOfAuthorityMessage) {
    return bcs.ser("ProofOfAuthority", {
      name: message.name,
      from: hex2vec(message.from),
      agreementCID: message.agreementCID,
      signers: serializeSigner(message.signers),
      timestamp: message.timestamp,
      metadata: message.metadata,
    });
  }

  private serializeProofOfSignature(message: ProofOfSignatureMessage) {
    return bcs.ser("ProofOfSignature", {
      name: message.name,
      signer: hex2vec(message.signer),
      authorityCID: message.authorityCID,
      timestamp: message.timestamp,
      metadata: message.metadata,
    });
  }

  private serializeProofOfAgreement(message: ProofOfAgreementMessage) {
    return bcs.ser("ProofOfAgreement", {
      authorityCID: message.authorityCID,
      signatureCIDs: message.signatureCIDs,
      timestamp: message.timestamp,
      metadata: message.metadata,
    });
  }
}

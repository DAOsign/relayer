import { Network, ProofProvider, ProofTypedMessage, SignedProof } from "./index";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock, Inputs } from "@mysten/sui.js/transactions";
import { bcs } from "@mysten/sui.js/bcs";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { createContractPayload } from "../../utils/transformers";
import { serializeSigner, SignedMessage } from "./bcs";
import env from "../../env";

export class SuiProofProvider implements ProofProvider {
  network = Network.SUI;

  rpcUrl = getFullnodeUrl(env.SUI_RPC_CHAIN_TYPE);
  bagReference = env.SUI_BAG_ID;

  txb = new TransactionBlock();
  mnemonic = "stool embrace dentist speed fire hope usual lock car inmate flag orbit";

  client: SuiClient;

  constructor() {
    this.client = new SuiClient({ url: this.rpcUrl });
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

    const keypair = Ed25519Keypair.deriveKeypair(this.mnemonic, derivationPath);
    this.txb.setGasBudget(10000000);

    let receipt: any;

    const contractPayload = createContractPayload(proof);

    if (contractPayload.message.name === "Proof-of-Authority") {
      const serializedBcs = SignedMessage.serialize({
        message: {
          name: contractPayload.message.name,
          from: bcs.string().serialize(contractPayload.message.from).toBytes(),
          agreementCID: contractPayload.message.agreementCID,
          app: contractPayload.message.app,
          signers: serializeSigner(contractPayload.message.signers),
          timestamp: contractPayload.message.timestamp,
          metadata: contractPayload.message.metadata,
        },
        signature: bcs.string().serialize(contractPayload.signature).toBytes(),
        proofCID: contractPayload.proofCID,
      }).toBytes();

      this.txb.moveCall({
        target: `${env.SUI_PACKAGE_ID}::${"application"}::${"store_proof_of_authority"}`,
        arguments: [this.txb.object(this.bagReference), this.txb.pure(serializedBcs)],
      });
    }

    if (contractPayload.message.name === "Proof-of-Signature") {
    }

    if (contractPayload.message.name === "Proof-of-Agreement") {
    }

    const result = await this.client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: this.txb,
      options: {
        showInput: true,
      },
    });

    return receipt;
  }
}

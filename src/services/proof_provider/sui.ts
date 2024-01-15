import { Network, PROOF_TYPE, ProofOfAuthorityMessage, ProofOfSignatureMessage, ProofProvider, ProofTypedMessage, SignedProof } from "./index";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock, Inputs } from "@mysten/sui.js/transactions";
import { bcs } from "@mysten/sui.js/bcs";
import { getProofType } from "./utils";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { createContractPayload } from "../../utils/transformers";

export class SuiProofProvider implements ProofProvider {
  network = Network.SUI;

  rpcUrl = getFullnodeUrl("testnet");
  bagReference = "0x5d0686f2d961130bcf563d3c94c651258ac7e1b1867bd437946038775a42062c";

  txb = new TransactionBlock();

  client: SuiClient;

  constructor(rpcUrl: string) {
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

    const proofType = getProofType(proof);

    const Signer = bcs.struct("Signer", {
      addr: bcs.vector(bcs.u8()),
      metadata: bcs.string(),
    });

    const ProofOfAuthority = bcs.struct("ProofOfAuthority", {
      name: bcs.string(),
      from: bcs.vector(bcs.u8()),
      agreementCID: bcs.string(),
      signers: bcs.vector(Signer),
      app: bcs.string(),
      timestamp: bcs.u64(),
      metadata: bcs.string(),
    });

    const SignedMessage = bcs.struct("SignedMessage", {
      message: ProofOfAuthority,
      signature: bcs.vector(bcs.u8()),
      proofCID: bcs.string(),
    });

    let receipt: any;

    const contractPayload = createContractPayload(proof);
    let message = contractPayload.message as ProofOfAuthorityMessage;

    const serializedSigners = message.signers.map((item) => {
      return { addr: bcs.string().serialize(item.addr).toBytes(), metadata: item.metadata };
    });

    const serializedBcs = SignedMessage.serialize({
      message: {
        name: message.name,
        from: bcs.string().serialize(message.from).toBytes(),
        agreementCID: message.agreementCID,
        app: message.app,
        signers: serializedSigners,
        timestamp: message.timestamp,
        metadata: message.metadata,
      },
      signature: bcs.string().serialize(contractPayload.signature).toBytes(),
      proofCID: contractPayload.proofCID,
    });

    // const serializedBcs = SignedMessage.serialize({
    //   message: {
    //     name: message.name,
    //     // from: message.from,
    //     agreementCID: message.agreementCID,
    //     signers: message.signers,
    //     app: message.app,
    //     timestamp: message.timestamp,
    //     metadata: message.metadata
    //   },
    //   signature: contractPayload.signature,
    //   proofCID: contractPayload.proofCID
    // })

    switch (proofType) {
      case PROOF_TYPE.PROOF_OF_AUTHORITY: {
        this.txb.moveCall({
          target: `${"0xab299d88f3a11981baa54cb64a845d1d73c237aab30800a0eb7a58f981308772"}::${"application"}::${"store_proof_of_authority"}`,
          arguments: [this.txb.object(this.bagReference), serializedBcs],
        });

        this.txb.setGasBudget(10000000);

        const keypair = Ed25519Keypair.deriveKeypair("stool embrace dentist speed fire hope usual lock car inmate flag orbit", "m/44'/784'/0'/0'/0'");

        await this.client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: this.txb });
        break;
      }
      // case PROOF_TYPE.PROOF_OF_AGREEMENT: {
      //   //@ts-ignore
      //   receipt = await contract.storeProofOfAgreement(contractPayload);
      //   break;
      // }
      // case PROOF_TYPE.PROOF_OF_AUTHORITY: {
      //   receipt = await this.client.call("store_proof_of_authority", [this.bagReference, contractPayload]);
      //   break;
      // }
    }

    return receipt;
  }
}

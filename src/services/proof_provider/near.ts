import { Network, PROOF_TYPE, ProofOfAgreementMessage, ProofOfAuthorityMessage, ProofOfSignatureMessage, ProofProvider, SignedProof } from "./index";
import { ethers } from "ethers";
import { DAOSignApp } from "../../types/DAOSignApp";
import { getProofType } from "./utils";
import { createContractPayload } from "../../utils/transformers";
import env from "../../env";
import {DaosignNearContractInteractor} from "@daosign/near";

export class NearProofProvider implements ProofProvider {
  network: Network;
  contractAddress: string;

  provider: ethers.JsonRpcProvider;
  contract: DAOSignApp;

  mnemonic: string;

  constructor(rpcUrl: string, network = Network.NEAR) {
    this.network = network;
    this.mnemonic = env.NEAR_MNEMONIC;
    this.contractAddress = env.NEAR_CONTRACT_ADDRESS;
  }

  public async get(proofCID: string): Promise<SignedProof> {
    //@ts-ignore //TODO
    return { message: {}, signature: "", proofCID };
  }

  public async set(derivationPath: string, proof: SignedProof): Promise<string> {
    const nearInteractor = new DaosignNearContractInteractor(this.contractAddress, env.NEAR_RPC_NET);
    const proofType = getProofType(proof);

    const connectedWallet = await nearInteractor.connectWallet(this.mnemonic, derivationPath);

    const contractPayload = createContractPayload(proof);

    let txHash: string;

    switch (proofType) {
      case PROOF_TYPE.PROOF_OF_SIGNATURE:
        txHash = await nearInteractor.storeProofOfSignature(connectedWallet, { ...contractPayload, message: contractPayload.message as ProofOfSignatureMessage });
        break;
      case PROOF_TYPE.PROOF_OF_AGREEMENT:
        delete contractPayload.signature;
        txHash = await nearInteractor.storeProofOfAgreement(connectedWallet, {
          proofCID: contractPayload.proofCID,
          message: contractPayload.message as ProofOfAgreementMessage,
        });
        break;
      case PROOF_TYPE.PROOF_OF_AUTHORITY:
        txHash = await nearInteractor.storeProofOfAuthority(connectedWallet, { ...contractPayload, message: contractPayload.message as ProofOfAuthorityMessage });
        break;
      default:
        throw new Error("Unsupported proof type");
    }

    if (!txHash) {
      throw new Error("Tx finished with error.");
    }

    return txHash;
  }
}

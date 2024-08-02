import { Network, PROOF_TYPE, ProofOfAgreementMessage, ProofOfAuthorityMessage, ProofOfSignatureMessage, ProofProvider, SignedProof } from "./index";
import { ethers } from "ethers";
import { DAOSignApp } from "../../types/DAOSignApp";
import abi from "./polkadot_abi.json";
import { getProofType } from "./utils";
import { createContractPayload } from "../../utils/transformers";
import { DaosignPolkadotContractInteractor } from "@daosign/polkadot";
import env from "../../env";

export class PolkadotProofProvider implements ProofProvider {
  network: Network;
  contractAddress: string;

  provider: ethers.JsonRpcProvider;
  contract: DAOSignApp;

  mnemonic: string;

  constructor(rpcUrl: string, network = Network.POLKADOT) {
    this.network = network;
    this.mnemonic = env.POLKADOT_MNEMONIC;
    this.contractAddress = env.POLKADOT_CONTRACT_ADDRESS;
  }

  public async get(proofCID: string): Promise<SignedProof> {
    //@ts-ignore //TODO
    return { message: {}, signature: "", proofCID };
  }

  public async set(derivationPath: string, proof: SignedProof): Promise<string> {
    const polkadotInteractor = new DaosignPolkadotContractInteractor(this.contractAddress, abi, env.POLKADOT_RPC_URL);
    const proofType = getProofType(proof);

    const connectedWallet = await polkadotInteractor.connectWallet(this.mnemonic, derivationPath);

    const contractPayload = createContractPayload(proof);

    let txHash: string;

    switch (proofType) {
      case PROOF_TYPE.PROOF_OF_SIGNATURE:
        txHash = await polkadotInteractor.storeProofOfSignature(connectedWallet, { ...contractPayload, message: contractPayload.message as ProofOfSignatureMessage });
        break;
      case PROOF_TYPE.PROOF_OF_AGREEMENT:
        delete contractPayload.signature;
        txHash = await polkadotInteractor.storeProofOfAgreement(connectedWallet, {
          proofCID: contractPayload.proofCID,
          message: contractPayload.message as ProofOfAgreementMessage,
        });
        break;
      case PROOF_TYPE.PROOF_OF_AUTHORITY:
        txHash = await polkadotInteractor.storeProofOfAuthority(connectedWallet, { ...contractPayload, message: contractPayload.message as ProofOfAuthorityMessage });
        break;
      default:
        throw new Error("Unsupported proof type");
    }

    return txHash;
  }
}

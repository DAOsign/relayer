import { ethers } from "ethers";
import { Network, ProofProvider, SignedProof } from ".";
import abi from "./abi.json";
import { DAOSignApp } from "../../types/DAOSignApp";
import env from "../../env";

export class EthereumProofProvider implements ProofProvider {
  network = Network.ETHEREUM;

  provider: ethers.JsonRpcProvider;
  contract: DAOSignApp;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(env.ETH_PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract("0xa86C519B4273bA45959271dD4411F12c97274Ebd", abi, signer) as unknown as DAOSignApp;
  }

  async get(proofCID: string): Promise<SignedProof> {
    const [message, signature] = await this.contract.getProofOfAgreement(proofCID);

    return { message: message, proofCID: proofCID, signature: signature };
  }

  async set(proof: SignedProof): Promise<string> {
    const receipt = await this.contract.storeProofOfAgreement(proof);

    return receipt.hash;
  }
}

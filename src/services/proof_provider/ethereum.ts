import { ethers } from "ethers";
import { Network, PROOF_TYPE, ProofProvider, SignedProof } from ".";
import abi from "./abi.json";
import { DAOSignApp } from "../../types/DAOSignApp";
import env from "../../env";
import { getProofType } from "./utils";

export class EthereumProofProvider implements ProofProvider {
  network = Network.ETHEREUM;

  provider: ethers.JsonRpcProvider;
  contract: DAOSignApp;

  mnemonic = ethers.Mnemonic.fromPhrase("test test test test test test test test test test test junk");

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(env.ETH_PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(env.ETH_CONTRACT_ADDRESS, abi, signer) as unknown as DAOSignApp;
  }

  async get(proofCID: string): Promise<SignedProof> {
    const [message, signature] = await this.contract.getProofOfAgreement(proofCID);

    //@ts-ignore //TODO
    return { message: message, proofCID: proofCID, signature: signature };
  }

  async set(proof: SignedProof): Promise<string> {
    const proofType = getProofType(proof);

    const wallet0 = ethers.HDNodeWallet.fromMnemonic(this.mnemonic, "m/44'/60'/0'/0");
    const connectedWallet = wallet0.connect(this.provider);
    const contract = this.getContract(connectedWallet);

    let receipt: ethers.ContractTransactionResponse;

    switch (proofType) {
      case PROOF_TYPE.PROOF_OF_SIGNATURE: {
        //@ts-ignore
        receipt = await contract.storeProofOfSignature(proof);
        break;
      }
      case PROOF_TYPE.PROOF_OF_AGREEMENT: {
        //@ts-ignore
        receipt = await contract.storeProofOfAgreement(proof);
        break;
      }
      case PROOF_TYPE.PROOF_OF_AUTHORITY: {
        //@ts-ignore
        receipt = await contract.storeProofOfAuthority(proof);
        break;
      }
    }

    console.log("receipt", receipt);

    return receipt.hash;
  }

  getContract(signer: ethers.ContractRunner) {
    return new ethers.Contract(env.ETH_CONTRACT_ADDRESS, abi, signer) as unknown as DAOSignApp;
  }
}

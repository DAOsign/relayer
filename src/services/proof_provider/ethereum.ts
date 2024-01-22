import { ethers } from "ethers";
import { Network, PROOF_TYPE, ProofProvider, SignedProof } from ".";
import abi from "./abi.json";
import { DAOSignApp } from "../../types/DAOSignApp";
import env from "../../env";
import { getProofType } from "./utils";
import { createContractPayload } from "../../utils/transformers";

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

  public async get(proofCID: string): Promise<SignedProof> {
    const [message, signature] = await this.contract.getProofOfAuthority(proofCID);

    //@ts-ignore //TODO
    return { message: message, proofCID: proofCID, signature: signature };
  }

  public async set(derivationPath: string, proof: SignedProof): Promise<string> {
    //@ts-ignore
    const proofType = getProofType(proof);

    const wallet0 = ethers.HDNodeWallet.fromMnemonic(this.mnemonic, derivationPath);
    const connectedWallet = wallet0.connect(this.provider);
    const contract = this.getContract(connectedWallet);

    const contractPayload = createContractPayload(proof);

    let storeProof: typeof contract.storeProofOfSignature | typeof contract.storeProofOfAuthority | typeof contract.storeProofOfAgreement;
    switch (proofType) {
      case PROOF_TYPE.PROOF_OF_SIGNATURE: {
        storeProof = contract.storeProofOfSignature;

        break;
      }
      case PROOF_TYPE.PROOF_OF_AGREEMENT: {
        storeProof = contract.storeProofOfAgreement;
        //@ts-ignore
        delete contractPayload.signature;
        break;
      }
      case PROOF_TYPE.PROOF_OF_AUTHORITY: {
        storeProof = contract.storeProofOfAuthority;
        break;
      }
    }
    console.log("contractPayload", contractPayload);
    //@ts-ignore
    const receipt = await storeProof(contractPayload).catch(console.error);

    //@ts-ignore
    return receipt?.hash;
  }

  getContract(signer: ethers.ContractRunner) {
    return new ethers.Contract(env.ETH_CONTRACT_ADDRESS, abi, signer) as unknown as DAOSignApp;
  }
}

import { ethers } from "ethers";
import env from "../../env";
import abi from "./abi.json";
import Logger from "../logger";

type StorageContract = {
  set: (key: string, value: string) => Promise<ethers.ContractTransactionResponse>;
};

export class StorageService {
  contractAddress: string;

  provider: ethers.JsonRpcProvider;
  contract: StorageContract;

  constructor(rpcUrl: string) {
    this.contractAddress = env.STORAGE_CONTRACT_ADDRESS;

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(env.STORAGE_ADMIN_PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(this.contractAddress, abi, signer) as unknown as StorageContract;
  }

  async setCID(certificateCID: string, agreementProofCID: string) {
    return this.contract
      .set(certificateCID, agreementProofCID)
      .then((receipt) => receipt?.hash)
      .catch((e) => {
        Logger.error(e?.message);
      });
  }
}

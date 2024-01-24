import { JsonRpcProvider } from "ethers";
import { BlockchainService } from ".";
import * as ethers from "ethers";
import { Tx_Status } from "../proof_provider";

export class EthereumService implements BlockchainService {
  provider: JsonRpcProvider;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async transactionStatus(hash: string): Promise<Tx_Status> {
    try {
      const receipt = await this.provider.getTransactionReceipt(hash);
      if (receipt?.status) {
        return receipt.status ? Tx_Status.SUCCESS : Tx_Status.ERROR;
      }
      return Tx_Status.IN_PROGRESS;
    } catch (e) {
      console.error(e);
      return Tx_Status.ERROR;
    }
  }

  async createWallet(hdPath: string, mnemonicPhrase = "test test test test test test test test test test test junk") {
    const mnemonic = ethers.Mnemonic.fromPhrase(mnemonicPhrase);

    const wallet0 = ethers.HDNodeWallet.fromMnemonic(mnemonic, hdPath);
    return wallet0.address;
  }
}

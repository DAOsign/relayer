import { BlockchainService } from "./index";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Tx_Status } from "../proof_provider";

export class SuiService implements BlockchainService {
  client: SuiClient;

  constructor(netType: "mainnet" | "testnet" | "devnet" | "localnet") {
    this.client = new SuiClient({ url: getFullnodeUrl(netType) });
  }

  async transactionStatus(hash: string): Promise<Tx_Status> {
    try {
      const transactionBlock = await this.client.waitForTransactionBlock({
        digest: hash,
        options: {
          showEffects: true,
        },
      });

      switch (transactionBlock.effects?.status.status) {
        case "success":
          return Tx_Status.SUCCESS;

        case "failure":
          return Tx_Status.ERROR;

        default:
          return Tx_Status.IN_PROGRESS;
      }
    } catch (e) {
      return Tx_Status.ERROR;
    }
  }

  async getWalletBalance(address: string) {
    const balance = await this.client.getBalance({ owner: address });
    return balance.totalBalance;
  }
}

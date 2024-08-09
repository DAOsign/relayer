import { BlockchainService } from ".";
import { Tx_Status } from "../proof_provider";
import { DaosignNearContractInteractor } from "@daosign/near";
import env from "../../env";
import * as ethers from "ethers";

export class NearService implements BlockchainService {
  provider: "testnet" | "mainnet";

  constructor(rpcUrl: "testnet" | "mainnet") {
    this.provider = rpcUrl;
  }

  async transactionStatus(hash: string): Promise<Tx_Status> {
    return Tx_Status.SUCCESS;
  }

  async getWalletBalance(hash: string): Promise<string> {
    const polkadotInteractor = new DaosignNearContractInteractor(env.NEAR_CONTRACT_ADDRESS, this.provider);

    return polkadotInteractor.getAccountBalance(hash);
  }
}
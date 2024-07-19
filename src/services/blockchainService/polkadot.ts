import { BlockchainService } from ".";
import { Tx_Status } from "../proof_provider";
import { DaosignPolkadotContractInteractor } from "daosign-polkadot";
import abi from "../proof_provider/polkadot_abi.json";
import env from "../../env";

export class PolkadotService implements BlockchainService {
  async transactionStatus(hash: string): Promise<Tx_Status> {
    return Tx_Status.SUCCESS;
  }

  async getWalletBalance(hash: string): Promise<string> {
    const polkadotInteractor = new DaosignPolkadotContractInteractor(env.POLKADOT_CONTRACT_ADDRESS, abi, env.POLKADOT_RPC_URL);

    return polkadotInteractor.getAccountBalance(hash);
  }
}

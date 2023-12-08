import { Tx_Status } from "../proof_provider";

export abstract class BlockchainService {
  abstract transactionStatus: (hash: string) => Promise<Tx_Status>;
}

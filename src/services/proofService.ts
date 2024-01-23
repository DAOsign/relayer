import { DataSource, Repository } from "typeorm";
import { Network, ProofProvider, SignedProof, Tx_Status } from "./proof_provider";
import { Tx } from "../models/Tx";
import { Account } from "../models/Account";

export class ProofService {
  providers: Record<Network, ProofProvider>;

  accountRepository: Repository<Account>;
  txRepository: Repository<Tx>;

  constructor(dataSource: DataSource, providers: ProofProvider[]) {
    this.providers = providers.reduce((res, provider) => ({ ...res, [provider.network]: provider }), {}) as Record<Network, ProofProvider>;

    this.accountRepository = dataSource.getRepository(Account);
    this.txRepository = dataSource.getRepository(Tx);
  }

  async set(network: Network, data: SignedProof) {
    const account = await this.accountRepository.findOne({ where: { network: { network_id: network }, locked: false } });

    if (!account) {
      await this.txRepository.create({ payload: data, network: { network_id: network }, status: Tx_Status.NEW }).save();
      return null;
      //throw new Error("No available account");
    }

    const txHash = await this.providers[network].set(account.hd_path, data);

    if (txHash) {
      this.accountRepository.update({ account_id: account.account_id }, { locked: true });
    }

    const savedTx = await this.txRepository.create({ payload: data, network: { network_id: network }, tx_hash: txHash, account: account, status: Tx_Status.IN_PROGRESS }).save();

    return savedTx;
  }

  async getTxById(refId: number) {
    const tx = await this.txRepository.findOneBy({ tx_id: refId });
    return tx;
  }
}

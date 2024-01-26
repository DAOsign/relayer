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

  async set(network: Network, data: SignedProof, existingTx?: Tx) {
    const account = await this.accountRepository.findOne({ where: { network: { network_id: network }, locked: false } });

    //create new tx
    const tx = existingTx || this.txRepository.create({ payload: data, network: { network_id: network }, status: Tx_Status.NEW });

    if (account) {
      try {
        const txHash = await this.providers[network].set(account.hd_path, data);

        // tx have hash
        await this.accountRepository.update({ account_id: account.account_id }, { locked: true });
        return await this.txRepository.save({ ...tx, payload: data, network: { network_id: network }, tx_hash: txHash, account: account, status: Tx_Status.IN_PROGRESS });
      } catch (e) {
        console.error(e);
        // error happened
        tx.status = Tx_Status.ERROR;
        return await tx.save();
      }
    }
    // QUEUE new tx
    return await tx.save();
  }

  async getTxById(refId: number) {
    const tx = await this.txRepository.findOneBy({ tx_id: refId });
    return tx;
  }
}

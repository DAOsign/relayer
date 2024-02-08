import { DataSource, Repository } from "typeorm";
import { Network, ProofProvider, SignedProof, Tx_Status } from "./proof_provider";
import { Tx } from "../models/Tx";
import { Account } from "../models/Account";
import { Proof } from "../models/Proof";
import { ProofType } from "../worker/queue.service";

export class ProofService {
  providers: Record<Network, ProofProvider>;

  accountRepository: Repository<Account>;
  txRepository: Repository<Tx>;
  proofRepository: Repository<Proof>;

  constructor(dataSource: DataSource, providers: ProofProvider[]) {
    this.providers = providers.reduce((res, provider) => ({ ...res, [provider.network]: provider }), {}) as Record<Network, ProofProvider>;

    this.accountRepository = dataSource.getRepository(Account);
    this.txRepository = dataSource.getRepository(Tx);
    this.proofRepository = dataSource.getRepository(Proof);
  }

  async set(network: Network, data: SignedProof, existingTx?: Tx) {
    let proof: Proof;
    try {
      if (data.message.message.name === "Proof-of-Authority") {
        proof = this.proofRepository.create({ refId: data.proofCID, network, status: 1, type: ProofType.AUTHORITY, cid: data.proofCID, signature: data.signature, payload: data });
      }

      if (data.message.message.name === "Proof-of-Signature") {
        proof = this.proofRepository.create({
          refId: data.message.message.authorityCID,
          network,
          status: 1,
          type: ProofType.SIGNATURE,
          cid: data.proofCID,
          signature: data.signature,
          payload: data,
        });
      }

      if (data.message.message.name === "Proof-of-Agreement") {
        proof = this.proofRepository.create({ refId: data.message.message.authorityCID, network, status: 1, type: ProofType.DOCUMENT, cid: data.proofCID, payload: data });
      }
    } catch (e) {
      console.log(e);
    }

    await this.proofRepository.save(proof);
    return proof;
  }

  async getTxById(refId: number) {
    const proof = await this.proofRepository.findOneBy({ id: refId });
    return proof;
  }
}

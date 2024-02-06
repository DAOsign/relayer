import { DataSource, Repository } from "typeorm";
import { Network, ProofProvider, SignedProof, Tx_Status } from "./proof_provider";
import { Tx } from "../models/Tx";
import { Account } from "../models/Account";
import { CallExceptionError } from "ethers";
import * as net from "net";
import {Proof} from "../models/Proof";
import {bcs, hex2vec, serializeSigner, str2hex} from "./proof_provider/bcs";
import env from "../env";
import {ProofType} from "../worker/queue.service";

export class ProofService {
  providers: Record<Network, ProofProvider>;

  accountRepository: Repository<Account>;
  txRepository: Repository<Tx>;
  proofRepository: Repository<Proof>

  constructor(dataSource: DataSource, providers: ProofProvider[]) {
    this.providers = providers.reduce((res, provider) => ({ ...res, [provider.network]: provider }), {}) as Record<Network, ProofProvider>;

    this.accountRepository = dataSource.getRepository(Account);
    this.txRepository = dataSource.getRepository(Tx);
    this.proofRepository = dataSource.getRepository(Proof);
  }

  // async set(network: Network, data: SignedProof, existingTx?: Tx) {
  //   const account = await this.accountRepository.findOne({ where: { network: { network_id: network }, locked: false } });
  //
  //   //create new tx
  //   const tx = existingTx || this.txRepository.create({ payload: data, network: { network_id: network }, status: Tx_Status.NEW });
  //
  //   if (account) {
  //     try {
  //       const txHash = await this.providers[network].set(account.hd_path, data);
  //
  //       // tx have hash
  //       await this.accountRepository.update({ account_id: account.account_id }, { locked: true });
  //       return await this.txRepository.save({ ...tx, payload: data, network: { network_id: network }, tx_hash: txHash, account: account, status: Tx_Status.IN_PROGRESS });
  //     } catch (e) {
  //       const providerError = e as CallExceptionError;
  //       console.error(e);
  //       // error happened
  //       tx.status = Tx_Status.ERROR;
  //       tx.error = providerError.reason || providerError.code;
  //       return await tx.save();
  //     }
  //   }
  //   // QUEUE new tx
  //   return await tx.save();
  // }

  async set(network: Network, data: SignedProof, existingTx?: Tx) {
    let proof: Proof;
    try {
      if (data.message.message.name === "Proof-of-Authority") {
        proof = this.proofRepository.create({ refId: data.proofCID, network, status: 1, type: ProofType.AUTHORITY, cid: data.proofCID, signature: data.signature, payload: data });
      }

      if (data.message.message.name === "Proof-of-Signature") {
        proof = this.proofRepository.create({ refId: data.message.message.authorityCID, network, status: 1, type: ProofType.SIGNATURE, cid: data.proofCID, signature: data.signature, payload: data });
      }

      if (data.message.message.name === "Proof-of-Agreement") {
        proof = this.proofRepository.create({ refId: data.message.message.authorityCID, network, status: 1, type: ProofType.DOCUMENT, cid: data.proofCID, payload: data });
      }
    } catch (e) {
      console.log(e)
    }


    await this.proofRepository.save(proof);
    return proof;
  }

  async getTxById(refId: number) {
    const tx = await this.txRepository.findOneBy({ tx_id: refId });
    return tx;
  }
}

import { DataSource, Repository } from "typeorm";
import { Network, ProofOfAuthorityMessage, ProofOfCancelMessage, ProofOfSignatureMessage, ProofOfVoidMessage, ProofProvider, SignedProof, Tx_Status } from "./proof_provider";
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
      if (data.message.primaryType === "ProofOfAuthority") {
        proof = this.proofRepository.create({ refId: data.proofCID, network, status: 1, type: ProofType.AUTHORITY, cid: data.proofCID, signature: data.signature, payload: data });
      }

      if (data.message.primaryType === "ProofOfSignature") {
        const message = data.message.message as ProofOfSignatureMessage;
        proof = this.proofRepository.create({
          refId: message.authorityCID,
          network,
          status: 1,
          type: ProofType.SIGNATURE,
          cid: data.proofCID,
          signature: data.signature,
          payload: data,
        });
      }

      if (data.message.primaryType === "ProofOfVoid") {
        const message = data.message.message as ProofOfVoidMessage;
        proof = this.proofRepository.create({ refId: message.authorityCID, network, status: 1, type: ProofType.VOID, cid: data.proofCID, payload: data });
      }

      if (data.message.primaryType === "ProofOfCancel") {
        const message = data.message.message as ProofOfCancelMessage;
        for (const CID of message.authorityCIDs) {
          proof = this.proofRepository.create({ refId: CID, network, status: 1, type: ProofType.CANCEL, cid: data.proofCID, payload: data });
        }
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

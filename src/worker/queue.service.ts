import { FindManyOptions, In, Repository, Not, IsNull } from "typeorm";
import { Proof } from "../models/Proof";
import { Account } from "../models/Account";
import { CronJob } from "cron";
import { Network, ProofProvider, SignedProof } from "../services/proof_provider";
import { BlockchainService } from "../services/blockchainService";
import { SuiService } from "../services/blockchainService/sui";
import env from "../env";
import { EthereumService } from "../services/blockchainService/ethereum";
import Logger from "../services/logger";

export enum Tx_Status {
  NEW = 1,
  IN_PROGRESS = 2,
  SUCCESS = 3,
  ERROR = 4,
}

export enum ProofType {
  AUTHORITY = 1,
  SIGNATURE = 2,
  DOCUMENT = 3,
}
interface RelayerService {
  set(derivationPath: string, proof: SignedProof): Promise<string>;
}

export class QueueService {
  private networkName: string;
  private logger = Logger || { info: (text: string) => console.log(text) };
  processQueueCron: CronJob;
  checkStatusCron: CronJob;
  blockchainService: BlockchainService;

  constructor(
    private readonly accountRepository: Repository<Account>,
    private readonly proofRepository: Repository<Proof>,
    private relayerService: ProofProvider,
  ) {
    this.networkName = Network[relayerService.network];
    //this.logger = Logger; //new Logger(`${this.networkName} ${QueueService.name}`);
    this.checkStatusCron = new CronJob("*/1 * * * *", () => this.checkTransactionStatus(), null, true, "", null, true);
    this.processQueueCron = new CronJob("*/1 * * * *", () => this.processQueue(), null, true, "", null, true);

    switch (relayerService.network) {
      case 1:
        this.blockchainService = new EthereumService(env.ETH_RPC_URL);
        break;
      case 2:
        this.blockchainService = new SuiService(env.SUI_RPC_TYPE);
        break;
    }
  }

  public start() {
    this.processQueueCron.start();
    this.checkStatusCron.start();
  }

  async processQueue() {
    this.logger.info(`${this.networkName} queue processor started`);

    const unlockedAccounts = await this.getUnlockedAccounts();

    if (!unlockedAccounts.length) {
      this.logger.info(`No unlocked ${this.networkName} accounts found. Skipping ${this.networkName} queue processing`);
      return;
    } else {
      this.logger.info(`${unlockedAccounts.length} ${this.networkName} unlocked accounts found.`);
    }

    const proofs = await this.getProcessableProofs(unlockedAccounts.length);

    if (!proofs.length) {
      this.logger.info(`No unprocessed ${this.networkName} proofs found. Skipping ${this.networkName} queue processing`);
      return;
    }

    this.logger.info(`${proofs.length} ${this.networkName} unprocessed proofs found.`);

    const processedProofs = await this.processProofs(proofs, unlockedAccounts);

    this.logger.info(`Processed ${processedProofs.length} ${this.networkName} proofs.`);
  }

  async checkTransactionStatus() {
    this.logger.info("Update transaction statuses");

    const processingProofs = await this.getProcessingProofs();

    this.logger.info(`Found ${processingProofs.length} ${this.networkName} pending transactions`);

    await this.checkProofsStatus(processingProofs);
  }

  async getUnlockedAccounts() {
    return this.accountRepository.find({
      where: { network: { network_id: this.relayerService.network }, currentProof: IsNull() },
    });
  }

  async getProcessableProofs(take: number) {
    //authority is prioritized
    const authorityProofs = await this.getNewProofs({
      where: { type: ProofType.AUTHORITY },
      take: take,
    });

    const authorityProofRefs = authorityProofs.map((p) => p.refId);

    const signatureProofs = await this.getNewProofs({
      where: { type: ProofType.SIGNATURE, refId: Not(In(authorityProofRefs)) },
      take: take,
    });

    const signatureProofRefs = signatureProofs.map((p) => p.refId);

    const restProofs = await this.getNewProofs({
      where: {
        type: ProofType.DOCUMENT,
        refId: Not(In([...signatureProofRefs, authorityProofRefs])),
      },
      take: take - authorityProofs.length,
    });

    return [...authorityProofs, ...signatureProofs, ...restProofs];
  }

  async getProcessingProofs() {
    const authorityProofs = await this.getInProgressProofs({
      where: { type: ProofType.AUTHORITY },
    });

    const authorityProofRefs = authorityProofs.map((p) => p.refId);

    const restProofs = await this.getInProgressProofs({
      where: {
        type: Not(ProofType.AUTHORITY),
        refId: Not(In(authorityProofRefs)),
      },
    });

    return [...authorityProofs, ...restProofs];
  }

  async getNewProofs(options?: FindManyOptions<Proof>) {
    const findOptions: FindManyOptions<Proof> = {
      ...options,
      where: {
        status: In([Tx_Status.NEW]),
        network: this.relayerService.network,
        ...options?.where,
      },
      order: { created_at: "ASC", ...options?.order },
      take: options?.take || 10,
    };
    return this.proofRepository.find(findOptions);
  }

  async getInProgressProofs(options?: FindManyOptions<Proof>) {
    const findOptions: FindManyOptions<Proof> = {
      ...options,
      where: {
        status: In([Tx_Status.IN_PROGRESS]),
        network: this.relayerService.network,
        ...options?.where,
      },
      order: { created_at: "ASC", ...options?.order },
      take: options?.take || 10,
    };
    return this.proofRepository.find(findOptions);
  }

  async checkProofStatus(proof: Proof) {
    return this.blockchainService
      .transactionStatus(proof.txHash)
      .then((status) => {
        if (status !== Tx_Status.IN_PROGRESS) {
          this.logger.info(`Tx:${proof.txHash} successed`);

          this.proofRepository.update({ txHash: proof.txHash }, { status: Tx_Status.SUCCESS });
          this.accountRepository.update({ currentProof: { id: proof.id } }, { currentProof: null });
        }
      })
      .catch((e) => {
        console.log(e);
        this.proofRepository.update({ txHash: proof.txHash }, { status: Tx_Status.ERROR });
        this.accountRepository.update({ currentProof: { id: proof.id } }, { currentProof: null });
      });
  }

  async checkProofsStatus(proofs: Proof[]) {
    for (const proof of proofs) {
      await this.checkProofStatus(proof);
    }
  }

  async isAuthorityProofProcessed(refId: string) {
    const authorityProof = await this.proofRepository.findOne({
      where: { refId, type: ProofType.AUTHORITY },
    });

    return !!authorityProof.txHash;
  }

  async isSignatureProofsProcessed(refId: string) {
    const signatureProofs = await this.proofRepository.find({ where: { refId, type: ProofType.SIGNATURE } });

    const result = signatureProofs
      .map((proof) => {
        return !!proof.txHash;
      })
      .some((value) => value === false);

    return !result;
  }

  async processProofs(proofs: Proof[], accounts: Account[]) {
    const processedProofs: Proof[] = [];

    for await (const proof of proofs) {
      switch (proof.type) {
        case ProofType.AUTHORITY: {
          const processed = await this.processProof(proof, accounts.shift());
          processedProofs.push(processed);
          break;
        }
        case ProofType.SIGNATURE: {
          const authorityProcessed = await this.isAuthorityProofProcessed(proof.refId);

          if (!authorityProcessed) {
            // if authority not processed - skip
            this.logger.info(`${proof.refId} proof have no processed authority proof. Skipping.`);
            break;
          }
          const processed = await this.processProof(proof, accounts.shift());
          processedProofs.push(processed);
          break;
        }
        case ProofType.DOCUMENT: {
          const signatureProcessed = await this.isSignatureProofsProcessed(proof.refId);

          if (!signatureProcessed) {
            // if authority not processed - skip
            this.logger.info(`${proof.refId} proof have no processed signatures proof. Skipping.`);
            break;
          }
          const processed = await this.processProof(proof, accounts.shift());
          processedProofs.push(processed);
        }
      }
    }

    return processedProofs;
  }

  async processProof(proof: Proof, account: Account) {
    try {
      const txHash = await this.relayerService.set(account.hd_path, proof.payload as SignedProof);
      proof.txHash = txHash;
      proof.status = Tx_Status.IN_PROGRESS;
      await this.accountRepository.save({ ...account, currentProof: proof });
      return await this.proofRepository.save(proof);
    } catch (e) {
      this.logger.info(e);
      proof.status = Tx_Status.ERROR;
      //Error handling
      return await this.proofRepository.save(proof);
    }
  }
}

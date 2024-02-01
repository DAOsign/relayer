import { FindManyOptions, In, Repository, Not } from "typeorm";
import { Proof } from "../models/Proof";
import { Account } from "../models/Account";
import { CronJob } from "cron";

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
  set(proof: Proof, account: Account): Promise<string>;
}

export class QueueService {
  private networkName = "Ethereum";
  private logger = { info: (text: string) => console.log(text) };
  cron: CronJob;

  constructor(
    //private relayerService: RelayerService,
    private readonly accountRepository: Repository<Account>,
    private readonly proofRepository: Repository<Proof>,
    private readonly network: number,
  ) {
    const networkName = "Ethereum";
    this.networkName = networkName;
    //this.logger = new Logger(`${this.networkName} ${QueueService.name}`);
    this.cron = new CronJob("*/1 * * * *", () => this.processQueue(), null, true, "", null, true);
  }

  public start() {
    this.cron.start();
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

  async getUnlockedAccounts() {
    return this.accountRepository.find({
      where: { network: { network_id: this.network }, locked: false },
    });
  }

  async getProcessableProofs(take: number) {
    //authority is prioritized
    const authorityProofs = await this.getNewProofs({
      where: { type: ProofType.AUTHORITY },
      take: take,
    });

    const authorityProofRefs = authorityProofs.map((p) => p.refId);

    const restProofs = await this.getNewProofs({
      where: {
        type: Not(ProofType.AUTHORITY),
        refId: Not(In(authorityProofRefs)),
      },
      take: take - authorityProofs.length,
    });

    return [...authorityProofs, ...restProofs];
  }

  async getNewProofs(options?: FindManyOptions<Proof>) {
    const findOptions: FindManyOptions<Proof> = {
      ...options,
      where: {
        status: In[Tx_Status.NEW],
        network: this.network,
        ...options?.where,
      },
      order: { created_at: "ASC", ...options?.order },
      take: options?.take || 10,
    };
    return this.proofRepository.find(findOptions);
  }

  async isAuthorityProofProcessed(refId: string) {
    const authorityProof = await this.proofRepository.findOne({
      where: { refId, type: ProofType.AUTHORITY },
    });

    return !!authorityProof.txHash;
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
        default: {
          const authorityProcessed = await this.isAuthorityProofProcessed(proof.refId);

          if (!authorityProcessed) {
            // if authority not processed - skip
            this.logger.info(`${proof.refId} proof have no processed authority proof. Skipping.`);
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
      const txHash = "0x"; // await this.relayerService.set(proof, account);
      proof.txHash = txHash;
      return await this.proofRepository.save(proof);
    } catch (e) {
      proof.status = Tx_Status.ERROR;
      //Error handling
      return await this.proofRepository.save(proof);
    }
  }
}

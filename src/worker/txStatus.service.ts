import { BlockchainService } from "../services/blockchainService";
import { EthereumService } from "../services/blockchainService/ethereum";
import env from "../env";
import { SuiService } from "../services/blockchainService/sui";
import { Network } from "../services/proof_provider";
import { CronJob } from "cron";
import Logger from "../services/logger";
import { FindManyOptions, In, Not, Repository } from "typeorm";
import { ProofType, Tx_Status } from "./queue.service";
import { Proof } from "../models/Proof";
import { Account } from "../models/Account";

export class TxStatusService {
  private networkName: string;
  private logger = Logger || { info: (text: string) => console.log(text) };
  blockchainService: BlockchainService;
  checkStatusCron: CronJob;

  constructor(
    private readonly accountRepository: Repository<Account>,
    private readonly proofRepository: Repository<Proof>,
    private readonly network: Network,
  ) {
    this.networkName = Network[network];
    switch (network) {
      case 1:
        this.blockchainService = new EthereumService(env.ETH_RPC_URL);
        break;
      case 2:
        this.blockchainService = new SuiService(env.SUI_RPC_TYPE);
        break;
      case 4:
        this.blockchainService = new EthereumService(env.OASIS_RPC_URL);
    }

    this.checkStatusCron = new CronJob("*/1 * * * *", () => this.checkTransactionStatus(), null, true, "", null, true);
  }

  public start() {
    this.checkStatusCron.start();
  }

  async checkTransactionStatus() {
    this.logger.info("Update transaction statuses");

    const processingProofs = await this.getProcessingProofs();

    this.logger.info(`Found ${processingProofs.length} ${this.networkName} pending transactions`);

    await this.checkProofsStatus(processingProofs);

    this.logger.info(`${processingProofs.length} ${this.networkName} proofs status checked`);
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

  async getInProgressProofs(options?: FindManyOptions<Proof>) {
    const findOptions: FindManyOptions<Proof> = {
      ...options,
      where: {
        status: In([Tx_Status.IN_PROGRESS]),
        network: this.network,
        ...options?.where,
      },
      order: { created_at: "ASC", ...options?.order },
      take: options?.take || 10,
    };
    return this.proofRepository.find(findOptions);
  }

  async checkProofsStatus(proofs: Proof[]) {
    for (const proof of proofs) {
      await this.checkProofStatus(proof);
    }
  }

  async checkProofStatus(proof: Proof) {
    return this.blockchainService
      .transactionStatus(proof.txHash)
      .then((status) => {
        if (status !== Tx_Status.IN_PROGRESS) {
          this.logger.info(`Tx:${proof.txHash} successed`);

          this.proofRepository.update({ txHash: proof.txHash }, { status: Tx_Status.SUCCESS });
        }
      })
      .catch((e) => {
        console.log(e);
        this.proofRepository.update({ txHash: proof.txHash }, { status: Tx_Status.ERROR });
      })
      .finally(async () => {
        const account = await this.accountRepository.findOneBy({ currentProof: { id: proof.id } });
        this.updateAccount(account);
      });
  }

  updateAccount(account: Account) {
    if (!account) return;
    this.accountRepository.update({ account_id: account.account_id }, { currentProof: null });
    this.updateAccountBalance(account);
  }

  async updateAccountBalance(account: Account) {
    const balance = await this.blockchainService.getWalletBalance(account.address);
    this.accountRepository.update({ account_id: account.account_id }, { balance: balance });
  }
}

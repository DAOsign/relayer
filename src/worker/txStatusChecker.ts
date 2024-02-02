import { CronJob } from "cron";
import { DataSource } from "typeorm";
import { Tx } from "../models/Tx";
import { Network, Tx_Status } from "../services/proof_provider";
import { EthereumService } from "../services/blockchainService/ethereum";
import env from "../env";
import { Account } from "../models/Account";
import { SuiService } from "../services/blockchainService/sui";
import Logger from "../services/logger";

const txStatusChecker = (datasource: DataSource) =>
  new CronJob(
    "*/1 * * * *",
    async (onComplete) => {
      try {
        console.time("Update transaction statuses");
        const txRepository = datasource.getRepository(Tx);
        const accountRepository = datasource.getRepository(Account);

        const pendingTxs = await txRepository.find({ where: { status: Tx_Status.IN_PROGRESS } });

        if (!pendingTxs.length) {
          Logger.info("No pending transactions");
          return onComplete();
        }

        const ethPendingTxs = pendingTxs.filter((tx) => tx.network?.network_id === Network.ETHEREUM);

        if (ethPendingTxs.length) {
          Logger.info(`Found ${ethPendingTxs.length} Ethereum pending transactions`);
          const ethService = new EthereumService(env.ETH_RPC_URL);
          for (const tx of ethPendingTxs) {
            await ethService
              .transactionStatus(tx.tx_hash)
              .then((status) => {
                if (status !== Tx_Status.IN_PROGRESS) {
                  logStatus(tx.tx_hash, status);
                  txRepository.update({ tx_id: tx.tx_id }, { status: status });
                  accountRepository.update({ account_id: tx.account.account_id }, { locked: false });
                }
              })
              .catch((e) => {
                txRepository.update({ tx_id: tx.tx_id }, { status: Tx_Status.ERROR });
                accountRepository.update({ account_id: tx.account.account_id }, { locked: false });
              });
          }
        }

        const suiPendingTxs = pendingTxs.filter((tx) => tx.network?.network_id === Network.SUI);
        if (suiPendingTxs.length) {
          console.info(`Found ${suiPendingTxs.length} Sui pending transactions`);
          const suiService = new SuiService(env.SUI_RPC_TYPE);
          for (const tx of suiPendingTxs) {
            suiService
              .transactionStatus(tx.tx_hash)
              .then((status) => {
                if (status !== Tx_Status.IN_PROGRESS) {
                  logStatus(tx.tx_hash, status);
                  txRepository.update({ tx_id: tx.tx_id }, { status: status });
                  accountRepository.update({ account_id: tx.account.account_id }, { locked: false });
                }
              })
              .catch((e) => {
                txRepository.update({ tx_id: tx.tx_id }, { status: Tx_Status.ERROR });
                accountRepository.update({ account_id: tx.account.account_id }, { locked: false });
              });
          }
        }
        return onComplete();
      } catch (e) {
        Logger.error("Status check error:", e);
      }
    },
    () => {
      console.timeEnd("Update transaction statuses");
      Logger.info("Transaction status updater finished");
    },
    true,
  );

function logStatus(txHash: string, status: Tx_Status) {
  switch (status) {
    case Tx_Status.ERROR: {
      Logger.error(`Tx:${txHash} failed`);
      break;
    }
    case Tx_Status.SUCCESS: {
      Logger.info(`Tx:${txHash} successed`);
      break;
    }
    default:
      return;
  }
}
export default txStatusChecker;

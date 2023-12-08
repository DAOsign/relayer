import { CronJob } from "cron";
import { DataSource } from "typeorm";
import { Tx } from "../models/Tx";
import { Network, Tx_Status } from "../services/proof_provider";
import { EthereumService } from "../services/blockchainService/ethereum";
import env from "../env";

const txStatusChecker = (datasource: DataSource) =>
  new CronJob(
    "*/1 * * * *",
    async (onComplete) => {
      console.time("Update transaction statuses");
      const txRepository = datasource.getRepository(Tx);
      const pendingTxs = await txRepository.find({ where: { status: Tx_Status.IN_PROGRESS } });

      if (!pendingTxs.length) {
        console.info("No pending transactions");
        return onComplete();
      }

      const ethPendingTxs = pendingTxs.filter((tx) => tx.network?.network_id === Network.ETHEREUM);

      if (ethPendingTxs.length) {
        const ethService = new EthereumService(env.ETH_RPC_URL);
        for (const tx of ethPendingTxs) {
          ethService.transactionStatus(tx.tx_hash).then((status) => {
            if (status !== Tx_Status.IN_PROGRESS) {
              txRepository.update({ tx_id: tx.tx_id }, { status: status });
            }
          });
        }
      }
      return onComplete();
    },
    () => {
      console.timeEnd("Update transaction statuses");
      console.info("Transaction status updater finished");
    },
    true,
  );

export default txStatusChecker;

import { CronJob } from "cron";
import { DataSource, In } from "typeorm";
import { Tx } from "../models/Tx";
import { Network, SignedProof, Tx_Status } from "../services/proof_provider";
import env from "../env";
import { Account } from "../models/Account";
import { ProofService } from "../services/proofService";
import { EthereumProofProvider } from "../services/proof_provider/ethereum";
import Logger from "../services/logger";
import { SuiProofProvider } from "../services/proof_provider/sui";

const proofQueue = (datasource: DataSource) =>
  new CronJob(
    "*/1 * * * *",
    async (onComplete) => {
      try {
        const proofService = new ProofService(datasource, [new EthereumProofProvider(env.ETH_RPC_URL), new SuiProofProvider("testnet")]);

        //take queued proofs
        // process them if accounts available
        console.time("Proof queue processor");
        const txRepository = datasource.getRepository(Tx);
        const accountRepository = datasource.getRepository(Account);

        const queuedTxs = await txRepository.find({ where: { status: In([Tx_Status.NEW, Tx_Status.ERROR]) }, order: { tx_id: "ASC" } });

        Logger.info(`Found ${queuedTxs.length} total queued proofs`);

        const ethQueuedProofs = queuedTxs.filter((tx) => tx.network?.network_id === Network.ETHEREUM);

        if (ethQueuedProofs.length) {
          Logger.info(`Found ${ethQueuedProofs.length} Ethereum queued proofs`);

          const accounts = await accountRepository.findBy({ locked: false, network: { network_id: Network.ETHEREUM } });
          if (!accounts.length) {
            Logger.info(`No unlocked Ethereum account was found. Skipping Ethereum queue processing`);
          } else {
            const txToProcess = ethQueuedProofs.slice(0, accounts.length);
            Logger.info(`${txToProcess.length} proofs to process`);
            //TODO REFACTOR duplitation/removing
            for (const tx of txToProcess) {
              await proofService.set(Network.ETHEREUM, tx.payload as SignedProof, tx);
            }

            Logger.info(`${txToProcess.length} proofs processed`);
          }
        }

        const suiQueuedProofs = queuedTxs.filter((tx) => tx.network?.network_id === Network.SUI);

        if (suiQueuedProofs) {
          console.info(`Found ${suiQueuedProofs.length} Sui queued proofs`);

          const accounts = await accountRepository.findBy({ locked: false, network: { network_id: Network.SUI } });
          if (!accounts.length) {
            console.info(`No unlocked Sui account was found. Skipping Sui queue processing`);
          } else {
            const txToProcess = suiQueuedProofs.slice(0, accounts.length);
            console.info(`${txToProcess.length} proofs to process`);
            //TODO REFACTOR duplitation/removing
            for (const tx of txToProcess) {
              await proofService.set(Network.SUI, tx.payload as SignedProof, tx);
            }

            console.info(`${txToProcess.length} proofs processed`);
          }
        }

        return onComplete();
      } catch (e) {
        Logger.error("QUEUE ERROR:", e);
      }
    },
    () => {
      console.timeEnd("Proof queue processor");
      console.info("Proof processor queue finished");
    },
    true,
  );

export default proofQueue;

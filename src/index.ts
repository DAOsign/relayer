import app from "./app";
import env from "./env";
import AppDataSource from "./ormconfig";
import txStatusChecker from "./worker/txStatusChecker";
import proofQueue from "./worker/queueWorker";
import { Account } from "./models/Account";
import { Proof } from "./models/Proof";
import { QueueService } from "./worker/queue.service";
import { Network } from "./services/proof_provider";
import { SuiProofProvider } from "./services/proof_provider/sui";

const port = env.PORT;

AppDataSource.initialize()
  .then((datasource) => {
    console.log("Data Source has been initialized!");

    // txStatusChecker(datasource).start();
    // proofQueue(datasource).start();

    const accountRepository = datasource.getRepository(Account);
    const proofRepository = datasource.getRepository(Proof);
    new QueueService(accountRepository, proofRepository, new SuiProofProvider("testnet")).start();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

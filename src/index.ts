import app from "./app";
import env from "./env";
import AppDataSource from "./ormconfig";
import txStatusChecker from "./worker/txStatusChecker";
import { debug } from "./services/debug";
import proofQueue from "./worker/queueWorker";

const port = env.PORT;

AppDataSource.initialize()
  .then((datasource) => {
    console.log("Data Source has been initialized!");

    //txStatusChecker(datasource).start();
    //proofQueue(datasource).start();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

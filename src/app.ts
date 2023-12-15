import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { routes } from "./routes";

class App {
  public app: express.Application;

  public constructor() {
    this.app = express();
    this.config();
    this.app.use(routes);
  }

  private config(): void {
    this.app.disable("x-powered-by");
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().app;

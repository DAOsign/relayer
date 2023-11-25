import * as express from "express";
import proof from "./proof";

export const routes = express();

routes.use(proof);

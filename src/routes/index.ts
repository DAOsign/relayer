import * as express from 'express';
import helloWorld from "./helloWorld";

export const routes = express();

routes.use(helloWorld);
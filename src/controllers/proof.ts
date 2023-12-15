import { Request, Response } from "express";
import AppDataSource from "../ormconfig";
import { parseNetwork, parseCID, parseProof } from "../utils/parsers";

import { EthereumProofProvider } from "../services/proof_provider/ethereum";
import env from "../env";
import { ProofService } from "../services/proofService";

const proofService = new ProofService(AppDataSource, [new EthereumProofProvider(env.ETH_RPC_URL)]);
export default class ProofController {
  public async get(req: Request, res: Response) {
    const network = parseNetwork(req.query.network as string);
    const proofcid = parseCID(req.query.proofcid as string);
    //  const data = await this.proofs.get(network, proofcid);
    res.status(200).json({});
  }

  public async set(req: Request, res: Response) {
    const data = parseProof(req.body);

    return proofService
      .set(data.network, data.message)
      .then((tx) => {
        res.status(200).json({ tx });
        return;
      })
      .catch((e) => {
        res.status(400).send(e?.message);
        return;
      });
  }
}

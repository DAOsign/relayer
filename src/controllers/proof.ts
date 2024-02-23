import { Request, Response } from "express";
import AppDataSource from "../ormconfig";
import { parseNetwork, parseCID, parseProof } from "../utils/parsers";

import { EthereumProofProvider } from "../services/proof_provider/ethereum";
import env from "../env";
import { ProofService } from "../services/proofService";
import { SuiProofProvider } from "../services/proof_provider/sui";
import { Network } from "../services/proof_provider";

const proofService = new ProofService(AppDataSource, [new EthereumProofProvider(env.ETH_RPC_URL), new SuiProofProvider("testnet"), new EthereumProofProvider(env.OASIS_RPC_URL, Network.OASIS)]);
export default class ProofController {
  public async get(req: Request, res: Response) {
    const network = parseNetwork(req.query.network as string);
    const proofcid = parseCID(req.query.proofcid as string);
    //  const data = await this.proofs.get(network, proofcid);
    res.status(200).json({});
  }

  public async set(req: Request, res: Response) {
    try {
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
    } catch (e: any) {
      console.error(e);
      res.status(500).send(e?.message);
    }
  }

  public async check(req: Request, res: Response) {
    const refId = req?.query?.refId;
    const tx = await proofService.getTxById(Number(refId));
    if (!tx) {
      return res.status(404).end();
    } else if (tx.txHash) {
      return res.status(200).send(tx.txHash);
    }

    return res.status(500).end();
  }
}

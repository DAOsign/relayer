import { Request, Response } from "express";
import { ProofProviders } from "../services/proof_provider";
import AppDataSource from "../ormconfig";
import { Tx } from "../models/Tx";
import { parseNetwork, parseCID, parseProof } from "../utils/parsers";
import { Account } from "../models/Account";

export default class Proof {
  private proofs: ProofProviders;

  constructor(proofs?: ProofProviders) {
    this.proofs = proofs!;
  }

  public async get(req: Request, res: Response) {
    const network = parseNetwork(req.query.network as string);
    const proofcid = parseCID(req.query.proofcid as string);
    const data = await this.proofs.get(network, proofcid);
    res.status(200).json(data);
  }

  public async set(req: Request, res: Response) {
    const data = parseProof(req.body);

    const accountRepository = AppDataSource.getRepository(Account);
    const txRepository = AppDataSource.getRepository(Tx);

    const account = await accountRepository.findOne({ where: { network: { network_id: data.network }, locked: false } });
    if (!account) {
      res.status(400).send("No available account");
      return;
    }

    const txhash = await this.proofs.set(data.network, data.message);

    if (txhash) {
      accountRepository.update({ account_id: account.account_id }, { locked: true });
    }

    const savedTx = await txRepository.create({ payload: data.message, network: { network_id: data.network }, tx_hash: txhash, account: account }).save();

    res.status(200).json({ savedTx });
  }
}

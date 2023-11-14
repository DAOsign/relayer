import { Request, Response } from "express";

export default class HelloWorld {
  public async isAlive(req: Request, res: Response) {
    res.status(200).json({ hello: "world" })
  }
}
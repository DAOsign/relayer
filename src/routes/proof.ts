import { Router } from "express";
import Proof from "../controllers/proof";

const router = Router();

const proofController: Proof = new Proof();

router.route("/proof").get(proofController.get).post(proofController.set);

export default router;

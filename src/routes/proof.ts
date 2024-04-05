import { Router } from "express";
import ProofController from "../controllers/proof";

const router = Router();

const proofController: ProofController = new ProofController();

router.route("/proof").get(proofController.get).post(proofController.set);
router.route("/check").get(proofController.check);
router.route("/cert").post(proofController.cert);
export default router;

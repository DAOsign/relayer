import { SignedProof } from "../services/proof_provider";

export const createContractPayload = (proof: SignedProof) => {
  return { message: proof.message.message, signature: proof.signature, proofCID: proof.proofCID };
};

import { ProofOfAgreementMessage, ProofOfAuthorityMessage, ProofOfSignatureMessage, SignedProof } from "../services/proof_provider";

export const createContractPayload = (proof: SignedProof) => {
  //console.log({ message: proof.message.message, signature: proof.signature, proofCID: proof.proofCID });
  return { message: proof.message.message as ProofOfAuthorityMessage | ProofOfSignatureMessage | ProofOfAgreementMessage, signature: proof.signature, proofCID: proof.proofCID };
};

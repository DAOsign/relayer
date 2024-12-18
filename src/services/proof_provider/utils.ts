import { PROOF_TYPE, SignedProof } from ".";

export function getProofType(proof: SignedProof): PROOF_TYPE {
  switch (proof.message.primaryType) {
    case "ProofOfAuthority":
      return PROOF_TYPE.PROOF_OF_AUTHORITY;
    case "ProofOfSignature":
      return PROOF_TYPE.PROOF_OF_SIGNATURE;
    case "ProofOfAgreement":
      return PROOF_TYPE.PROOF_OF_AGREEMENT;
    case "ProofOfVoid":
      return PROOF_TYPE.PROOF_OF_VOID;
    case "ProofOfCancel":
      return PROOF_TYPE.PROOF_OF_CANCEL;
    default:
      throw new Error("Unrecognized Proof type");
  }
}

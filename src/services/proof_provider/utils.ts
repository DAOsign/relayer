import { PROOF_TYPE, SignedProof } from ".";

export function getProofType(proof: SignedProof): PROOF_TYPE {
  switch (proof.message.primaryType) {
    case "ProofOfAuthority":
      return PROOF_TYPE.PROOF_OF_AUTHORITY;
    case "ProofOfSignature":
      return PROOF_TYPE.PROOF_OF_SIGNATURE;
    case "ProofOfAgreement":
      return PROOF_TYPE.PROOF_OF_AGREEMENT;
    default:
      throw new Error("Unrecognized Proof type");
  }

  /*   if ("ProofOfAuthority" in proof.message) return PROOF_TYPE.PROOF_OF_AUTHORITY;
  else if ("ProofOfSignature" in proof.message) return PROOF_TYPE.PROOF_OF_SIGNATURE;
  else if ("ProofOfAgreement" in proof.message) return PROOF_TYPE.PROOF_OF_AGREEMENT;
  else throw new Error("Unrecognized Proof type"); */
}

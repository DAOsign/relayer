import { bcs } from "@mysten/bcs";

const Signer = bcs.struct("Signer", {
  addr: bcs.vector(bcs.u8()),
  metadata: bcs.string(),
});

const ProofOfAuthority = bcs.struct("ProofOfAuthority", {
  name: bcs.string(),
  from: bcs.vector(bcs.u8()),
  agreementCID: bcs.string(),
  signers: bcs.vector(Signer),
  app: bcs.string(),
  timestamp: bcs.u64(),
  metadata: bcs.string(),
});

const ProofOfAgreement = bcs.struct("ProofOfAuthority", {
  agreementCID: bcs.string(),
  signatureCIDs: bcs.vector(bcs.string()),
  app: bcs.string(),
  timestamp: bcs.u64(),
  metadata: bcs.string(),
});

const ProofOfSignature = bcs.struct("ProofOfSignature", {
  name: bcs.string(),
  signer: bcs.vector(bcs.u8()),
  agreementCID: bcs.string(),
  app: bcs.string(),
  timestamp: bcs.u64(),
  metadata: bcs.string(),
});

export const SignedMessage = bcs.struct("SignedMessage", {
  message: ProofOfAuthority || ProofOfSignature || ProofOfAgreement,
  signature: bcs.vector(bcs.u8()),
  proofCID: bcs.string(),
});

export const serializeSigner = (signers: Array<{ addr: string; metadata: string }>) => {
  return signers.map((item) => {
    return { addr: bcs.string().serialize(item.addr).toBytes(), metadata: item.metadata };
  });
};

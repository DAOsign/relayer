import { BCS, getSuiMoveConfig } from "@mysten/bcs";

export const str2hex = (str: string) => {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
};

export const hex2vec = (hex: string) => {
  return Uint8Array.from(Buffer.from(hex.startsWith("0x") ? hex.slice(2) : hex, "hex"));
};

export const bcs = new BCS(getSuiMoveConfig());

// @ts-ignore
bcs.registerVectorType("vector<u8>", BCS.U8);
bcs.registerStructType("Signer", {
  addr: "vector<u8>",
  metadata: BCS.STRING,
});
// @ts-ignore
bcs.registerVectorType("vector<Signer>", "Signer");
bcs.registerStructType("ProofOfAuthority", {
  name: BCS.STRING,
  from: "vector<u8>",
  agreementCID: BCS.STRING,
  signers: "vector<Signer>",
  app: BCS.STRING,
  timestamp: BCS.U64,
  metadata: BCS.STRING,
});

bcs.registerStructType("ProofOfSignature", {
  name: BCS.STRING,
  signer: "vector<u8>",
  authorityCID: BCS.STRING,
  app: BCS.STRING,
  timestamp: BCS.U64,
  metadata: BCS.STRING,
});

// @ts-ignore
bcs.registerVectorType("vector<string>", BCS.STRING);
bcs.registerStructType("ProofOfAgreement", {
  authorityCID: BCS.STRING,
  signatureCIDs: "vector<string>",
  app: BCS.STRING,
  timestamp: BCS.U64,
  metadata: BCS.STRING,
});

export const serializeSigner = (signers: { addr: string; metadata: string }[]) => {
  return signers.map((signer) => {
    return { addr: hex2vec(signer.addr), metadata: signer.metadata };
  });
};

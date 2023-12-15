import {
  Network,
  ProofTypedMessage,
  SignedProof,
  ProofOfAuthorityTypedMessage,
  ProofOfSignatureTypedMessage,
  ProofOfAgreementTypedMessage,
  ProofOfAuthorityMessage,
  ProofOfSignatureMessage,
  ProofOfAgreementMessage,
} from "../services/proof_provider";

const IPFS_CID_LENGTH = 46;
const CHAIN_SIG_LENGTH = 132;

export function parseNetwork(value?: string): Network {
  switch ((value ?? "").toLocaleLowerCase()) {
    case "ethereum":
      return Network.ETHEREUM;
    case "astar":
      return Network.ASTAR;
    case "sui":
      return Network.SUI;
  }
  throw new Error("invalid network value");
}

export function parseCID(value?: string): string {
  if (value === undefined || value.length !== IPFS_CID_LENGTH || !value.startsWith("Qm")) {
    throw new Error("invalid cid value");
  }
  return value;
}

export function parseSig(value?: string): string {
  if (value === undefined || value.length !== CHAIN_SIG_LENGTH || !value.startsWith("0x")) {
    throw new Error("invalid sig value");
  }
  return value;
}

export function parseProofTypedMessage(value: any): ProofTypedMessage {
  const errMsg = new Error("invalid msg value");

  if (typeof value !== "object") {
    throw errMsg;
  }
  value = value as Record<string, any>;
  if (typeof value.domain !== "object") {
    throw errMsg;
  }
  const domain: {
    name?: string;
    version?: string;
    chainId?: number;
    verifyingContract?: string;
    salt?: ArrayBuffer;
  } = value.domain;

  if (typeof value.primaryType !== "string") {
    throw errMsg;
  }
  const primaryType = value.primaryType;

  if (typeof value.types !== "object" || typeof value.types.EIP712Domain !== "object" || typeof value.message !== "object") {
    throw errMsg;
  }
  let types: ProofOfAuthorityTypedMessage | ProofOfSignatureTypedMessage | ProofOfAgreementTypedMessage;
  let msg: ProofOfAuthorityMessage | ProofOfSignatureMessage | ProofOfAgreementMessage;
  switch (primaryType) {
    case "ProofOfAuthority":
      if (typeof value.types.Signer !== "object" || typeof value.types.ProofOfAuthority !== "object") {
        throw errMsg;
      }
      types = value.types as ProofOfAuthorityTypedMessage;
      msg = value.message as ProofOfAuthorityMessage;
      break;
    case "ProofOfSignature":
      if (typeof value.types.ProofOfSignature !== "object") {
        throw errMsg;
      }
      types = value.types as ProofOfSignatureTypedMessage;
      msg = value.message as ProofOfSignatureMessage;
      break;
    case "ProofOfAgreement":
      if (typeof value.types.ProofOfAgreement !== "object") {
        throw errMsg;
      }
      types = value.types as ProofOfAgreementTypedMessage;
      msg = value.message as ProofOfAgreementMessage;
      break;
    default:
      throw errMsg;
  }

  return {
    domain: domain,
    primaryType: primaryType,
    types: types,
    message: msg,
  };
}

export function parseSignedProof(value: any): SignedProof {
  const proofCID = parseCID(value.proofCID);
  const signature = parseSig(value.signature);
  const message = parseProofTypedMessage(value.message)!;
  return {
    message: message,
    signature: signature,
    proofCID: proofCID,
  };
}

export function parseProof(value?: any): { network: Network; message: SignedProof } {
  return {
    network: parseNetwork(value.network),
    message: parseSignedProof(value.message)!,
  };
}

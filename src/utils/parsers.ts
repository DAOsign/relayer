import {
  Network,
  ProofOfAgreementMessage,
  ProofOfAgreementTypedMessage,
  ProofOfAuthorityMessage,
  ProofOfAuthorityTypedMessage,
  ProofOfCancelMessage,
  ProofOfCancelTypedMessage,
  ProofOfSignatureMessage,
  ProofOfSignatureTypedMessage,
  ProofOfVoidMessage,
  ProofOfVoidTypedMessage,
  ProofTypedMessage,
  SignedProof,
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
    case "oasis":
      return Network.OASIS;
    case "polkadot":
      return Network.POLKADOT;
    case "near":
      return Network.NEAR;
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
  if (value === undefined || /* value.length !== CHAIN_SIG_LENGTH || */ !value.startsWith("0x")) {
    //TODO
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
  /*   if (typeof value.types !== "object" || typeof value.types.EIP712Domain !== "object" || typeof value.message !== "object") {
    throw errMsg;
  } */
  let types: ProofOfAuthorityTypedMessage | ProofOfSignatureTypedMessage | ProofOfAgreementTypedMessage | ProofOfVoidTypedMessage | ProofOfCancelTypedMessage;
  let msg: ProofOfAuthorityMessage | ProofOfSignatureMessage | ProofOfAgreementMessage | ProofOfVoidMessage | ProofOfCancelMessage;

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
    case "ProofOfVoid":
      if (typeof value.types.ProofOfVoid !== "object") {
        throw errMsg;
      }
      types = value.types as ProofOfVoidTypedMessage;
      msg = value.message as ProofOfVoidMessage;
      break;
    case "ProofOfCancel":
      if (typeof value.types.ProofOfCancel !== "object") {
        throw errMsg;
      }
      types = value.types as ProofOfCancelTypedMessage;
      msg = value.message as ProofOfCancelMessage;
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
  const message = parseProofTypedMessage(value.message)!;

  const signedProof: SignedProof = {
    message: message,
    proofCID: proofCID,
  };

  if ("signature" in value) {
    signedProof.signature = parseSig(value?.signature);
  }

  return signedProof;
}

export function parseProof(value?: any): { network: Network; message: SignedProof } {
  return {
    network: parseNetwork(value.network),
    message: parseSignedProof(value.message)!,
  };
}

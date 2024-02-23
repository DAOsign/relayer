export enum Network {
  ETHEREUM = 1,
  SUI = 2,
  ASTAR = 3,
  OASIS = 4,
}
export enum Tx_Status {
  NEW = 1,
  IN_PROGRESS = 2,
  SUCCESS = 3,
  ERROR = 4,
}

export enum PROOF_TYPE {
  PROOF_OF_SIGNATURE,
  PROOF_OF_AUTHORITY,
  PROOF_OF_AGREEMENT,
  PROOF_OF_VOID,
  PROOF_OF_CANCEL,
}

export interface MessageTypeProperty {
  name: string;
  type: string;
}

export interface MessageTypes {
  EIP712Domain: MessageTypeProperty[];
  [additionalProperties: string]: MessageTypeProperty[];
}

export interface TypedMessage<T extends MessageTypes, M> {
  types: T;
  primaryType: keyof T;
  domain: {
    name?: string;
    version?: string;
    chainId?: number;
    verifyingContract?: string;
    salt?: ArrayBuffer;
  };
  message: M;
}

export interface ProofOfAuthorityTypedMessage extends MessageTypes {
  EIP712Domain: [{ name: "name"; type: "string" }, { name: "version"; type: "string" }, { name: "chainId"; type: "uint256" }, { name: "verifyingContract"; type: "address" }];
  Signer: [{ name: "addr"; type: "address" }, { name: "metadata"; type: "string" }];
  ProofOfAuthority: [
    { name: "name"; type: "string" },
    { name: "from"; type: "address" },
    { name: "agreementCID"; type: "string" },
    { name: "signers"; type: "Signer[]" },
    { name: "app"; type: "string" },
    { name: "timestamp"; type: "uint256" },
    { name: "metadata"; type: "string" },
  ];
}

export interface ProofOfSignatureTypedMessage extends MessageTypes {
  EIP712Domain: [{ name: "name"; type: "string" }, { name: "version"; type: "string" }, { name: "chainId"; type: "uint256" }, { name: "verifyingContract"; type: "address" }];
  ProofOfSignature: [
    { name: "name"; type: "string" },
    { name: "signer"; type: "address" },
    { name: "authorityCID"; type: "string" },
    { name: "app"; type: "string" },
    { name: "timestamp"; type: "uint256" },
    { name: "metadata"; type: "string" },
  ];
}

export interface ProofOfAgreementTypedMessage extends MessageTypes {
  EIP712Domain: [{ name: "name"; type: "string" }, { name: "version"; type: "string" }, { name: "chainId"; type: "uint256" }, { name: "verifyingContract"; type: "address" }];
  ProofOfAgreement: [
    { name: "authorityCID"; type: "string" },
    { name: "signatureCIDs"; type: "string[]" },
    { name: "app"; type: "string" },
    { name: "timestamp"; type: "uint256" },
    { name: "metadata"; type: "string" },
  ];
}

export interface ProofOfVoidTypedMessage extends MessageTypes {
  EIP712Domain: [{ name: "name"; type: "string" }, { name: "version"; type: "string" }, { name: "chainId"; type: "uint256" }, { name: "verifyingContract"; type: "address" }];
  ProofOfVoid: [{ name: "authorityCID"; type: "string" }, { name: "app"; type: "string" }, { name: "timestamp"; type: "uint256" }, { name: "metadata"; type: "string" }];
}
export interface ProofOfCancelTypedMessage extends MessageTypes {
  EIP712Domain: [{ name: "name"; type: "string" }, { name: "version"; type: "string" }, { name: "chainId"; type: "uint256" }, { name: "verifyingContract"; type: "address" }];
  ProofOfVoid: [{ name: "authorityCIDs"; type: "string[]" }, { name: "app"; type: "string" }, { name: "timestamp"; type: "uint256" }, { name: "metadata"; type: "string" }];
}

export interface MessageMetadata {
  app: "daosign";
  timestamp: number;
  metadata: string;
}

export interface ProofOfAuthorityMessage extends MessageMetadata {
  name: "Proof-of-Authority";
  from: string;
  agreementCID: string;
  signers: Array<{ addr: string; metadata: string }>;
}

export interface ProofOfSignatureMessage extends MessageMetadata {
  name: "Proof-of-Signature";
  signer: string;
  authorityCID: string;
}

export interface ProofOfAgreementMessage extends MessageMetadata {
  name: "Proof-of-Agreement";
  authorityCID: string;
  signatureCIDs: Array<string>;
}
export interface ProofOfVoidMessage extends MessageMetadata {
  authorityCID: string;
}
export interface ProofOfCancelMessage extends MessageMetadata {
  authorityCIDs: string[];
}

export type ProofTypedMessage = TypedMessage<
  ProofOfAuthorityTypedMessage | ProofOfSignatureTypedMessage | ProofOfAgreementTypedMessage | ProofOfVoidTypedMessage | ProofOfCancelTypedMessage,
  ProofOfAuthorityMessage | ProofOfSignatureMessage | ProofOfAgreementMessage | ProofOfVoidMessage | ProofOfCancelMessage
>;

export interface SignedProof {
  message: ProofTypedMessage;
  signature?: string;
  proofCID: string;
}

export interface ProofProvider {
  network: Network;

  get(proofCID: string): Promise<SignedProof>;
  set(derivationPath: string, proof: SignedProof): Promise<string>;
}

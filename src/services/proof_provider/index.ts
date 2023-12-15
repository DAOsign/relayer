export enum Network {
  ETHEREUM = 1,
  ASTAR = 2,
  SUI = 3,
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
    { name: "agreementCID"; type: "string" },
    { name: "app"; type: "string" },
    { name: "timestamp"; type: "uint256" },
    { name: "metadata"; type: "string" },
  ];
}

export interface ProofOfAgreementTypedMessage extends MessageTypes {
  EIP712Domain: [{ name: "name"; type: "string" }, { name: "version"; type: "string" }, { name: "chainId"; type: "uint256" }, { name: "verifyingContract"; type: "address" }];
  ProofOfAgreement: [
    { name: "agreementCID"; type: "string" },
    { name: "signatureCIDs"; type: "string[]" },
    { name: "app"; type: "string" },
    { name: "timestamp"; type: "uint256" },
    { name: "metadata"; type: "string" },
  ];
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
  agreementCID: string;
}

export interface ProofOfAgreementMessage extends MessageMetadata {
  agreementCID: string;
  signatureCIDs: Array<string>;
}

export type ProofTypedMessage = TypedMessage<
  ProofOfAuthorityTypedMessage | ProofOfSignatureTypedMessage | ProofOfAgreementTypedMessage,
  ProofOfAuthorityMessage | ProofOfSignatureMessage | ProofOfAgreementMessage
>;

export interface SignedProof {
  message: ProofTypedMessage;
  signature: string;
  proofCID: string;
}

export interface ProofProvider {
  network: Network;

  get(proofCID: string): Promise<SignedProof>;
  set(derivationPath: string, proof: SignedProof): Promise<string>;
}


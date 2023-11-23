export enum Network {
  ETHEREUM = "ethereum",
  ASTAR = "astar",
  SUI = "sui",
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
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
  Signer: [
    { name: "addr", type: "address" },
    { name: "metadata", type: "string" },
  ],
  ProofOfAuthority: [
    { name: "name", type: "string" },
    { name: "from", type: "address" },
    { name: "agreementCID", type: "string" },
    { name: "signers", type: "Signer[]" },
    { name: "app", type: "string" },
    { name: "timestamp", type: "uint256" },
    { name: "metadata", type: "string" },
  ]
}

export interface ProofOfSignatureTypedMessage extends MessageTypes {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
  ProofOfSignature: [
    { name: "name", type: "string" },
    { name: "signer", type: "address" },
    { name: "agreementCID", type: "string" },
    { name: "app", type: "string" },
    { name: "timestamp", type: "uint256" },
    { name: "metadata", type: "string" },
  ],
}

export interface ProofOfAgreementTypedMessage extends MessageTypes {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
  ProofOfAgreement: [
    { name: "agreementCID", type: "string" },
    { name: "signatureCIDs", type: "string[]" },
    { name: "app", type: "string" },
    { name: "timestamp", type: "uint256" },
    { name: "metadata", type: "string" },
  ],
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
  ProofOfAuthorityTypedMessage |
  ProofOfSignatureTypedMessage |
  ProofOfAgreementTypedMessage,
  ProofOfAuthorityMessage |
  ProofOfSignatureMessage |
  ProofOfAgreementMessage
>;

export interface SignedProof {
  message: ProofTypedMessage;
  signature: string;
  proofCID: string;
}

export interface ProofProvider {
  network: Network;

  get(proofCID: string): Promise<SignedProof>;
  set(proof: SignedProof): Promise<string>;
}

export class ProofProviders {
  providers: { [key: string]: ProofProvider } = {};

  constructor(providers: Array<ProofProvider>) {
    for (const provider of providers) {
      this.providers[provider.network] = provider;
    }
  }

  get(network: Network, proofCID: string): Promise<SignedProof> {
    return this.providers[network].get(proofCID)
  }

  set(network: Network, proof: SignedProof): Promise<string> {
    return this.providers[network].set(proof);
  }
}
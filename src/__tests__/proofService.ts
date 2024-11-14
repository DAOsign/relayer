import { DataSource, Repository } from "typeorm";
import { ProofService } from "../services/proofService";
import { Network, ProofOfAgreementMessage, ProofOfSignatureMessage, SignedProof, ProofOfVoidMessage } from "../services/proof_provider";
import { Tx } from "../models/Tx";
import { Account } from "../models/Account";
import { Proof } from "../models/Proof";
import { ProofType } from "../worker/queue.service";

jest.mock("../models/Proof");

describe("ProofService", () => {
  let proofService: ProofService;
  let mockDataSource: Partial<DataSource>;
  let mockAccountRepository: Partial<Repository<Account>>;
  let mockTxRepository: Partial<Repository<Tx>>;
  let mockProofRepository: Partial<Repository<Proof>>;

  beforeEach(() => {
    mockAccountRepository = { create: jest.fn(), save: jest.fn() };
    mockTxRepository = { create: jest.fn(), save: jest.fn() };
    mockProofRepository = { create: jest.fn(), save: jest.fn(), findOneBy: jest.fn() };

    mockDataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === Account) return mockAccountRepository;
        if (entity === Tx) return mockTxRepository;
        if (entity === Proof) return mockProofRepository;
      }),
    } as Partial<DataSource>;

    const mockProviders = [];
    proofService = new ProofService(mockDataSource as DataSource, mockProviders);
  });

  describe("set", () => {
    it("should create and save Proof with ProofOfSignature type", async () => {
      const mockSignedProof: SignedProof = {
        message: {
          primaryType: "ProofOfSignature",
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
            ProofOfSignature: [
              { name: "name", type: "string" },
              { name: "signer", type: "address" },
              { name: "authorityCID", type: "string" },
              { name: "timestamp", type: "uint256" },
              { name: "metadata", type: "string" },
            ],
          },
          domain: {},
          message: {
            name: "Proof-of-Signature",
            signer: "0x123",
            authorityCID: "authorityCID",
            timestamp: Date.now(),
            metadata: "testMetadata",
          } as ProofOfSignatureMessage,
        },
        proofCID: "testCID",
        signature: "testSignature",
      };

      const expectedProof = { id: 2, refId: "authorityCID", network: Network.ETHEREUM, type: ProofType.SIGNATURE };

      (mockProofRepository.create as jest.Mock).mockReturnValue(expectedProof);
      (mockProofRepository.save as jest.Mock).mockResolvedValue(expectedProof);

      const result = await proofService.set(Network.ETHEREUM, mockSignedProof);

      expect(mockProofRepository.create).toHaveBeenCalledWith({
        refId: "authorityCID",
        network: Network.ETHEREUM,
        status: 1,
        type: ProofType.SIGNATURE,
        cid: "testCID",
        signature: "testSignature",
        payload: mockSignedProof,
      });
      expect(mockProofRepository.save).toHaveBeenCalledWith(expectedProof);
      expect(result).toEqual(expectedProof);
    });

    it("should create and save Proof with ProofOfAgreement type", async () => {
      const mockSignedProof: SignedProof = {
        message: {
          primaryType: "ProofOfAgreement",
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
            ProofOfAgreement: [
              { name: "authorityCID", type: "string" },
              { name: "signatureCIDs", type: "string[]" },
              { name: "timestamp", type: "uint256" },
              { name: "metadata", type: "string" },
            ],
          },
          domain: {},
          message: {
            name: "Proof-of-Agreement",
            authorityCID: "authorityCID",
            signatureCIDs: ["sigCID1", "sigCID2"],
            timestamp: Date.now(),
            metadata: "testMetadata",
          } as ProofOfAgreementMessage,
        },
        proofCID: "testCID",
        signature: "testSignature",
      };

      const expectedProof = { id: 3, refId: "authorityCID", network: Network.ETHEREUM, type: ProofType.DOCUMENT };

      (mockProofRepository.create as jest.Mock).mockReturnValue(expectedProof);
      (mockProofRepository.save as jest.Mock).mockResolvedValue(expectedProof);

      const result = await proofService.set(Network.ETHEREUM, mockSignedProof);

      expect(mockProofRepository.create).toHaveBeenCalledWith({
        refId: "authorityCID",
        network: Network.ETHEREUM,
        status: 1,
        type: ProofType.DOCUMENT,
        cid: "testCID",
        payload: mockSignedProof,
      });
      expect(mockProofRepository.save).toHaveBeenCalledWith(expectedProof);
      expect(result).toEqual(expectedProof);
    });

    it("should handle errors and return undefined when proof creation fails", async () => {
      const mockSignedProof: SignedProof = {
        message: {
          primaryType: "ProofOfSignature",
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
            ProofOfSignature: [
              { name: "name", type: "string" },
              { name: "signer", type: "address" },
              { name: "authorityCID", type: "string" },
              { name: "timestamp", type: "uint256" },
              { name: "metadata", type: "string" },
            ],
          },
          domain: {},
          message: {
            name: "Proof-of-Signature",
            signer: "0x123",
            authorityCID: "authorityCID",
            timestamp: Date.now(),
            metadata: "testMetadata",
          } as ProofOfSignatureMessage,
        },
        proofCID: "testCID",
        signature: "testSignature",
      };

      mockProofRepository.create= jest.fn().mockRejectedValue(new Error("Creation error"));

      const resultPromise = proofService.set(Network.ETHEREUM, mockSignedProof);

      expect(mockProofRepository.create).toHaveBeenCalled();
      await expect(resultPromise).rejects.toThrow();
    });

    it("should create and save Proof with ProofOfVoid type", async () => {
      const mockSignedProof: SignedProof = {
        message: {
          primaryType: "ProofOfVoid",
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
            ProofOfVoid: [
              { name: "authorityCID", type: "string" },
              { name: "timestamp", type: "uint256" },
              { name: "metadata", type: "string" },
            ],
          },
          domain: {
            name: "VoidProofDomain",
            version: "1",
            chainId: 1,
            verifyingContract: "0xContractAddress",
          },
          message: {
            authorityCID: "authorityCID",
            timestamp: Date.now(),
            metadata: "void metadata",
          } as ProofOfVoidMessage,
        },
        proofCID: "voidCID",
        signature: "voidSignature",
      };

      const expectedProof = { id: 4, refId: "authorityCID", network: Network.ETHEREUM, type: ProofType.VOID };

      (mockProofRepository.create as jest.Mock).mockReturnValue(expectedProof);
      (mockProofRepository.save as jest.Mock).mockResolvedValue(expectedProof);

      const result = await proofService.set(Network.ETHEREUM, mockSignedProof);

      expect(mockProofRepository.create).toHaveBeenCalledWith({
        refId: "authorityCID",
        network: Network.ETHEREUM,
        status: 1,
        type: ProofType.VOID,
        cid: "voidCID",
        signature: "voidSignature",
        payload: mockSignedProof,
      });
      expect(mockProofRepository.save).toHaveBeenCalledWith(expectedProof);
      expect(result).toEqual(expectedProof);
    });
  });

  describe("getTxById", () => {
    it("should return the transaction by ID", async () => {
      const mockProof = { id: 1, refId: "testCID" } as Proof;

      (mockProofRepository.findOneBy as jest.Mock).mockResolvedValue(mockProof);

      const result = await proofService.getTxById(1);

      expect(mockProofRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockProof);
    });

    it("should return null if no transaction is found", async () => {
      (mockProofRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await proofService.getTxById(999);

      expect(mockProofRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(result).toBeNull();
    });
  });
});

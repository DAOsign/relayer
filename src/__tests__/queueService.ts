import { ProofType, QueueService, Tx_Status } from "../worker/queue.service";
import { Proof } from "../models/Proof";
import { Account } from "../models/Account";
import { CronJob } from "cron";
import { Network, ProofProvider } from "../services/proof_provider";
import { Repository } from "typeorm";

describe("QueueService", () => {
  let queueService: QueueService;
  let mockAccountRepository: Partial<Repository<Account>>;
  let mockProofRepository: Partial<Repository<Proof>>;
  let mockRelayerService: Partial<ProofProvider>;

  beforeEach(() => {
    mockAccountRepository = {
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ account_id: 1, hd_path: "m/44'/60'/0'/0/0", balance: "1000000" } as Partial<Account>] as Account[]),
      }),
      save: jest.fn(),
    };

    mockProofRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
    };

    mockRelayerService = {
      network: Network.ETHEREUM,
      set: jest.fn().mockResolvedValue("0xTransactionHash"),
    };

    queueService = new QueueService(mockAccountRepository as Repository<Account>, mockProofRepository as Repository<Proof>, mockRelayerService as ProofProvider);

    queueService.processQueueCron = {
      start: jest.fn(),
      stop: jest.fn(),
      tick: jest.fn(),
    } as unknown as CronJob;
  });

  describe("processProofs", () => {
    it("should process proofs if conditions are met", async () => {
      const mockProofs = [
        { id: 1, type: ProofType.AUTHORITY, refId: "auth1" } as Proof,
        { id: 2, type: ProofType.SIGNATURE, refId: "auth1" } as Proof,
        { id: 3, type: ProofType.DOCUMENT, refId: "sig1" } as Proof,
      ];
      const mockAccounts = [
        { account_id: 1, hd_path: "m/44'/60'/0'/0/0" } as Account,
        { account_id: 2, hd_path: "m/44'/60'/0'/0/1" } as Account,
        { account_id: 3, hd_path: "m/44'/60'/0'/0/2" } as Account,
      ];

      jest.spyOn(queueService, "isAuthorityProofProcessed").mockResolvedValue(true);
      jest.spyOn(queueService, "isSignatureProofsProcessed").mockResolvedValue(true);

      const resultPromise = queueService.processProofs(mockProofs, mockAccounts);

      await expect(resultPromise).resolves.toHaveLength(3);
      expect(queueService.isAuthorityProofProcessed).toHaveBeenCalledWith("auth1");
    });

    it("should skip processing if authority proof is not processed", async () => {
      const mockProof = { id: 4, type: ProofType.SIGNATURE, refId: "auth1" } as Proof;
      const mockAccount = { account_id: 4, hd_path: "m/44'/60'/0'/0/4" } as Account;

      jest.spyOn(queueService, "isAuthorityProofProcessed").mockResolvedValue(false);

      const result = await queueService.processProofs([mockProof], [mockAccount]);

      expect(queueService.isAuthorityProofProcessed).toHaveBeenCalledWith("auth1");
      expect(result[0]).toBeUndefined();
    });

    it("should skip processing DOCUMENT proof if SIGNATURE proof is not processed", async () => {
      const mockProof = { id: 5, type: ProofType.DOCUMENT, refId: "sig1" } as Proof;
      const mockAccount = { account_id: 5, hd_path: "m/44'/60'/0'/0/5" } as Account;

      jest.spyOn(queueService, "isSignatureProofsProcessed").mockResolvedValue(false);

      const result = await queueService.processProofs([mockProof], [mockAccount]);

      expect(queueService.isSignatureProofsProcessed).toHaveBeenCalledWith("sig1");
      expect(result[0]).toBeUndefined();
    });

    it("should skip processing VOID proof if authority proof is not processed", async () => {
      const mockProof = { id: 6, type: ProofType.VOID, refId: "auth1" } as Proof;
      const mockAccount = { account_id: 6, hd_path: "m/44'/60'/0'/0/6" } as Account;

      jest.spyOn(queueService, "isAuthorityProofProcessed").mockResolvedValue(false);

      const result = await queueService.processProofs([mockProof], [mockAccount]);

      expect(queueService.isAuthorityProofProcessed).toHaveBeenCalledWith("auth1");
      expect(result[0]).toBeUndefined();
    });

    it("should skip processing CANCEL proof if authority proof is not processed", async () => {
      const mockProof = { id: 7, type: ProofType.CANCEL, refId: "auth1" } as Proof;
      const mockAccount = { account_id: 7, hd_path: "m/44'/60'/0'/0/7" } as Account;

      jest.spyOn(queueService, "isAuthorityProofProcessed").mockResolvedValue(false);

      const result = await queueService.processProofs([mockProof], [mockAccount]);

      expect(queueService.isAuthorityProofProcessed).toHaveBeenCalledWith("auth1");
      expect(result[0]).toBeUndefined();
    });
  });

  describe("processProof", () => {
    it("should not process proof if account is undefined", async () => {
      const mockProof = { id: 8, type: ProofType.AUTHORITY, payload: { proofCID: "proof8" } } as Proof;

      const result = queueService.processProof(mockProof, undefined as unknown as Account);

      await expect(result).resolves.toBeUndefined();
      expect(mockProofRepository.save).not.toHaveBeenCalled();
    });

    it("should handle error in relayerService.set and set proof status to ERROR", async () => {
      const mockProof = { id: 9, type: ProofType.AUTHORITY, payload: { proofCID: "proof9" } } as Proof;
      const mockAccount = { account_id: 9, hd_path: "m/44'/60'/0'/0/9" } as Account;

      (mockRelayerService.set as jest.Mock).mockRejectedValue(new Error("Test error"));

      await queueService.processProof(mockProof, mockAccount);

      expect(mockProof.status).toBe(Tx_Status.ERROR);
      expect(mockProofRepository.save).toHaveBeenCalledWith(mockProof);
    });
  });

  describe("processQueue", () => {
    it("should not process queue if no unlocked accounts", async () => {
      jest.spyOn(queueService, "getUnlockedAccounts").mockResolvedValue([]);
      jest.spyOn(queueService, "getProcessableProofs");

      await queueService.processQueue();

      expect(queueService.getUnlockedAccounts).toHaveBeenCalled();
      expect(queueService.getProcessableProofs).not.toHaveBeenCalled();
    });

    it("should log if no processable proofs found", async () => {
      const unlockedAccounts = [{ account_id: 1, hd_path: "m/44'/60'/0'/0/0" }] as Account[];
      jest.spyOn(queueService, "getUnlockedAccounts").mockResolvedValue(unlockedAccounts);
      jest.spyOn(queueService, "getProcessableProofs").mockResolvedValue([]);

      await queueService.processQueue();

      expect(queueService.getUnlockedAccounts).toHaveBeenCalled();
      expect(queueService.getProcessableProofs).toHaveBeenCalledWith(unlockedAccounts.length);
    });

    it("should handle successful processing of proofs", async () => {
      const unlockedAccounts = [
        { account_id: 1, hd_path: "m/44'/60'/0'/0/0", balance: "1000000" },
        { account_id: 2, hd_path: "m/44'/60'/0'/0/1", balance: "1000000" },
      ] as Account[];

      const proofs = [
        { id: 1, type: ProofType.AUTHORITY, refId: "auth1" },
        { id: 2, type: ProofType.SIGNATURE, refId: "auth1" },
      ] as Proof[];

      jest.spyOn(queueService, "getUnlockedAccounts").mockResolvedValue(unlockedAccounts);
      jest.spyOn(queueService, "getProcessableProofs").mockResolvedValue(proofs);
      jest.spyOn(queueService, "processProofs").mockResolvedValue(proofs);

      await queueService.processQueue();

      expect(queueService.getUnlockedAccounts).toHaveBeenCalled();
      expect(queueService.getProcessableProofs).toHaveBeenCalledWith(unlockedAccounts.length);
      expect(queueService.processProofs).toHaveBeenCalledWith(proofs, unlockedAccounts);
    });
  });
});

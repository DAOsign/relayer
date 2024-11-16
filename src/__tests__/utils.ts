import { parseNetwork, parseCID, parseSig, parseProofTypedMessage, parseSignedProof, parseProof } from "../utils/parsers";
import { Network, ProofOfAuthorityTypedMessage, ProofOfAuthorityMessage, ProofTypedMessage, SignedProof } from "../services/proof_provider";

describe("Parser Functions", () => {
  describe("parseNetwork", () => {
    it("should return the correct Network enum for valid input", () => {
      expect(parseNetwork("ethereum")).toBe(Network.ETHEREUM);
      expect(parseNetwork("sui")).toBe(Network.SUI);
      expect(parseNetwork("astar")).toBe(Network.ASTAR);
    });

    it("should throw an error for invalid network value", () => {
      expect(() => parseNetwork("invalid")).toThrow("invalid network value");
    });
  });

  describe("parseCID", () => {
    it("should return the CID if it is valid", () => {
      const validCID = "QmT8PLQJ4Lu2KBfszvVMyc1YuUjSnD7HbK3kieSh8XMzz3";
      expect(parseCID(validCID)).toBe(validCID);
    });

    it("should throw an error if CID is invalid", () => {
      expect(() => parseCID("invalidCID")).toThrow("invalid cid value");
      expect(() => parseCID(undefined)).toThrow("invalid cid value");
    });
  });

  describe("parseSig", () => {
    it("should return the signature if it is valid", () => {
      const validSig = "0x" + "a".repeat(130);
      expect(parseSig(validSig)).toBe(validSig);
    });

    it("should throw an error if signature is invalid", () => {
      expect(() => parseSig("invalidSig")).toThrow("invalid sig value");
      expect(() => parseSig(undefined)).toThrow("invalid sig value");
    });
  });

  describe("parseProofTypedMessage", () => {
    it("should parse and return a valid ProofTypedMessage object", () => {
      const message: ProofOfAuthorityMessage = {
        name: "Proof-of-Authority",
        from: "0xAddress",
        agreementCID: "QmAgreementCID",
        signers: [{ addr: "0xSignerAddress", metadata: "metadata" }],
        timestamp: 123456,
        metadata: "Some metadata",
      };

      const typedMessage: ProofTypedMessage = {
        primaryType: "ProofOfAuthority",
        types: {
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
            { name: "timestamp", type: "uint256" },
            { name: "metadata", type: "string" },
          ],
        } as ProofOfAuthorityTypedMessage,
        domain: { name: "domain", chainId: 1 },
        message,
      };

      expect(parseProofTypedMessage(typedMessage)).toEqual(typedMessage);
    });

    it("should throw an error for an invalid ProofTypedMessage", () => {
      const invalidMessage = {
        primaryType: "InvalidType",
        types: {},
        domain: {},
        message: {},
      };
      expect(() => parseProofTypedMessage(invalidMessage)).toThrow("invalid msg value");
    });
  });

  describe("parseSignedProof", () => {
    it("should parse a valid SignedProof", () => {
      const message: ProofOfAuthorityMessage = {
        name: "Proof-of-Authority",
        from: "0xAddress",
        agreementCID: "QmAgreementCID",
        signers: [{ addr: "0xSignerAddress", metadata: "metadata" }],
        timestamp: 123456,
        metadata: "Some metadata",
      };

      const typedMessage: ProofTypedMessage = {
        primaryType: "ProofOfAuthority",
        types: {
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
            { name: "timestamp", type: "uint256" },
            { name: "metadata", type: "string" },
          ],
        } as ProofOfAuthorityTypedMessage,
        domain: { name: "domain", chainId: 1 },
        message,
      };

      const signedProof: SignedProof = {
        message: typedMessage,
        proofCID: "QmT8PLQJ4Lu2KBfszvVMyc1YuUjSnD7HbK3kieSh8XMzz3",
        signature: "0x" + "a".repeat(130),
      };

      expect(parseSignedProof(signedProof)).toEqual(signedProof);
    });

    it("should throw an error for an invalid SignedProof", () => {
      const invalidProof = { proofCID: "invalidCID", message: {}, signature: "invalidSig" };
      expect(() => parseSignedProof(invalidProof)).toThrow("invalid cid value");
    });
  });

  describe("parseProof", () => {
    it("should parse a valid proof object", () => {
      const message: ProofOfAuthorityMessage = {
        name: "Proof-of-Authority",
        from: "0xAddress",
        agreementCID: "QmAgreementCID",
        signers: [{ addr: "0xSignerAddress", metadata: "metadata" }],
        timestamp: 123456,
        metadata: "Some metadata",
      };

      const typedMessage: ProofTypedMessage = {
        primaryType: "ProofOfAuthority",
        types: {
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
            { name: "timestamp", type: "uint256" },
            { name: "metadata", type: "string" },
          ],
        } as ProofOfAuthorityTypedMessage,
        domain: { name: "domain", chainId: 1 },
        message,
      };

      const proofObj = {
        network: "ethereum",
        message: {
          proofCID: "QmT8PLQJ4Lu2KBfszvVMyc1YuUjSnD7HbK3kieSh8XMzz3",
          message: typedMessage,
          signature: "0x" + "a".repeat(130),
        },
      };

      const parsedProof = parseProof(proofObj);

      expect(parsedProof.network).toBe(Network.ETHEREUM);
      expect(parsedProof.message.proofCID).toBe("QmT8PLQJ4Lu2KBfszvVMyc1YuUjSnD7HbK3kieSh8XMzz3");
      expect(parsedProof.message.signature).toBe("0x" + "a".repeat(130));
    });

    it("should throw an error if proof object is invalid", () => {
      const invalidProof = { network: "invalidNetwork", message: {} };
      expect(() => parseProof(invalidProof)).toThrow("invalid network value");
    });
  });
});

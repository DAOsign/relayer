import { parseNetwork, parseCID, parseSig, parseProofTypedMessage } from "../../src/controllers/proof";
import { Network } from "../../src/services/proof_provider";

describe("params parsers", () => {
  test("network", () => {
    expect(parseNetwork("ethereum")).toBe(Network.ETHEREUM);
    expect(parseNetwork("astar")).toBe(Network.ASTAR);
    expect(parseNetwork("sui")).toBe(Network.SUI);
    expect(parseNetwork.bind(null)).toThrow("invalid network value");
    expect(parseNetwork.bind(null, "network")).toThrow("invalid network value");
  });

  test("cid", () => {
    const cid = "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB";
    expect(parseCID(cid)).toBe(cid);
    expect(parseCID.bind(null)).toThrow("invalid cid value");
    expect(parseCID.bind(null, "some sid")).toThrow("invalid cid value");
  })

  test("sig", () => {
    const sig = "0xf4076ad4d3f314a634bdf720a52fcbf94566678040f7896ea70c1f4fd35f81ad4e6e1338a5e503e6189e365a860b7a3f974ef553c77829555e2e621a3975da3b1b";
    expect(parseSig(sig)).toBe(sig);
    expect(parseSig.bind(null)).toThrow("invalid sig value");
    expect(parseSig.bind(null, "some hash")).toThrow("invalid sig value");
    expect(parseSig.bind(null, "ab" + sig)).toThrow("invalid sig value");
  })

  test("msg", () => {
    const msg = {
      domain: {
        name: "daosign",
        version: "1.0.1",
      },
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
          { name: "app", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "metadata", type: "string" },
        ]
      },
      message: {
        name: "Proof-of-Authority",
        from: "",
        agreementCID: "",
        signers: [],
        app: "daosign",
        timestamp: Date.now() / 1000 | 0,
        metadata: ""
      }
    }
    const json = JSON.parse(JSON.stringify(msg))
    expect(parseProofTypedMessage(json)).toStrictEqual(msg)
  })
});
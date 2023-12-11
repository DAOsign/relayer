import env from "../env";
import { EthereumProofProvider } from "./proof_provider/ethereum";

export const debug = () => {
  new EthereumProofProvider(env.ETH_RPC_URL).set({
    signature: "0x22138f50d98e013709924c3c0445c260c7cad648b143590d7b01ed8bb8297dc11aab19265bae8d9de7b8cc30d61b4dd354f3b1414bb0b9f2e7b05c35dbe204af1b",
    proofCID: "QmTDcCdt3yb6mZitzWBmQr65AW6Wska295Dg9nbEYpSUDR",
    message: {
      domain: {
        chainId: 5,
      },
      //@ts-ignore
      name: "name",
      from: "0xd405aebF7b60eD2cb2Ac4497Bddd292DEe534E82",
      agreementCID: "QmTDcCdt3yb6mZitzWBmQr65AW6Wska295Dg9nbEYpSUDR",
      signers: [{ addr: "0xd405aebF7b60eD2cb2Ac4497Bddd292DEe534E82", metadata: "" }],
      app: "daosign",
      timestamp: "00",
      metadata: "",
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
        ],
      },
    },
  });
};
/* export const debug = () => {
  new EthereumProofProvider(env.ETH_RPC_URL).set({
    signature: "0xd405aebF7b60eD2cb2Ac4497Bddd292DEe534E82",
    proofCID: "QmTDcCdt3yb6mZitzWBmQr65AW6Wska295Dg9nbEYpSUDR",
    message: {
      domain: {
        chainId: 5,
      },
      //@ts-ignore
      app: "daosign",
      timestamp: 0,
      metadata: "",
      name: "Proof-of-Authority",
      agreementCID: "QmTDcCdt3yb6mZitzWBmQr65AW6Wska295Dg9nbEYpSUDD",
      from: "0xd405aebF7b60eD2cb2Ac4497Bddd292DEe534E82",
      signers: [{ addr: "0xd405aebF7b60eD2cb2Ac4497Bddd292DEe534E82", metadata: "" }],
      // agreementCID: "QmTDcCdt3yb6mZitzWBmQr65AW6Wska295Dg9nbEYpSUDD",
      //signatureCIDs: [""],
      message: {
        agreementCID: "QmTDcCdt3yb6mZitzWBmQr65AW6Wska295Dg9nbEYpSUDF",
        app: "daosign",
        timestamp: 0,
        metadata: "",
        signatureCIDs: ["QmTDcCdt3yb6mZitzWBmQr65AW6Wska295Dg9nbEYpSUDS"],
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
        ],
      },
    },
  });
};
 */

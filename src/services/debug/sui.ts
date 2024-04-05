import env from "../../env";
import { SuiProofProvider } from "../proof_provider/sui";

const agreementCID = "agreement file cid                            ";
const signatureCID = "QmbetiMECZy4q5mN9VbZ2LejxoA1AjNEeEhBdU9LPDbAX8";

export const debugSui = () => {
  debugAuthority().then(console.log).catch(console.error);
  // debugSignature().then(console.log).catch(console.error);
  // debugAgreement().then(console.log).catch(console.error);
};

const debugAuthority = () => {
  //Authority
  return new SuiProofProvider("testnet").set("m/44'/784'/0'/0'/0'", {
    message: {
      domain: {
        name: "daosign",
        version: "0.1.0",
        chainId: 1,
        verifyingContract: "0x0000000000000000000000000000000000000000",
      },
      primaryType: "ProofOfAuthority",
      //@ts-ignore
      types: {
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
      message: {
        name: "Proof-of-Authority",
        from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        agreementCID: agreementCID,
        signers: [
          {
            addr: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            metadata: "some metadata",
          },
        ],
        timestamp: 1706195505,
        metadata: "proof metadata",
      },
    },
    signature: "0xfa3a4d4426243566a8c65ec42a41a38a0fe8e673fe9c7ba0deb09e487c180f5e7d9973b89e2db107b32412be728d3f45b5d75b64446efb0693a24b2a0e0557221b",
    proofCID: "QmdRa839ynpkuRLcMTmZZngzWFXmNMKSUypPijs7Fg1117",
  });
};

const debugSignature = () => {
  // SIGNATURE
  return new SuiProofProvider("testnet").set("m/44'/784'/0'/0'/0'", {
    message: {
      domain: {
        name: "daosign",
        version: "0.1.0",
        chainId: 1,
        verifyingContract: "0x0000000000000000000000000000000000000000",
      },
      primaryType: "ProofOfSignature",
      //@ts-ignore
      types: {
        ProofOfSignature: [
          { name: "name", type: "string" },
          { name: "signer", type: "address" },
          { name: "authorityCID", type: "string" },
          { name: "app", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "metadata", type: "string" },
        ],
      },
      message: {
        name: "Proof-of-Signature",
        signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        authorityCID: "QmdRa839ynpkuRLcMTmZZngzWFXmNMKSUypPijs7Fg1116", //proof of authority CID
        timestamp: 1706193686,
        metadata: "proof metadata",
      },
    },
    signature: "0x18f8cb5dd9fcdf3c2cdbb88eda3772c1004eafa75645346fe8231c5def26371817355d1a8f59f3908009b71120da9b64202341356fec0dd3094c20c9e75518fb1b",
    proofCID: "QmbetiMECZy4q5mN9VbZ2LejxoA1AjNEeEhBdU9LPD1116",
  });
};

const debugAgreement = () => {
  // AGREEMENT
  return new SuiProofProvider("testnet").set("m/44'/784'/0'/0'/0'", {
    message: {
      domain: {
        name: "daosign",
        version: "0.1.0",
        chainId: 1,
        verifyingContract: "0x0000000000000000000000000000000000000000",
      },
      primaryType: "ProofOfAgreement",
      //@ts-ignore
      types: {
        ProofOfAgreement: [
          {
            name: "authorityCID",
            type: "string",
          },
          {
            name: "signatureCIDs",
            type: "string[]",
          },
          {
            name: "app",
            type: "string",
          },
          {
            name: "timestamp",
            type: "uint256",
          },
          {
            name: "metadata",
            type: "string",
          },
        ],
      },
      //@ts-ignore
      message: {
        name: "Proof-of-Agreement",
        metadata: "proof metadata",
        timestamp: 1706193686,
        authorityCID: "QmdRa839ynpkuRLcMTmZZngzWFXmNMKSUypPijs7Fg1116",
        signatureCIDs: ["QmbetiMECZy4q5mN9VbZ2LejxoA1AjNEeEhBdU9LPD1116"],
      },
    },
    // signature: "0x",
    proofCID: "QmWCrNGzYwfpZu2AozftkWYcZs1ZQ5PbPMrCc2f5Yy1116",
  });
};

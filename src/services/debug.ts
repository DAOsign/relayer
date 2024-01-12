import env from "../env";
import { EthereumProofProvider } from "./proof_provider/ethereum";

const agreementCID = "QmdbCHsCsaMXGw6XVahtqTkbSkCLc8aupiu4hcVMbHpAfX";
export const debug = () => {
  //  debugAuthority().then(console.log).catch(console.error);
  debugSignature().then(console.log).catch(console.error)//.catch((e)=>console.error(JSON.stringify(e, null, 2)));
  //debugAgreement().then(console.log).catch(console.error);
};

const debugAuthority = () => {
  //Authority
  return new EthereumProofProvider(env.ETH_RPC_URL).set("m/44'/60'/0'/0", {
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
        from: "0x4300bc1ed00706e5386c6b938382d37edb31d143",
        agreementCID: agreementCID,
        signers: [
          {
            addr: "0x4300bc1Ed00706E5386C6B938382d37eDB31d143",
            metadata: "{}",
          },
        ],
        app: "daosign",
        timestamp: 1705055133954,
        metadata: "{}",
      },
    },
    signature: "0x56ce17b1ebf66ae8520ccc531e3607d2c6d66e1bf89e02f4f78490b15c2472a76f310cf402f10fb1e78b4b3250a374469615461e61a8959a4f965ba2710407d01b",
    proofCID: "QmdRa839ynpkuRLcMTmZZngzWFXmNMKSUypPijs7Fg2Ygj",
  });
};

const debugSignature = () => {
  // SIGNATURE
  return new EthereumProofProvider(env.ETH_RPC_URL).set("m/44'/60'/0'/0", {
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
          { name: "agreementCID", type: "string" },
          { name: "app", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "metadata", type: "string" },
        ],
      },
      message: {
        name: "Proof-of-Signature",
        signer: "0x4300bc1Ed00706E5386C6B938382d37eDB31d143",
        agreementCID: agreementCID,
        app: "daosign",
        timestamp: 1703580673701,
        metadata: "{}",
      },
    },
    signature: "0xf7e6cdf40a308d8146b0b668913b93268e49ed8cc1d1d46c27b61aa0396203875437b485e27fd63b7ddcfc2f1803a9814e0707e11ee88264dd834556932178f71c",
    proofCID: "QmbetiMECZy4q5mN9VbZ2LejxoA1AjNEeEhBdU9LPDbAX8",
  });
};

const debugAgreement = () => {
  // AGREEMENT
  return new EthereumProofProvider(env.ETH_RPC_URL).set("m/44'/60'/0'/0", {
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
            name: "agreementCID",
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
        agreementCID: "QmSHjHv9CyZVi5evoLKegeyFKqo9Y7PLSAMU4c28GV3ZTp",
        signatureCIDs: ["QmY32m6B5JFGeQAJFLDjhbrSEpBUErZHCTFrR9tkmwcy6Q", "QmH42m6B5JFGeQAJFLDjhbrSEpBUErZHCTFrR9tkmwcy6Q"],
        app: "daosign",
        timestamp: 1702376820,
        metadata: "metadata",
      },
    },
    signature: "0x7c75af0f79402ac55516ab79c326995f94777433d45670017c355f18e9e2406626bd89ef949c861940121dceb64cced02baa60cb05dad53ab7adf86f07c2ce721b",
    proofCID: "QmbetiMECZy4q5mN9VbZ2LejxoA1AjNEeEhBdU9LPDbAX8",
  });
};

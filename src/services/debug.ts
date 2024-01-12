import env from "../env";
import { EthereumProofProvider } from "./proof_provider/ethereum";

const agreementCID = "QmdbCHsCsaMXGw6XVahtqTkbSkCLc8aupiu4hcVMbHpAfX";
const signatureCID = "QmbetiMECZy4q5mN9VbZ2LejxoA1AjNEeEhBdU9LPDbAX8";

export const debug = () => {
  //debugAuthority().then(console.log).catch(console.error);
  //debugSignature().then(console.log).catch(console.error); //.catch((e)=>console.error(JSON.stringify(e, null, 2)));
  //debugAgreement().then(console.log).catch(console.error);
  //@ts-ignore
  // getProofOfAuth('QmdRa839ynpkuRLcMTmZZngzWFXmNMKSUypPijs7Fg2Ygj').then((res) => console.dir(res.message[3])).catch(console.error);
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
    signature: "0xf7e6cdf40a308d8146b0b668913b93268e49ed8cc1d1d46c27b61aa0396203875437b485e27fd63b7ddcfc2f1803a9814e0707e11ee88264dd834556932178f71c",
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
        agreementCID: "QmdRa839ynpkuRLcMTmZZngzWFXmNMKSUypPijs7Fg2Ygj", //proof of authority CID
        app: "daosign",
        timestamp: 1703580673701,
        metadata: "{}",
      },
    },
    signature: "0x273b33d4827550693dc69f83803423eeb23d9c2cbe038e76b72aafbb0d09528d5e8a2c67d2447d7b34a28873b486a4d7f2086cb24fd93086fe5e80e9286693771c",
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
        agreementCID: "QmdRa839ynpkuRLcMTmZZngzWFXmNMKSUypPijs7Fg2Ygj",
        signatureCIDs: ["QmbetiMECZy4q5mN9VbZ2LejxoA1AjNEeEhBdU9LPDbAX8", "QmbetiMECZy4q5mN9VbZ2LejxoA1AjNEeEhBdU9LPDbAX8"],
        app: "daosign",
        timestamp: 1702376820,
        metadata: "metadata",
      },
    },
    signature: "0x48dbff7681bd112283ac4167c5cd91ac133f4bb79a10da7896eac374688c984d4f56a2b10b961520a29ac08392117868638b19ac73611a5f4811967462113c081b",
    proofCID: "QmbetiMECZy4q5mN9VbZ2LejxoA1AjNEeEhBdU9LPDbAB2",
  });
};

const getProofOfAuth = (cid: string) => {
  return new EthereumProofProvider(env.ETH_RPC_URL).get(cid);
};

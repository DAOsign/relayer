import env from "../../env";
import { EthereumProofProvider } from "../proof_provider/ethereum";

const agreementCID = "QmdbCHsCsaMXGw6XVahtqTkbSkCLc8aupiu4hcVMbHpAfX";
const signatureCID = "QmbetiMECZy4q5mN9VbZ2LejxoA1AjNEeEhBdU9LPDbAX8";

export const debugEthereum = () => {
  // debugAuthority().then(console.log).catch(console.error);
  // debugSignature().then(console.log).catch(console.error); //.catch((e)=>console.error(JSON.stringify(e, null, 2)));
  debugAgreement().then(console.log).catch(console.error);
  //@ts-ignore
  // getProofOfAuth('QmdRa839ynpkuRLcMTmZZngzWFXmNMKSUypPijs7Fg2Ygj').then((res) => console.dir(res.message[3])).catch(console.error);
};

export const debugAuthority = () => {
  //Authority
  return new EthereumProofProvider(env.ETH_RPC_URL).set("m/44'/60'/0'/0", {
    message: {
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
      domain: { name: "daosign", chainId: 1, version: "0.1.0", verifyingContract: "0x0000000000000000000000000000000000000000" },
      message: {
        app: "daosign",
        from: "0x8a7aa629fd80492b33650d17fe96b1f60083201f",
        name: "Proof-of-Authority",
        signers: [{ addr: "0x8a7aa629fd80492b33650d17fe96b1f60083201f", metadata: "{}" }],
        metadata: "{}",
        timestamp: 1707315859337,
        agreementCID: "QmRhBMrsMXBEbMNRWLrjhmdCPaY4qc6kxGuwfLm1PhWUZj",
      },
      primaryType: "ProofOfAuthority",
    },
    proofCID: "QmaKzoizE2bRzCxKVFf6vNAF2yPG66bwuxqe2Lh6GA4cgU",
    signature: "0x1682f2788aef801d23ae997aa81faf5b528b1558417402beb24e1018a3f6712b684757470e96d866a457d6e349731320b046eab4096fcf4be08c6bc71ba29ce01b",
  });
};

export const debugVoid = () => {
  //VOID
  return new EthereumProofProvider(env.ETH_RPC_URL).set("m/44'/60'/0'/0", {
    message: {
      domain: {
        name: "daosign",
        version: "0.1.0",
        chainId: 1,
        verifyingContract: "0x0000000000000000000000000000000000000000",
      },
      primaryType: "ProofOfVoid",
      //@ts-ignore
      types: {
        ProofOfVoid: [
          { name: "authorityCID", type: "string" },
          { name: "app", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "metadata", type: "string" },
        ],
      },
      //@ts-ignore
      message: {
        authorityCID: 'QmaKzoizE2bRzCxKVFf6vNAF2yPG66bwuxqe2Lh6GA4cgU',
        app: "daosign",
        timestamp: 1705055133954,
        metadata: "{}",
      },
    },
    signature: "0xd74c95a151d07d5d69915e5bfc5070768c4ef336cf19b419cf562b7f134e360265960ca9beaf2a2ee5d893bcdd2f1a064e4fb9ddabe457c53b5ef6fd298b64dd1b",
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
          { name: "authorityCID", type: "string" },
          { name: "app", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "metadata", type: "string" },
        ],
      },
      message: {
        name: "Proof-of-Signature",
        signer: "0x4300bc1Ed00706E5386C6B938382d37eDB31d143",
        authorityCID: "QmdRa839ynpkuRLcMTmZZngzWFXmNMKSUypPijs7Fg2Ygj", //proof of authority CID
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
        app: "daosign",
        metadata: "{}",
        timestamp: 1705932865834,
        authorityCID: "QmZ6SFuANGA4pEydXeVmM4RzRhdijpfa1aMHGWHDapY17S",
        signatureCIDs: ["QmWCrNGzYwfpZu2AozftkWYcZs1ZQ5PbPMrCc2f5Yy4hsg"],
      },
    },
    signature: "0x",
    proofCID: "QmWCrNGzYwfpZu2AozftkWYcZs1ZQ5PbPMrCc2f5Yy4hsg",
  });
};

const getProofOfAuth = (cid: string) => {
  return new EthereumProofProvider(env.ETH_RPC_URL).get(cid);
};

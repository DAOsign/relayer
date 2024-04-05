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
          {
            name: "addr",
            type: "address",
          },
          {
            name: "metadata",
            type: "string",
          },
        ],
        ProofOfAuthority: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "from",
            type: "address",
          },
          {
            name: "agreementCID",
            type: "string",
          },
          {
            name: "signers",
            type: "Signer[]",
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
      domain: {
        name: "daosign",
        chainId: 1,
        version: "0.1.0",
        verifyingContract: "0x0000000000000000000000000000000000000000",
      },
      message: {
        from: "0xd405aebf7b60ed2cb2ac4497bddd292dee534e82",
        name: "Proof-of-Authority",
        signers: [
          {
            addr: "0xd405aebf7b60ed2cb2ac4497bddd292dee534e82",
            metadata: "{}",
          },
        ],
        metadata: "{}",
        timestamp: 1712308340511,
        agreementCID: "QmaYtLzyAcDNFiBPkFXhBcwePpG6E7L35xJu572iYQiSTc",
      },
      primaryType: "ProofOfAuthority",
    },
    proofCID: "QmZeoZURVcFoY1BNK4xFNQoUW7aPSg6nz2dEC16uCYvFB4",
    signature: "0x5f878e6cfd819ee62e8cfb01f64514a33c9ceb96cb33a0261be340a6e0c726b50b6f9cdf899e137181368bc8e41c4336f5d4266e31b81c5b2b253748ffa19dff1c",
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
        authorityCID: "QmaKzoizE2bRzCxKVFf6vNAF2yPG66bwuxqe2Lh6GA4cgF",
        timestamp: 1705055133954,
        metadata: "{}",
      },
    },
    signature: "0x5637383584118084c3bb4d66a8c2dbe73fb07262201957ab78532234bd780d67578372fefcf7c0212b73816bde80d7bc703530e326a9c5eca776f82991894ecb1b",
    proofCID: "QmdRa839ynpkuRLcMTmZZngzWFXmNMKSUypPijs7Fg2Ygg",
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

import env from "../env";
import { EthereumProofProvider } from "./proof_provider/ethereum";
import {SuiProofProvider} from "./proof_provider/sui";

// export const debug = () => {
//   new EthereumProofProvider(env.ETH_RPC_URL).set("m/44'/60'/0'/0", {
//     message: {
//       domain: {
//         name: "daosign",
//         version: "0.1.0",
//         chainId: 1,
//         verifyingContract: "0x0000000000000000000000000000000000000000",
//       },
//       primaryType: "ProofOfSignature",
//       //@ts-ignore
//       types: {
//         ProofOfSignature: [
//           { name: "name", type: "string" },
//           { name: "signer", type: "address" },
//           { name: "agreementCID", type: "string" },
//           { name: "app", type: "string" },
//           { name: "timestamp", type: "uint256" },
//           { name: "metadata", type: "string" },
//         ],
//       },
//       message: {
//         agreementCID: "QmVzTCEcwDnQnK8QuZfeacXp53T29D5UsXEVfSm9nbRs7P",
//         name: "Proof-of-Signature",
//         signer: "0xd405aebf7b60ed2cb2ac4497bddd292dee534e82",
//         app: "daosign",
//         //@ts-ignore
//         timestamp: '1703580673701',
//         metadata: "{}",
//       },
//     },
//     signature: "0x7c75af0f79402ac55516ab79c326995f94777433d45670017c355f18e9e2406626bd89ef949c861940121dceb64cced02baa60cb05dad53ab7adf86f07c2ce721b",
//     proofCID: "QmbetiMECZy4q5mN9VbZ2LejxoA1AjNEeEhBdU9LPDbAX8",
//   }).then(console.log).catch(console.error);
//   return;

  export const debug = () => {
    new SuiProofProvider("https://fullnode.testnet.sui.io/").set("m/44'/60'/0'/0", {
      message: {
        domain: {
          name: "daosign",
          version: "0.1.0",
          chainId: 1,
          verifyingContract: "0x0000000000000000000000000000000000000000",
        },
        primaryType: "ProofOfAuthority",
        //@ts-ignore
        "types": {
          "EIP712Domain": [
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "version",
              "type": "string"
            },
            {
              "name": "chainId",
              "type": "uint256"
            },
            {
              "name": "verifyingContract",
              "type": "address"
            }
          ],
          "ProofOfAgreement": [
            {
              "name": "agreementCID",
              "type": "string"
            },
            {
              "name": "signatureCIDs",
              "type": "string[]"
            },
            {
              "name": "app",
              "type": "string"
            },
            {
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "name": "metadata",
              "type": "string"
            }
          ]
        },
        "message": {
          "name": "Proof-of-Authority",
          signers: [
            { addr: "f39fd6e51aad88f6f4ce6ab8827279cfffb92266", metadata: "f39fd6e51aad88f6f4ce6ab8827279cfffb92266" },
          ],
          from: "f39fd6e51aad88f6f4ce6ab8827279cfffb92266",

          "app": "daosign",
          "timestamp": 1704804210,
          agreementCID: "QmVv2RzVuX7B2xBzPpBxSBSFc7zpJZ6Pgf71YUHNF8dP31",
          "metadata": "metadata"
        }
      },
      signature: "ea491aaa3413bb0980431b770233ac0e0919c685f1277605d021da030d1fff394843496b6742a4c8cb75ea01dc92b18a9608198a5173f8b8078148c2fc07df141b",
      proofCID: "QmbetiMECZy4q5mN9VbZ2LejxoA1AjNEeEhBdU9LPDbAX8",
    }).then(console.log).catch(console.error);
    return;

  /*   //Authority
  return new EthereumProofProvider(env.ETH_RPC_URL).set({
    message: {
      //@ts-ignore
      name: "Proof-of-Authority",
      from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      agreementCID: "agreement file cid                            ",
      signers: [
        {
          addr: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          metadata: "some metadata",
        },
      ],
      app: "daosign",
      timestamp: 1702554568,
      metadata: "proof metadata",
    },
    signature: "0x3f5b2c3e1bc0cba1dc7101ce6f9eabe130c466dbe10c0620a21c456002a3a7e614de848d07551c30a937bef82825de2f9e0551c57e5a845dfc381bfb10e4df381b",
    proofCID: "ProofOfAuthority proof cid                    ",
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

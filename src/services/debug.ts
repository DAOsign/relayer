import env from "../env";
import { EthereumProofProvider } from "./proof_provider/ethereum";

export const debug = () => {
  return;

  //Authority
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

  //Authority
  new EthereumProofProvider(env.ETH_RPC_URL).set({
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

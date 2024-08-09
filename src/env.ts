import * as dotenv from "dotenv";

const envalid = require("envalid");

dotenv.config();

// Validator types https://github.com/af/envalid#validator-types
export default envalid.cleanEnv(process.env, {
  PORT: envalid.port({
    default: 3000,
    desc: "The port to start the server on",
  }),

  TYPEORM_HOST: envalid.host(),
  TYPEORM_USERNAME: envalid.str(),
  TYPEORM_PASSWORD: envalid.str(),
  TYPEORM_DATABASE: envalid.str(),
  TYPEORM_PORT: envalid.port(),
  TYPEORM_LOGGING: envalid.bool(),

  ETH_RPC_URL: envalid.str(),
  ETH_PRIVATE_KEY: envalid.str(),
  ETH_CONTRACT_ADDRESS: envalid.str(),

  OASIS_RPC_URL: envalid.str(),
  OASIS_CONTRACT_ADDRESS: envalid.str(),
  OASIS_PRIVATE_KEY: envalid.str(),

  SUI_PACKAGE_ID: envalid.str(),
  SUI_BAG_ID: envalid.str(),
  SUI_RPC_TYPE: envalid.str(),
  SUI_MNEMONIC: envalid.str(),
  GRAYLOG_HOST: envalid.str("localhost"),

  NEAR_RPC_NET: envalid.str(),
  NEAR_CONTRACT_ADDRESS: envalid.str(),
  NEAR_MNEMONIC: envalid.str(),

  STORAGE_RPC_URL: envalid.str({ default: "https://optimism-sepolia.blockpi.network/v1/rpc/public" }),
  STORAGE_CONTRACT_ADDRESS: envalid.str({ default: "0x14f8CFdFB4B5ac014aF715d147Ff7B126fB4dc43" }),
  STORAGE_ADMIN_PRIVATE_KEY: envalid.str({ default: "" }),

  APP_NAME: envalid.str(),
  APP_SLACK_WEBHOOK_LINK: envalid.str(),
});

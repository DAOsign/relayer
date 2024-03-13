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

  STORAGE_CONTRACT_ADDRESS: envalid.str({ default: "0x9dd45EEf0cE1C3E92b540AC0DAAb68B6FE3fC77E" }),
  STORAGE_ADMIN_PRIVATE_KEY: envalid.str({ default: "" }),
});

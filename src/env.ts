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
});

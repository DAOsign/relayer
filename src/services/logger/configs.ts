import Graylog from "winston-graylog2";
import env from "../../env";

export const graylogConfig: Graylog.TransportOptions = {
  name: "Graylog",
  level: "debug",
  silent: false,
  handleExceptions: false,
  graylog: {
    servers: [
      { host: "localhost", port: 12201 },
      { host: env.GRAYLOG_HOST, port: 12201 },
    ],
    hostname: "myServer",
    facility: "myAwesomeApp",
    bufferSize: 1400,
  },
  staticMeta: { env: "staging" },
};

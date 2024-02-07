import { createLogger, transports, format } from "winston";
import Graylog, { GraylogOptions } from "winston-graylog2";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
};

const graylogConfig: Graylog.TransportOptions = {
  name: "Graylog",
  level: "debug",
  silent: false,
  handleExceptions: false,
  graylog: {
    servers: [
      { host: "localhost", port: 12201 },
      { host: "remote.host", port: 12201 },
    ],
    hostname: "myServer",
    facility: "myAwesomeApp",
    bufferSize: 1400,
  },
  staticMeta: { env: "staging" },
};

export const initLogger = () => {
  return createLogger({
    exitOnError: false,
    transports: [
      new transports.Console(),
      //new Graylog(graylogConfig)
    ],
    level: "debug",
    levels: levels,
    format: format.combine(format.errors({ stack: true }), format.colorize({ all: true }), format.splat(), format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" })),
  });
};

const Logger = initLogger();

export default Logger;

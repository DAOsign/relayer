import { createLogger, transports, format } from "winston";
import Graylog from "winston-graylog2";
import { customMessageFormat } from "./format";
import { graylogConfig } from "./configs";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
};

export const initLogger = () => {
  return createLogger({
    exitOnError: false,
    //@ts-ignore
    transports: [new transports.Console(), new Graylog(graylogConfig)],
    level: "debug",
    levels: levels,
    format: format.combine(
      format.errors({ stack: true }),
      format.colorize({ all: true }),
      format.splat(),
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
      customMessageFormat,
    ),
  });
};

const Logger = initLogger();

export default Logger;

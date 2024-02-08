import { format } from "winston";

export const customMessageFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  if (level === "error" || metadata?.stack) {
    return `${timestamp} ${metadata?.stack ? `${metadata.stack.startsWith("Error") ? metadata.stack.replace("Error", level) : `${level}: \n${metadata.stack}`}` : message}`;
  }

  const metadataCopy = { ...metadata };
  delete metadataCopy.stack;

  const mainMessage = `${timestamp} ${level}: ${message}`;

  let formattedMetadata: string;
  delete metadataCopy?.httpStatusCode;
  if (metadataCopy && Object.keys(metadataCopy).length !== 0) {
    formattedMetadata = `\n    ${JSON.stringify(metadataCopy)}`;
  } else {
    formattedMetadata = "";
  }

  return mainMessage + formattedMetadata;
});

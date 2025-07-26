import morgan from "morgan";
import logger from "./logger";

const stream = {
  write: (message: unknown) => logger.http(message),
};

const morganMiddleware = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream }
);

export default morganMiddleware;

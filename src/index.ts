import config from "config";
import logger from "./utils/logger";
import { createApp } from "./app";

export async function main() {
  const app = createApp();
  const port = config.PORT;
  app.listen({ port }, () => {
    logger.info(`[Server] ready 🚀: http://localhost:${port}`);
  });
}

void main();

import express from "express";
import helmet from "helmet";
import morganMiddleware from "utils/morgan";
import { healthCheckRouter } from "routes/health-check";
import { errorHandler } from "middlewares/error";
import { routes } from "routes";
import { endPointNotFound, unexpectedErrorHandler } from "routes/misc";

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morganMiddleware);

  // Health check router
  app.use("/", healthCheckRouter);

  // Routes
  app.use("/api", routes);

  // Endpoint not found middleware
  app.use(endPointNotFound);

  // Error handler middleware
  app.use(errorHandler);

  process.on("unhandledRejection", unexpectedErrorHandler);
  process.on("uncaughtException", unexpectedErrorHandler);

  return app;
};

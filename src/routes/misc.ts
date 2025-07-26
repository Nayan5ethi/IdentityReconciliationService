import logger from "../utils/logger";
import { Request, Response } from "express";

export const unexpectedErrorHandler = (
  error: Error,
  origin: NodeJS.UncaughtExceptionOrigin
) => {
  logger.error(`[${origin}] ${error}`);
};

export const endPointNotFound = (req: Request, res: Response) => {
  res.status(404).json({
    error: "endpoint not found",
    path: req.originalUrl,
  });
};

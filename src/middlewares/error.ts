import type { Request, Response, NextFunction } from "express";
import { CustomError } from "errors";
import logger from "utils/logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`[Error] ${err.message}`);

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      custom_code: err.errorCode,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errorCode: "INTERNAL_SERVER_ERROR",
  });
};

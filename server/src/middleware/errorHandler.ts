import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

/**
 * Centralized error handler (section 28: gracefully handle every failure
 * mode, never crash, always show a clear message). Keeps internal error
 * detail out of the response in production while still logging it.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (err instanceof AppError) {
    logger.warn("Handled application error", {
      path: req.path,
      code: err.code,
      message: err.message,
    });
    res.status(err.statusCode).json({
      ok: false,
      error: { code: err.code, message: err.message },
    });
    return;
  }

  logger.error("Unhandled server error", {
    path: req.path,
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });

  res.status(500).json({
    ok: false,
    error: {
      code: "INTERNAL_ERROR",
      message:
        "Something went wrong on our side. Verified information may currently be unavailable — please try again shortly.",
    },
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    ok: false,
    error: { code: "NOT_FOUND", message: `No route for ${req.method} ${req.path}` },
  });
}

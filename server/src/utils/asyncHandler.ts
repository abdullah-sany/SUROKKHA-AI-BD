import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Wraps an async Express handler so a rejected promise is forwarded to
 * `next(err)` instead of crashing the process (section 28: never crash).
 */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}

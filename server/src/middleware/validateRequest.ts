import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../utils/AppError";

type Part = "body" | "query" | "params";

/**
 * Validates and replaces req[part] with the parsed (and coerced) data.
 * Every route that accepts client input goes through this — no controller
 * trusts raw req.body/query directly (section 27: validate input).
 */
export function validateRequest(schema: ZodSchema, part: Part = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const detail = firstIssue ? `${firstIssue.path.join(".")}: ${firstIssue.message}` : "Invalid request";
      next(new AppError(`Invalid request: ${detail}`, 422, "VALIDATION_ERROR"));
      return;
    }
    (req as unknown as Record<Part, unknown>)[part] = result.data;
    next();
  };
}

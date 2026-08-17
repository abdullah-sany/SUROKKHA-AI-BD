import { Router } from "express";
import { z } from "zod";
import { postSpecialist } from "../controllers/specialist.controller";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { aiLimiter } from "../middleware/rateLimiter";

const router = Router();

const bodySchema = z.object({
  context: z.string().min(3, "Please describe the context.").max(2000),
  language: z.enum(["en", "bn"]).default("en"),
});

router.post("/", aiLimiter, validateRequest(bodySchema), asyncHandler(postSpecialist));

export default router;

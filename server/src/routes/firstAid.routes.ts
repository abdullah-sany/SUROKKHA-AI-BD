import { Router } from "express";
import { z } from "zod";
import { postFirstAid } from "../controllers/firstAid.controller";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { aiLimiter } from "../middleware/rateLimiter";

const router = Router();

const firstAidBodySchema = z.object({
  situationText: z.string().min(3, "Please describe what happened.").max(2000),
  language: z.enum(["en", "bn"]).default("en"),
  imageBase64: z.string().max(10_000_000).optional(),
  imageMimeType: z.enum(["image/jpeg", "image/png", "image/webp"]).optional(),
});

router.post("/", aiLimiter, validateRequest(firstAidBodySchema), asyncHandler(postFirstAid));

export default router;

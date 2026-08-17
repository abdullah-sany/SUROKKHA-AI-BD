import { Router } from "express";
import { z } from "zod";
import {
  deleteAllTimeline,
  deleteTimelineEntry,
  getTimeline,
  postTimeline,
} from "../controllers/timeline.controller";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

const bodySchema = z.object({
  type: z.enum([
    "FIRST_AID_CONSULTATION",
    "EMERGENCY_SEARCH",
    "HOSPITAL_SEARCH",
    "PRESCRIPTION_ANALYSIS",
    "BLOOD_PLATFORM_VISIT",
  ]),
  summary: z.string().min(1).max(300),
  severity: z.string().max(50).optional(),
});

router.get("/", asyncHandler(getTimeline));
router.post("/", validateRequest(bodySchema), asyncHandler(postTimeline));
router.delete("/:id", asyncHandler(deleteTimelineEntry));
router.delete("/", asyncHandler(deleteAllTimeline));

export default router;

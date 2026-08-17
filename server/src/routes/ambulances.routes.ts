import { Router } from "express";
import { z } from "zod";
import { getAmbulanceDistricts, getAmbulances } from "../controllers/ambulances.controller";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

const querySchema = z.object({
  district: z.string().max(100).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  sortBy: z.enum(["nearest", "verified", "name"]).optional(),
});

router.get("/districts", asyncHandler(getAmbulanceDistricts));
router.get("/", validateRequest(querySchema, "query"), asyncHandler(getAmbulances));

export default router;

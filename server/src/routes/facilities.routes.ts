import { Router } from "express";
import { z } from "zod";
import { getFacilities, getFacilityById, getFacilityFilters } from "../controllers/facilities.controller";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

const facilityTypeEnum = z.enum([
  "Hospital",
  "Medical College Hospital",
  "Private Hospital/Clinic",
  "Health Complex",
  "Clinic",
  "Diagnostic Center",
  "Blood Bank",
  "Other Healthcare Facility",
]);

const querySchema = z.object({
  search: z.string().max(200).optional(),
  division: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  facilityType: facilityTypeEnum.optional(),
  ownership: z.enum(["public", "private", "all"]).optional(),
  verifiedOnly: z.coerce.boolean().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  sortBy: z.enum(["nearest", "verified", "name"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(50).optional(),
});

router.get("/filters", asyncHandler(getFacilityFilters));
router.get("/:id", asyncHandler(getFacilityById));
router.get("/", validateRequest(querySchema, "query"), asyncHandler(getFacilities));

export default router;

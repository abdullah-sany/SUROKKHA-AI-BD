import { Router } from "express";
import { getEmergencyContacts } from "../controllers/emergencyContacts.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getEmergencyContacts));

export default router;

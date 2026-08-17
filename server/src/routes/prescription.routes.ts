import { Router } from "express";
import { postPrescriptionAnalyze } from "../controllers/prescription.controller";
import { prescriptionUpload } from "../middleware/upload";
import { asyncHandler } from "../utils/asyncHandler";
import { aiLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/analyze", aiLimiter, prescriptionUpload.single("prescription"), asyncHandler(postPrescriptionAnalyze));

export default router;

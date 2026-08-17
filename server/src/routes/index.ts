import { Router } from "express";
import { env } from "../config/env";
import firstAidRoutes from "./firstAid.routes";
import facilitiesRoutes from "./facilities.routes";
import ambulancesRoutes from "./ambulances.routes";
import emergencyContactsRoutes from "./emergencyContacts.routes";
import prescriptionRoutes from "./prescription.routes";
import specialistRoutes from "./specialist.routes";
import timelineRoutes from "./timeline.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    data: {
      status: "up",
      aiConfigured: env.isGeminiConfigured(),
      demoFallbackAllowed: env.allowDemoFallback,
    },
  });
});

router.use("/first-aid", firstAidRoutes);
router.use("/facilities", facilitiesRoutes);
router.use("/ambulances", ambulancesRoutes);
router.use("/emergency-contacts", emergencyContactsRoutes);
router.use("/prescription", prescriptionRoutes);
router.use("/specialist", specialistRoutes);
router.use("/timeline", timelineRoutes);

export default router;

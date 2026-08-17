import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";
import { generateStructuredJson, isGeminiAvailable } from "./gemini/geminiClient";
import { buildPrescriptionUserContent, PRESCRIPTION_SYSTEM_INSTRUCTION } from "./gemini/prescriptionPrompt";
import { prescriptionResultSchema, tryParseJson } from "./aiSchemas";
import type { PrescriptionAnalysisResult } from "../types/prescription";

const STANDARD_DISCLAIMER =
  "Follow your doctor's prescription. If any instruction is unclear, confirm with a qualified doctor or pharmacist. SUROKKHA AI BD never changes what your doctor prescribed.";

function buildDemoResponse(): PrescriptionAnalysisResult {
  return {
    medicines: [
      {
        name: "Paracetamol (sample)",
        strength: "500 mg",
        dosage: "1 tablet",
        frequency: "3 times daily",
        timing: "After food",
        duration: "5 days",
        specialInstructions: null,
        confidence: "high",
        explanation: {
          generalUse: "A common medicine generally used to relieve mild pain and reduce fever.",
          howToTakeAccordingToPrescription: "Take one tablet three times a day, after food, for 5 days as written on this sample prescription.",
          precautions: ["Do not exceed the prescribed dose.", "Avoid combining with other paracetamol-containing products."],
          commonSideEffects: ["Generally well tolerated at prescribed doses.", "Rare: allergic reaction or nausea."],
        },
      },
    ],
    unreadableNotice:
      "This is a demo response because the AI service is not configured (no GEMINI_API_KEY). Upload a real prescription once an API key is added to see live extraction.",
    overallConfidence: "low",
    disclaimer: STANDARD_DISCLAIMER,
    isDemoResponse: true,
  };
}

function safeFallback(): PrescriptionAnalysisResult {
  return {
    medicines: [],
    unreadableNotice: "We couldn't safely read this prescription. Please confirm with your doctor or pharmacist, or try a clearer photo.",
    overallConfidence: "low",
    disclaimer: STANDARD_DISCLAIMER,
    isDemoResponse: true,
  };
}

export async function analyzePrescription(
  imageBase64: string,
  imageMimeType: string,
  language: "en" | "bn"
): Promise<PrescriptionAnalysisResult> {
  if (!isGeminiAvailable()) {
    if (!env.allowDemoFallback) {
      throw new AppError("AI service is not configured on this server.", 503, "AI_NOT_CONFIGURED");
    }
    logger.warn("Serving demo prescription response (GEMINI_API_KEY not set)");
    return buildDemoResponse();
  }

  const raw = await generateStructuredJson({
    systemInstruction: PRESCRIPTION_SYSTEM_INSTRUCTION,
    userContent: buildPrescriptionUserContent(language),
    model: "vision",
    imageBase64,
    imageMimeType,
    maxOutputTokens: 2048,
  });

  const parsed = tryParseJson(raw);
  const validated = prescriptionResultSchema.safeParse(parsed);
  if (!validated.success) {
    logger.error("Prescription AI response failed schema validation", { issues: validated.error.issues });
    return safeFallback();
  }

  return { ...validated.data, isDemoResponse: false };
}

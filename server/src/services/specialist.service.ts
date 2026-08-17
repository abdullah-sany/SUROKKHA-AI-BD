import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";
import { generateStructuredJson, isGeminiAvailable } from "./gemini/geminiClient";
import { buildSpecialistUserContent, SPECIALIST_SYSTEM_INSTRUCTION } from "./gemini/specialistPrompt";
import { specialistResultSchema, tryParseJson } from "./aiSchemas";
import type { SpecialistRequest, SpecialistResult } from "../types/firstAid";

const STANDARD_DISCLAIMER =
  "This is general guidance, not a diagnosis. The final decision about which specialist to see should be made by a qualified healthcare professional.";

function buildDemoResponse(): SpecialistResult {
  return {
    suggestions: [
      {
        specialty: "General Medicine",
        reasoning: "This is a demo response (no GEMINI_API_KEY configured). General Medicine is a safe first stop for most non-emergency symptoms, and a doctor there can refer you further.",
        confidence: "low",
      },
    ],
    disclaimer: STANDARD_DISCLAIMER,
    isDemoResponse: true,
  };
}

function safeFallback(): SpecialistResult {
  return {
    suggestions: [
      {
        specialty: "General Medicine",
        reasoning: "We couldn't safely process a specific suggestion. General Medicine is a reasonable starting point for most concerns.",
        confidence: "low",
      },
    ],
    disclaimer: STANDARD_DISCLAIMER,
    isDemoResponse: true,
  };
}

export async function getSpecialistSuggestion(request: SpecialistRequest): Promise<SpecialistResult> {
  if (!isGeminiAvailable()) {
    if (!env.allowDemoFallback) {
      throw new AppError("AI service is not configured on this server.", 503, "AI_NOT_CONFIGURED");
    }
    logger.warn("Serving demo specialist response (GEMINI_API_KEY not set)");
    return buildDemoResponse();
  }

  const raw = await generateStructuredJson({
    systemInstruction: SPECIALIST_SYSTEM_INSTRUCTION,
    userContent: buildSpecialistUserContent(request),
    model: "text",
  });

  const parsed = tryParseJson(raw);
  const validated = specialistResultSchema.safeParse(parsed);
  if (!validated.success) {
    logger.error("Specialist AI response failed schema validation", { issues: validated.error.issues });
    return safeFallback();
  }

  return { ...validated.data, isDemoResponse: false };
}

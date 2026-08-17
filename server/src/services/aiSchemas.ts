import { z } from "zod";

/**
 * Section 9: "Validate the model response before rendering... If JSON
 * parsing fails, use a safe fallback. Never display malformed AI output
 * as trusted medical instructions." These schemas are that gate.
 */
export const firstAidResultSchema = z.object({
  severity: z.enum(["NORMAL_FIRST_AID", "MEDICAL_ATTENTION_RECOMMENDED", "URGENT", "EMERGENCY"]),
  situationSummary: z.string().min(1).max(600),
  immediateSteps: z.array(z.string().min(1)).max(12),
  avoid: z.array(z.string().min(1)).max(10),
  warningSigns: z.array(z.string().min(1)).max(10),
  seekCare: z.string().min(1).max(600),
  emergencyEscalation: z.boolean(),
  disclaimer: z.string().min(1).max(400),
});

const medicineExplanationSchema = z.object({
  generalUse: z.string().min(1).max(400),
  howToTakeAccordingToPrescription: z.string().min(1).max(400),
  precautions: z.array(z.string().min(1)).max(10),
  commonSideEffects: z.array(z.string().min(1)).max(10),
});

const medicineEntrySchema = z.object({
  name: z.string().min(1).max(200),
  strength: z.string().max(100).nullable(),
  dosage: z.string().max(200).nullable(),
  frequency: z.string().max(200).nullable(),
  timing: z.string().max(200).nullable(),
  duration: z.string().max(200).nullable(),
  specialInstructions: z.string().max(400).nullable(),
  confidence: z.enum(["low", "medium", "high"]),
  explanation: medicineExplanationSchema,
});

export const prescriptionResultSchema = z.object({
  medicines: z.array(medicineEntrySchema).max(20),
  unreadableNotice: z.string().max(600).nullable(),
  overallConfidence: z.enum(["low", "medium", "high"]),
  disclaimer: z.string().min(1).max(400),
});

export const specialistResultSchema = z.object({
  suggestions: z
    .array(
      z.object({
        specialty: z.string().min(1).max(100),
        reasoning: z.string().min(1).max(400),
        confidence: z.enum(["low", "medium", "high"]),
      })
    )
    .max(3),
  disclaimer: z.string().min(1).max(400),
});

/**
 * Strips markdown code fences if the model wraps JSON in ```json ... ```
 * despite instructions, then parses. Returns null (never throws) so
 * callers can fall back safely.
 */
export function tryParseJson(raw: string): unknown | null {
  const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

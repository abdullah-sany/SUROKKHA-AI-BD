import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";
import { generateStructuredJson, isGeminiAvailable } from "./gemini/geminiClient";
import { buildFirstAidUserContent, FIRST_AID_SYSTEM_INSTRUCTION } from "./gemini/firstAidPrompt";
import { firstAidResultSchema, tryParseJson } from "./aiSchemas";
import type { FirstAidRequest, FirstAidResult, SeverityLevel } from "../types/firstAid";

const STANDARD_DISCLAIMER =
  "SUROKKHA AI BD provides general safety guidance and does not replace professional medical care.";

/**
 * Conservative, offline demo responses used ONLY when GEMINI_API_KEY is
 * not configured and ALLOW_DEMO_FALLBACK=true (section 29: demo mode
 * must be clearly labeled and never mixed silently with real AI output).
 * Keyword matching is intentionally simple — this is a fallback path for
 * the Innovation Fair demo, not a medical inference engine.
 */
function buildDemoResponse(situationText: string): FirstAidResult {
  const text = situationText.toLowerCase();

  const matchers: Array<{ test: RegExp; result: Omit<FirstAidResult, "disclaimer" | "isDemoResponse"> }> = [
    {
      test: /bleed|cut|wound/,
      result: {
        severity: "URGENT" as SeverityLevel,
        situationSummary: "You described a cut or wound that is actively bleeding.",
        immediateSteps: [
          "Wash your hands if possible before touching the wound.",
          "Apply firm, direct pressure on the wound with a clean cloth or bandage.",
          "Keep pressing without lifting the cloth to check — add more layers if it soaks through.",
          "If possible, raise the injured area above heart level.",
          "Once bleeding is controlled, cover with a clean dressing.",
        ],
        avoid: ["Do not remove an object stuck in the wound.", "Do not repeatedly lift the cloth to check the wound.", "Do not apply a tourniquet unless trained and bleeding is life-threatening."],
        warningSigns: ["Bleeding does not slow after 10 minutes of firm pressure", "The wound is deep, gaping, or on the face/neck/chest/abdomen", "Signs of shock: pale skin, dizziness, rapid breathing"],
        seekCare: "If bleeding does not stop with firm pressure, or the wound is deep or large, seek emergency care immediately.",
        emergencyEscalation: true,
      },
    },
    {
      test: /burn/,
      result: {
        severity: "MEDICAL_ATTENTION_RECOMMENDED" as SeverityLevel,
        situationSummary: "You described a burn injury.",
        immediateSteps: [
          "Cool the burn under clean, cool (not ice-cold) running water for 10-20 minutes.",
          "Remove any tight clothing or jewellery near the burn before it swells.",
          "Cover loosely with a clean, non-fluffy cloth or dressing.",
        ],
        avoid: ["Do not apply ice, butter, oil, or toothpaste to the burn.", "Do not burst any blisters.", "Do not use fluffy cotton wool directly on the burn."],
        warningSigns: ["Burn is larger than the person's palm", "Burn is on the face, hands, feet, or genitals", "Skin looks white, charred, or leathery", "Signs of infection develop later"],
        seekCare: "Seek medical attention for any burn larger than a small area, or any burn on the face, hands, feet, or genitals.",
        emergencyEscalation: false,
      },
    },
    {
      test: /chok/,
      result: {
        severity: "EMERGENCY" as SeverityLevel,
        situationSummary: "You described a possible choking emergency.",
        immediateSteps: [
          "If the person can cough or speak, encourage them to keep coughing.",
          "If they cannot breathe, speak, or cough, call 999 immediately or have someone else call.",
          "If trained, give back blows and abdominal thrusts until help arrives or the object is dislodged.",
        ],
        avoid: ["Do not leave the person alone.", "Do not give food or water while they are choking."],
        warningSigns: ["No sound or air movement", "Lips or face turning blue", "Person becomes unresponsive"],
        seekCare: "Choking with no air movement is a medical emergency — call 999 immediately.",
        emergencyEscalation: true,
      },
    },
    {
      test: /faint|dizzy|unconscious|pass(ed)? out/,
      result: {
        severity: "URGENT" as SeverityLevel,
        situationSummary: "You described fainting, dizziness, or loss of consciousness.",
        immediateSteps: [
          "Help the person lie down flat and raise their legs slightly if there is no injury.",
          "Loosen tight clothing around the neck.",
          "Check that they are breathing normally.",
          "If they don't wake within a minute or aren't breathing normally, call 999 immediately.",
        ],
        avoid: ["Do not give food or water until fully alert.", "Do not stand the person up quickly."],
        warningSigns: ["Does not regain consciousness within 1-2 minutes", "Not breathing normally", "Repeated fainting episodes", "Head injury from a fall"],
        seekCare: "If the person does not wake up quickly, is not breathing normally, or was injured in a fall, seek emergency care.",
        emergencyEscalation: true,
      },
    },
  ];

  const match = matchers.find((m) => m.test.test(text));
  const result = match?.result ?? {
    severity: "MEDICAL_ATTENTION_RECOMMENDED" as SeverityLevel,
    situationSummary: "Thanks for sharing what's happening. This demo build can't reach the AI service right now, so here is general guidance only.",
    immediateSteps: ["Stay calm and keep the person comfortable.", "Monitor for any worsening symptoms.", "If you're ever unsure, it's always safest to contact a healthcare professional."],
    avoid: ["Do not ignore worsening symptoms."],
    warningSigns: ["Symptoms get noticeably worse", "New severe pain, breathing difficulty, or confusion appears"],
    seekCare: "If you're unsure or symptoms are getting worse, contact a doctor or the national health helpline (16263).",
    emergencyEscalation: false,
  };

  return { ...result, disclaimer: STANDARD_DISCLAIMER, isDemoResponse: true };
}

function safeFallback(): FirstAidResult {
  return {
    severity: "MEDICAL_ATTENTION_RECOMMENDED",
    situationSummary: "We couldn't safely process that response.",
    immediateSteps: [],
    avoid: [],
    warningSigns: [],
    seekCare: "Verified guidance is currently unavailable. If this is urgent, contact a doctor or the national emergency service (999) directly.",
    emergencyEscalation: false,
    disclaimer: STANDARD_DISCLAIMER,
    isDemoResponse: true,
  };
}

export async function getFirstAidGuidance(request: FirstAidRequest): Promise<FirstAidResult> {
  if (!isGeminiAvailable()) {
    if (!env.allowDemoFallback) {
      throw new AppError("AI service is not configured on this server.", 503, "AI_NOT_CONFIGURED");
    }
    logger.warn("Serving demo first-aid response (GEMINI_API_KEY not set)");
    return buildDemoResponse(request.situationText);
  }

  const raw = await generateStructuredJson({
    systemInstruction: FIRST_AID_SYSTEM_INSTRUCTION,
    userContent: buildFirstAidUserContent(request),
    model: request.imageBase64 ? "vision" : "text",
    imageBase64: request.imageBase64,
    imageMimeType: request.imageMimeType,
  });

  const parsed = tryParseJson(raw);
  const validated = firstAidResultSchema.safeParse(parsed);
  if (!validated.success) {
    logger.error("First-aid AI response failed schema validation", { issues: validated.error.issues });
    return safeFallback();
  }

  return { ...validated.data, isDemoResponse: false };
}

/**
 * AI safety classification levels (section 8 of the spec).
 * The model is instructed to be conservative: when uncertain, it must
 * escalate rather than downgrade.
 */
export type SeverityLevel =
  | "NORMAL_FIRST_AID"
  | "MEDICAL_ATTENTION_RECOMMENDED"
  | "URGENT"
  | "EMERGENCY";

export interface FirstAidRequest {
  situationText: string;
  language: "en" | "bn";
  imageBase64?: string; // optional photo of a visible injury
  imageMimeType?: string;
}

/**
 * Structured, validated shape every first-aid response must conform to
 * before it is ever rendered (section 9). If the model's raw output does
 * not parse into this shape, we never show it — we fall back instead.
 */
export interface FirstAidResult {
  severity: SeverityLevel;
  situationSummary: string;
  immediateSteps: string[];
  avoid: string[];
  warningSigns: string[];
  seekCare: string;
  emergencyEscalation: boolean;
  disclaimer: string;
  isDemoResponse: boolean;
}

export interface SpecialistSuggestion {
  specialty: string;
  reasoning: string;
  confidence: "low" | "medium" | "high";
}

export interface SpecialistRequest {
  context: string;
  language: "en" | "bn";
}

export interface SpecialistResult {
  suggestions: SpecialistSuggestion[];
  disclaimer: string;
  isDemoResponse: boolean;
}

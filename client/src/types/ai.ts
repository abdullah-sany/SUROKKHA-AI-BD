export type SeverityLevel =
  | "NORMAL_FIRST_AID"
  | "MEDICAL_ATTENTION_RECOMMENDED"
  | "URGENT"
  | "EMERGENCY";

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

export interface MedicineEntry {
  name: string;
  strength: string | null;
  dosage: string | null;
  frequency: string | null;
  timing: string | null;
  duration: string | null;
  specialInstructions: string | null;
  confidence: "low" | "medium" | "high";
  explanation: {
    generalUse: string;
    howToTakeAccordingToPrescription: string;
    precautions: string[];
    commonSideEffects: string[];
  };
}

export interface PrescriptionAnalysisResult {
  medicines: MedicineEntry[];
  unreadableNotice: string | null;
  overallConfidence: "low" | "medium" | "high";
  disclaimer: string;
  isDemoResponse: boolean;
}

export interface SpecialistSuggestion {
  specialty: string;
  reasoning: string;
  confidence: "low" | "medium" | "high";
}

export interface SpecialistResult {
  suggestions: SpecialistSuggestion[];
  disclaimer: string;
  isDemoResponse: boolean;
}

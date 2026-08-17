/**
 * Prescription analyzer types (sections 19-20). The model is instructed to
 * read only what it can read confidently and to flag anything it cannot,
 * rather than guess. Nothing here ever changes a prescription — it only
 * explains what is already written on it.
 */
export interface MedicineEntry {
  name: string;
  strength: string | null;
  dosage: string | null;
  frequency: string | null;
  timing: string | null;
  duration: string | null;
  specialInstructions: string | null;
  confidence: "low" | "medium" | "high";
  /** Plain-language explanation of the medicine's general use and this
   * entry's instructions — never a diagnosis, never a dosage change. */
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

import { apiRequest } from "./apiClient";
import type { PrescriptionAnalysisResult, Language } from "../types";

export async function analyzePrescription(file: File, language: Language): Promise<PrescriptionAnalysisResult> {
  const formData = new FormData();
  formData.append("prescription", file);
  formData.append("language", language);

  const res = await apiRequest<{ ok: true; data: PrescriptionAnalysisResult }>("/prescription/analyze", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
  return res.data;
}

import { apiRequest } from "./apiClient";
import type { FirstAidResult, SpecialistResult } from "../types";
import type { Language } from "../types";

interface FirstAidPayload {
  situationText: string;
  language: Language;
  imageBase64?: string;
  imageMimeType?: "image/jpeg" | "image/png" | "image/webp";
}

export async function requestFirstAidGuidance(payload: FirstAidPayload): Promise<FirstAidResult> {
  const res = await apiRequest<{ ok: true; data: FirstAidResult }>("/first-aid", {
    method: "POST",
    body: payload,
  });
  return res.data;
}

export async function requestSpecialistSuggestion(context: string, language: Language): Promise<SpecialistResult> {
  const res = await apiRequest<{ ok: true; data: SpecialistResult }>("/specialist", {
    method: "POST",
    body: { context, language },
  });
  return res.data;
}

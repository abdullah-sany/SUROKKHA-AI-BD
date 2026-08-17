export * from "./health";
export * from "./ai";

export type TimelineEntryType =
  | "FIRST_AID_CONSULTATION"
  | "EMERGENCY_SEARCH"
  | "HOSPITAL_SEARCH"
  | "PRESCRIPTION_ANALYSIS"
  | "BLOOD_PLATFORM_VISIT";

export interface TimelineEntry {
  id: string;
  clientId: string;
  type: TimelineEntryType;
  summary: string;
  severity: string | null;
  createdAt: string;
}

export type Language = "en" | "bn";

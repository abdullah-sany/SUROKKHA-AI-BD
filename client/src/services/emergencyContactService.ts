import { apiRequest } from "./apiClient";
import type { EmergencyContact } from "../types";

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  const res = await apiRequest<{ ok: true; data: EmergencyContact[] }>("/emergency-contacts");
  return res.data;
}

import { apiRequest } from "./apiClient";
import type { AmbulanceProvider } from "../types";

export interface AmbulanceSearchParams {
  district?: string;
  latitude?: number;
  longitude?: number;
  sortBy?: "nearest" | "verified" | "name";
}

export async function searchAmbulances(params: AmbulanceSearchParams): Promise<AmbulanceProvider[]> {
  const res = await apiRequest<{ ok: true; data: AmbulanceProvider[] }>("/ambulances", { query: { ...params } });
  return res.data;
}

export async function getAmbulanceDistricts(): Promise<string[]> {
  const res = await apiRequest<{ ok: true; data: string[] }>("/ambulances/districts");
  return res.data;
}

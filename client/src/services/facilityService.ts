import { apiRequest } from "./apiClient";
import type { Facility, FacilityType } from "../types";

export interface FacilitySearchParams {
  search?: string;
  division?: string;
  district?: string;
  facilityType?: FacilityType;
  ownership?: "public" | "private" | "all";
  verifiedOnly?: boolean;
  latitude?: number;
  longitude?: number;
  sortBy?: "nearest" | "verified" | "name";
  page?: number;
  pageSize?: number;
}

export async function searchFacilities(params: FacilitySearchParams): Promise<{ items: Facility[]; total: number }> {
  const res = await apiRequest<{ ok: true; data: Facility[]; meta: { total: number } }>("/facilities", {
    query: { ...params },
  });
  return { items: res.data, total: res.meta.total };
}

export async function getFacilityFilters(): Promise<{ divisions: string[]; districts: string[] }> {
  const res = await apiRequest<{ ok: true; data: { divisions: string[]; districts: string[] } }>(
    "/facilities/filters"
  );
  return res.data;
}

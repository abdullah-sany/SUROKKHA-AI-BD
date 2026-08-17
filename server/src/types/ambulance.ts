/**
 * Ambulance directory record. Kept as its own domain (section 15 of the
 * spec) — an ambulance provider is NOT assumed to belong to any hospital
 * record, since we cannot verify that relationship for most entries.
 */
export type AmbulanceServiceType =
  | "Government"
  | "Fire Service & Civil Defence"
  | "Red Crescent"
  | "Private"
  | "NGO";

export interface AmbulanceProvider {
  id: string;
  providerName: string;
  division: string;
  district: string;
  area: string | null;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  serviceType: AmbulanceServiceType;
  verified: boolean;
  source: string;
  lastVerifiedAt: string | null;
  isDemoData: boolean;
}

export interface AmbulanceWithDistance extends AmbulanceProvider {
  distanceKm: number | null;
}

export interface AmbulanceQuery {
  district?: string;
  latitude?: number;
  longitude?: number;
  sortBy?: "nearest" | "verified" | "name";
}

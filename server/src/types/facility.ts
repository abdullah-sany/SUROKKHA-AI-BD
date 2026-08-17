/**
 * Normalized healthcare facility record.
 *
 * Modeled after the fields published by DGHS / the Ministry of Health and
 * Family Welfare facility registry (see section 12/13 of the product spec).
 * Only fields we can actually source go on a record — nothing here is
 * invented. `verified` + `source` + `lastVerifiedAt` travel with every row
 * so the UI can show a verification badge instead of implying certainty
 * we don't have.
 */
export type FacilityType =
  | "Hospital"
  | "Medical College Hospital"
  | "Private Hospital/Clinic"
  | "Health Complex"
  | "Clinic"
  | "Diagnostic Center"
  | "Blood Bank"
  | "Other Healthcare Facility";

export interface Facility {
  id: string;
  name: string;
  nameBn: string | null;
  code: string | null;
  agency: string | null;
  facilityType: FacilityType;
  division: string;
  district: string;
  cityCorporation: string | null;
  upazila: string | null;
  paurasava: string | null;
  union: string | null;
  isPrivate: boolean;
  phone: string | null;
  emergencyPhone: string | null;
  latitude: number | null;
  longitude: number | null;
  verified: boolean;
  source: string;
  lastVerifiedAt: string | null; // ISO date
  isDemoData: boolean;
}

export interface FacilityWithDistance extends Facility {
  distanceKm: number | null;
}

export interface FacilityQuery {
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

// Mirrors server/src/types/facility.ts and ambulance.ts — kept as plain
// duplicated interfaces (no shared package) to keep this a simple two-app
// prototype. If this becomes a monorepo with a build step, move these to
// a shared package instead.

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
  lastVerifiedAt: string | null;
  isDemoData: boolean;
  distanceKm: number | null;
}

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
  distanceKm: number | null;
}

export interface EmergencyContact {
  id: string;
  name: string;
  nameBn: string | null;
  category: "National Emergency" | "Police" | "Fire Service" | "Medical Emergency" | "Other";
  phone: string;
  description: string;
  descriptionBn: string | null;
  verified: boolean;
  source: string;
  lastVerifiedAt: string | null;
}

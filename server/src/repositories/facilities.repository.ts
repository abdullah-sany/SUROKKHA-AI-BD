import { db } from "./db";
import { haversineDistanceKm } from "../utils/haversine";
import type { Facility, FacilityQuery, FacilityWithDistance } from "../types/facility";

interface FacilityRow {
  id: string;
  name: string;
  nameBn: string | null;
  code: string | null;
  agency: string | null;
  facilityType: string;
  division: string;
  district: string;
  cityCorporation: string | null;
  upazila: string | null;
  paurasava: string | null;
  union_: string | null;
  isPrivate: number;
  phone: string | null;
  emergencyPhone: string | null;
  latitude: number | null;
  longitude: number | null;
  verified: number;
  source: string;
  lastVerifiedAt: string | null;
  isDemoData: number;
}

function rowToFacility(row: FacilityRow): Facility {
  return {
    id: row.id,
    name: row.name,
    nameBn: row.nameBn,
    code: row.code,
    agency: row.agency,
    facilityType: row.facilityType as Facility["facilityType"],
    division: row.division,
    district: row.district,
    cityCorporation: row.cityCorporation,
    upazila: row.upazila,
    paurasava: row.paurasava,
    union: row.union_,
    isPrivate: !!row.isPrivate,
    phone: row.phone,
    emergencyPhone: row.emergencyPhone,
    latitude: row.latitude,
    longitude: row.longitude,
    verified: !!row.verified,
    source: row.source,
    lastVerifiedAt: row.lastVerifiedAt,
    isDemoData: !!row.isDemoData,
  };
}

const PAGE_SIZE_DEFAULT = 20;
const PAGE_SIZE_MAX = 50;

export const facilitiesRepository = {
  findById(id: string): Facility | null {
    const row = db.prepare("SELECT * FROM facilities WHERE id = ?").get(id) as FacilityRow | undefined;
    return row ? rowToFacility(row) : null;
  },

  search(query: FacilityQuery): { items: FacilityWithDistance[]; total: number } {
    const clauses: string[] = [];
    const params: Record<string, unknown> = {};

    if (query.search) {
      clauses.push("(name LIKE @search OR nameBn LIKE @search OR district LIKE @search)");
      params.search = `%${query.search}%`;
    }
    if (query.division) {
      clauses.push("division = @division");
      params.division = query.division;
    }
    if (query.district) {
      clauses.push("district = @district");
      params.district = query.district;
    }
    if (query.facilityType) {
      clauses.push("facilityType = @facilityType");
      params.facilityType = query.facilityType;
    }
    if (query.ownership === "public") {
      clauses.push("isPrivate = 0");
    } else if (query.ownership === "private") {
      clauses.push("isPrivate = 1");
    }
    if (query.verifiedOnly) {
      clauses.push("verified = 1");
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const total = (db.prepare(`SELECT COUNT(*) AS c FROM facilities ${where}`).get(params) as { c: number }).c;

    const rows = db.prepare(`SELECT * FROM facilities ${where}`).all(params) as FacilityRow[];
    let facilities: FacilityWithDistance[] = rows.map((row) => {
      const facility = rowToFacility(row);
      const distanceKm =
        query.latitude != null && query.longitude != null && facility.latitude != null && facility.longitude != null
          ? haversineDistanceKm(query.latitude, query.longitude, facility.latitude, facility.longitude)
          : null;
      return { ...facility, distanceKm };
    });

    const sortBy = query.sortBy ?? (query.latitude != null ? "nearest" : "name");
    facilities = facilities.sort((a, b) => {
      if (sortBy === "nearest") {
        if (a.distanceKm == null && b.distanceKm == null) return a.name.localeCompare(b.name);
        if (a.distanceKm == null) return 1; // unknown distance sorts last, never guessed
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      }
      if (sortBy === "verified") {
        if (a.verified === b.verified) return a.name.localeCompare(b.name);
        return a.verified ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    const pageSize = Math.min(query.pageSize ?? PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX);
    const page = Math.max(query.page ?? 1, 1);
    const start = (page - 1) * pageSize;
    const items = facilities.slice(start, start + pageSize);

    return { items, total };
  },

  listDivisions(): string[] {
    const rows = db.prepare("SELECT DISTINCT division FROM facilities ORDER BY division").all() as { division: string }[];
    return rows.map((r) => r.division);
  },

  listDistricts(division?: string): string[] {
    const rows = division
      ? (db.prepare("SELECT DISTINCT district FROM facilities WHERE division = ? ORDER BY district").all(division) as { district: string }[])
      : (db.prepare("SELECT DISTINCT district FROM facilities ORDER BY district").all() as { district: string }[]);
    return rows.map((r) => r.district);
  },
};

import { db } from "./db";
import { haversineDistanceKm } from "../utils/haversine";
import type { AmbulanceProvider, AmbulanceQuery, AmbulanceWithDistance } from "../types/ambulance";

interface AmbulanceRow {
  id: string;
  providerName: string;
  division: string;
  district: string;
  area: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  serviceType: string;
  verified: number;
  source: string;
  lastVerifiedAt: string | null;
  isDemoData: number;
}

function rowToAmbulance(row: AmbulanceRow): AmbulanceProvider {
  return {
    id: row.id,
    providerName: row.providerName,
    division: row.division,
    district: row.district,
    area: row.area,
    phone: row.phone ?? "",
    latitude: row.latitude,
    longitude: row.longitude,
    serviceType: row.serviceType as AmbulanceProvider["serviceType"],
    verified: !!row.verified,
    source: row.source,
    lastVerifiedAt: row.lastVerifiedAt,
    isDemoData: !!row.isDemoData,
  };
}

export const ambulancesRepository = {
  search(query: AmbulanceQuery): AmbulanceWithDistance[] {
    const clauses: string[] = [];
    const params: Record<string, unknown> = {};

    if (query.district) {
      clauses.push("(district = @district OR district = 'Nationwide')");
      params.district = query.district;
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = db.prepare(`SELECT * FROM ambulances ${where}`).all(params) as AmbulanceRow[];

    let items: AmbulanceWithDistance[] = rows.map((row) => {
      const ambulance = rowToAmbulance(row);
      const distanceKm =
        query.latitude != null && query.longitude != null && ambulance.latitude != null && ambulance.longitude != null
          ? haversineDistanceKm(query.latitude, query.longitude, ambulance.latitude, ambulance.longitude)
          : null;
      return { ...ambulance, distanceKm };
    });

    const sortBy = query.sortBy ?? (query.latitude != null ? "nearest" : "verified");
    items = items.sort((a, b) => {
      if (sortBy === "nearest") {
        if (a.distanceKm == null && b.distanceKm == null) return a.verified === b.verified ? 0 : a.verified ? -1 : 1;
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      }
      if (sortBy === "name") return a.providerName.localeCompare(b.providerName);
      // verified first, then name
      if (a.verified === b.verified) return a.providerName.localeCompare(b.providerName);
      return a.verified ? -1 : 1;
    });

    return items;
  },

  listDistricts(): string[] {
    const rows = db.prepare("SELECT DISTINCT district FROM ambulances ORDER BY district").all() as { district: string }[];
    return rows.map((r) => r.district);
  },
};

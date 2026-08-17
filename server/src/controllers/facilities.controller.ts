import type { Request, Response } from "express";
import { facilitiesService } from "../services/facilities.service";
import { AppError } from "../utils/AppError";
import type { FacilityQuery } from "../types/facility";

export async function getFacilities(req: Request, res: Response) {
  const query = req.query as unknown as FacilityQuery;
  const result = facilitiesService.search(query);
  res.json({ ok: true, data: result.items, meta: { total: result.total } });
}

export async function getFacilityById(req: Request, res: Response) {
  const facility = facilitiesService.getById(req.params.id as string);
  if (!facility) {
    throw new AppError("Facility not found.", 404, "NOT_FOUND");
  }
  res.json({ ok: true, data: facility });
}

export async function getFacilityFilters(_req: Request, res: Response) {
  res.json({
    ok: true,
    data: {
      divisions: facilitiesService.listDivisions(),
      districts: facilitiesService.listDistricts(),
    },
  });
}

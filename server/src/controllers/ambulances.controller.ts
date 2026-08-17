import type { Request, Response } from "express";
import { ambulancesService } from "../services/ambulances.service";
import type { AmbulanceQuery } from "../types/ambulance";

export async function getAmbulances(req: Request, res: Response) {
  const query = req.query as unknown as AmbulanceQuery;
  const items = ambulancesService.search(query);
  res.json({ ok: true, data: items });
}

export async function getAmbulanceDistricts(_req: Request, res: Response) {
  res.json({ ok: true, data: ambulancesService.listDistricts() });
}

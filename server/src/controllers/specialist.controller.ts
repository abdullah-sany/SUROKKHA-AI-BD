import type { Request, Response } from "express";
import { getSpecialistSuggestion } from "../services/specialist.service";
import type { SpecialistRequest } from "../types/firstAid";

export async function postSpecialist(req: Request, res: Response) {
  const body = req.body as SpecialistRequest;
  const result = await getSpecialistSuggestion(body);
  res.json({ ok: true, data: result });
}

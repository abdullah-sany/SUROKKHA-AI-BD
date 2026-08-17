import type { Request, Response } from "express";
import { getFirstAidGuidance } from "../services/firstAid.service";
import type { FirstAidRequest } from "../types/firstAid";

export async function postFirstAid(req: Request, res: Response) {
  const body = req.body as FirstAidRequest;
  const result = await getFirstAidGuidance(body);
  res.json({ ok: true, data: result });
}

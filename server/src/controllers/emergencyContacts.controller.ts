import type { Request, Response } from "express";
import { emergencyContactsRepository } from "../repositories/emergencyContacts.repository";

export async function getEmergencyContacts(_req: Request, res: Response) {
  res.json({ ok: true, data: emergencyContactsRepository.listAll() });
}

import type { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { analyzePrescription } from "../services/prescription.service";

export async function postPrescriptionAnalyze(req: Request, res: Response) {
  const file = req.file;
  if (!file) {
    throw new AppError("Please attach a prescription image (JPG, PNG, WEBP, or PDF).", 400, "MISSING_FILE");
  }

  const language = (req.body?.language === "bn" ? "bn" : "en") as "en" | "bn";
  const imageBase64 = file.buffer.toString("base64");

  const result = await analyzePrescription(imageBase64, file.mimetype, language);

  // Section 26 (privacy): the uploaded buffer only ever lived in memory for
  // this request and is discarded once this handler returns — nothing is
  // written to disk unless the client later calls a separate "save" action
  // that doesn't exist in this prototype yet (see README extension points).
  res.json({ ok: true, data: result });
}

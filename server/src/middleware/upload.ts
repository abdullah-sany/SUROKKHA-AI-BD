import multer from "multer";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

/**
 * Prescription upload handling (section 27: restrict file type & size,
 * handle malicious/invalid files safely). Files are kept in memory only
 * long enough to send to Gemini — see section 26 (privacy): images are
 * not persisted unless the user explicitly opts to save them.
 */
export const prescriptionUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadBytes, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new AppError("Unsupported file type. Please upload a JPG, PNG, WEBP, or PDF.", 415, "UNSUPPORTED_FILE_TYPE"));
      return;
    }
    cb(null, true);
  },
});

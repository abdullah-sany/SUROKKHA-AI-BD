import "dotenv/config";
import path from "node:path";

function boolFromEnv(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.trim().toLowerCase() === "true";
}

function intFromEnv(value: string | undefined, fallback: number): number {
  const parsed = value ? parseInt(value, 10) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  port: intFromEnv(process.env.PORT, 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",

  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiTextModel: process.env.GEMINI_TEXT_MODEL ?? "gemini-1.5-flash",
  geminiVisionModel: process.env.GEMINI_VISION_MODEL ?? "gemini-1.5-flash",

  databaseUrl: process.env.DATABASE_URL
    ? path.resolve(process.cwd(), process.env.DATABASE_URL)
    : path.resolve(process.cwd(), "data/surokkha.sqlite"),

  allowDemoFallback: boolFromEnv(process.env.ALLOW_DEMO_FALLBACK, true),
  maxUploadBytes: intFromEnv(process.env.MAX_UPLOAD_BYTES, 5 * 1024 * 1024),

  isGeminiConfigured(): boolean {
    return this.geminiApiKey.trim().length > 0;
  },
};

export type Env = typeof env;

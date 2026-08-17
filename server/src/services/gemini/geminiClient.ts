import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";
import { AppError } from "../../utils/AppError";

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!client) {
    client = new GoogleGenerativeAI(env.geminiApiKey);
  }
  return client;
}

export interface GenerateJsonOptions {
  systemInstruction: string;
  userContent: string;
  model?: "text" | "vision";
  imageBase64?: string;
  imageMimeType?: string;
  /** Upper bound on output size; keeps latency and cost predictable. */
  maxOutputTokens?: number;
}

/**
 * Calls Gemini and returns the raw text response. Every caller is
 * responsible for parsing + validating the JSON itself (section 9:
 * "Validate the model response before rendering... never display
 * malformed AI output as trusted medical instructions").
 *
 * Throws AppError(503) if Gemini is not configured and demo fallback is
 * disabled — callers that support a demo response should check
 * `isGeminiAvailable()` first instead of calling this blind.
 */
export async function generateStructuredJson(options: GenerateJsonOptions): Promise<string> {
  if (!env.isGeminiConfigured()) {
    throw new AppError(
      "AI service is not configured on this server (missing GEMINI_API_KEY).",
      503,
      "AI_NOT_CONFIGURED"
    );
  }

  const modelName = options.model === "vision" ? env.geminiVisionModel : env.geminiTextModel;
  const model = getClient().getGenerativeModel({
    model: modelName,
    systemInstruction: options.systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: options.maxOutputTokens ?? 1024,
      temperature: 0.2,
    },
  });

  const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [
    { text: options.userContent },
  ];
  if (options.imageBase64 && options.imageMimeType) {
    parts.push({ inlineData: { data: options.imageBase64, mimeType: options.imageMimeType } });
  }

  try {
    const result = await model.generateContent(parts as never);
    const text = result.response.text();
    return text;
  } catch (err) {
    logger.error("Gemini API call failed", { message: err instanceof Error ? err.message : String(err) });
    throw new AppError(
      "The AI service could not be reached right now. Please try again shortly.",
      502,
      "AI_UPSTREAM_ERROR"
    );
  }
}

export function isGeminiAvailable(): boolean {
  return env.isGeminiConfigured();
}

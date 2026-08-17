import { createApp } from "./app";
import { env } from "./config/env";
import { initDatabase } from "./repositories/db";
import { logger } from "./utils/logger";

initDatabase();

const app = createApp();

app.listen(env.port, () => {
  logger.info(`SUROKKHA AI BD server listening`, {
    port: env.port,
    env: env.nodeEnv,
    aiConfigured: env.isGeminiConfigured(),
    demoFallbackAllowed: env.allowDemoFallback,
  });
  if (!env.isGeminiConfigured()) {
    logger.warn(
      "GEMINI_API_KEY is not set. AI routes will serve clearly-labeled demo responses. Add a key to server/.env to enable live AI."
    );
  }
});

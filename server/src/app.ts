import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";
import routes from "./routes";

export function createApp() {
  const app = express();

  // Security headers (section 27). API-only server, so a strict default
  // CSP isn't relevant here — the client app applies its own.
  app.use(helmet());

  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: false,
    })
  );

  app.use(express.json({ limit: "2mb" }));
  app.use(apiLimiter);

  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

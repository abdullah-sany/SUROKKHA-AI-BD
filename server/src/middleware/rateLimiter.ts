import rateLimit from "express-rate-limit";

/**
 * General API limiter — generous, just a backstop against abuse.
 */
export const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: { code: "RATE_LIMITED", message: "Too many requests. Please slow down." } },
});

/**
 * Tighter limiter for Gemini-backed routes, since those cost real tokens
 * and should never be hammered by a runaway client loop.
 */
export const aiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    error: { code: "AI_RATE_LIMITED", message: "Too many AI requests. Please wait a moment and try again." },
  },
});

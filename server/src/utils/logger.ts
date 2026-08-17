/* Minimal structured logger. Swap for pino/winston in production without
 * touching call sites — every module imports `logger`, never `console`. */
type LogFields = Record<string, unknown>;

function emit(level: "info" | "warn" | "error", message: string, fields?: LogFields) {
  const entry = {
    level,
    message,
    time: new Date().toISOString(),
    ...(fields ?? {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    // eslint-disable-next-line no-console
    console.error(line);
  } else {
    // eslint-disable-next-line no-console
    console.log(line);
  }
}

export const logger = {
  info: (message: string, fields?: LogFields) => emit("info", message, fields),
  warn: (message: string, fields?: LogFields) => emit("warn", message, fields),
  error: (message: string, fields?: LogFields) => emit("error", message, fields),
};

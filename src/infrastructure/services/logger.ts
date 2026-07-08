/**
 * The single logging entry point (Golden Rule 12 — no raw `console.*` elsewhere).
 * A thin wrapper today; the seam lets us swap in a real sink later without
 * touching call sites.
 */
type LogLevel = "info" | "warn" | "error";

function emit(level: LogLevel, message: string, meta?: unknown): void {
  const line = `[rmc] ${message}`;
  if (meta === undefined) {
    console[level](line);
  } else {
    console[level](line, meta);
  }
}

export const logger = {
  info: (message: string, meta?: unknown) => emit("info", message, meta),
  warn: (message: string, meta?: unknown) => emit("warn", message, meta),
  error: (message: string, meta?: unknown) => emit("error", message, meta),
};

/**
 * RM data is effectively static, so we cache server fetches aggressively.
 * Caching is opt-in in Next 16 (dynamic by default) — this is the opt-in.
 */
export const SERVER_REVALIDATE_SECONDS = 3600;

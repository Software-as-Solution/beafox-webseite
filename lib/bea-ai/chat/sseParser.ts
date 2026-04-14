// ─── SSE PARSER ───────────────────────────────────────────
// Parses Server-Sent Event chunks from /api/bea-ai/chat into typed
// objects. Returns null for malformed events so callers can skip them.

import type { SSEEvent } from "./chatTypes";

/**
 * Parse a single SSE event chunk (`data: {...}`) into a typed event.
 * Returns null for malformed or empty events.
 */
export function parseSSEEvent(raw: string): SSEEvent | null {
  const cleaned = raw.replace(/^data: /, "").trim();
  if (!cleaned) return null;
  try {
    return JSON.parse(cleaned) as SSEEvent;
  } catch {
    return null;
  }
}

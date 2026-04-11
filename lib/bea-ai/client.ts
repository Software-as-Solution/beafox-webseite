// ─────────────────────────────────────────────────────────────
// Bea AI — Anthropic Client & Model Config
// Singleton-Instanz + automatisches Haiku → Sonnet Upgrade
// ─────────────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";

// ─── Singleton ──────────────────────────────────────────────
let _client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Add it to .env or .env.local."
      );
    }
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

// ─── Models ─────────────────────────────────────────────────
export const BEA_MODEL =
  process.env.BEA_AI_MODEL ?? "claude-haiku-4-5-20251001";

export const BEA_UPGRADE_MODEL =
  process.env.BEA_AI_UPGRADE_MODEL ?? "claude-sonnet-4-6-20250514";

// ─── Limits ─────────────────────────────────────────────────
export const MAX_MESSAGES_PER_SESSION = parseInt(
  process.env.BEA_AI_MAX_MESSAGES_PER_SESSION ?? "15",
  10
);

export const MAX_OUTPUT_TOKENS = parseInt(
  process.env.BEA_AI_MAX_OUTPUT_TOKENS ?? "600",
  10
);

// ─── Upgrade Logic ──────────────────────────────────────────
// Haiku startet. Wenn die Konversation tiefer wird (mehr als
// UPGRADE_THRESHOLD Nachrichten), wechseln wir automatisch
// auf Sonnet für bessere Gesprächsqualität.
const UPGRADE_THRESHOLD = 6; // Nach 6 User-Nachrichten → Sonnet

export function pickModel(userMessageCount: number): string {
  if (userMessageCount >= UPGRADE_THRESHOLD) {
    return BEA_UPGRADE_MODEL;
  }
  return BEA_MODEL;
}

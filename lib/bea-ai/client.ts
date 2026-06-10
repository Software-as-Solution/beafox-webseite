// ─────────────────────────────────────────────────────────────
// Bea AI — Anthropic Client & Model Config
// Singleton-Instanz. EIN Modell pro Session, kein Mid-Conversation-
// Swap (würde den Prompt-Cache invalidieren, da pro (model, prefix)
// gekeyed).
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
    // maxRetries: SDK retryt 408/409/429/5xx (inkl. 529 "overloaded") mit
    // Backoff auf Request-Ebene. Der mid-stream overloaded_error wird zusätzlich
    // im Chat-Route-Handler abgefangen (App-Level-Retry).
    _client = new Anthropic({ apiKey, maxRetries: 4 });
  }
  return _client;
}

// ─── Models ─────────────────────────────────────────────────
// Default: Sonnet 4.6 für den Haupt-Chat. Bester Balance-Punkt
// aus Qualität (WhatsApp-Freundin-Ton) und Kosten.
export const BEA_MODEL_DEFAULT =
  process.env.BEA_AI_MODEL ?? "claude-sonnet-4-6";

// Premium-Pfad. Erst aktiv, wenn ein quality-Flag gesetzt wird.
export const BEA_MODEL_QUALITY =
  process.env.BEA_AI_MODEL_QUALITY ?? "claude-opus-4-7";

// Klassifikator-only. NIEMALS für Haupt-Chat verwenden — Haikus
// Knappheit passt nicht zum Freundin-Ton.
export const BEA_MODEL_CLASSIFIER =
  process.env.BEA_AI_MODEL_CLASSIFIER ?? "claude-haiku-4-5-20251001";

// ─── Limits ─────────────────────────────────────────────────
export const MAX_MESSAGES_PER_SESSION = parseInt(
  process.env.BEA_AI_MAX_MESSAGES_PER_SESSION ?? "10",
  10
);

// 350 statt 600: Bea soll knapp antworten (1-3 Sätze laut System-Prompt).
// Reicht locker auch für die "Nutzer fragt explizit nach Details"-Fälle
// und halbiert nebenbei die Worst-Case-Output-Kosten pro Turn.
export const MAX_OUTPUT_TOKENS = parseInt(
  process.env.BEA_AI_MAX_OUTPUT_TOKENS ?? "350",
  10
);

// ─── Model Picker ───────────────────────────────────────────
// Wird EINMAL pro Session aufgerufen. Niemals mid-conversation
// wechseln, sonst Cache-Miss auf jedem nachfolgenden Turn.
export function pickModel(opts: { quality?: boolean } = {}): string {
  return opts.quality ? BEA_MODEL_QUALITY : BEA_MODEL_DEFAULT;
}

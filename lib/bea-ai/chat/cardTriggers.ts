// ─── CARD TRIGGERS ────────────────────────────────────────
// Client-side logic that decides when to inject Bea-Cards into the
// chat. Phase 1: simple deterministic rules (message-count, keywords).
// Phase 2 (later): backend-driven via inline markers.

import type { BeaCard, Message } from "./chatTypes";

// CONSTANTS
export const TRIGGER_RULES = {
  betaAccessAfterUserMessages: 5,
  milestoneAtUserMessages: [1, 10, 25] as const,
} as const;

interface TriggerContext {
  messages: Message[];
  shownCardIds: string[];
}

interface TriggerResult {
  card: BeaCard;
  /** Stable card ID — ensures the same card isn't re-triggered. */
  cardId: string;
}

/**
 * Counts user messages in the conversation. Used as the primary
 * heuristic for engagement-based triggers.
 */
function countUserMessages(messages: Message[]): number {
  return messages.filter((m) => m.role === "user").length;
}

/**
 * Determines whether the BetaAccessCard should be shown next.
 * Shown once per session, after a configurable number of user messages.
 */
export function shouldTriggerBetaAccess(ctx: TriggerContext): TriggerResult | null {
  const cardId = "beta_access";
  if (ctx.shownCardIds.includes(cardId)) return null;
  const userMsgCount = countUserMessages(ctx.messages);
  if (userMsgCount < TRIGGER_RULES.betaAccessAfterUserMessages) return null;
  return { card: { type: "beta_access" }, cardId };
}

/**
 * Determines whether a milestone card should be shown next.
 * Shown at predefined message-count thresholds.
 */
export function shouldTriggerMilestone(
  ctx: TriggerContext,
): TriggerResult | null {
  const userMsgCount = countUserMessages(ctx.messages);
  for (const threshold of TRIGGER_RULES.milestoneAtUserMessages) {
    if (userMsgCount === threshold) {
      const cardId = `milestone_${threshold}`;
      if (ctx.shownCardIds.includes(cardId)) continue;
      return {
        card: {
          type: "milestone",
          milestone: getMilestoneTitle(threshold),
          description: getMilestoneDescription(threshold),
        },
        cardId,
      };
    }
  }
  return null;
}

function getMilestoneTitle(threshold: number): string {
  if (threshold === 1) return "Erstes Gespräch ✨";
  if (threshold === 10) return "Zehn Nachrichten — du bist drin!";
  return "Stark dabei — weiter so!";
}

function getMilestoneDescription(threshold: number): string {
  if (threshold === 1)
    return "Du hast den ersten Schritt gemacht. Freut mich, dass du da bist.";
  if (threshold === 10)
    return "Wir haben schon richtig was zusammen besprochen. Mach weiter so!";
  return "Du bleibst dran — das ist mehr als die meisten machen.";
}

/**
 * Master function: runs all trigger rules in priority order and
 * returns the first match. Returns null if no card should be triggered.
 */
export function evaluateCardTriggers(
  ctx: TriggerContext,
): TriggerResult | null {
  return (
    shouldTriggerMilestone(ctx) ??
    shouldTriggerBetaAccess(ctx) ??
    null
  );
}

/**
 * Backend-marker placeholder parser. If the LLM ever returns
 * `[CARD:type:slug]` in its response, this function extracts it.
 * Currently inactive — backend doesn't emit these markers yet.
 */
export function parseCardMarker(_text: string): BeaCard | null {
  // POTENTIAL FUTURE: regex-extract card markers from streamed text.
  return null;
}

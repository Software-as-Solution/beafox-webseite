// ─────────────────────────────────────────────────────────────
// BeAFox Analytics — Insights Tracker
// ─────────────────────────────────────────────────────────────

import { buildMeta, enqueue } from "../client";
import type { OnboardingInsights } from "@/lib/bea-ai/onboarding";

export function trackInsightsGenerated(insights: OnboardingInsights): void {
  enqueue({
    type: "insights.generated",
    insights,
    meta: buildMeta(),
  });
}

export function trackInsightViewed(
  insight_type: "strength" | "challenge" | "starting_point" | "financial_type",
  dwell_ms: number,
): void {
  enqueue({
    type: "insights.viewed",
    insight_type,
    dwell_ms,
    meta: buildMeta(),
  });
}

export function trackInsightReacted(
  insight_type: "strength" | "challenge" | "starting_point" | "financial_type",
  reaction: "resonates" | "does_not_fit",
): void {
  enqueue({
    type: "insights.reacted",
    insight_type,
    reaction,
    meta: buildMeta(),
  });
}

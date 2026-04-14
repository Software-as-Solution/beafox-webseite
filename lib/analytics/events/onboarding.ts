// ─────────────────────────────────────────────────────────────
// BeAFox Analytics — Onboarding Tracker
// ─────────────────────────────────────────────────────────────
// Typed wrapper für Onboarding-Events. Buckets das Profil vor dem
// Senden, scrubbt Freitext-Felder wie zielbild.
// ─────────────────────────────────────────────────────────────

import { buildMeta, enqueue } from "../client";
import { ageBucket, scrubPII } from "../scrubber";
import type { BucketedProfile } from "../types";
import type { StepId, UserProfile } from "@/lib/bea-ai/onboarding";

// ─── Profile-Bucketing ───────────────────────────────────────
/**
 * Konvertiert ein vollständiges UserProfile in eine PII-minimierte
 * Variante für Analytics. Freitext wird nur durch Länge repräsentiert.
 */
export function bucketProfile(profile: UserProfile): BucketedProfile {
  const persoenlichkeitYes = Object.values(profile.persoenlichkeit ?? {})
    .filter(Boolean).length;

  return {
    age_bucket: ageBucket(profile.alter),
    lebenssituation: profile.lebenssituation,
    wohnsituation: profile.wohnsituation,
    einkommensRange: profile.einkommensRange,
    zeithorizont: profile.zeithorizont,
    hasDebt: profile.hatSchulden,
    prioritaeten_count: profile.prioritaeten?.length ?? 0,
    wissenstest_correct: profile.wissenstest?.correctCount ?? 0,
    szenario_present: profile.szenario !== null,
    persoenlichkeit_yes_count: persoenlichkeitYes,
    geldgefuehl: profile.geldgefuehl,
    geldpraegung: profile.geldpraegung,
    zielbild_length: profile.zielbild?.length ?? 0,
    lebenswerte: profile.lebenswerte ?? [],
  };
}

// ─── Tracker-Funktionen ──────────────────────────────────────
export function trackOnboardingStarted(): void {
  enqueue({ type: "onboarding.started", meta: buildMeta() });
}

export function trackStepViewed(step_id: StepId, step_idx: number): void {
  enqueue({
    type: "onboarding.step.viewed",
    step_id,
    step_idx,
    meta: buildMeta(),
  });
}

export function trackStepCompleted(
  step_id: StepId,
  step_idx: number,
  duration_ms: number,
  payload: Record<string, unknown>,
): void {
  // Scrubbe Freitext-Felder im Payload
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (k === "zielbild" && typeof v === "string") {
      // Zielbild gehört zu den sensibelsten Feldern → scrubben + truncaten
      cleaned[k] = scrubPII(v);
    } else {
      cleaned[k] = v;
    }
  }

  enqueue({
    type: "onboarding.step.completed",
    step_id,
    step_idx,
    duration_ms,
    payload: cleaned,
    meta: buildMeta(),
  });
}

export function trackStepAbandoned(
  step_id: StepId,
  step_idx: number,
  duration_ms: number,
): void {
  enqueue({
    type: "onboarding.step.abandoned",
    step_id,
    step_idx,
    duration_ms,
    meta: buildMeta(),
  });
}

export function trackStepBack(
  from_step_id: StepId,
  to_step_id: StepId,
): void {
  enqueue({
    type: "onboarding.step.back",
    from_step_id,
    to_step_id,
    meta: buildMeta(),
  });
}

export function trackOnboardingCompleted(
  profile: UserProfile,
  total_duration_ms: number,
): void {
  enqueue({
    type: "onboarding.completed",
    total_duration_ms,
    profile: bucketProfile(profile),
    meta: buildMeta(),
  });
}

// ─────────────────────────────────────────────────────────────
// BeAFox Analytics — Event Types
// ─────────────────────────────────────────────────────────────
// Strikt typisierte Event-Payloads für alle Tracking-Calls.
// Jedes Event hat eine `type`-Diskriminante und einheitliche `meta`.
// Events gehen durch Consent-Gates, bevor sie persistiert werden.
// ─────────────────────────────────────────────────────────────

import type {
  UserProfile,
  OnboardingInsights,
  StepId,
} from "@/lib/bea-ai/onboarding";

// CONSTANTS
export const EVENT_SCHEMA_VERSION = 1;

// ─── Consent ─────────────────────────────────────────────────
export type ConsentPurpose =
  | "analytics" // Funnel, Abbruchraten, Session-Metriken
  | "prompt_iteration" // Chat-Logs zur internen Qualitäts-Verbesserung
  | "model_training" // Chat-Logs fürs LLM-Fine-Tuning
  | "profile_tracking"; // Longitudinal-Profile-Snapshots

export interface ConsentRecord {
  granted: boolean;
  granted_at: string | null; // ISO 8601
  revoked_at: string | null; // ISO 8601
  consent_text_version: string;
}

export type ConsentState = Record<ConsentPurpose, ConsentRecord>;

// ─── Base Meta (jedes Event hat das) ─────────────────────────
export interface BaseEventMeta {
  analytics_id: string; // pseudonyme User-ID
  session_id: string; // pro Browser-Session
  client_timestamp: string; // ISO 8601
  app_version: string;
  schema_version: number;
  source: "b2c"; // Erweiterung für B2B später
}

// ─── Bucketed Profile (PII-minimiert, für Analytics) ─────────
export interface BucketedProfile {
  age_bucket: string; // z.B. "18-22", "23-27", "28-30+"
  lebenssituation: string;
  wohnsituation: string;
  einkommensRange: string;
  zeithorizont: string;
  hasDebt: boolean;
  prioritaeten_count: number;
  wissenstest_correct: number;
  szenario_present: boolean;
  persoenlichkeit_yes_count: number;
  geldgefuehl: string;
  geldpraegung: string;
  zielbild_length: number; // nur Länge, nicht Inhalt
  lebenswerte: string[];
}

// ─── Onboarding Events ───────────────────────────────────────
export type OnboardingEvent =
  | {
      type: "onboarding.started";
      meta: BaseEventMeta;
    }
  | {
      type: "onboarding.step.viewed";
      step_id: StepId;
      step_idx: number;
      meta: BaseEventMeta;
    }
  | {
      type: "onboarding.step.completed";
      step_id: StepId;
      step_idx: number;
      duration_ms: number;
      /** Die User-Eingabe — bei Freitext gescrubbt, sonst strukturiert */
      payload: Record<string, unknown>;
      meta: BaseEventMeta;
    }
  | {
      type: "onboarding.step.abandoned";
      step_id: StepId;
      step_idx: number;
      duration_ms: number;
      meta: BaseEventMeta;
    }
  | {
      type: "onboarding.step.back";
      from_step_id: StepId;
      to_step_id: StepId;
      meta: BaseEventMeta;
    }
  | {
      type: "onboarding.completed";
      total_duration_ms: number;
      profile: BucketedProfile;
      meta: BaseEventMeta;
    };

// ─── Insights Events ─────────────────────────────────────────
export type InsightsEvent =
  | {
      type: "insights.generated";
      /** Snapshot des OnboardingInsights-Objekts (bereits pseudonymisiert) */
      insights: OnboardingInsights;
      meta: BaseEventMeta;
    }
  | {
      type: "insights.viewed";
      insight_type: "strength" | "challenge" | "starting_point" | "financial_type";
      dwell_ms: number;
      meta: BaseEventMeta;
    }
  | {
      type: "insights.reacted";
      insight_type: "strength" | "challenge" | "starting_point" | "financial_type";
      reaction: "resonates" | "does_not_fit";
      meta: BaseEventMeta;
    };

// ─── Chat Events ─────────────────────────────────────────────
export type ChatEvent =
  | {
      type: "chat.session.started";
      conversation_id: string;
      /** Der komplette System-Prompt, mit dem die Session startete */
      system_prompt: string;
      /** Bucketed Profile-Snapshot (ohne PII) */
      profile_snapshot: BucketedProfile | null;
      meta: BaseEventMeta;
    }
  | {
      type: "chat.message.sent";
      conversation_id: string;
      message_id: string;
      /** Scrubber hat bereits PII entfernt */
      content: string;
      length_chars: number;
      meta: BaseEventMeta;
    }
  | {
      type: "chat.response.received";
      conversation_id: string;
      message_id: string;
      in_reply_to: string; // message_id der User-Nachricht
      content: string;
      length_chars: number;
      model: string;
      latency_ms: number;
      tokens_approx: number; // Schätzung, falls API keine exakten liefert
      meta: BaseEventMeta;
    }
  | {
      type: "chat.response.regenerated";
      conversation_id: string;
      message_id: string;
      meta: BaseEventMeta;
    }
  | {
      type: "chat.response.feedback";
      conversation_id: string;
      message_id: string;
      feedback: "up" | "down";
      note: string | null;
      meta: BaseEventMeta;
    }
  | {
      type: "chat.error";
      conversation_id: string;
      error_code: string;
      error_message: string;
      meta: BaseEventMeta;
    }
  | {
      type: "chat.session.ended";
      conversation_id: string;
      message_count: number;
      duration_ms: number;
      meta: BaseEventMeta;
    };

// ─── Profile Events ──────────────────────────────────────────
export type ProfileEvent =
  | {
      type: "profile.snapshot";
      snapshot: BucketedProfile;
      reason: "onboarding_complete" | "periodic" | "field_changed";
      meta: BaseEventMeta;
    }
  | {
      type: "profile.field.changed";
      field: string;
      /** Bei Freitext: nur Länge, nicht Inhalt */
      change_type: "set" | "unset" | "changed";
      meta: BaseEventMeta;
    };

// ─── System Events ───────────────────────────────────────────
export type SystemEvent =
  | {
      type: "system.consent.changed";
      purpose: ConsentPurpose;
      granted: boolean;
      consent_text_version: string;
      meta: BaseEventMeta;
    }
  | {
      type: "system.session.started";
      device_class: "mobile" | "tablet" | "desktop";
      language: string;
      referrer_domain: string | null; // nur Domain, nicht voller Pfad
      meta: BaseEventMeta;
    }
  | {
      type: "system.error";
      scope: string;
      code: string;
      message: string;
      meta: BaseEventMeta;
    };

// ─── Union aller Events ──────────────────────────────────────
export type AnalyticsEvent =
  | OnboardingEvent
  | InsightsEvent
  | ChatEvent
  | ProfileEvent
  | SystemEvent;

// ─── Helper: welche Consent-Purpose braucht welches Event? ───
// Bestimmt beim Enqueue, ob das Event persistiert oder verworfen wird.
export function requiredConsentFor(event: AnalyticsEvent): ConsentPurpose {
  const t = event.type;
  if (t.startsWith("chat.")) return "prompt_iteration";
  if (t.startsWith("profile.")) return "profile_tracking";
  // Alles andere fällt unter basic Analytics
  return "analytics";
}

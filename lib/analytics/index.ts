// ─────────────────────────────────────────────────────────────
// BeAFox Analytics — Public API
// ─────────────────────────────────────────────────────────────
// Barrel-Export für die gesamte Analytics-Surface.
// Import-Beispiel: `import { trackChatMessageSent } from "@/lib/analytics";`
// ─────────────────────────────────────────────────────────────

// Core
export { initAnalytics, refreshConsent, flush } from "./client";

// Types
export type {
  AnalyticsEvent,
  ConsentPurpose,
  ConsentState,
  ConsentRecord,
  BucketedProfile,
} from "./types";
export { CONSENT_TEXT_VERSION } from "./consent";
export {
  loadConsent,
  saveConsent,
  updateConsent,
  hasConsent,
  hasDecision,
  defaultConsentState,
} from "./consent";

// Trackers
export * from "./events/onboarding";
export * from "./events/chat";
export * from "./events/insights";
export * from "./events/system";

// Session utilities
export {
  getAnalyticsId,
  resetAnalyticsId,
  getSessionId,
  uuid,
} from "./session";

// Scrubber (auch für ad-hoc Einsätze exportiert)
export { scrubPII, detectPII, ageBucket, bucket } from "./scrubber";

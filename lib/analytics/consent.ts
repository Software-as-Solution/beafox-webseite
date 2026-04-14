// ─────────────────────────────────────────────────────────────
// BeAFox Analytics — Consent Management
// ─────────────────────────────────────────────────────────────
// DSGVO-konformes Consent-Handling mit vier unabhängigen Zwecken.
// Jede Zustimmung ist separat, freiwillig, widerrufbar, versioniert.
// Default: ALLE auf false (Opt-In, nicht Opt-Out).
// ─────────────────────────────────────────────────────────────

import type { ConsentPurpose, ConsentRecord, ConsentState } from "./types";

// CONSTANTS
const CONSENT_STORAGE_KEY = "beafox.consent";
/**
 * Version des Consent-Textes. Bei wesentlichen Änderungen am
 * Einwilligungstext MUSS diese Version hochgezogen werden — dann
 * erscheint der Consent-Banner erneut und der User muss neu zustimmen.
 */
export const CONSENT_TEXT_VERSION = "2026.04.14";

const ALL_PURPOSES: readonly ConsentPurpose[] = [
  "analytics",
  "prompt_iteration",
  "model_training",
  "profile_tracking",
] as const;

// ─── Default-State: alles nicht-erteilt ──────────────────────
function emptyRecord(): ConsentRecord {
  return {
    granted: false,
    granted_at: null,
    revoked_at: null,
    consent_text_version: CONSENT_TEXT_VERSION,
  };
}

export function defaultConsentState(): ConsentState {
  return {
    analytics: emptyRecord(),
    prompt_iteration: emptyRecord(),
    model_training: emptyRecord(),
    profile_tracking: emptyRecord(),
  };
}

// ─── Load / Save (localStorage) ──────────────────────────────
export function loadConsent(): ConsentState {
  if (typeof window === "undefined") return defaultConsentState();
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return defaultConsentState();
    const parsed = JSON.parse(raw) as Partial<ConsentState>;

    // Migration: fehlende Keys auffüllen
    const state = defaultConsentState();
    for (const purpose of ALL_PURPOSES) {
      if (parsed[purpose]) state[purpose] = parsed[purpose] as ConsentRecord;
    }

    // Wenn Text-Version veraltet: alle Einwilligungen invalidieren,
    // damit der User neu zustimmen muss.
    for (const purpose of ALL_PURPOSES) {
      if (state[purpose].consent_text_version !== CONSENT_TEXT_VERSION) {
        state[purpose] = emptyRecord();
      }
    }
    return state;
  } catch {
    return defaultConsentState();
  }
}

export function saveConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silent fail — Private Mode, Storage voll, etc.
  }
}

// ─── Update einer einzelnen Purpose ──────────────────────────
export function updateConsent(
  state: ConsentState,
  purpose: ConsentPurpose,
  granted: boolean,
): ConsentState {
  const now = new Date().toISOString();
  return {
    ...state,
    [purpose]: {
      granted,
      granted_at: granted ? now : state[purpose].granted_at,
      revoked_at: !granted ? now : null,
      consent_text_version: CONSENT_TEXT_VERSION,
    },
  };
}

// ─── Check ob ein Purpose aktiv ist ──────────────────────────
export function hasConsent(
  state: ConsentState,
  purpose: ConsentPurpose,
): boolean {
  const record = state[purpose];
  return record.granted && record.revoked_at === null;
}

// ─── Wurde jemals eine Entscheidung getroffen? ───────────────
// Relevant für den Consent-Banner: nur zeigen, wenn keine Entscheidung existiert.
export function hasDecision(state: ConsentState): boolean {
  return ALL_PURPOSES.some(
    (p) => state[p].granted_at !== null || state[p].revoked_at !== null,
  );
}

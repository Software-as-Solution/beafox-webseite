// ─── BEA PRESENCE ─────────────────────────────────────────
// State machine for Bea's "online" presence. Used by the chat header
// to make Bea feel like a real person with availability rhythms.

export type BeaPresenceState =
  | "arriving" // Initial state on chat mount: "Bea kommt gleich online..."
  | "online" // Default available
  | "thinking" // Pre-streaming, 500-2000ms
  | "typing" // Stream is in progress
  | "away" // No activity for IDLE_THRESHOLD_AWAY_MS
  | "sleeping" // No activity for IDLE_THRESHOLD_SLEEPING_MS
  | "returning"; // Brief transition from away/sleeping → online

// CONSTANTS
export const IDLE_THRESHOLD_AWAY_MS = 3 * 60 * 1000; // 3 min
export const IDLE_THRESHOLD_SLEEPING_MS = 10 * 60 * 1000; // 10 min
export const RETURNING_DURATION_MS = 1500;
export const ARRIVING_DURATION_MS = 3000;

export interface BeaPresenceContext {
  state: BeaPresenceState;
  /** Timestamp of last user activity. */
  lastActivity: number;
  /** Localized status text for the header. */
  statusText: string;
}

/**
 * Returns the i18n key fragment for a given presence state.
 * Used by the header to look up the translation.
 */
export function getPresenceStatusKey(state: BeaPresenceState): string {
  return `presence.${state}`;
}

/**
 * Returns whether the presence state represents an "available" Bea
 * (online or busy responding) vs. an "absent" Bea (away/sleeping).
 */
export function isPresenceAvailable(state: BeaPresenceState): boolean {
  return (
    state === "online" ||
    state === "thinking" ||
    state === "typing" ||
    state === "returning" ||
    state === "arriving"
  );
}

/**
 * Returns true if the user has been idle long enough that a returning
 * greeting would feel natural.
 */
export function shouldGreetReturning(idleMs: number): boolean {
  return idleMs >= 2 * 60 * 1000; // 2 min threshold (less strict than away)
}

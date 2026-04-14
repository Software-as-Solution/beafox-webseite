"use client";

// ─── useBeaPresence ───────────────────────────────────────
// Manages Bea's presence state (arriving → online → away → sleeping → returning).
// Fires whenever activity-dependency changes and updates the state machine.

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ARRIVING_DURATION_MS,
  IDLE_THRESHOLD_AWAY_MS,
  IDLE_THRESHOLD_SLEEPING_MS,
  RETURNING_DURATION_MS,
  type BeaPresenceState,
} from "@/lib/bea-ai/chat/beaPresence";

interface Options {
  /** Optional override (e.g. "thinking" / "typing" during streaming). */
  override?: BeaPresenceState | null;
}

interface UsePresenceReturn {
  state: BeaPresenceState;
  /** Notify the hook that the user is active (e.g. typed something). */
  bumpActivity: () => void;
  lastActivity: number;
}

/**
 * Manages Bea's perceived presence. Internal timers update the state
 * autonomously; external override (e.g. `"thinking"`) takes precedence.
 *
 * Lifecycle:
 *   - Mount: `arriving` for ARRIVING_DURATION_MS, then `online`
 *   - Idle ≥ AWAY_MS: `away`
 *   - Idle ≥ SLEEPING_MS: `sleeping`
 *   - Activity from away/sleeping: `returning` for RETURNING_DURATION_MS, then `online`
 */
export function useBeaPresence(options: Options = {}): UsePresenceReturn {
  const { override } = options;
  const [state, setState] = useState<BeaPresenceState>("arriving");
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const stateRef = useRef(state);
  stateRef.current = state;

  // Initial arrival → online
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (stateRef.current === "arriving") {
        setState("online");
      }
    }, ARRIVING_DURATION_MS);
    return () => window.clearTimeout(id);
  }, []);

  // Idle detection
  useEffect(() => {
    if (override) return; // override takes priority — no idle timer
    const awayTimer = window.setTimeout(() => {
      if (stateRef.current === "online") setState("away");
    }, IDLE_THRESHOLD_AWAY_MS);
    const sleepTimer = window.setTimeout(() => {
      if (stateRef.current === "online" || stateRef.current === "away") {
        setState("sleeping");
      }
    }, IDLE_THRESHOLD_SLEEPING_MS);
    return () => {
      window.clearTimeout(awayTimer);
      window.clearTimeout(sleepTimer);
    };
  }, [lastActivity, override]);

  // Override handling
  useEffect(() => {
    if (override) setState(override);
  }, [override]);

  const bumpActivity = useCallback(() => {
    const wasAbsent =
      stateRef.current === "away" || stateRef.current === "sleeping";
    setLastActivity(Date.now());
    if (wasAbsent) {
      setState("returning");
      window.setTimeout(() => {
        if (stateRef.current === "returning") setState("online");
      }, RETURNING_DURATION_MS);
    } else if (
      stateRef.current !== "thinking" &&
      stateRef.current !== "typing" &&
      stateRef.current !== "arriving"
    ) {
      setState("online");
    }
  }, []);

  return { state, bumpActivity, lastActivity };
}

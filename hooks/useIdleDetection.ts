"use client";

// ─── useIdleDetection ─────────────────────────────────────
// Triggers a callback after the user has been idle for a configurable
// duration. Resets every time the `activity` dependency changes.

import { useEffect, useRef } from "react";

interface Options {
  /** Idle threshold in milliseconds before `onIdle` fires. */
  thresholdMs: number;
  /** Callback invoked when the threshold is reached. */
  onIdle: () => void;
  /** When true, the timer is paused (e.g. when chat is streaming). */
  disabled?: boolean;
}

/**
 * Watches activity and fires `onIdle` after the threshold elapses
 * with no new activity. Pass any value as `activityDependency` —
 * incrementing it (or replacing it) resets the timer.
 *
 * The callback fires AT MOST ONCE per idle period. To re-arm,
 * trigger another activity event.
 */
export function useIdleDetection(
  activityDependency: unknown,
  options: Options,
): void {
  const { thresholdMs, onIdle, disabled = false } = options;
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    if (disabled) return;
    const id = window.setTimeout(() => {
      onIdleRef.current();
    }, thresholdMs);
    return () => window.clearTimeout(id);
  }, [activityDependency, thresholdMs, disabled]);
}

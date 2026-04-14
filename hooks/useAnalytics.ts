"use client";

// ─────────────────────────────────────────────────────────────
// useAnalytics — initialisiert Analytics einmalig beim App-Mount
// ─────────────────────────────────────────────────────────────
// Wird einmal im Root-Layout genutzt. Feuert beim ersten Mount
// ein `system.session.started`-Event.
// ─────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { initAnalytics, trackSessionStarted } from "@/lib/analytics";

export function useAnalytics(): void {
  useEffect(() => {
    initAnalytics();
    trackSessionStarted();
  }, []);
}

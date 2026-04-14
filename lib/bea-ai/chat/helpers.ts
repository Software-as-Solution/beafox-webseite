// ─── CHAT HELPERS ─────────────────────────────────────────
// Small pure utilities used across chat components.

/**
 * Cheap collision-resistant ID for client-side message IDs.
 * Not cryptographically secure — only used to differentiate messages.
 */
export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** Format a Date as HH:MM in German locale. */
export function fmtTime(d: Date): string {
  return d.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Returns a contextual encouragement label for the onboarding progress.
 * Used by the OnboardingProgress header — kept here so the chat
 * components can reuse it if needed.
 */
export function getOnboardingEncouragement(
  current: number,
  total: number,
): string {
  if (current === 0) return "Lass uns starten";
  const ratio = current / total;
  if (ratio < 0.25) return "Guter Start 🧡";
  if (ratio < 0.5) return "Du bist drin";
  if (ratio < 0.6) return "Halbzeit 🎉";
  if (ratio < 0.85) return "Über die Hälfte";
  if (ratio < 1) return "Fast geschafft 🎯";
  return "Fertig!";
}

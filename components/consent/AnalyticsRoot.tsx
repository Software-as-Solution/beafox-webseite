"use client";

// ─────────────────────────────────────────────────────────────
// AnalyticsRoot — Client-only wrapper for the root layout
// ─────────────────────────────────────────────────────────────
// Bootstraps the analytics system (via useAnalytics) and renders
// the unified cookie-/consent-banner. Mount this once in
// app/layout.tsx.
//
// Scope of the banner:
// - Covers cookie categories (Notwendig / Analyse / Marketing) and
//   Bea-internal consent purposes (analytics, profile_tracking).
// - Writes both the Bea consent store AND GA4 Consent Mode v2 +
//   the legacy `cookieConsent` localStorage key for backward-compat.
// - AI-specific purposes (prompt_iteration, model_training) are
//   handled separately via `BeaChatConsentGate` directly in the
//   Bea chat — NOT through this banner.
//
// Performance notes:
// - ConsentBanner is dynamically imported with ssr: false. It's
//   client-only (needs localStorage for consent state) AND it's
//   not critical for LCP, so lazy loading shaves kilobytes off
//   the initial payload.
// - The banner only renders for users without a prior decision.
//   Returning users pay zero runtime cost beyond the useAnalytics
//   hook initialization.
// ─────────────────────────────────────────────────────────────

import dynamic from "next/dynamic";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * Dynamically imported because:
 *   1. It uses browser-only APIs (localStorage, document, window)
 *   2. It's not LCP-critical — the banner enters ~600ms after mount
 *   3. Keeps the initial bundle smaller for pages that don't need it
 *
 * No `loading` fallback is specified because the banner itself
 * delays its entrance by BANNER_OPEN_DELAY_MS — a loading skeleton
 * would flash in during that window and look janky.
 */
const ConsentBanner = dynamic(() => import("./ConsentBanner"), {
  ssr: false,
});

export default function AnalyticsRoot() {
  // Initialize analytics tracking. This hook is gated internally by
  // the user's consent state — it will only fire events for purposes
  // the user has explicitly granted.
  useAnalytics();

  return <ConsentBanner />;
}

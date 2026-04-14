"use client";

// ─────────────────────────────────────────────────────────────
// AnalyticsRoot — Client-only wrapper for the root layout
// ─────────────────────────────────────────────────────────────
// Bootstraps the analytics system (via useAnalytics) and renders
// the first-visit consent banner. Mount this once in app/layout.tsx.
//
// Separation of concerns:
// - This is NOT the cookie banner for Google Analytics / Ahrefs —
//   those are handled by a separate CookieBanner component for
//   strictly technical third-party tags.
// - This banner is for Bea's internal consent purposes (analytics,
//   prompt iteration, model training, profile tracking).
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

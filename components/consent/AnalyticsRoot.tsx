"use client";

// ─────────────────────────────────────────────────────────────
// AnalyticsRoot — Client-Only-Wrapper fürs Root-Layout
// ─────────────────────────────────────────────────────────────
// Startet das Analytics-System und rendert den Consent-Banner.
// Muss in `app/layout.tsx` einmal gemounted werden.
// Der separate CookieBanner (für Google Analytics / Ahrefs) bleibt
// unverändert — das hier ist ein getrennter Zweck.
// ─────────────────────────────────────────────────────────────

import dynamic from "next/dynamic";
import { useAnalytics } from "@/hooks/useAnalytics";

// Lazy-load the banner, it's not critical for LCP
const ConsentBanner = dynamic(() => import("./ConsentBanner"), {
  ssr: false,
});

export default function AnalyticsRoot() {
  useAnalytics();
  return <ConsentBanner />;
}

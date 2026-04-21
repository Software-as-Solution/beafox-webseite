"use client";

// ─────────────────────────────────────────────────────────────
// ConditionalGlobals — Unterdrückt UX-Overlays auf Standalone-Pages
// ─────────────────────────────────────────────────────────────
// ScrollToTop und AnalyticsRoot (unser vereinigter Cookie-/Consent-
// Banner) sind Marketing-/Chrome-Elemente. Auf der Bea-AI-App-Page
// sollen sie NICHT erscheinen — der User soll das Gefühl haben,
// in einer eigenen App zu sein, nicht auf einer Website-Subpage.
//
// Hinweis: Der frühere separate `CookieBanner` wurde in den
// `ConsentBanner` (gerendert durch AnalyticsRoot) integriert, daher
// nur noch ein einziger Banner-Mount hier.
// ─────────────────────────────────────────────────────────────

import { usePathname } from "next/navigation";
import ScrollToTop from "@/components/ScrollToTop";
import AnalyticsRoot from "@/components/consent/AnalyticsRoot";

// CONSTANTS
const STANDALONE_PREFIXES = ["/bea-ai"] as const;

function isStandaloneRoute(pathname: string): boolean {
  return STANDALONE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function ConditionalGlobals() {
  const pathname = usePathname();
  const standalone = isStandaloneRoute(pathname);

  if (standalone) {
    // Nur Analytics-Bootstrap (ohne Banner-Visuals), keine Marketing-UI.
    return <AnalyticsRoot />;
  }

  return (
    <>
      <ScrollToTop />
      <AnalyticsRoot />
    </>
  );
}

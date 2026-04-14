"use client";

// ─────────────────────────────────────────────────────────────
// ConditionalGlobals — Unterdrückt UX-Overlays auf Standalone-Pages
// ─────────────────────────────────────────────────────────────
// ScrollToTop, CookieBanner und AnalyticsRoot (der BeAFox-spezifische
// Consent-Banner) sind Marketing-Elemente. Auf der Bea-AI-App-Page
// sollen sie NICHT erscheinen — der User soll das Gefühl haben,
// in einer eigenen App zu sein, nicht auf einer Website-Subpage.
//
// Wichtig: AnalyticsRoot bleibt aktiv, weil der Consent auf der
// Hauptseite erteilt worden sein sollte. Auf /bea-ai kein zweiter Banner.
// ─────────────────────────────────────────────────────────────

import { usePathname } from "next/navigation";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";
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
      <CookieBanner />
      <AnalyticsRoot />
    </>
  );
}

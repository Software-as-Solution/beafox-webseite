// ─────────────────────────────────────────────────────────────
// CookieBanner — Legacy-Reexport
// ─────────────────────────────────────────────────────────────
// Der ursprüngliche CookieBanner wurde in den vereinigten
// ConsentBanner unter `components/consent/ConsentBanner.tsx`
// integriert. Diese Datei bleibt als Re-Export bestehen, damit
// alte Imports (`@/components/CookieBanner`) und die öffentliche
// `openCookieSettings()`-API weiterhin funktionieren — ohne
// doppelte Logik oder doppelten Banner-Mount.
//
// Bitte keine neue Logik hier hinzufügen. Neu-Entwicklungen
// direkt gegen `@/components/consent/ConsentBanner` bauen.
// ─────────────────────────────────────────────────────────────

export { default, openCookieSettings } from "@/components/consent/ConsentBanner";

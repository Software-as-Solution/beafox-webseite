// CONSTANTS

import { InlineBannerProps } from "@/components/InlineBanner";


/**
 * Banner Registry — definiert alle verfügbaren Inline-Banner.
 *
 * Strategie:
 * - Jeder Rechner kann 0-2 Banner zwischen Article-Sections zeigen
 * - Banner werden aus dieser Registry per Slug ausgewählt
 * - Banner können später durch Sanity ersetzt werden ohne Code-Änderungen
 *
 * Banner-Slots in der Article-Section (in Reihenfolge):
 * - position: "after-howItWorks"  → unter "So funktioniert der Rechner"
 * - position: "after-useCases"    → unter "Wann lohnt sich der Rechner"
 * - position: "after-tips"        → unter "Tipps & Hinweise"
 */

export type BannerPosition =
  | "after-howItWorks"
  | "after-useCases"
  | "after-tips";

export type BannerConfig = InlineBannerProps & {
  id: string;
};

// ─── BeAFox Eigene Produkte ───
export const BANNER_UNLIMITED: BannerConfig = {
  id: "beafox-unlimited",
  title: "Schon BeAFox Unlimited entdeckt?",
  description:
    "Voller Zugang zu allen Lernmodulen, Bea als persönlicher Finanzbegleiter und alle Premium-Features. Jederzeit kündbar.",
  ctaLabel: "Mehr erfahren",
  ctaHref: "/unlimited",
  variant: "primary",
};

export const BANNER_APP_DOWNLOAD: BannerConfig = {
  id: "beafox-app",
  title: "Bea begleitet dich in der App",
  description:
    "Spielerisch durch echte Finanzsituationen — vom ersten Gehalt bis zur Steuererklärung. Kostenlos für iOS und Android.",
  ctaLabel: "App kostenlos laden",
  ctaHref: "https://apps.apple.com/de/app/beafox/id6746110612",
  variant: "primary",
};

export const BANNER_RATGEBER_AZUBIS: BannerConfig = {
  id: "ratgeber-azubis",
  title: "Ratgeber für Azubis",
  description:
    "Vom ersten Gehalt bis zur eigenen Wohnung — alles was du als Azubi über Geld wissen musst.",
  ctaLabel: "Zu den Ratgebern",
  ctaHref: "/ratgeber/finanzen-fuer-azubis",
  variant: "subtle",
};

export const BANNER_RATGEBER_STUDENTEN: BannerConfig = {
  id: "ratgeber-studenten",
  title: "Ratgeber für Studenten",
  description:
    "BAföG, Werkstudentenjob, WG-Kosten und die erste Steuererklärung — kompakt erklärt für dein Studium.",
  ctaLabel: "Zu den Ratgebern",
  ctaHref: "/ratgeber/finanzen-fuer-studenten",
  variant: "subtle",
};

export const BANNER_RATGEBER_INVESTIEREN: BannerConfig = {
  id: "ratgeber-investieren",
  title: "Erste Schritte beim Investieren",
  description:
    "ETFs, Sparpläne und worauf du wirklich achten solltest — neutral und ohne Verkaufsabsicht.",
  ctaLabel: "Investieren lernen",
  ctaHref: "/ratgeber/investieren-fuer-anfaenger",
  variant: "subtle",
};

export const BANNER_SCHULEN: BannerConfig = {
  id: "beafox-schulen",
  title: "Du bist Lehrkraft?",
  description:
    "Bea bringt Finanzbildung in deinen Unterricht — spielerisch, ohne Vorbereitung, mit Live-Dashboard für deine Klasse.",
  ctaLabel: "Für Schulen",
  ctaHref: "/schulen",
  variant: "subtle",
};

export const BANNER_BUSINESS: BannerConfig = {
  id: "beafox-business",
  title: "Du bildest Azubis aus?",
  description:
    "Finanzbildung als Recruiting-Vorteil und Schuldenprävention für deine Auszubildenden — schon ab 125€ pro Azubi.",
  ctaLabel: "Für Unternehmen",
  ctaHref: "/unternehmen",
  variant: "subtle",
};

// ─── Banner-Mapping pro Rechner ───
/**
 * Definiert welche Banner auf welchem Rechner an welcher Position angezeigt werden.
 *
 * Beispiel: Brutto-Netto-Rechner zeigt nach "How it works" das Unlimited-Banner
 * und nach "Use Cases" das Azubi-Ratgeber Banner.
 */
export const CALCULATOR_BANNERS: Record<
  string,
  Partial<Record<BannerPosition, BannerConfig>>
> = {
  // GEHALT & ARBEIT
  "brutto-netto-rechner": {
    "after-howItWorks": BANNER_UNLIMITED,
    "after-tips": BANNER_RATGEBER_AZUBIS,
  },
  "stundenlohn-rechner": {
    "after-howItWorks": BANNER_UNLIMITED,
    "after-tips": BANNER_BUSINESS,
  },
  "gehaltserhoehung-rechner": {
    "after-useCases": BANNER_UNLIMITED,
  },

  // SPAREN & BUDGET
  "sparplan-rechner": {
    "after-howItWorks": BANNER_RATGEBER_INVESTIEREN,
    "after-tips": BANNER_APP_DOWNLOAD,
  },
  "budget-rechner": {
    "after-howItWorks": BANNER_APP_DOWNLOAD,
    "after-useCases": BANNER_RATGEBER_AZUBIS,
  },
  "inflations-rechner": {
    "after-howItWorks": BANNER_RATGEBER_INVESTIEREN,
  },
  "taschengeld-rechner": {
    "after-useCases": BANNER_RATGEBER_AZUBIS,
  },

  // INVESTIEREN
  "zinseszins-rechner": {
    "after-howItWorks": BANNER_RATGEBER_INVESTIEREN,
    "after-tips": BANNER_APP_DOWNLOAD,
  },
  "etf-sparplan-rechner": {
    "after-howItWorks": BANNER_RATGEBER_INVESTIEREN,
    "after-useCases": BANNER_UNLIMITED,
  },

  // ALLTAG & LIFESTYLE
  "miet-rechner": {
    "after-howItWorks": BANNER_RATGEBER_STUDENTEN,
    "after-tips": BANNER_APP_DOWNLOAD,
  },
  "auto-kosten-rechner": {
    "after-useCases": BANNER_APP_DOWNLOAD,
  },

  // STUDENTEN
  "bafoeg-rechner": {
    "after-howItWorks": BANNER_RATGEBER_STUDENTEN,
    "after-tips": BANNER_UNLIMITED,
  },
  "werkstudent-rechner": {
    "after-howItWorks": BANNER_RATGEBER_STUDENTEN,
  },

  // SCHULE
  "noten-rechner": {
    "after-useCases": BANNER_SCHULEN,
  },
};

/**
 * Helper: Banner für einen bestimmten Slug an einer Position abrufen.
 * Gibt undefined zurück wenn kein Banner definiert ist.
 */
export function getBannerForCalculator(
  slug: string,
  position: BannerPosition,
): BannerConfig | undefined {
  return CALCULATOR_BANNERS[slug]?.[position];
}

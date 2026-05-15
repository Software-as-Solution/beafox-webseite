// CONSTANTS
export const BLOG_CATEGORIES = [
  {
    slug: "azubis",
    navLabel: "Azubis",
    title: "Finanzen fuer Azubis",
    description:
      "Erstes Gehalt, Gehaltsabrechnung, VWL - alles was du als Azubi wissen musst.",
    metaTitle: "Finanzen fuer Azubis - Erstes Gehalt & mehr | BeAFox",
    metaDescription:
      "Finanztipps fuer Azubis: Gehaltsabrechnung verstehen, VWL nutzen, richtig sparen. Schritt-fuer-Schritt Ratgeber von BeAFox.",
    emoji: "🔧",
  },
  {
    slug: "schueler",
    navLabel: "Schüler",
    title: "Finanzen fuer Schueler",
    description:
      "Taschengeld, erstes Konto, Nebenjob - so wirst du als Schueler finanziell fit.",
    metaTitle: "Finanzen fuer Schueler - Tipps & Ratgeber | BeAFox",
    metaDescription:
      "Finanzbildung fuer Schueler: Taschengeld einteilen, erstes Girokonto, Nebenjob und Steuern. Praktische Ratgeber von BeAFox.",
    emoji: "🎒",
  },
  {
    slug: "studenten",
    navLabel: "Studenten",
    title: "Finanzen fuer Studenten",
    description:
      "BAfoeG, Studienkredit, Werkstudent - finanziell durch das Studium kommen.",
    metaTitle: "Finanzen fuer Studenten - BAfoeG, Sparen & mehr | BeAFox",
    metaDescription:
      "Finanz-Ratgeber fuer Studierende: BAfoeG beantragen, als Werkstudent Steuern sparen, Studienkredit Vor- und Nachteile.",
    emoji: "🎓",
  },
  {
    slug: "berufseinsteiger",
    navLabel: "Berufseinsteiger",
    title: "Finanzen fuer Berufseinsteiger",
    description:
      "Steuererklaerung, Gehaltsverhandlung, Versicherungen - dein Start ins Berufsleben.",
    metaTitle: "Finanzen fuer Berufseinsteiger - Ratgeber & Tipps | BeAFox",
    metaDescription:
      "Erste Steuererklaerung, Gehaltsverhandlung, Versicherungs-Check: Praktische Finanz-Ratgeber fuer den Berufsstart.",
    emoji: "💼",
  },
  {
    slug: "lebenssituation",
    navLabel: "Lebenssituationen",
    title: "Finanzen bei Lebensereignissen",
    description:
      "Umzug, Heiraten, Eltern werden - was du finanziell beachten musst.",
    metaTitle: "Finanzen bei Lebensereignissen - Umzug, Hochzeit & mehr | BeAFox",
    metaDescription:
      "Erste eigene Wohnung, Zusammenziehen, Heiraten, Eltern werden: Was du finanziell beachten musst. Ratgeber von BeAFox.",
    emoji: "🏠",
  },
  {
    slug: "investieren",
    navLabel: "Investieren",
    title: "Investieren fuer Anfaenger",
    description:
      "ETF, Depot, Sparplan - so laesst du dein Geld fuer dich arbeiten.",
    metaTitle: "Investieren fuer Anfaenger - ETF, Depot & Sparplan | BeAFox",
    metaDescription:
      "Erster ETF kaufen, Depot eroeffnen, Sparplan einrichten: Investieren lernen ohne Fachchinesisch. Ratgeber von BeAFox.",
    emoji: "📈",
  },
] as const;
export const BLOG_CATEGORY_SLUGS = BLOG_CATEGORIES.map((c) => c.slug);

// TYPES
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type BlogCategorySlug = BlogCategory["slug"];

// HELPERS FUNCTIONS
/** Öffentliche URL für Ratgeber-Kategorie */
export function getRatgeberCategoryPath(categorySlug: string) {
  return `/${categorySlug}`;
}

/** Öffentliche URL für einen Guide (lebt unter /kategorie/slug) */
export function getGuidePostPath(categorySlug: string, postSlug: string) {
  return `/${categorySlug}/${postSlug}`;
}

export function getCategoryBySlug(slug: string) {
  return BLOG_CATEGORIES.find((category) => category.slug === slug);
}

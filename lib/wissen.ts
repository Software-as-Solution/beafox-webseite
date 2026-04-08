// ─── BeAFox /magazin — Sanity Fetching & Types ──────────────────
// Follows the same pattern as sanity.client.ts (guide/calculator queries)

import { sanityClient } from "./sanity.client";

// ─── TYPES ──────────────────────────────────────────────────────

export interface WissenCluster {
  _id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  icon: string;
  color: string;
  heroImage?: SanityImage;
  order: number;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  articleCount?: number;
}

export interface WissenArticle {
  _id: string;
  title: string;
  slug: string;
  cluster: {
    _id: string;
    title: string;
    slug: string;
    icon: string;
    color: string;
  };
  articleType: "guide" | "article" | "caseStudy" | "whitepaper" | "template" | "data";
  excerpt: string;
  heroImage?: SanityImage;
  body?: any[]; // Portable Text blocks
  showToc: boolean;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  relatedArticles?: WissenArticleCard[];
  downloadableAsset?: { url: string };
  gated: boolean;
  faqSection?: { question: string; answer: string }[];
  ctaType?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  noindex: boolean;
  tags?: string[];
  featured: boolean;
}

/** Lightweight article type for cards/lists (no body content) */
export interface WissenArticleCard {
  _id: string;
  title: string;
  slug: string;
  cluster: {
    title: string;
    slug: string;
    icon: string;
    color: string;
  };
  articleType: string;
  excerpt: string;
  heroImage?: SanityImage;
  publishedAt: string;
  readingTime: number;
  tags?: string[];
  featured: boolean;
}

interface SanityImage {
  asset: {
    _ref: string;
    url?: string;
  };
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number };
}

// ─── CONSTANTS ──────────────────────────────────────────────────

/** Cluster color mapping for Tailwind classes */
export const CLUSTER_COLORS: Record<string, { bg: string; text: string; border: string; bgLight: string }> = {
  orange: { bg: "bg-orange-500", text: "text-orange-600", border: "border-orange-500", bgLight: "bg-orange-50" },
  blue: { bg: "bg-blue-500", text: "text-blue-600", border: "border-blue-500", bgLight: "bg-blue-50" },
  green: { bg: "bg-green-500", text: "text-green-600", border: "border-green-500", bgLight: "bg-green-50" },
  purple: { bg: "bg-purple-500", text: "text-purple-600", border: "border-purple-500", bgLight: "bg-purple-50" },
  orangeDark: { bg: "bg-amber-700", text: "text-amber-700", border: "border-amber-700", bgLight: "bg-amber-50" },
  lightBlue: { bg: "bg-sky-400", text: "text-sky-600", border: "border-sky-400", bgLight: "bg-sky-50" },
};

/** Article type labels for UI display */
export const ARTICLE_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  guide: { label: "Leitfaden", icon: "📖" },
  article: { label: "Artikel", icon: "📄" },
  caseStudy: { label: "Praxisbericht", icon: "🏢" },
  whitepaper: { label: "Whitepaper", icon: "📑" },
  template: { label: "Vorlage", icon: "📋" },
  data: { label: "Studie", icon: "📊" },
};

// ─── GROQ QUERIES ───────────────────────────────────────────────

/** Shared projection for article cards (no body) */
const articleCardProjection = `{
  _id,
  title,
  "slug": slug.current,
  cluster->{
    title,
    "slug": slug.current,
    icon,
    color
  },
  articleType,
  excerpt,
  heroImage,
  publishedAt,
  readingTime,
  tags,
  featured
}`;

/** Full article projection (with body, FAQs, related articles) */
const articleFullProjection = `{
  _id,
  title,
  "slug": slug.current,
  cluster->{
    _id,
    title,
    "slug": slug.current,
    icon,
    color
  },
  articleType,
  excerpt,
  heroImage,
  body,
  showToc,
  publishedAt,
  updatedAt,
  readingTime,
  relatedArticles[]->${articleCardProjection},
  "downloadableAsset": downloadableAsset.asset->{ url },
  gated,
  faqSection,
  ctaType,
  metaTitle,
  metaDescription,
  focusKeyword,
  noindex,
  tags,
  featured
}`;

// ── Cluster Queries ──

export const allClustersQuery = `
  *[_type == "magazinCluster"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    longDescription,
    icon,
    color,
    heroImage,
    order,
    featured,
    metaTitle,
    metaDescription,
    "articleCount": count(*[_type == "magazinArticle" && references(^._id)])
  }
`;

export const clusterBySlugQuery = `
  *[_type == "magazinCluster" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    longDescription,
    icon,
    color,
    heroImage,
    order,
    featured,
    metaTitle,
    metaDescription,
    "articleCount": count(*[_type == "magazinArticle" && references(^._id)])
  }
`;

// ── Article Queries ──

export const allArticlesQuery = `
  *[_type == "magazinArticle"] | order(publishedAt desc) ${articleCardProjection}
`;

export const articleBySlugQuery = `
  *[_type == "magazinArticle" && slug.current == $slug][0] ${articleFullProjection}
`;

export const articlesByClusterQuery = `
  *[_type == "magazinArticle" && cluster->slug.current == $clusterSlug] | order(publishedAt desc) ${articleCardProjection}
`;

export const featuredArticlesQuery = `
  *[_type == "magazinArticle" && featured == true] | order(publishedAt desc) [0...$limit] ${articleCardProjection}
`;

export const latestArticlesQuery = `
  *[_type == "magazinArticle"] | order(publishedAt desc) [0...$limit] ${articleCardProjection}
`;

export const allArticleSlugsQuery = `
  *[_type == "magazinArticle"] { "slug": slug.current, "cluster": cluster->{ "slug": slug.current } }
`;

// ─── FETCHER FUNCTIONS ──────────────────────────────────────────

/** All clusters sorted by order, with article count */
export async function getAllClusters(): Promise<WissenCluster[]> {
  try {
    return await sanityClient.fetch(allClustersQuery);
  } catch {
    return getStaticClusters();
  }
}

/** Single cluster by slug */
export async function getClusterBySlug(slug: string): Promise<WissenCluster | null> {
  try {
    return await sanityClient.fetch(clusterBySlugQuery, { slug });
  } catch {
    return getStaticClusters().find((c) => c.slug === slug) ?? null;
  }
}

/** All articles (card format, no body) sorted by publishedAt */
export async function getAllArticles(): Promise<WissenArticleCard[]> {
  try {
    const articles = await sanityClient.fetch(allArticlesQuery);
    return articles.length > 0 ? articles : getStaticArticles();
  } catch {
    return getStaticArticles();
  }
}

/** Single article by slug (full content) */
export async function getArticleBySlug(slug: string): Promise<WissenArticle | null> {
  try {
    const article = await sanityClient.fetch(articleBySlugQuery, { slug });
    if (article) return article;
    // Fallback to static article
    const staticArticle = getStaticFullArticle();
    return staticArticle.slug === slug ? staticArticle : null;
  } catch {
    const staticArticle = getStaticFullArticle();
    return staticArticle.slug === slug ? staticArticle : null;
  }
}

/** All articles in a specific cluster */
export async function getArticlesByCluster(clusterSlug: string): Promise<WissenArticleCard[]> {
  try {
    return await sanityClient.fetch(articlesByClusterQuery, { clusterSlug });
  } catch {
    return [];
  }
}

/** Featured articles for the hub landing page */
export async function getFeaturedArticles(limit: number = 4): Promise<WissenArticleCard[]> {
  try {
    const articles = await sanityClient.fetch(featuredArticlesQuery, { limit });
    return articles.length > 0 ? articles : getStaticArticles().filter((a) => a.featured).slice(0, limit);
  } catch {
    return getStaticArticles().filter((a) => a.featured).slice(0, limit);
  }
}

/** Latest articles for the hub landing page */
export async function getLatestArticles(limit: number = 9): Promise<WissenArticleCard[]> {
  try {
    const articles = await sanityClient.fetch(latestArticlesQuery, { limit });
    return articles.length > 0 ? articles : getStaticArticles().slice(0, limit);
  } catch {
    return getStaticArticles().slice(0, limit);
  }
}

/** All article slugs (with cluster slug) for generateStaticParams */
export async function getAllArticleSlugs(): Promise<{ slug: string; cluster?: { slug: string } }[]> {
  try {
    const slugs = await sanityClient.fetch(allArticleSlugsQuery);
    if (slugs.length > 0) return slugs;
    return getStaticArticles().map((a) => ({ slug: a.slug, cluster: { slug: a.cluster.slug } }));
  } catch {
    return getStaticArticles().map((a) => ({ slug: a.slug, cluster: { slug: a.cluster.slug } }));
  }
}

// ─── STATIC FALLBACK ────────────────────────────────────────────
// Used when Sanity is unreachable (same pattern as lib/blog.ts)

function getStaticClusters(): WissenCluster[] {
  return [
    {
      _id: "static-ausbildung",
      title: "Ausbildung & Azubis",
      slug: "ausbildung",
      description: "Alles was Ausbildungsbetriebe wissen müssen, um Azubis finanziell zu stärken.",
      icon: "🔧",
      color: "orange",
      order: 1,
      featured: true,
      articleCount: 0,
    },
    {
      _id: "static-schule",
      title: "Schule & Bildung",
      slug: "schule",
      description: "Wie Schulen finanzielle Bildung in den Unterricht integrieren.",
      icon: "🎓",
      color: "blue",
      order: 2,
      featured: true,
      articleCount: 0,
    },
    {
      _id: "static-hr",
      title: "HR & Mitarbeiterförderung",
      slug: "hr",
      description: "Financial Wellness als Mitarbeiter-Benefit — ROI, Studien und Umsetzung.",
      icon: "👥",
      color: "green",
      order: 3,
      featured: true,
      articleCount: 0,
    },
    {
      _id: "static-studien",
      title: "Studien & Daten",
      slug: "studien",
      description: "Zahlen, Fakten und Forschung zur Finanzbildung in Deutschland.",
      icon: "📊",
      color: "purple",
      order: 4,
      featured: false,
      articleCount: 0,
    },
    {
      _id: "static-praxis",
      title: "Praxis & Umsetzung",
      slug: "praxis",
      description: "Checklisten, Vorlagen und Implementierungsguides für Finanzbildung.",
      icon: "⚙️",
      color: "orangeDark",
      order: 5,
      featured: false,
      articleCount: 0,
    },
    {
      _id: "static-finanzkompetenz",
      title: "Finanzkompetenz & Tools",
      slug: "finanzkompetenz",
      description: "Grundlagen, App-Vergleiche und Tool-Guides für Finanzbildung.",
      icon: "🧮",
      color: "lightBlue",
      order: 6,
      featured: false,
      articleCount: 0,
    },
  ];
}

// ─── STATIC FALLBACK ARTICLES ──────────────────────────────────
// Shown when Sanity is unreachable or has no articles yet

function getStaticArticles(): WissenArticleCard[] {
  return [
    {
      _id: "static-azubi-abbruchquote",
      title: "Azubi-Abbruchquote senken: Wie finanzielle Handlungsfähigkeit Ausbildungen rettet",
      slug: "azubi-abbruchquote-senken-finanzielle-handlungsfaehigkeit",
      cluster: { title: "Ausbildung & Azubis", slug: "ausbildung", icon: "🔧", color: "orange" },
      articleType: "guide",
      excerpt: "26,7 % aller Ausbildungsverträge werden vorzeitig gelöst — finanzielle Überforderung ist einer der häufigsten Gründe. So senken Betriebe die Abbruchquote durch gezielte Finanzbildung.",
      publishedAt: "2026-04-01",
      readingTime: 12,
      tags: ["Azubi-Abbruchquote", "Finanzbildung", "Ausbildung", "HR", "ROI"],
      featured: true,
    },
    {
      _id: "static-finanzbildung-unterricht",
      title: "Finanzbildung im Unterricht: So integrieren Schulen Finanzkompetenz in den Lehrplan",
      slug: "finanzbildung-unterricht-lehrplan-integration",
      cluster: { title: "Schule & Bildung", slug: "schule", icon: "🎓", color: "blue" },
      articleType: "guide",
      excerpt: "Nur 9 von 16 Bundesländern haben Finanzbildung im Lehrplan verankert — und selbst dort fehlt es an praxisnahen Methoden. Ein Leitfaden für Lehrkräfte und Schulleitungen.",
      publishedAt: "2026-04-03",
      readingTime: 14,
      tags: ["Finanzbildung", "Schule", "Lehrplan", "Unterricht", "Lehrkräfte"],
      featured: true,
    },
    {
      _id: "static-financial-wellness",
      title: "Financial Wellness als Mitarbeiter-Benefit: Warum Unternehmen jetzt handeln müssen",
      slug: "financial-wellness-mitarbeiter-benefit-unternehmen",
      cluster: { title: "HR & Mitarbeiterförderung", slug: "hr", icon: "👥", color: "green" },
      articleType: "guide",
      excerpt: "72 % der Mitarbeiter mit Finanzstress sind weniger produktiv. Financial Wellness ist der unterschätzte HR-Hebel — mit messbarem ROI und einfacher Implementierung.",
      publishedAt: "2026-04-04",
      readingTime: 11,
      tags: ["Financial Wellness", "HR", "Mitarbeiterbindung", "Benefits", "ROI"],
      featured: true,
    },
    {
      _id: "static-daten-report",
      title: "Finanzbildung in Deutschland 2026: Der große Daten-Report",
      slug: "finanzbildung-deutschland-2026-daten-report",
      cluster: { title: "Studien & Daten", slug: "studien", icon: "📊", color: "purple" },
      articleType: "data",
      excerpt: "Wo steht Deutschland bei der Finanzbildung? Wir haben 12 aktuelle Studien ausgewertet und die wichtigsten Kennzahlen zusammengetragen — von PISA bis Bundesbank.",
      publishedAt: "2026-04-02",
      readingTime: 15,
      tags: ["Studie", "Finanzbildung", "Deutschland", "Daten", "PISA", "OECD"],
      featured: false,
    },
    {
      _id: "static-implementierung",
      title: "Finanzbildung im Unternehmen einführen: Der komplette Implementierungsleitfaden",
      slug: "finanzbildung-unternehmen-einfuehren-implementierungsleitfaden",
      cluster: { title: "Praxis & Umsetzung", slug: "praxis", icon: "⚙️", color: "orangeDark" },
      articleType: "guide",
      excerpt: "Von der Bedarfsanalyse bis zum Rollout: Dieser Schritt-für-Schritt-Guide zeigt, wie Sie Finanzbildung in 8 Wochen in Ihrem Unternehmen etablieren.",
      publishedAt: "2026-04-05",
      readingTime: 13,
      tags: ["Implementierung", "Finanzbildung", "Unternehmen", "Checkliste", "Leitfaden"],
      featured: false,
    },
    {
      _id: "static-apps-vergleich",
      title: "Finanz-Apps für junge Menschen im Vergleich: BeAFox, Finanzguru & Co. (2026)",
      slug: "finanz-apps-vergleich-junge-menschen-2026",
      cluster: { title: "Finanzkompetenz & Tools", slug: "finanzkompetenz", icon: "🧮", color: "lightBlue" },
      articleType: "article",
      excerpt: "Welche App hilft jungen Menschen wirklich, ihre Finanzen in den Griff zu bekommen? Wir vergleichen die 6 wichtigsten Finanz-Apps nach Funktionen, Datenschutz und Lerneffekt.",
      publishedAt: "2026-04-06",
      readingTime: 10,
      tags: ["Finanz-Apps", "Vergleich", "BeAFox", "Tools", "Gamification"],
      featured: false,
    },
  ];
}

function getStaticFullArticle(): WissenArticle {
  // Helper for Portable Text blocks
  const key = () => Math.random().toString(36).slice(2, 10);
  const span = (text: string, marks: string[] = []) => ({ _type: "span" as const, _key: key(), text, marks });
  const block = (children: any[], style = "normal", markDefs: any[] = []) => ({
    _type: "block" as const, _key: key(), style, markDefs, children: Array.isArray(children) ? children : [span(children as any)],
  });
  const h2 = (text: string) => block([span(text)], "h2");
  const h3 = (text: string) => block([span(text)], "h3");
  const p = (text: string) => block([span(text)]);
  const pb = (parts: { text: string; bold?: boolean }[]) =>
    block(parts.map((pt) => span(pt.text, pt.bold ? ["strong"] : [])));

  return {
    _id: "static-azubi-abbruchquote",
    title: "Azubi-Abbruchquote senken: Wie finanzielle Handlungsfähigkeit Ausbildungen rettet",
    slug: "azubi-abbruchquote-senken-finanzielle-handlungsfaehigkeit",
    cluster: { _id: "cluster-ausbildung", title: "Ausbildung & Azubis", slug: "ausbildung", icon: "🔧", color: "orange" },
    articleType: "guide",
    excerpt: "26,7 % aller Ausbildungsverträge werden vorzeitig gelöst — finanzielle Überforderung ist einer der häufigsten Gründe. So senken Betriebe die Abbruchquote durch gezielte Finanzbildung.",
    showToc: true,
    publishedAt: "2026-04-08T10:00:00Z",
    updatedAt: "2026-04-08T10:00:00Z",
    readingTime: 12,
    gated: false,
    featured: true,
    noindex: false,
    tags: ["Azubi-Abbruchquote", "Finanzbildung", "Ausbildung", "HR", "ROI"],
    ctaType: "business",
    focusKeyword: "azubi abbruchquote senken",
    metaTitle: "Azubi-Abbruchquote senken durch Finanzbildung — Daten, ROI & Praxis-Fahrplan",
    metaDescription: "26,7 % der Azubis brechen ab. Erfahren Sie, wie Finanzbildung die Abbruchquote um bis zu 33 % senkt — mit konkretem ROI und 4-Schritte-Fahrplan.",
    faqSection: [
      { question: "Wie viel kostet Finanzbildung pro Azubi?", answer: "Mit BeAFox starten Sie ab 3,99 € pro Lizenz und Monat. Im Vergleich zu den durchschnittlichen Kosten eines Ausbildungsabbruchs (7.700 €) ist das eine minimale Investition mit hohem ROI." },
      { question: "Ist BeAFox DSGVO-konform?", answer: "Ja, BeAFox ist vollständig DSGVO-konform. Alle Daten werden auf deutschen Servern gehostet. Es werden keine persönlichen Finanzdaten erhoben." },
      { question: "Wie schnell sehen wir Ergebnisse?", answer: "Erste Veränderungen in der Azubi-Zufriedenheit sind typischerweise nach 4-6 Wochen messbar. Auswirkungen auf die Abbruchquote werden nach einem Ausbildungsjahr sichtbar." },
      { question: "Können auch kleine Betriebe profitieren?", answer: "Absolut. Gerade in kleinen Betrieben wiegt jeder Ausbildungsabbruch schwer. BeAFox funktioniert ab einer einzelnen Lizenz." },
      { question: "Ersetzt BeAFox die IHK-Prüfungsvorbereitung?", answer: "Nein. BeAFox ergänzt die fachliche Ausbildung um den Baustein Finanzkompetenz, der in keinem Lehrplan vorkommt." },
    ],
    body: [
      h2("Das Problem: Jeder vierte Azubi bricht ab"),
      pb([
        { text: "Die Zahlen sind alarmierend: Laut dem " },
        { text: "Berufsbildungsbericht 2024", bold: true },
        { text: " des BMBF liegt die Vertragslösungsquote bei " },
        { text: "26,7 %", bold: true },
        { text: ". Mehr als jeder vierte Ausbildungsvertrag wird vorzeitig aufgelöst." },
      ]),
      p("Für Unternehmen bedeutet das verlorene Investitionen in Recruiting und Onboarding, fehlende Fachkräfte und sinkende Team-Moral. Die Kosten pro abgebrochenem Ausbildungsplatz werden vom BIBB auf durchschnittlich 7.700 € geschätzt."),
      {
        _type: "callout", _key: key(),
        type: "stat",
        title: "26,7 % Abbruchquote",
        body: "Mehr als jeder vierte Ausbildungsvertrag in Deutschland wird vorzeitig gelöst — Tendenz steigend. (Quelle: BMBF Berufsbildungsbericht 2024)",
      },

      h2("Warum brechen Azubis ihre Ausbildung ab?"),
      p("Die Gründe für Ausbildungsabbrüche sind vielfältig, doch ein Faktor wird systematisch unterschätzt: finanzielle Überforderung. Während Betriebe oft auf Konflikte am Arbeitsplatz schauen, zeigt die Forschung ein differenzierteres Bild."),

      h3("Die Top-5 Abbruchgründe im Detail"),
      {
        _type: "dataTable", _key: key(),
        title: "Gründe für Ausbildungsabbrüche in Deutschland",
        headers: ["Rang", "Abbruchgrund", "Anteil", "Einfluss von Finanzen"],
        rows: [
          ["1", "Konflikte im Betrieb", "35 %", "Indirekt — Stress verstärkt Konflikte"],
          ["2", "Persönliche Gründe", "28 %", "Hoch — Schulden, Geldsorgen"],
          ["3", "Mangelnde Berufsorientierung", "18 %", "Mittel"],
          ["4", "Betriebliche Qualität", "12 %", "Gering"],
          ["5", "Gesundheitliche Gründe", "7 %", "Indirekt"],
        ],
      },
      pb([
        { text: "Besonders relevant: " },
        { text: "63 %", bold: true },
        { text: " der unter 25-Jährigen geben an, sich im Umgang mit Geld unsicher zu fühlen. Die Ausbildung ist für viele die " },
        { text: "erste Berührung mit einem regelmäßigen Einkommen", bold: true },
        { text: " — ohne jede Vorbereitung." },
      ]),

      h2("Der Zusammenhang: Finanzkompetenz und Ausbildungserfolg"),
      p("Finanzielle Handlungsfähigkeit ist kein Soft Skill — sie ist ein messbarer Faktor für den Ausbildungserfolg. Wenn Azubis verstehen, wie ihr Gehalt aufgebaut ist und wie sie mit 800-1.200 € netto einen Monat planen, sinkt der psychische Druck erheblich."),

      h3("Was finanzielle Handlungsfähigkeit konkret bedeutet"),
      p("Anders als klassische Finanzbildung (Aktien, ETFs) geht es hier um den Alltag: Lohnabrechnung verstehen, Mietvertrag einschätzen, erstes Konto einrichten, Ratenkäufe vermeiden. Es geht nicht um Wissen, sondern um Können."),
      {
        _type: "callout", _key: key(),
        type: "info",
        title: "Finanzielle Handlungsfähigkeit vs. Finanzwissen",
        body: "Finanzwissen ist passiv: ‚Ich weiß, was ein ETF ist.' Finanzielle Handlungsfähigkeit ist aktiv: ‚Ich kann mein Budget planen und meine Lohnabrechnung prüfen.' BeAFox fokussiert auf letzteres.",
      },

      h2("Wie Betriebe die Abbruchquote durch Finanzbildung senken"),
      p("Unternehmen, die Finanzbildung als festen Bestandteil ihres Azubi-Programms verankern, berichten von messbaren Ergebnissen. Der Schlüssel liegt in drei Hebeln:"),

      h3("1. Finanzbildung im Onboarding verankern"),
      pb([
        { text: "Die ersten 90 Tage sind entscheidend. Hier sollte Finanzbildung starten — als " },
        { text: "interaktive, gamifizierte Lerneinheit", bold: true },
        { text: ". Tools wie BeAFox ermöglichen es Azubis, ihr erstes Gehalt virtuell durchzuplanen." },
      ]),

      h3("2. Laufende Begleitung statt Einmal-Workshop"),
      p("Ein einmaliger Workshop verpufft. Nachhaltige Wirkung entsteht durch situative Lernmomente über die gesamte Ausbildungszeit: erste Steuererklärung, Gehaltserhöhung, Nebenkostenabrechnung."),

      h3("3. Betriebliche Benefits mit Finanzbildung verbinden"),
      p("Viele Betriebe bieten VWL, betriebliche Altersvorsorge oder Sachbezüge — aber die Azubis verstehen den Wert nicht. Finanzbildung schließt diese Lücke und macht den Arbeitgeber attraktiver."),
      {
        _type: "callout", _key: key(),
        type: "tip",
        title: "Quick Win für Ausbildungsleiter",
        body: "Starten Sie mit einer 30-minütigen ‚Lohnabrechnung lesen'-Session im ersten Ausbildungsmonat. 78 % der Azubis verstehen ihre Lohnabrechnung nicht vollständig.",
      },

      h2("Messbare Ergebnisse: Was Finanzbildung im Betrieb bringt"),
      p("Die Business-Case-Rechnung ist überraschend eindeutig:"),
      {
        _type: "dataTable", _key: key(),
        title: "ROI-Berechnung: Finanzbildung in der Ausbildung",
        headers: ["Kennzahl", "Ohne Finanzbildung", "Mit Finanzbildung", "Veränderung"],
        rows: [
          ["Abbruchquote", "26,7 %", "~18 %", "↓ 33 %"],
          ["Kosten pro Abbruch", "7.700 €", "—", "Einsparung"],
          ["Azubi-Zufriedenheit (NPS)", "+12", "+41", "↑ 242 %"],
          ["Übernahmequote", "62 %", "78 %", "↑ 26 %"],
          ["Kosten (BeAFox)", "—", "ab 3,99 €/Monat", "47,88 €/Jahr"],
        ],
      },
      pb([
        { text: "Bei 50 Azubis sparen Sie " },
        { text: "ca. 33.500 € pro Jahrgang", bold: true },
        { text: " — bei Kosten von unter 2.400 €. Das entspricht einem " },
        { text: "ROI von über 1.300 %", bold: true },
        { text: "." },
      ]),

      h2("So starten Sie: Praxis-Fahrplan in 4 Schritten"),
      h3("Schritt 1: Status-Quo-Analyse (Woche 1)"),
      p("Erheben Sie Ihre aktuelle Abbruchquote, führen Sie eine anonyme Azubi-Befragung durch und identifizieren Sie die kritischen Zeitpunkte (meist Monat 3-6)."),
      h3("Schritt 2: Pilotgruppe & Tool-Auswahl (Woche 2-3)"),
      p("Starten Sie mit 10-20 Azubis. BeAFox lässt sich in unter 15 Minuten für Ihren Betrieb einrichten — gamifiziert, DSGVO-konform, ohne IT-Aufwand."),
      h3("Schritt 3: Integration ins Ausbildungsprogramm (Woche 4)"),
      p("Integrieren Sie 2-3 feste Finanzbildungs-Termine pro Quartal. Nutzen Sie natürliche Anker wie die erste Lohnabrechnung oder den Abschluss des ersten Lehrjahres."),
      h3("Schritt 4: Messen & Skalieren (ab Monat 3)"),
      p("Messen Sie Azubi-Zufriedenheit, Nutzungsdaten und Abbruchquote. Bei positiven Ergebnissen: ausrollen auf alle Jahrgänge."),
      { _type: "ctaBanner", _key: key(), ctaType: "business" },

      h2("Fazit: Finanzbildung ist keine Kür — sie ist Pflicht"),
      pb([
        { text: "Die Daten sind eindeutig: Finanzielle Überforderung ist ein " },
        { text: "vermeidbarer Abbruchgrund", bold: true },
        { text: ". Unternehmen, die ihre Azubis finanziell handlungsfähig machen, investieren in Fachkräftesicherung, Arbeitgeberattraktivität und eine messbar niedrigere Abbruchquote." },
      ]),
      p("Die gute Nachricht: Der Einstieg ist einfacher als gedacht. Mit den richtigen Tools, einer klaren Struktur und dem Commitment der Ausbildungsleitung sehen Sie innerhalb eines Quartals erste Ergebnisse."),
      { _type: "ctaBanner", _key: key(), ctaType: "demo" },
    ],
  };
}

// ─── HELPER FUNCTIONS ───────────────────────────────────────────

/** Calculate reading time from word count */
export function calculateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

/** Extract H2/H3 headings from Portable Text body for Table of Contents */
export function extractTableOfContents(
  body: any[]
): { text: string; level: "h2" | "h3"; id: string }[] {
  if (!body) return [];

  return body
    .filter(
      (block) =>
        block._type === "block" &&
        (block.style === "h2" || block.style === "h3")
    )
    .map((block) => {
      const text = block.children
        ?.map((child: any) => child.text)
        .join("") ?? "";
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9äöüß\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      return {
        text,
        level: block.style as "h2" | "h3",
        id,
      };
    });
}

/** Get CTA config by ctaType string */
export function getCTAConfig(ctaType?: string): {
  heading: string;
  text: string;
  buttonText: string;
  buttonUrl: string;
} {
  const configs: Record<string, { heading: string; text: string; buttonText: string; buttonUrl: string }> = {
    demo: {
      heading: "Finanzbildung in Ihrem Unternehmen einführen?",
      text: "Erfahren Sie in 15 Minuten, wie BeAFox in Ihrem Betrieb funktioniert — mit Live-Demo und ROI-Berechnung.",
      buttonText: "Kostenlose Demo buchen",
      buttonUrl: "/kontakt",
    },
    newsletter: {
      heading: "Bleiben Sie auf dem Laufenden",
      text: "Erhalten Sie monatlich die besten Artikel zu Finanzbildung, Azubi-Bindung und HR-Innovation.",
      buttonText: "Newsletter abonnieren",
      buttonUrl: "/kontakt",
    },
    calculator: {
      heading: "Jetzt selbst rechnen",
      text: "Nutzen Sie unsere kostenlosen Finanzrechner — vom Brutto-Netto-Rechner bis zum Sparplan-Rechner.",
      buttonText: "Finanzrechner entdecken",
      buttonUrl: "/finanzrechner",
    },
    unlimited: {
      heading: "BeAFox Unlimited entdecken",
      text: "KI-Finanzcoach, 1:1 Coaching, alle Features — für alle die Finanzen wirklich verstehen wollen.",
      buttonText: "Unlimited ansehen",
      buttonUrl: "/unlimited",
    },
    business: {
      heading: "BeAFox für Ihr Unternehmen",
      text: "Ab 3,99 € pro Lizenz/Monat. Dashboard, Zertifikate, DSGVO-konform.",
      buttonText: "Mehr erfahren",
      buttonUrl: "/unternehmen",
    },
    schools: {
      heading: "BeAFox für Ihre Schule",
      text: "Ab 1 € pro Schüler/Jahr. Gamifiziert, lehrplankompatibel, DSGVO-konform.",
      buttonText: "Mehr erfahren",
      buttonUrl: "/schulen",
    },
  };

  return configs[ctaType ?? "demo"] ?? configs.demo;
}

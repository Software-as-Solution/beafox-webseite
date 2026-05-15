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
    return [];
  }
}

/** Single cluster by slug */
export async function getClusterBySlug(slug: string): Promise<WissenCluster | null> {
  try {
    return await sanityClient.fetch(clusterBySlugQuery, { slug });
  } catch {
    return null;
  }
}

/** All articles (card format, no body) sorted by publishedAt */
export async function getAllArticles(): Promise<WissenArticleCard[]> {
  try {
    return await sanityClient.fetch(allArticlesQuery);
  } catch {
    return [];
  }
}

/** Single article by slug (full content) */
export async function getArticleBySlug(slug: string): Promise<WissenArticle | null> {
  try {
    return (await sanityClient.fetch(articleBySlugQuery, { slug })) ?? null;
  } catch {
    return null;
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
    return await sanityClient.fetch(featuredArticlesQuery, { limit });
  } catch {
    return [];
  }
}

/** Latest articles for the hub landing page */
export async function getLatestArticles(limit: number = 9): Promise<WissenArticleCard[]> {
  try {
    return await sanityClient.fetch(latestArticlesQuery, { limit });
  } catch {
    return [];
  }
}

/** All article slugs (with cluster slug) for generateStaticParams */
export async function getAllArticleSlugs(): Promise<{ slug: string; cluster?: { slug: string } }[]> {
  try {
    return await sanityClient.fetch(allArticleSlugsQuery);
  } catch {
    return [];
  }
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

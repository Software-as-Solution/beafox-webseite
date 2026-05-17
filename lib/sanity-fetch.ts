/**
 * Client-side Sanity fetcher — works without next-sanity dependency.
 * Uses Sanity's CDN API directly via fetch().
 */

const PROJECT_ID = "gnyg0xwn";
const DATASET = "production";
const API_VERSION = "2024-01-01";
const CDN_BASE = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}`;

export interface SanityGuide {
  _id: string;
  title: string;
  slug: string;
  category: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt: string;
  readingTime: number;
  tags: string[];
  publishedAt: string;
  steps: { title: string; description: string }[];
  body?: PortableTextBlock[];
}

export interface PortableTextBlock {
  _type: string;
  _key: string;
  style?: string;
  listItem?: "bullet" | "number";
  level?: number;
  children?: { _type: string; text: string; marks?: string[] }[];
  markDefs?: any[];
}

async function sanityFetch<T>(query: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(CDN_BASE);
  url.searchParams.set("query", query);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(`$${key}`, `"${value}"`);
    }
  }

  // `no-store`: kein Browser-HTTP-Cache. Sonst kann ein vor einer
  // Inhaltsänderung gecachtes (leeres) Ergebnis hängen bleiben — z. B.
  // direkt nach einem Sanity-Import.
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status}`);
  const data = await res.json();
  return data.result;
}

/** Single guide by category + slug (full content) */
export async function fetchSanityGuide(
  category: string,
  slug: string
): Promise<SanityGuide | null> {
  const query = `*[_type == "guide" && category == $category && slug.current == $slug][0]{
    _id, title, "slug": slug.current, category, metaTitle, metaDescription,
    excerpt, readingTime, tags, publishedAt,
    steps[]{ title, description }, body
  }`;
  return sanityFetch<SanityGuide | null>(query, { category, slug });
}

/** All guides for a given category */
export async function fetchSanityGuidesByCategory(
  category: string
): Promise<SanityGuide[]> {
  const query = `*[_type == "guide" && category == $category] | order(publishedAt desc) {
    _id, title, "slug": slug.current, category, excerpt,
    readingTime, tags, publishedAt, steps[]{ title, description }
  }`;
  return sanityFetch<SanityGuide[]>(query, { category });
}

/** All guides across all categories */
export async function fetchAllSanityGuides(): Promise<SanityGuide[]> {
  const query = `*[_type == "guide"] | order(publishedAt desc) {
    _id, title, "slug": slug.current, category, excerpt,
    readingTime, tags, publishedAt
  }`;
  return sanityFetch<SanityGuide[]>(query);
}

// ─── UNIFIED COMPACT GUIDE FORMAT ────────────────────────────────────────────
// The full structure rendered on a single guide page:
// Einstieg → 4 Kapitel (Text + 1 interaktives Element + Frag-Bea-Frage)
// → Frag-Bea-Block → FAQ. Mirrors the Sanity `guide` document schema.

export type GuideInteractive =
  | {
      _type: "inlineQuiz";
      question: string;
      options: { label: string; correct?: boolean }[];
      explanation: string;
    }
  | {
      _type: "matchPairs";
      title: string;
      instruction?: string;
      pairs: { left: string; right: string }[];
    }
  | {
      _type: "inputCalc";
      question: string;
      hint?: string;
      answer: number;
      tolerance?: number;
      suffix?: string;
    }
  | {
      _type: "miniChecklist";
      title: string;
      items: { label: string; hint?: string }[];
    }
  | {
      _type: "estimateSlider";
      question: string;
      min: number;
      max: number;
      step?: number;
      correctValue: number;
      unit?: string;
      explanation: string;
    }
  | {
      _type: "rankingExercise";
      title: string;
      instruction?: string;
      items: { label: string }[];
      explanation?: string;
    }
  | {
      _type: "thisOrThat";
      question: string;
      optionA: { label: string; description?: string };
      optionB: { label: string; description?: string };
      correct: "a" | "b";
      explanation: string;
    }
  | {
      _type: "didYouKnow";
      teaser: string;
      fact: string;
    };

export type GuideVisual =
  | {
      _type: "costBarChart";
      heading: string;
      bars: {
        label: string;
        value: number;
        suffix?: string;
        highlight?: boolean;
      }[];
    }
  | {
      _type: "timeline";
      heading?: string;
      steps: { label: string; detail?: string }[];
    }
  | {
      _type: "statHighlight";
      heading?: string;
      stats: { value: string; label: string }[];
    }
  | {
      _type: "figureImage";
      src: string;
      alt: string;
      caption?: string;
    };

export interface GuideChapter {
  heading: string;
  body: PortableTextBlock[];
  beaPrompt: string;
  interactive: GuideInteractive | null;
  visual: GuideVisual | null;
  callout: { kind: "info" | "tip"; text: string } | null;
}

export interface GuideFaqItem {
  question: string;
  answer: string;
}

export interface GuideAuthor {
  name: string;
  role: string;
  credentials?: string;
  bio: string;
}

export interface GuideComparisonTable {
  heading: string;
  columns: string[];
  rows: { cells: string[] }[];
}

export interface GuideSummaryBox {
  heading: string;
  points: string[];
}

/** Abschluss-Block: jeder Ratgeber hat genau einen — Tabelle oder Zusammenfassung. */
export type GuideSummary =
  | ({ _type: "comparisonTable" } & GuideComparisonTable)
  | ({ _type: "summaryBox" } & GuideSummaryBox);

export interface GuideSource {
  label: string;
  url: string;
}

export interface GuideFull {
  _id: string;
  title: string;
  slug: string;
  category: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt: string;
  readingTime: number;
  tags: string[];
  publishedAt: string;
  author: GuideAuthor | null;
  quickAnswer: string;
  chapters: GuideChapter[];
  summary: GuideSummary | null;
  beaBlock: { intro: string; questions: string[] };
  faq: GuideFaqItem[];
  sources: GuideSource[];
}

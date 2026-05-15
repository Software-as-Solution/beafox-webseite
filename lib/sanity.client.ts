import { createClient } from "next-sanity";
import { type GuideFull } from "./sanity-fetch";

export const sanityClient = createClient({
  projectId: "gnyg0xwn",
  dataset: "production",
  apiVersion: "2024-01-01",
  // Set to false for production; true enables draft preview
  useCdn: process.env.NODE_ENV === "production",
});

// ─── GROQ Queries ────────────────────────────────────────────────

/** All guides for a given category, sorted by publishedAt */
export const guidesByCategoryQuery = `
  *[_type == "guide" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    excerpt,
    difficulty,
    readingTime,
    tags,
    publishedAt,
    steps[] { title, description }
  }
`;

/** Single guide by category + slug (full content) */
export const guideBySlugQuery = `
  *[_type == "guide" && category == $category && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    metaTitle,
    metaDescription,
    excerpt,
    difficulty,
    readingTime,
    tags,
    publishedAt,
    steps[] { title, description },
    body
  }
`;

/** All guides (for sitemap, hub pages, etc.) */
export const allGuidesQuery = `
  *[_type == "guide"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    excerpt,
    difficulty,
    readingTime,
    tags,
    publishedAt
  }
`;

/** Distinct categories that have at least one guide */
export const categoriesWithGuidesQuery = `
  array::unique(*[_type == "guide"].category)
`;

/** Schlanke Query für das Header-Mega-Menü — nur Titel, Slug, Kategorie */
export const guideNavTopicsQuery = `
  *[_type == "guide"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    category
  }
`;

// ─── Types ───────────────────────────────────────────────────────

export interface SanityGuide {
  _id: string;
  title: string;
  slug: string;
  category: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt: string;
  difficulty: "einsteiger" | "fortgeschritten";
  readingTime: number;
  tags: string[];
  publishedAt: string;
  steps: { title: string; description: string }[];
  body?: any[]; // Portable Text blocks
}

export interface SanityGuideNavTopic {
  title: string;
  slug: string;
  category: string;
}

// ─── Fetchers ────────────────────────────────────────────────────

export async function getGuidesByCategory(
  category: string,
): Promise<SanityGuide[]> {
  try {
    return await sanityClient.fetch(
      guidesByCategoryQuery,
      { category },
      { next: { revalidate: 3600 } },
    );
  } catch {
    return [];
  }
}

export async function getGuideBySlug(
  category: string,
  slug: string
): Promise<SanityGuide | null> {
  return sanityClient.fetch(guideBySlugQuery, { category, slug });
}

export async function getAllGuides(): Promise<SanityGuide[]> {
  try {
    return await sanityClient.fetch(
      allGuidesQuery,
      {},
      { next: { revalidate: 3600 } },
    );
  } catch {
    return [];
  }
}

/** Alle Guides als schlanke Nav-Einträge fürs Header-Mega-Menü. */
export async function getGuideNavTopics(): Promise<SanityGuideNavTopic[]> {
  try {
    return await sanityClient.fetch(
      guideNavTopicsQuery,
      {},
      { next: { revalidate: 3600 } },
    );
  } catch {
    return [];
  }
}

// ─── Guide Metadata (für generateMetadata, serverseitig) ─────────

/** Schlanke Query — nur die Felder, die der <head> braucht. */
export const guideMetaBySlugQuery = `
  *[_type == "guide" && category == $category && slug.current == $slug][0] {
    title,
    metaTitle,
    metaDescription,
    excerpt,
    "slug": slug.current,
    category,
    publishedAt
  }
`;

export interface SanityGuideMeta {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt: string;
  slug: string;
  category: string;
  publishedAt: string;
}

/** Holt die SEO-Metadaten eines Guides per Kategorie + Slug (serverseitig). */
export async function getGuideMeta(
  category: string,
  slug: string,
): Promise<SanityGuideMeta | null> {
  try {
    return await sanityClient.fetch(guideMetaBySlugQuery, { category, slug });
  } catch {
    return null;
  }
}

// ─── Guide (Vollinhalt, serverseitig für SSR) ────────────────────

/** Kompletter Ratgeber-Inhalt — serverseitig, damit Inhalt + JSON-LD
 *  im initialen HTML landen. ISR: stündlich revalidiert. */
export const guideFullQuery = `
  *[_type == "guide" && category == $category && slug.current == $slug][0] {
    _id, title, "slug": slug.current, category, metaTitle, metaDescription,
    excerpt, difficulty, readingTime, tags, publishedAt, quickAnswer,
    author->{ name, role, credentials, bio },
    chapters[]{
      heading, body, beaPrompt,
      "interactive": interactive[0],
      "visual": visual[0]{
        _type, heading,
        bars[]{ label, value, suffix, highlight },
        steps[]{ label, detail },
        stats[]{ value, label },
        "src": image.asset->url, alt, caption
      },
      callout{ kind, text }
    },
    "summary": summary[0]{ _type, heading, columns, rows[]{ cells }, points },
    beaBlock{ intro, questions },
    faq[]{ question, answer },
    sources[]{ label, url }
  }
`;

export async function getGuideFull(
  category: string,
  slug: string,
): Promise<GuideFull | null> {
  try {
    return await sanityClient.fetch(
      guideFullQuery,
      { category, slug },
      { next: { revalidate: 3600 } },
    );
  } catch {
    return null;
  }
}

// ─── Calculator Queries ─────────────────────────────────────────

/** Single calculator content by slug */
export const calculatorBySlugQuery = `
  *[_type == "calculator" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    categoryEmoji,
    metaTitle,
    metaDescription,
    focusKeyword,
    excerpt,
    intro,
    howItWorks[] { title, description },
    tips,
    useCases,
    faqs[] { question, answer }
  }
`;

/** All calculator slugs (for generateStaticParams) */
export const allCalculatorSlugsQuery = `
  *[_type == "calculator"] { "slug": slug.current }
`;

/** All calculators for listing page */
export const allCalculatorsQuery = `
  *[_type == "calculator"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    categoryEmoji,
    metaTitle,
    metaDescription,
    excerpt
  }
`;

// ─── Calculator Types ───────────────────────────────────────────

export interface SanityCalculatorContent {
  _id: string;
  title: string;
  slug: string;
  category: string;
  categoryEmoji: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword?: string;
  excerpt: string;
  intro: string[];
  howItWorks: { title: string; description: string }[];
  tips: string[];
  useCases: string[];
  faqs: { question: string; answer: string }[];
}

// ─── Calculator Fetchers ────────────────────────────────────────

export async function getCalculatorContent(
  slug: string
): Promise<SanityCalculatorContent | null> {
  try {
    return await sanityClient.fetch(calculatorBySlugQuery, { slug });
  } catch {
    // Graceful fallback — if Sanity is unreachable, page.tsx uses calculators.ts
    return null;
  }
}

export async function getAllCalculatorSlugs(): Promise<{ slug: string }[]> {
  try {
    return await sanityClient.fetch(allCalculatorSlugsQuery);
  } catch {
    return [];
  }
}

export async function getAllCalculatorContent(): Promise<
  SanityCalculatorContent[]
> {
  try {
    return await sanityClient.fetch(allCalculatorsQuery);
  } catch {
    return [];
  }
}

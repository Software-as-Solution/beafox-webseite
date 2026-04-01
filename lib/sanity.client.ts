import { createClient } from "next-sanity";

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

// ─── Fetchers ────────────────────────────────────────────────────

export async function getGuidesByCategory(
  category: string
): Promise<SanityGuide[]> {
  return sanityClient.fetch(guidesByCategoryQuery, { category });
}

export async function getGuideBySlug(
  category: string,
  slug: string
): Promise<SanityGuide | null> {
  return sanityClient.fetch(guideBySlugQuery, { category, slug });
}

export async function getAllGuides(): Promise<SanityGuide[]> {
  return sanityClient.fetch(allGuidesQuery);
}

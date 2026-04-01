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
  difficulty: "einsteiger" | "fortgeschritten";
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

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
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
    excerpt, difficulty, readingTime, tags, publishedAt,
    steps[]{ title, description }, body
  }`;
  return sanityFetch<SanityGuide | null>(query, { category, slug });
}

/** All guides for a given category */
export async function fetchSanityGuidesByCategory(
  category: string
): Promise<SanityGuide[]> {
  const query = `*[_type == "guide" && category == $category] | order(publishedAt desc) {
    _id, title, "slug": slug.current, category, excerpt, difficulty,
    readingTime, tags, publishedAt, steps[]{ title, description }
  }`;
  return sanityFetch<SanityGuide[]>(query, { category });
}

/** All guides across all categories */
export async function fetchAllSanityGuides(): Promise<SanityGuide[]> {
  const query = `*[_type == "guide"] | order(publishedAt desc) {
    _id, title, "slug": slug.current, category, excerpt, difficulty,
    readingTime, tags, publishedAt
  }`;
  return sanityFetch<SanityGuide[]>(query);
}

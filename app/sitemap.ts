import { MetadataRoute } from "next";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { CALCULATORS } from "@/lib/calculators";
import { getAllGuides } from "@/lib/sanity.client";
import { getAllArticles, getAllClusters } from "@/lib/wissen";

// CONSTANTS
const BASE_URL = "https://beafox.app";
const BUILD_TIME = new Date();

// Sitemap stündlich neu generieren, damit neue Sanity-Ratgeber schnell drin sind.
export const revalidate = 3600;
// TYPES
type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";
interface RouteConfig {
  priority: number;
  images?: string[];
  changefreq: ChangeFreq;
}

// Route definitions with priority, frequency, and optional images for rich results
const ROUTE_CONFIG: Record<string, RouteConfig> = {
  "": {
    priority: 1.0,
    changefreq: "weekly",
    images: ["/assets/og-image.webp", "/Maskottchen/Maskottchen-Hero.webp"],
  },
  "/unlimited": {
    priority: 0.95,
    changefreq: "monthly",
    images: ["/Maskottchen/Maskottchen-Unlimited.webp"],
  },
  "/unternehmen": {
    priority: 0.95,
    changefreq: "monthly",
    images: ["/Maskottchen/Maskottchen-Business.webp"],
  },
  "/schulen": {
    priority: 0.95,
    changefreq: "monthly",
    images: ["/Maskottchen/Maskottchen-School.webp"],
  },
  "/bildungshaus": {
    priority: 0.95,
    changefreq: "monthly",
    images: ["/Maskottchen/Maskottchen-VHS.webp"],
  },
  "/ueber-uns": {
    priority: 0.9,
    changefreq: "monthly",
    images: ["/Team/Team.webp", "/Maskottchen/Maskottchen-Friends.webp"],
  },
  "/faq": { priority: 0.8, changefreq: "monthly" },
  "/kontakt": { priority: 0.8, changefreq: "monthly" },
  "/magazin": { priority: 0.9, changefreq: "weekly" },
  "/ratgeber": { priority: 0.8, changefreq: "weekly" },
  "/news": { priority: 0.8, changefreq: "weekly" },
  "/presse": { priority: 0.7, changefreq: "monthly" },
  // /shop läuft ab 2026-04-21 extern auf shop.beafox.app (Shopify) — eigene Sitemap dort.
  "/updates": { priority: 0.7, changefreq: "weekly" },
  "/community-richtlinien": { priority: 0.6, changefreq: "yearly" },
  "/impressum": { priority: 0.3, changefreq: "yearly" },
  "/datenschutz": { priority: 0.3, changefreq: "yearly" },
  "/agb": { priority: 0.3, changefreq: "yearly" },
  "/widerrufsbelehrung": { priority: 0.3, changefreq: "yearly" },
  "/barrierefreiheit": { priority: 0.3, changefreq: "yearly" },
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = Object.entries(ROUTE_CONFIG).map(
    ([route, config]) => ({
      url: `${BASE_URL}${route}`,
      lastModified: BUILD_TIME,
      changeFrequency: config.changefreq,
      priority: config.priority,
      ...(config.images
        ? { images: config.images.map((img) => `${BASE_URL}${img}`) }
        : {}),
    }),
  );

  // Ratgeber category pages
  const categoryRoutes: MetadataRoute.Sitemap = BLOG_CATEGORIES.map(
    (category) => ({
      url: `${BASE_URL}/${category.slug}`,
      lastModified: BUILD_TIME,
      changeFrequency: "weekly",
      priority: 0.75,
    }),
  );

  // Individual guide pages — Sanity-driven (single source of truth)
  let guideRoutes: MetadataRoute.Sitemap = [];
  try {
    const guides = await getAllGuides();
    const seen = new Set<string>();
    guideRoutes = guides
      .filter((guide) => guide.slug && guide.category)
      .map((guide) => ({
        url: `${BASE_URL}/${guide.category}/${guide.slug}`,
        lastModified: guide.publishedAt
          ? new Date(guide.publishedAt)
          : BUILD_TIME,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }))
      // Dubletten im Sanity-Datensatz nicht doppelt in die Sitemap schreiben
      .filter((route) => {
        if (seen.has(route.url)) return false;
        seen.add(route.url);
        return true;
      });
  } catch {
    // Sanity unreachable — die restliche Sitemap wird trotzdem gebaut
  }

  // Finanzrechner index + individual calculator pages
  const calculatorRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/finanzrechner`,
      lastModified: BUILD_TIME,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...CALCULATORS.map((calc) => ({
      url: `${BASE_URL}/finanzrechner/${calc.slug}`,
      lastModified: BUILD_TIME,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // ── Wissen Artikel (hub is already in ROUTE_CONFIG) ──
  let wissenRoutes: MetadataRoute.Sitemap = [];

  try {
    const [clusters, articles] = await Promise.all([
      getAllClusters(),
      getAllArticles(),
    ]);

    // Cluster landing pages
    const clusterRoutes: MetadataRoute.Sitemap = clusters.map((cluster) => ({
      url: `${BASE_URL}/magazin/${cluster.slug}`,
      lastModified: BUILD_TIME,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Individual wissen articles
    const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${BASE_URL}/magazin/${article.cluster?.slug || "artikel"}/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

    wissenRoutes = [...wissenRoutes, ...clusterRoutes, ...articleRoutes];
  } catch {
    // If Sanity is unreachable, still include the hub page
  }

  return [...staticRoutes, ...categoryRoutes, ...guideRoutes, ...calculatorRoutes, ...wissenRoutes];
}

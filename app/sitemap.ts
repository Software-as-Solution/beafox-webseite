import { MetadataRoute } from "next";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/lib/blog";

// CONSTANTS
const BASE_URL = "https://beafox.app";
const BUILD_TIME = new Date();
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
    images: ["/assets/og-image.jpg", "/Maskottchen/Maskottchen-Hero.png"],
  },
  "/unlimited": {
    priority: 0.95,
    changefreq: "monthly",
    images: ["/Maskottchen/Maskottchen-Unlimited.png"],
  },
  "/unternehmen": {
    priority: 0.95,
    changefreq: "monthly",
    images: ["/Maskottchen/Maskottchen-Business.png"],
  },
  "/schulen": {
    priority: 0.95,
    changefreq: "monthly",
    images: ["/Maskottchen/Maskottchen-School.png"],
  },
  "/bildungshaus": {
    priority: 0.95,
    changefreq: "monthly",
    images: ["/Maskottchen/Maskottchen-VHS.png"],
  },
  "/ueber-uns": {
    priority: 0.9,
    changefreq: "monthly",
    images: ["/Team/Team.png", "/Maskottchen/Maskottchen-Friends.png"],
  },
  "/faq": { priority: 0.8, changefreq: "monthly" },
  "/kontakt": { priority: 0.8, changefreq: "monthly" },
  "/ratgeber": { priority: 0.8, changefreq: "weekly" },
  "/news": { priority: 0.8, changefreq: "weekly" },
  "/shop": { priority: 0.7, changefreq: "weekly" },
  "/updates": { priority: 0.7, changefreq: "weekly" },
  "/guidelines": { priority: 0.6, changefreq: "yearly" },
  "/impressum": { priority: 0.3, changefreq: "yearly" },
  "/datenschutz": { priority: 0.3, changefreq: "yearly" },
  "/agb": { priority: 0.3, changefreq: "yearly" },
};

export default function sitemap(): MetadataRoute.Sitemap {
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

  // Individual guide posts
  const guideRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/${post.categorySlug}/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...guideRoutes];
}

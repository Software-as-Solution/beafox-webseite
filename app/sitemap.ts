import { MetadataRoute } from "next";

// Build-Zeit für lastModified (statisch pro Build)
const buildTime = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://beafox.app";

  // Alle Seiten der Website
  const routes = [
    "",
    "/beafox-unlimited",
    "/fuer-unternehmen",
    "/fuer-schulen",
    "/fuer-clubs",
    "/preise",
    "/ueber-beafox",
    "/faq",
    "/kontakt",
    "/shop",
    "/blog",
    "/blog/updates",
    "/guidelines",
    "/impressum",
    "/datenschutz",
    "/agb",
  ];

  // Prioritäten und Änderungsfrequenzen definieren
  const priorityMap: Record<
    string,
    {
      priority: number;
      changefreq:
        | "always"
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly"
        | "yearly"
        | "never";
    }
  > = {
    "": { priority: 1.0, changefreq: "weekly" },
    "/beafox-unlimited": { priority: 0.95, changefreq: "monthly" },
    "/fuer-unternehmen": { priority: 0.95, changefreq: "monthly" },
    "/fuer-schulen": { priority: 0.95, changefreq: "monthly" },
    "/fuer-clubs": { priority: 0.95, changefreq: "monthly" },
    "/ueber-beafox": { priority: 0.9, changefreq: "monthly" },
    "/preise": { priority: 0.9, changefreq: "monthly" },
    "/faq": { priority: 0.8, changefreq: "monthly" },
    "/kontakt": { priority: 0.8, changefreq: "monthly" },
    "/blog": { priority: 0.8, changefreq: "weekly" },
    "/shop": { priority: 0.7, changefreq: "weekly" },
    "/blog/updates": { priority: 0.7, changefreq: "weekly" },
    "/guidelines": { priority: 0.6, changefreq: "yearly" },
    "/impressum": { priority: 0.3, changefreq: "yearly" },
    "/datenschutz": { priority: 0.3, changefreq: "yearly" },
    "/agb": { priority: 0.3, changefreq: "yearly" },
  };

  return routes.map((route) => {
    const config = priorityMap[route] || {
      priority: 0.5,
      changefreq: "monthly" as const,
    };

    return {
      url: `${baseUrl}${route}`,
      lastModified: buildTime,
      changeFrequency: config.changefreq,
      priority: config.priority,
    };
  });
}

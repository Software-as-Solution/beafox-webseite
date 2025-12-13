import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://beafox.app";

  // Alle Seiten der Website
  const routes = [
    "",
    "/ueber-beafox",
    "/preise",
    "/fuer-unternehmen",
    "/fuer-schulen",
    "/fuer-clubs",
    "/beafox-unlimited",
    "/shop",
    "/faq",
    "/kontakt",
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
    "/ueber-beafox": { priority: 0.9, changefreq: "monthly" },
    "/preise": { priority: 0.9, changefreq: "monthly" },
    "/fuer-unternehmen": { priority: 0.9, changefreq: "monthly" },
    "/fuer-schulen": { priority: 0.9, changefreq: "monthly" },
    "/fuer-clubs": { priority: 0.9, changefreq: "monthly" },
    "/beafox-unlimited": { priority: 0.9, changefreq: "monthly" },
    "/shop": { priority: 0.8, changefreq: "weekly" },
    "/faq": { priority: 0.8, changefreq: "monthly" },
    "/kontakt": { priority: 0.8, changefreq: "monthly" },
    "/blog": { priority: 0.8, changefreq: "weekly" },
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
      lastModified: new Date(),
      changeFrequency: config.changefreq,
      priority: config.priority,
    };
  });
}

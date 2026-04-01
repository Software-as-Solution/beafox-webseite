import { MetadataRoute } from "next";

const BASE_URL = "https://beafox.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/auth/",
          "/checkout/",
          "/shop/warenkorb",
          "/studio/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}

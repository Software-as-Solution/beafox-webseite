import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations("manifest");

  return {
    lang: "de",
    name: t("name"),
    start_url: "/",
    display: "standalone",
    theme_color: "#E87720",
    orientation: "portrait",
    short_name: t("shortName"),
    background_color: "#ffffff",
    description: t("description"),
    categories: ["finance", "education", "learning"],
    icons: [
      {
        purpose: "any",
        sizes: "192x192",
        type: "image/png",
        src: "/icon-192.png",
      },
      {
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
        src: "/icon-512.png",
      },
    ],
  };
}

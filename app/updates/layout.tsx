import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = "https://beafox.app";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("appUpdates");
  const title = t("meta.title");
  const description = t("meta.description");
  const url = `${BASE_URL}/app-updates`;

  return {
    title,
    description,
    openGraph: {
      url,
      description,
      type: "website",
      locale: "de_DE",
      siteName: "BeAFox",
      title: t("meta.ogTitle"),
      images: [
        {
          width: 1200,
          height: 630,
          alt: "BeAFox App-Updates — Neue Features und Verbesserungen",
          url: `${BASE_URL}/assets/og-image.jpg`,
        },
      ],
    },
    twitter: {
      description,
      creator: "@beafox_app",
      card: "summary_large_image",
      title: t("meta.ogTitle"),
      images: [`${BASE_URL}/assets/og-image.jpg`],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function UpdatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

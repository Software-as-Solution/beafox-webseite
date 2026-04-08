import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = "https://beafox.app";

// ISR: Revalidate news overview every hour
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("news");
  const title = t("meta.title");
  const description = t("meta.description");
  const url = `${BASE_URL}/news`;

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
          alt: "BeAFox News — Neuigkeiten zur Finanzbildungs-App",
          url: `${BASE_URL}/assets/og-image.webp`,
        },
      ],
    },
    twitter: {
      description,
      creator: "@beafox_app",
      card: "summary_large_image",
      title: t("meta.ogTitle"),
      images: [`${BASE_URL}/assets/og-image.webp`],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

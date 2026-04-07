import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = "https://beafox.app";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("shop");
  const title = t("meta.title");
  const description = t("meta.description");
  const ogImageAlt = t("meta.ogImageAlt");
  const keywords = (t.raw("meta.keywords") as string[]) ?? [];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/shop`,
      type: "website",
      siteName: "BeAFox",
      images: [
        {
          width: 1200,
          height: 630,
          url: `${BASE_URL}/assets/og-image.webp`,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      description,
      creator: "@beafox_app",
      card: "summary_large_image",
      title,
      images: [`${BASE_URL}/assets/og-image.webp`],
    },
    alternates: {
      canonical: `${BASE_URL}/shop`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = "https://beafox.app";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("eduplaces");
  const url = `${BASE_URL}/eduplaces`;
  const title = t("meta.title");
  const description = t("meta.description");
  const ogImageAlt = t("meta.ogImageAlt");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      description,
      type: "website",
      locale: "de_DE",
      siteName: "BeAFox",
      title: `${title} | BeAFox`,
      images: [
        {
          width: 1200,
          height: 630,
          url: `${BASE_URL}/assets/og-image.jpg`,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      description,
      creator: "@beafox_app",
      card: "summary_large_image",
      title: `${title} | BeAFox`,
      images: [`${BASE_URL}/assets/og-image.jpg`],
    },
  };
}

export default function EduplacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

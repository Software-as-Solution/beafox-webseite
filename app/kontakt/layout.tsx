import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = "https://beafox.app";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  const title = t("meta.title");
  const url = `${BASE_URL}/kontakt`;
  const description = t("meta.description");

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
          alt: t("meta.ogImageAlt"),
          url: `${BASE_URL}/assets/og-image.webp`,
        },
      ],
    },
    twitter: {
      description,
      creator: "@beafox_app",
      title: `${title} | BeAFox`,
      card: "summary_large_image",
      images: [`${BASE_URL}/assets/og-image.webp`],
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

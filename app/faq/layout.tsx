import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = "https://beafox.app";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("faq");
  const title = t("meta.title");
  const description = t("meta.description");
  const url = `${BASE_URL}/faq`;

  return {
    title,
    description,
    openGraph: {
      url,
      description,
      type: "website",
      locale: "de_DE",
      siteName: "BeAFox",
      title,
      images: [
        {
          width: 1200,
          height: 630,
          alt: "BeAFox FAQ — Häufig gestellte Fragen",
          url: `${BASE_URL}/assets/og-image.jpg`,
        },
      ],
    },
    twitter: {
      description,
      creator: "@beafox_app",
      card: "summary_large_image",
      title,
      images: [`${BASE_URL}/assets/og-image.jpg`],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

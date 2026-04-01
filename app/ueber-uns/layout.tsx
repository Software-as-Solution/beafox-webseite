import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = "https://beafox.app";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");

  const title = "Über uns";
  const description = t("meta.description");
  const url = `${BASE_URL}/ueber-uns`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | BeAFox`,
      description,
      url,
      siteName: "BeAFox",
      type: "website",
      locale: "de_DE",
      images: [
        {
          url: `${BASE_URL}/Team/Team.png`,
          width: 600,
          height: 450,
          alt: "Das BeAFox Team",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | BeAFox`,
      description,
      images: [`${BASE_URL}/Team/Team.png`],
      creator: "@beafox_app",
    },
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

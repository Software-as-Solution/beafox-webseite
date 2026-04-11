// IMPORTS
import type { Metadata } from "next";

// CONSTANTS
const BASE_URL = "https://beafox.app";

export async function generateMetadata(): Promise<Metadata> {
  // CONSTANTS
  const url = `${BASE_URL}/unternehmen`;
  const title = "Unternehmen – Finanzbildung für Azubis";
  const description =
    "Mit Bea spielen Ihre Azubis ihre Finanzen einfach durch. Spielerische App, Live-Dashboard, Workshops — ohne Aufwand für Ihr Team. Jetzt Demo anfordern.";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
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
          url: `${BASE_URL}/assets/og-image.webp`,
          alt: "BeAFox für Unternehmen — Finanzbildung für Azubis",
        },
        {
          width: 500,
          height: 500,
          url: `${BASE_URL}/Maskottchen/Maskottchen-Business.webp`,
          alt: "BeAFox Business-Maskottchen",
        },
      ],
    },
    twitter: {
      description,
      creator: "@beafox_app",
      card: "summary_large_image",
      title: `${title} | BeAFox`,
      images: [`${BASE_URL}/assets/og-image.webp`],
    },
  };
}

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

// IMPORTS
import type { Metadata } from "next";

const BASE_URL = "https://beafox.app";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${BASE_URL}/schulen`;
  const title = "Schulen – Jeder Schüler verdient eine Bea";
  const description =
    "Bea macht Schüler finanziell handlungsfähig. Spielerische App, Live-Dashboard für Lehrkräfte — ohne Vorbereitung, ohne Unterrichtsausfall. Jetzt Demo anfragen.";

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
          alt: "BeAFox für Schulen — Finanzbildung im Unterricht",
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

export default function SchoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

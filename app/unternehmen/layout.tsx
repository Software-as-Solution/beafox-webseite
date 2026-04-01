// IMPORTS
import type { Metadata } from "next";

// CONSTANTS
const BASE_URL = "https://beafox.app";

export async function generateMetadata(): Promise<Metadata> {
  // CONSTANTS
  const url = `${BASE_URL}/unternehmen`;
  const title = "Unternehmen – Finanzbildung für Azubis";
  const description =
    "Bea macht Ihre Azubis finanziell handlungsfähig. Spielerische App, Live-Dashboard, Workshops — ohne Aufwand für Ihr Team. Jetzt Demo anfordern.";

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
          url: `${BASE_URL}/assets/og-image-business.jpg`,
          alt: "BeAFox für Unternehmen — Finanzbildung für Azubis",
        },
      ],
    },
    twitter: {
      description,
      creator: "@beafox_app",
      card: "summary_large_image",
      title: `${title} | BeAFox`,
      images: [`${BASE_URL}/assets/og-image-business.jpg`],
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

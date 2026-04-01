// IMPORTS
import type { Metadata } from "next";

const BASE_URL = "https://beafox.app";

export async function generateMetadata(): Promise<Metadata> {
  // CONSTANTS
  const title = "Unlimited – Dein persönlicher Finanzbegleiter";
  const description =
    "Bea begleitet dich durch jede Finanzsituation. Vom ersten Gehalt bis zur Steuererklärung — spielerisch, unabhängig und in deinem Tempo. Jetzt kostenlos starten.";
  const url = `${BASE_URL}/unlimited`;

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
          url: `${BASE_URL}/assets/og-image.jpg`,
          alt: "BeAFox Unlimited — Finanzbildung für junge Menschen",
        },
      ],
    },
    twitter: {
      description,
      creator: "@beafox_app",
      title: `${title} | BeAFox`,
      card: "summary_large_image",
      images: [`${BASE_URL}/assets/og-image.jpg`],
    },
  };
}

export default function UnlimitedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

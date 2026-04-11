import type { Metadata } from "next";

const BASE_URL = "https://beafox.app";

export const metadata: Metadata = {
  title: "Bea AI — Deine KI-Companion | BeAFox",
  description:
    "Sprich mit Bea — deiner persönlichen KI-Companion für Finanzbildung. Kein trockenes Wissen, sondern echte Gespräche, die dich weiterbringen.",
  openGraph: {
    url: `${BASE_URL}/bea-ai`,
    title: "Bea AI — Deine KI-Companion | BeAFox",
    description:
      "Sprich mit Bea — deiner persönlichen KI-Companion für Finanzbildung.",
    type: "website",
    locale: "de_DE",
    siteName: "BeAFox",
    images: [
      {
        width: 1200,
        height: 630,
        alt: "Bea AI — KI-Companion von BeAFox",
        url: `${BASE_URL}/assets/og-image.webp`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bea AI — Deine KI-Companion | BeAFox",
    description:
      "Sprich mit Bea — deiner persönlichen KI-Companion für Finanzbildung.",
    creator: "@beafox_app",
    images: [`${BASE_URL}/assets/og-image.webp`],
  },
  alternates: {
    canonical: `${BASE_URL}/bea-ai`,
  },
};

export default function BeaAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

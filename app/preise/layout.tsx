import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preise",
  description:
    "Transparente Preise für BeAFox - Finde das passende Paket für Schulen, Unternehmen oder Privatpersonen. Flexible Lizenzen und individuelle Lösungen.",
  openGraph: {
    title: "BeAFox Preise - Transparente Preisgestaltung",
    description:
      "Finde das passende BeAFox Paket für Schulen, Unternehmen oder Privatpersonen. Flexible Lizenzen und individuelle Lösungen.",
    url: "https://beafox.app/preise",
  },
  alternates: {
    canonical: "https://beafox.app/preise",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

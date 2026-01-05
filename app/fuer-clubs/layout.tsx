import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BeAFox for Clubs – Finanzbildung für Vereine & Communities",
  description:
    "Finanzbildung für Vereine: BeAFox for Clubs bietet Finanzbildung für Sportvereine, Finanzbildung für Jugendvereine und Finanzbildung in Communities. Finanzwissen für mentale Stärke und bessere Leistung.",
  openGraph: {
    title: "BeAFox for Clubs – Finanzbildung für Vereine & Communities",
    description:
      "Ganzheitliche Förderung für Sportvereine. Finanzwissen für mentale Stärke und bessere Leistung auf dem Platz.",
    url: "https://beafox.app/fuer-clubs",
  },
  alternates: {
    canonical: "https://beafox.app/fuer-clubs",
  },
};

export default function ClubsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

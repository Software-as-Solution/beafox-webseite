import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BeAFox for Clubs – Finanzbildung für Vereine & Communities",
  description:
    "Finanzbildung für Sportvereine - BeAFox for Clubs unterstützt Vereine dabei, ihre Sportler ganzheitlich zu fördern. Finanzwissen für mentale Stärke.",
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

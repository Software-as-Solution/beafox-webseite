import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "BeAFox Community Guidelines - Unsere Richtlinien für respektvolles Verhalten, konstruktive Kommunikation und eine positive Lernumgebung.",
  openGraph: {
    title: "BeAFox Community Guidelines",
    description:
      "Unsere Richtlinien für respektvolles Verhalten und eine positive Lernumgebung.",
    url: "https://beafox.app/guidelines",
  },
  alternates: {
    canonical: "https://beafox.app/guidelines",
  },
};

export default function GuidelinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BeAFox for Schools – Finanzbildung für Schulen",
  description:
    "Finanzbildung für Schulen: Digitale Lernplattform für Finanzbildung im Schulunterricht. Finanzbildung Schüler, Finanzbildung im Lehrplan und Finanzbildung Schulunterricht – ideal für Lehrer und Schüler ab der 7. Klasse.",
  openGraph: {
    title: "BeAFox for Schools – Finanzbildung für Schulen",
    description:
      "Spielerische Finanzbildungs-Lösungen für Schulen. Ideal für Lehrer und Schüler ab der 7. Klasse.",
    url: "https://beafox.app/fuer-schulen",
  },
  alternates: {
    canonical: "https://beafox.app/fuer-schulen",
  },
};

export default function SchoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

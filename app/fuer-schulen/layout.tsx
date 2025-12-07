import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BeAFox for Schools",
  description:
    "Finanzbildung für Schulen - BeAFox for Schools bietet spielerische Lernmodule für den Unterricht. Ideal für Lehrer und Schüler ab der 7. Klasse.",
  openGraph: {
    title: "BeAFox for Schools - Finanzbildung für Schulen",
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


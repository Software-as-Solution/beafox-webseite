import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BeAFox for Business – Finanzbildung für Unternehmen & Azubis",
  description:
    "Finanzbildung für Unternehmen: BeAFox bietet Finanzbildung für Azubis, Finanzbildung in der Ausbildung und Finanztraining für Mitarbeiter. Digitale Finanzbildungsplattform für nachhaltige Mitarbeiterentwicklung.",
  openGraph: {
    title: "BeAFox for Business – Finanzbildung für Unternehmen & Azubis",
    description:
      "Maßgeschneiderte Finanzbildungs-Lösungen für Unternehmen. Steigern Sie die Finanzkompetenz Ihrer Mitarbeiter mit BeAFox.",
    url: "https://beafox.app/fuer-unternehmen",
  },
  alternates: {
    canonical: "https://beafox.app/fuer-unternehmen",
  },
};

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

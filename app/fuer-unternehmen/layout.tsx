import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BeAFox for Business – Finanzbildung für Unternehmen & Azubis",
  description:
    "Finanzbildung für Ihre Mitarbeiter - BeAFox for Business bietet maßgeschneiderte Lösungen für Unternehmen. Steigern Sie die Finanzkompetenz Ihrer Belegschaft.",
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

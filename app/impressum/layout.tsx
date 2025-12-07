import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Impressum der BeAFox UG (haftungsbeschränkt) - Rechtliche Angaben, Kontaktdaten und Registereintrag.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://beafox.app/impressum",
  },
};

export default function ImpressumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

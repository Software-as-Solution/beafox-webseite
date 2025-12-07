import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AGB - Allgemeine Geschäftsbedingungen",
  description:
    "Allgemeine Geschäftsbedingungen der BeAFox UG (haftungsbeschränkt) - Nutzungsbedingungen, Preise, Zahlung und rechtliche Bestimmungen.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://beafox.app/agb",
  },
};

export default function AGBLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

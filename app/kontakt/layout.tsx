import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktiere BeAFox - Wir sind für dich da! Nutze unser Kontaktformular oder vereinbare einen Termin. Antwortzeit unter 24 Stunden.",
  openGraph: {
    title: "Kontakt - BeAFox",
    description:
      "Kontaktiere BeAFox - Wir sind für dich da! Nutze unser Kontaktformular oder vereinbare einen Termin.",
    url: "https://beafox.app/kontakt",
  },
  alternates: {
    canonical: "https://beafox.app/kontakt",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

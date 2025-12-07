import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung der BeAFox UG (haftungsbeschränkt) - Informationen zur Datenverarbeitung, Cookies und Ihren Rechten gemäß DSGVO.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://beafox.app/datenschutz",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

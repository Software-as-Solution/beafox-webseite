import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BeAFox Unlimited – Vollzugang zur Finanzbildung-App",
  description:
    "Alle Lernmodule, Missionen und Features ohne Einschränkungen - BeAFox Unlimited bietet den vollen Zugang zu allen Premium-Inhalten der App.",
  openGraph: {
    title: "BeAFox Unlimited – Vollzugang zur Finanzbildung-App",
    description:
      "Voller Zugang zu allen Premium-Inhalten. Alle Lernmodule, Missionen und Features ohne Einschränkungen.",
    url: "https://beafox.app/beafox-unlimited",
  },
  alternates: {
    canonical: "https://beafox.app/beafox-unlimited",
  },
};

export default function UnlimitedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BeAFox Unlimited – Vollzugang zur Finanzbildung-App",
  description:
    "Lern-App für Finanzen: BeAFox Unlimited ist die Finanz-App für Finanzbildung. Finanzbildung App für alle, die Finanzwissen lernen wollen. Alle Lernmodule, Missionen und Features ohne Einschränkungen.",
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

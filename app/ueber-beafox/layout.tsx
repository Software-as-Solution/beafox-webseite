import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über BeAFox",
  description:
    "Erfahre mehr über BeAFox - unsere Mission, Werte und wie wir Finanzbildung für junge Menschen revolutionieren. Lerne unser Team und unsere Vision kennen.",
  openGraph: {
    title: "Über BeAFox - Unsere Mission & Vision",
    description:
      "Erfahre mehr über BeAFox - unsere Mission, Werte und wie wir Finanzbildung für junge Menschen revolutionieren.",
    url: "https://beafox.app/ueber-beafox",
  },
  alternates: {
    canonical: "https://beafox.app/ueber-beafox",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

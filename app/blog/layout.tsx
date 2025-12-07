import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "BeAFox Blog - Aktuelle Artikel, Updates und Neuigkeiten rund um Finanzbildung, unsere App und die BeAFox Community.",
  openGraph: {
    title: "BeAFox Blog - Artikel & Updates",
    description:
      "Aktuelle Artikel, Updates und Neuigkeiten rund um Finanzbildung und die BeAFox Community.",
    url: "https://beafox.app/blog",
  },
  alternates: {
    canonical: "https://beafox.app/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

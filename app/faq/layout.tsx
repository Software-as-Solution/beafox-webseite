import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Häufige Fragen",
  description:
    "Häufige Fragen zu BeAFox - Finde Antworten zu Preisen, Features, Nutzung, Schulen, Unternehmen und mehr. Alles was du über BeAFox wissen musst.",
  openGraph: {
    title: "FAQ - Häufige Fragen zu BeAFox",
    description:
      "Finde Antworten zu Preisen, Features, Nutzung, Schulen, Unternehmen und mehr.",
    url: "https://beafox.app/faq",
  },
  alternates: {
    canonical: "https://beafox.app/faq",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

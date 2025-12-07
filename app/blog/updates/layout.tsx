import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App Updates",
  description:
    "BeAFox App Updates - Alle neuen Features, Verbesserungen und Änderungen in der BeAFox App. Bleibe auf dem neuesten Stand.",
  openGraph: {
    title: "BeAFox App Updates - Neue Features & Verbesserungen",
    description:
      "Alle neuen Features, Verbesserungen und Änderungen in der BeAFox App.",
    url: "https://beafox.app/blog/updates",
  },
  alternates: {
    canonical: "https://beafox.app/blog/updates",
  },
};

export default function UpdatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

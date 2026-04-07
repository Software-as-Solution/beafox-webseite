import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guidelines");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: "https://beafox.app/community-richtlinien",
    },
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: "BeAFox",
      title: t("meta.title"),
      description: t("meta.description"),
      url: "https://beafox.app/community-richtlinien",
    },
    twitter: {
      card: "summary",
      title: t("meta.title"),
      description: t("meta.description"),
      creator: "@beafox_app",
    },
  };
}

export default function GuidelinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: "https://beafox.app/datenschutz",
    },
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: "BeAFox",
      title: t("meta.title"),
      description: t("meta.description"),
      url: "https://beafox.app/datenschutz",
    },
    twitter: {
      card: "summary",
      title: t("meta.title"),
      description: t("meta.description"),
      creator: "@beafox_app",
    },
  };
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

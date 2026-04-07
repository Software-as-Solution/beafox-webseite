import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("barrierefreiheit");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: "https://beafox.app/barrierefreiheit",
    },
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: "BeAFox",
      title: t("meta.title"),
      description: t("meta.description"),
      url: "https://beafox.app/barrierefreiheit",
    },
    twitter: {
      card: "summary",
      title: t("meta.title"),
      description: t("meta.description"),
      creator: "@beafox_app",
    },
  };
}

export default function BarrierefreiheitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

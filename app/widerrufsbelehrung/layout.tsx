import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("widerruf");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: "https://beafox.app/widerrufsbelehrung",
    },
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: "BeAFox",
      title: t("meta.title"),
      description: t("meta.description"),
      url: "https://beafox.app/widerrufsbelehrung",
    },
  };
}

export default function WiderrufLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

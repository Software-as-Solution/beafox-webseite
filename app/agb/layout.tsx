import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("agb");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: "https://beafox.app/agb",
    },
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: "BeAFox",
      title: t("meta.title"),
      url: "https://beafox.app/agb",
      description: t("meta.description"),
    },
  };
}

export default function AGBLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

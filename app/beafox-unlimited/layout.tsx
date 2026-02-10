import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("unlimited");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      url: "https://beafox.app/beafox-unlimited",
    },
    alternates: {
      canonical: "https://beafox.app/beafox-unlimited",
    },
  };
}

export default function UnlimitedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

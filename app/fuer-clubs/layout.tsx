import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("clubs");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      url: "https://beafox.app/fuer-clubs",
    },
    alternates: {
      canonical: "https://beafox.app/fuer-clubs",
    },
  };
}

export default function ClubsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("imprint");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: "https://beafox.app/impressum",
    },
  };
}

export default function ImpressumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

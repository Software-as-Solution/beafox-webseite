import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guidelines");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: "https://beafox.app/guidelines",
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

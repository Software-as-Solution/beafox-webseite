import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("unsubscribe");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    robots: "noindex, nofollow",
  };
}

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

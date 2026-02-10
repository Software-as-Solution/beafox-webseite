import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("agb");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: "https://beafox.app/agb",
    },
  };
}

export default function AGBLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

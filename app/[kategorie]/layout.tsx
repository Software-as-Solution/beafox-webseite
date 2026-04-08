import type { Metadata } from "next";
import { getCategoryBySlug, getRatgeberCategoryPath } from "@/lib/blog";

// ISR: Revalidate category pages every hour
export const revalidate = 3600;

const BASE_URL = "https://beafox.app";

type Props = {
  params: Promise<{ kategorie: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategorie } = await params;
  const category = getCategoryBySlug(kategorie);

  if (!category) return {};

  const url = `${BASE_URL}${getRatgeberCategoryPath(kategorie)}`;

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      type: "website",
      locale: "de_DE",
      siteName: "BeAFox",
      title: category.metaTitle,
      description: category.metaDescription,
      images: [
        {
          width: 1200,
          height: 630,
          url: `${BASE_URL}/assets/og-image.webp`,
          alt: category.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@beafox_app",
      title: category.metaTitle,
      description: category.metaDescription,
    },
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

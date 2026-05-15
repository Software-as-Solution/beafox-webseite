import type { Metadata } from "next";
import { getGuideMeta } from "@/lib/sanity.client";
import { getGuidePostPath } from "@/lib/blog";

// ISR: Revalidate guide metadata every hour
export const revalidate = 3600;

const BASE_URL = "https://beafox.app";

type Props = {
  params: Promise<{ kategorie: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategorie, slug } = await params;
  const guide = await getGuideMeta(kategorie, slug);

  if (!guide) return {};

  const url = `${BASE_URL}${getGuidePostPath(kategorie, slug)}`;
  // metaTitle enthält bereits das Branding — daher `absolute`, damit das
  // `%s | BeAFox`-Template aus dem Root-Layout nicht doppelt anhängt.
  const headTitle = guide.metaTitle ?? `${guide.title} | BeAFox`;
  const description = guide.metaDescription ?? guide.excerpt;

  return {
    title: { absolute: headTitle },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      type: "article",
      locale: "de_DE",
      siteName: "BeAFox",
      title: headTitle,
      description,
      publishedTime: guide.publishedAt,
      images: [
        {
          width: 1200,
          height: 630,
          url: `${BASE_URL}/assets/og-image.webp`,
          alt: guide.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@beafox_app",
      title: headTitle,
      description,
    },
  };
}

export default function GuideArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { notFound } from "next/navigation";
import { getGuideFull } from "@/lib/sanity.client";
import GuideArticle from "@/components/guide/GuideArticle";

// ISR: Revalidate guide pages every hour
export const revalidate = 3600;

type Props = {
  params: Promise<{ kategorie: string; slug: string }>;
};

// GUIDE_ARTICLE_PAGE
export default async function GuideArticlePage({ params }: Props) {
  const { kategorie, slug } = await params;
  const guide = await getGuideFull(kategorie, slug);

  if (!guide) notFound();

  return <GuideArticle guide={guide} kategorie={kategorie} slug={slug} />;
}

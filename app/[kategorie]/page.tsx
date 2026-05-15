import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/blog";
import { getGuidesByCategory } from "@/lib/sanity.client";
import RatgeberCategory from "@/components/guide/RatgeberCategory";

// ISR: Revalidate category pages every hour
export const revalidate = 3600;

type Props = {
  params: Promise<{ kategorie: string }>;
};

// RATGEBER_CATEGORY_PAGE
export default async function RatgeberCategoryPage({ params }: Props) {
  const { kategorie } = await params;
  const category = getCategoryBySlug(kategorie);

  if (!category) notFound();

  const guides = await getGuidesByCategory(category.slug);

  return <RatgeberCategory category={category} guides={guides} />;
}

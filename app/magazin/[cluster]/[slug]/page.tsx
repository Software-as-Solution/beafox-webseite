import React from "react";
import { getArticleBySlug, getAllArticleSlugs, extractTableOfContents, getCTAConfig, CLUSTER_COLORS, ARTICLE_TYPE_LABELS } from "@/lib/wissen";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowLeft, ChevronRight, Share2, Linkedin, Twitter, Mail, Link2, Download } from "lucide-react";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import WissenPortableText from "@/components/wissen/WissenPortableText";
import WissenTOC from "@/components/wissen/WissenTOC";
import CopyLinkButton from "@/components/magazin/CopyLinkButton";

// Allow dynamic routes not returned by generateStaticParams
export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    cluster: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((item) => ({
    cluster: item.cluster?.slug || "artikel",
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations("magazin.article");
  const { cluster: clusterParam, slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: t("notFoundTitle"),
    };
  }

  const ogImage = article.heroImage?.asset?.url
    ? {
        url: article.heroImage.asset.url,
        width: 1200,
        height: 630,
      }
    : undefined;

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ["BeAFox Redaktion"],
      tags: article.tags || [],
      images: ogImage ? [ogImage] : undefined,
      url: `https://beafox.app/magazin/${clusterParam}/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: ogImage ? [ogImage.url] : undefined,
    },
  };
}

export default async function MagazinArticlePage({ params }: PageProps) {
  const { cluster: clusterSlug, slug } = await params;
  const t = await getTranslations();
  const tm = await getTranslations("magazin.article");
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const toc = extractTableOfContents(article.body || []);
  const ctaConfig = getCTAConfig(article.ctaType);

  const breadcrumbItems = [
    { label: tm("magazineLabel"), href: "/magazin" },
    ...(article.cluster
      ? [
          {
            label: article.cluster.title,
            href: `/magazin/${article.cluster.slug}`,
          },
        ]
      : []),
    { label: article.title, href: `/magazin/${clusterSlug}/${article.slug}` },
  ];

  const readingTimeMinutes = Math.ceil((article.body?.length || 0) / 200);
  const publishDate = new Date(article.publishedAt);
  const modifiedDate = article.updatedAt ? new Date(article.updatedAt) : publishDate;

  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          image: article.heroImage?.asset?.url,
          author: {
            "@type": "Organization",
            name: "BeAFox Redaktion",
          },
          datePublished: article.publishedAt,
          dateModified: article.updatedAt || article.publishedAt,
          publisher: {
            "@type": "Organization",
            name: "BeAFox",
            logo: {
              "@type": "ImageObject",
              url: "https://beafox.app/logo.png",
            },
          },
        }}
      />

      {toc.length > 0 && (
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbItems.map((item, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: item.label,
              item: `https://beafox.app${item.href}`,
            })),
          }}
        />
      )}

      {article.faqSection && article.faqSection.length > 0 && (
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: article.faqSection.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }}
        />
      )}

      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 py-6 border-b border-gray-100">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <div className="w-full bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-wrap gap-3 mb-6">
              {article.cluster && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${
                    CLUSTER_COLORS[article.cluster.slug as keyof typeof CLUSTER_COLORS]?.bg ||
                    "bg-indigo-500"
                  }`}
                >
                  {article.cluster.title}
                </span>
              )}
              {article.articleType && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
                  {ARTICLE_TYPE_LABELS[article.articleType as keyof typeof ARTICLE_TYPE_LABELS]?.label ||
                    article.articleType}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-darkerGray mb-4 leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-lg text-lightGray mb-8 leading-relaxed max-w-3xl">
                {article.excerpt}
              </p>
            )}

            {/* Author block */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-10 h-10 rounded-full bg-primaryOrange flex items-center justify-center">
                <span className="text-white font-bold text-sm">BF</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-lightGray">
                <span className="font-medium text-darkerGray">BeAFox Redaktion</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {publishDate.toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {tm("readingTime", { minutes: readingTimeMinutes })}
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          {article.heroImage?.asset?.url && (
            <div className="relative w-full h-96 md:h-[500px] bg-gray-200">
              <Image
                src={article.heroImage.asset.url}
                alt={article.heroImage.alt || article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - TOC */}
            {toc.length > 0 && (
              <div className="hidden lg:block">
                <WissenTOC items={toc} />
              </div>
            )}

            {/* Center Content */}
            <div
              className={`${
                toc.length > 0 ? "lg:col-span-2" : "lg:col-span-3"
              } max-w-3xl mx-auto`}
            >
              {article.body && article.body.length > 0 ? (
                <WissenPortableText blocks={article.body} />
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
                  <p className="text-blue-900">
                    {tm("draftNotice")}
                  </p>
                </div>
              )}

              {/* FAQ Section */}
              {article.faqSection && article.faqSection.length > 0 && (
                <div className="mt-16 pt-12 border-t border-gray-200">
                  <h2 className="text-2xl md:text-3xl font-bold text-darkerGray mb-8" id="faq">
                    {tm("faqTitle")}
                  </h2>
                  <div className="space-y-4">
                    {article.faqSection.map((faq, idx) => (
                      <details
                        key={idx}
                        className="group border-b border-gray-200 py-4 cursor-pointer"
                      >
                        <summary className="flex items-center justify-between font-semibold text-darkerGray hover:text-primaryOrange transition-colors">
                          {faq.question}
                          <ChevronRight
                            size={20}
                            className="group-open:rotate-90 transition-transform"
                          />
                        </summary>
                        <p className="mt-4 text-lightGray leading-relaxed text-base">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio Section — always BeAFox Redaktion */}
              <div className="mt-16 pt-12 border-t border-gray-200">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col sm:flex-row gap-6">
                  <div className="w-24 h-24 rounded-full bg-primaryOrange flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-2xl">BF</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-darkerGray mb-1">
                      BeAFox Redaktion
                    </h3>
                    <p className="text-primaryOrange font-semibold mb-3">
                      Redaktion
                    </p>
                    <p className="text-base text-lightGray leading-relaxed mb-4">
                      Das BeAFox-Redaktionsteam recherchiert, analysiert und schreibt über Finanzbildung für Unternehmen, Schulen und Ausbildungsbetriebe — praxisnah, datengestützt und verständlich.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["Finanzbildung", "HR & Ausbildung", "Bildungsforschung"].map((cred, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {cred}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="mt-12 pt-8 border-t border-gray-200 flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">
                  {tm("shareTitle")}
                </span>
                <div className="flex gap-3">
                  <ShareButton
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      `https://beafox.app/magazin/${clusterSlug}/${article.slug}`
                    )}`}
                    icon={<Linkedin size={18} />}
                    label={tm("linkedinLabel")}
                  />
                  <ShareButton
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      `https://beafox.app/magazin/${clusterSlug}/${article.slug}`
                    )}&text=${encodeURIComponent(article.title)}`}
                    icon={<Twitter size={18} />}
                    label={tm("xLabel")}
                  />
                  <ShareButton
                    href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(
                      `${article.title}\n\nhttps://beafox.app/magazin/${clusterSlug}/${article.slug}`
                    )}`}
                    icon={<Mail size={18} />}
                    label={tm("emailLabel")}
                  />
                  <CopyLinkButton
                    cluster={clusterSlug}
                    slug={article.slug}
                    copyTitle={tm("copyLinkTitle")}
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            {(article.ctaType || article.relatedArticles?.length) && (
              <div className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  {/* CTA Card */}
                  {article.ctaType && (
                    <div className="rounded-2xl p-6 text-white bg-primaryOrange">
                      <h3 className="text-lg font-bold mb-3">{ctaConfig.heading}</h3>
                      <p className="text-sm mb-4 opacity-90">{ctaConfig.text}</p>
                      {article.downloadableAsset?.url && article.gated && (
                        <a
                          href={article.downloadableAsset.url}
                          className="inline-flex items-center gap-2 bg-white text-darkerGray font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full justify-center"
                        >
                          <Download size={16} />
                          {tm("downloadButton")}
                        </a>
                      )}
                      {!article.gated && (
                        <a
                          href={ctaConfig.buttonUrl}
                          className="inline-flex items-center gap-2 bg-white text-darkerGray font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full justify-center"
                        >
                          {ctaConfig.buttonText}
                          <ChevronRight size={16} />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Related Articles */}
                  {article.relatedArticles && article.relatedArticles.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                      <h3 className="font-bold text-darkerGray mb-4">{tm("relatedTitle")}</h3>
                      <div className="space-y-3">
                        {article.relatedArticles.map((related) => (
                          <Link
                            key={related._id}
                            href={`/magazin/${related.cluster?.slug || "artikel"}/${related.slug}`}
                            className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                          >
                            <p className="text-sm font-semibold text-darkerGray hover:text-primaryOrange line-clamp-2">
                              {related.title}
                            </p>
                            {related.cluster && (
                              <p className="text-xs text-lightGray mt-1">{related.cluster.title}</p>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Articles Section - Full Width */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="w-full bg-gray-50 border-t border-gray-200 py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-darkerGray mb-8">
                {tm("relatedTitle")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {article.relatedArticles.map((related) => (
                  <Link
                    key={related._id}
                    href={`/magazin/${related.cluster?.slug || "artikel"}/${related.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    {related.heroImage?.asset?.url && (
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        <Image
                          src={related.heroImage.asset.url}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {related.cluster && (
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white mb-3 ${
                            CLUSTER_COLORS[related.cluster.slug as keyof typeof CLUSTER_COLORS]?.bg ||
                            "bg-indigo-500"
                          }`}
                        >
                          {related.cluster.title}
                        </span>
                      )}
                      <h3 className="font-bold text-darkerGray mb-2 group-hover:text-primaryOrange transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      {related.excerpt && (
                        <p className="text-sm text-lightGray line-clamp-3">
                          {related.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {article.ctaType && (
          <div className="w-full bg-darkerGray text-white py-16">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{ctaConfig.heading}</h2>
              <p className="text-lg text-gray-300 mb-8">{ctaConfig.text}</p>
              {article.downloadableAsset?.url && article.gated && (
                <a
                  href={article.downloadableAsset.url}
                  className="inline-flex items-center gap-2 bg-primaryOrange text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Download size={18} />
                  {tm("downloadNow")}
                </a>
              )}
              {!article.gated && (
                <a
                  href={ctaConfig.buttonUrl}
                  className="inline-flex items-center gap-2 bg-primaryOrange text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {ctaConfig.buttonText}
                  <ChevronRight size={18} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* Client Component for Share Button */
function ShareButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-primaryOrange hover:text-white transition-all duration-200"
    >
      {icon}
    </a>
  );
}


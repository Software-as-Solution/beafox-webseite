// STANDARD COMPONENTS
import Link from "next/link";
// CUSTOMCOMPONENTS
import Button from "@/components/Button";
import Section from "@/components/Section";
import CalculatorWidget from "./CalculatorWidget";
import InlineBanner from "@/components/InlineBanner";
import GradientMascotCtaSection from "@/components/GradientMascotCtaSection";
// IMPORTS
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
// ICONS
import {
  Home,
  Clock,
  Download,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
// DATA
import { getCalculatorContent } from "@/lib/sanity.client";
import { getBannerForCalculator } from "@/lib/calculatorBanners";
import { CALCULATORS, getCalculatorBySlug } from "@/lib/calculators";

// CONSTANTS
const RELATED_CALCULATORS_LIMIT = 3;
const READING_WORDS_PER_MINUTE = 200;
const SITE_URL = "https://beafox.app";
const APP_DOWNLOAD_URL = "https://apps.apple.com/de/app/beafox/id6746110612";
// HELPER FUNCTIONS
const isBeaTip = (tip: string) => /^Beas?\s+Tipp:?/i.test(tip);
const stripBeaTipPrefix = (tip: string) =>
  tip.replace(/^Beas?\s+Tipp:?\s*/i, "");
const calculateReadingTime = (text: string): number => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / READING_WORDS_PER_MINUTE));
};
export function generateStaticParams() {
  return CALCULATORS.map((calc) => ({ slug: calc.slug }));
}

// METADATA
type PageProps = { params: Promise<{ slug: string }> };
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // QUERIES
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);
  const sanityContent = await getCalculatorContent(slug);
  if (!sanityContent && !calculator) {
    return { title: "Rechner nicht gefunden | BeAFox" };
  }
  const metaTitle =
    sanityContent?.metaTitle || "Finanzrechner | BeAFox";
  const metaDescription = sanityContent?.metaDescription || "";
  const url = `${SITE_URL}/finanzrechner/${slug}`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: url },
    openGraph: {
      url,
      type: "website",
      locale: "de_DE",
      title: metaTitle,
      siteName: "BeAFox",
      description: metaDescription,
    },
    twitter: {
      card: "summary",
      title: metaTitle,
      creator: "@beafox_app",
      description: metaDescription,
    },
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  // QUERIES
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);
  const t = await getTranslations("finanzrechner");
  if (!calculator) notFound();
  // SANITY CONTENT (all editorial content lives in Sanity CMS)
  const sanityContent = await getCalculatorContent(slug);
  const title = sanityContent?.title || calculator.title;
  const excerpt = sanityContent?.excerpt || calculator.excerpt;
  const category = sanityContent?.category || calculator.category;
  const categoryEmoji =
    sanityContent?.categoryEmoji || calculator.categoryEmoji;
  const intro = sanityContent?.intro || [];
  const howItWorks = sanityContent?.howItWorks || [];
  const tips = sanityContent?.tips || [];
  const useCases = sanityContent?.useCases || [];
  const faqs = sanityContent?.faqs || [];
  // BANNER SLOTS
  const bannerAfterTips = getBannerForCalculator(slug, "after-tips");
  const bannerAfterUseCases = getBannerForCalculator(slug, "after-useCases");
  const bannerAfterHowItWorks = getBannerForCalculator(
    slug,
    "after-howItWorks",
  );
  // CONSTANTS
  const relatedCalculators = CALCULATORS.filter(
    (c) => c.category === calculator.category && c.slug !== calculator.slug,
  ).slice(0, RELATED_CALCULATORS_LIMIT);
  const readingTime = calculateReadingTime(intro.join(" "));
  const faqSchema =
    faqs.length > 0
      ? {
          "@type": "FAQPage",
          "@context": "https://schema.org",
          mainEntity: faqs.map((faq) => ({
            name: faq.question,
            "@type": "Question",
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;
  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@context": "https://schema.org",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE_URL },
      {
        position: 2,
        "@type": "ListItem",
        name: "Finanzrechner",
        item: `${SITE_URL}/finanzrechner`,
      },
      {
        name: title,
        position: 3,
        "@type": "ListItem",
        item: `${SITE_URL}/finanzrechner/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* STRUCTURED DATA */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-gray-100 pt-24 md:pt-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs md:text-sm text-lightGray"
          >
            <Link
              href="/"
              aria-label="Startseite"
              className="hover:text-primaryOrange transition-colors flex items-center"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
            <ChevronRight
              aria-hidden="true"
              className="w-3 h-3 text-gray-300"
            />
            <Link
              href="/finanzrechner"
              className="hover:text-primaryOrange transition-colors"
            >
              Finanzrechner
            </Link>
            <ChevronRight
              className="w-3 h-3 text-gray-300"
              aria-hidden="true"
            />
            <span className="text-darkerGray font-medium truncate">
              {title}
            </span>
          </nav>
        </div>
      </div>

      {/* HERO */}
      <Section className="bg-primaryWhite py-10 md:py-16 lg:py-20 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-1/3 translate-x-1/3"
          style={{
            background:
              "radial-gradient(circle, rgba(232,119,32,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{
                background: "rgba(232,119,32,0.08)",
                border: "1px solid rgba(232,119,32,0.15)",
              }}
            >
              <span className="text-base" aria-hidden="true">
                {categoryEmoji}
              </span>
              <span className="text-[11px] font-bold text-primaryOrange uppercase tracking-widest">
                {category}
              </span>
            </div>
            <span className="text-gray-300" aria-hidden="true">
              ·
            </span>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-lightGray">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {readingTime} min Lesezeit
            </div>
          </div>
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-5 leading-[1.1]">
            {title}
          </h1>
          {/* Excerpt */}
          <p className="text-base md:text-lg lg:text-xl text-lightGray leading-relaxed">
            {excerpt}
          </p>
          {/* Intro paragraphs */}
          {intro.length > 0 && (
            <div className="mt-8 md:mt-10 space-y-5">
              {intro.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-base md:text-lg text-darkerGray leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* CALCULATOR WIDGET */}
      <CalculatorWidget slug={slug} />

      {/* EDITORIAL CONTENT */}
      <Section className="bg-primaryWhite py-12 md:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="space-y-16 md:space-y-20">
            {/* HOW IT WORKS */}
            {howItWorks.length > 0 && (
              <section aria-labelledby="how-it-works-heading">
                <h2
                  id="how-it-works-heading"
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-8"
                >
                  So funktioniert der Rechner
                </h2>
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute left-[19px] top-2 bottom-2 w-px"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent, rgba(232,119,32,0.2) 5%, rgba(232,119,32,0.2) 95%, transparent)",
                    }}
                  />
                  <ol className="space-y-6">
                    {howItWorks.map((step, idx) => (
                      <li key={idx} className="flex gap-5 relative">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 relative z-10 bg-white"
                          style={{
                            color: "#E87720",
                            border: "2px solid rgba(232,119,32,0.25)",
                            boxShadow: "0 4px 12px rgba(232,119,32,0.08)",
                          }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 pt-1.5">
                          <h3 className="text-lg md:text-xl font-bold text-darkerGray mb-1">
                            {step.title}
                          </h3>
                          <p className="text-base md:text-lg text-lightGray leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            )}
            {/* ▶ BANNER 1 */}
            {bannerAfterHowItWorks && (
              <InlineBanner {...bannerAfterHowItWorks} />
            )}
            {/* USE CASES */}
            {useCases.length > 0 && (
              <section aria-labelledby="use-cases-heading">
                <h2
                  id="use-cases-heading"
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-4"
                >
                  Wann lohnt sich der Rechner?
                </h2>
                <p className="text-base md:text-lg text-lightGray leading-relaxed mb-8 max-w-4xl">
                  Der Rechner ist in vielen Situationen hilfreich — hier ein
                  paar typische Beispiele aus dem Leben.
                </p>
                <ul className="space-y-4">
                  {useCases.map((useCase, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <ArrowRight
                        aria-hidden="true"
                        className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-1"
                      />
                      <p className="text-base md:text-lg text-darkerGray leading-relaxed">
                        {useCase}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {/* ▶ BANNER 2 */}
            {bannerAfterUseCases && <InlineBanner {...bannerAfterUseCases} />}
            {/* TIPS */}
            {tips.length > 0 && (
              <section aria-labelledby="tips-heading">
                <h2
                  id="tips-heading"
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-4"
                >
                  Tipps & Hinweise
                </h2>
                <p className="text-base md:text-lg text-lightGray leading-relaxed mb-8 max-w-4xl">
                  Diese Punkte helfen dir, die Ergebnisse richtig einzuordnen
                  und das Beste aus dem Rechner herauszuholen.
                </p>
                <div className="space-y-4">
                  {tips.map((tip, idx) => {
                    if (isBeaTip(tip)) {
                      return (
                        <div
                          key={idx}
                          className="relative rounded-2xl p-6 md:p-8 border-2 border-primaryOrange/30"
                          style={{
                            background:
                              "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
                            boxShadow: "0 8px 24px rgba(232,119,32,0.06)",
                          }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles
                              className="w-4 h-4 text-primaryOrange"
                              aria-hidden="true"
                            />
                            <span className="text-xs font-bold text-primaryOrange uppercase tracking-widest">
                              Beas Tipp
                            </span>
                          </div>
                          <p className="text-base md:text-lg text-darkerGray font-medium leading-relaxed">
                            {stripBeaTipPrefix(tip)}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-4 pl-5 border-l-2 border-primaryOrange/30 py-1"
                      >
                        <p className="text-base md:text-lg text-darkerGray leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            {/* ▶ BANNER 3 */}
            {bannerAfterTips && <InlineBanner {...bannerAfterTips} />}
            {/* FAQ */}
            {faqs.length > 0 && (
              <section aria-labelledby="faq-heading">
                <h2
                  id="faq-heading"
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-8"
                >
                  Häufige Fragen
                </h2>

                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <details
                      key={idx}
                      className="group border-b border-gray-200 last:border-b-0"
                    >
                      <summary className="flex items-center gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <span className="flex-1 text-lg md:text-xl font-bold text-darkerGray group-hover:text-primaryOrange transition-colors pr-4">
                          {faq.question}
                        </span>
                        <div
                          style={{ background: "rgba(232,119,32,0.08)" }}
                          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all group-open:bg-primaryOrange group-open:rotate-90"
                        >
                          <ChevronRight
                            className="w-4 h-4 text-primaryOrange group-open:text-white transition-colors"
                            aria-hidden="true"
                          />
                        </div>
                      </summary>
                      <div className="pb-6 -mt-1 max-w-4xl">
                        <p className="text-base md:text-lg text-lightGray leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      </Section>

      {/* ─── 5. RELATED CALCULATORS ─── */}
      {relatedCalculators.length > 0 && (
        <Section className="bg-gray-50 pt-12 md:py-t lg:pt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
              <div>
                <p className="text-[11px] font-bold text-primaryOrange uppercase tracking-widest mb-2">
                  {category}
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray leading-tight">
                  Weitere Rechner für dich
                </h2>
              </div>
              <Link
                href="/finanzrechner"
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-primaryOrange hover:gap-2.5 transition-all whitespace-nowrap"
              >
                Alle Rechner
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {relatedCalculators.map((calc) => (
                <Link
                  key={calc.slug}
                  href={`/finanzrechner/${calc.slug}`}
                  className="group flex flex-col rounded-2xl bg-white border border-gray-200 hover:border-primaryOrange/30 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="p-5 md:p-6 flex items-start justify-between gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{
                        background: "rgba(232,119,32,0.08)",
                        border: "1px solid rgba(232,119,32,0.12)",
                      }}
                    >
                      <span aria-hidden="true">{calc.categoryEmoji}</span>
                    </div>
                    <span className="text-[11px] font-medium text-lightGray bg-gray-100 rounded-full px-2.5 py-1 flex-shrink-0">
                      {calc.category}
                    </span>
                  </div>
                  <div className="px-5 md:px-6 pb-4 md:pb-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-darkerGray mb-2 group-hover:text-primaryOrange transition-colors leading-snug">
                      {calc.title}
                    </h3>
                    <p className="text-sm text-lightGray leading-relaxed flex-1 line-clamp-2">
                      {calc.excerpt}
                    </p>
                  </div>
                  <div className="px-5 md:px-6 pb-5 md:pb-6">
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-semibold text-primaryOrange">
                        Rechner öffnen
                      </span>
                      <div className="w-8 h-8 rounded-full bg-primaryOrange/10 flex items-center justify-center group-hover:bg-primaryOrange transition-colors">
                        <ArrowRight
                          className="w-4 h-4 text-primaryOrange group-hover:text-white transition-colors"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* Mobile "Alle Rechner" link */}
            <div className="md:hidden mt-6 text-center">
              <Link
                href="/finanzrechner"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primaryOrange"
              >
                Alle Rechner ansehen
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* ─── 6. FINAL CTA ─── */}
      <GradientMascotCtaSection
        titleAs="h2"
        mascotWidth={200}
        mascotHeight={200}
        descriptionClassName="mb-4"
        title={t("downloadCta.title")}
        mascotClassName="md:!w-36 md:!h-36"
        contentRowClassName="gap-6 md:gap-8"
        containerClassName="max-w-3xl mx-auto"
        mascotAlt={t("downloadCta.description")}
        description={t("downloadCta.description")}
        mascotSrc="/Maskottchen/Maskottchen-Hero.png"
        cardPaddingClassName="px-6 py-8 md:px-10 md:py-14"
        sectionClassName="bg-primaryWhite py-2 md:py-6 lg:py-10"
        actions={
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              target="_blank"
              href={APP_DOWNLOAD_URL}
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 !rounded-xl !px-6 !py-3 text-sm md:text-base shadow-sm shadow-primaryOrange/20 w-full sm:w-auto"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              {t("downloadCta.button")}
            </Button>
            <Link
              href="/unlimited"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-primaryOrange/30 text-primaryOrange font-semibold text-sm md:text-base hover:border-primaryOrange hover:bg-primaryOrange/5 transition-all w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Unlimited entdecken
            </Link>
          </div>
        }
      />
    </>
  );
}

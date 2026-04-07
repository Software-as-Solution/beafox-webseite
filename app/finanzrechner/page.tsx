// STANDARD COMPONENTS
import Link from "next/link";
// CUSTOM COMPONENTS
import Button from "@/components/Button";
import Section from "@/components/Section";
import LandingHero from "@/components/LandingHero";
import SectionHeader from "@/components/SectionHeader";
import DemoBookingCtaSection from "@/components/DemoBookingCtaSection";
import GradientMascotCtaSection from "@/components/GradientMascotCtaSection";
// IMPORTS
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
// ICONS
import { Sparkles, Download, Calculator, ChevronRight } from "lucide-react";
// DATA
import { CALCULATORS } from "@/lib/calculators";
import CalculatorBrowser from "@/components/CalculatorBrowser";

// CONSTANTS
const SITE_URL = "https://beafox.app";
const APP_DOWNLOAD_URL = "https://apps.apple.com/de/app/beafox/id6746110612";
// METADATA
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("finanzrechner");
  const title = t("rootMeta.title");
  const url = `${SITE_URL}/finanzrechner`;
  const description = t("rootMeta.description");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title,
      description,
      type: "website",
      locale: "de_DE",
      siteName: "BeAFox",
    },
    twitter: {
      title,
      description,
      card: "summary",
      creator: "@beafox_app",
    },
  };
}

export default async function FinanzrechnerPage() {
  // HOOKS
  const t = await getTranslations("finanzrechner");
  // CONSTANTS
  const faqs =
    (t.raw("faq.items") as { question: string; answer: string }[]) || [];
  const itemListSchema = {
    "@type": "ItemList",
    name: "BeAFox Finanzrechner",
    "@context": "https://schema.org",
    description: t("rootMeta.description"),
    numberOfItems: CALCULATORS.length,
    itemListElement: CALCULATORS.map((calc, idx) => ({
      name: calc.title,
      position: idx + 1,
      "@type": "ListItem",
      url: `${SITE_URL}/finanzrechner/${calc.slug}`,
    })),
  };
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
    ],
  };
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

  return (
    <>
      {/* ─── STRUCTURED DATA ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* ─── 1. HERO ─── */}
      <LandingHero
        badge={t("hero.badge")}
        mascotAlt={t("hero.badge")}
        cardText={t("hero.cardText")}
        description={t("hero.description")}
        mascotClassName="scale-80 md:top-0"
        mascotSrc="/Maskottchen/Maskottchen-Rechner.png"
        title={
          <>
            {t("hero.titlePre")}{" "}
            <span className="text-primaryOrange">
              {t("hero.titleHighlight")}
            </span>
          </>
        }
        actions={
          <>
            <Button
              target="_blank"
              variant="primary"
              href={APP_DOWNLOAD_URL}
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Download
                aria-hidden="true"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
              {t("hero.ctaPrimary")}
            </Button>
            <a
              href="#alle-rechner"
              className="inline-flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto px-5 py-2.5 md:px-8 md:py-3 text-sm md:text-base rounded-full font-semibold text-primaryOrange border-2 border-primaryOrange/30 hover:border-primaryOrange hover:bg-primaryOrange/5 transition-all"
            >
              <Calculator
                aria-hidden="true"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
              {t("hero.ctaSecondary")}
            </a>
          </>
        }
      />

      {/* ─── 2. ALL CALCULATORS ─── */}
      <Section
        id="alle-rechner"
        className="bg-gray-50 pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20 scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <SectionHeader
              pillClassName="mb-4 md:mb-6"
              title={
                <>
                  {t("all.titlePre")}{" "}
                  <span className="text-primaryOrange">
                    {t("all.titleHighlight")}
                  </span>
                </>
              }
            />
          </div>

          <CalculatorBrowser />
        </div>
      </Section>

      {/* ─── 3. FAQ ─── */}
      {faqs.length > 0 && (
        <Section className="bg-primaryWhite py-12 md:py-16 lg:py-20">
          <div className="mb-10 md:mb-12">
            <SectionHeader
              pillClassName="mb-4 md:mb-6"
              title={
                <>
                  {t("faq.titlePre")}{" "}
                  <span className="text-primaryOrange">
                    {t("faq.titleHighlight")}
                  </span>
                </>
              }
            />
          </div>

          <div className="max-w-5xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group border-b border-gray-200 last:border-b-0"
              >
                <summary className="flex items-center gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="flex-1 text-base md:text-lg font-bold text-darkerGray group-hover:text-primaryOrange transition-colors pr-4">
                    {faq.question}
                  </span>
                  <div
                    style={{ background: "rgba(232,119,32,0.08)" }}
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all group-open:bg-primaryOrange group-open:rotate-90"
                  >
                    <ChevronRight
                      aria-hidden="true"
                      className="w-4 h-4 text-primaryOrange group-open:text-white transition-colors"
                    />
                  </div>
                </summary>
                <div className="pb-6 -mt-1">
                  <p className="text-sm md:text-base text-lightGray leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </Section>
      )}

      {/* ─── 7. FINAL CTA ─── */}
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
        sectionClassName="bg-primaryWhite py-8 md:py-12 lg:py-16"
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
              {t("downloadCta.secondaryButton")}
            </Link>
          </div>
        }
      />

      {/* ─── 8. DEMO BOOKING ─── */}
      <DemoBookingCtaSection />
    </>
  );
}

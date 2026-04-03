"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// CUSTOM COMPONENTS
import Button from "@/components/Button";
import Section from "@/components/Section";
import LandingHero from "@/components/LandingHero";
import RatgeberSection from "@/components/RatGeber";
import DownloadModal from "@/components/DownloadModal";
import SectionHeader from "@/components/SectionHeader";
import StructuredData from "@/components/StructuredData";
import StickyMobileCTA from "@/components/StickyMobileCta";
import TestimonialsCarousel from "@/components/TestimonialCarousel";
import DemoBookingCtaSection from "@/components/DemoBookingCtaSection";
import DownloadBannerSection from "@/components/DownloadBannerSection";
import ContentShowcaseSection from "@/components/ContentShowcaseSection";
import FaqAccordion, { type FaqAccordionItem } from "@/components/FaqAccordion";
// IMPORTS
import { useState, useCallback, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
// ICONS
import {
  Users,
  Download,
  Building2,
  ArrowRight,
  Presentation,
} from "lucide-react";

// TYPES
interface Stat {
  value: string;
  label: string;
  icon: typeof Users;
}
interface UseCase {
  id: string;
  href: string;
  mascot: string;
  mascotAlt: string;
}
interface AppFeature {
  id: string;
  mockup: string;
}

// CONSTANTS
const USE_CASES: UseCase[] = [
  {
    id: "business",
    href: "/unternehmen",
    mascotAlt: "BeAFox für Unternehmen",
    mascot: "/Maskottchen/Maskottchen-Business.png",
  },
  {
    id: "schools",
    href: "/schulen",
    mascotAlt: "BeAFox für Schulen",
    mascot: "/Maskottchen/Maskottchen-School.png",
  },
];
const APP_FEATURES: AppFeature[] = [
  { id: "stufen", mockup: "/assets/Mockups/Mockup-Stufen.png" },
  { id: "lernpfad", mockup: "/assets/Mockups/Mockup-Lernpfad.png" },
  { id: "lektion", mockup: "/assets/Mockups/Mockup-Lektion.png" },
  { id: "quiz", mockup: "/assets/Mockups/Mockup-Quiz.png" },
  { id: "rangliste", mockup: "/assets/Mockups/Mockup-Rangliste.png" },
  { id: "missionen", mockup: "/assets/Mockups/Mockup-Missionen.png" },
  { id: "profil", mockup: "/assets/Mockups/Mockup-Profil.png" },
];
const FEATURE_CARD_STYLE = {
  border: "1px solid rgba(232,119,32,0.15)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.06), 0 0 0 1px rgba(232,119,32,0.04)",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
} as const;
const PARTNER_COUNT = 14;
const PARTNER_IDS = Array.from({ length: PARTNER_COUNT }, (_, i) => i + 1);
const GLOW = (opacity: number) => ({
  background: `radial-gradient(circle, rgba(232,119,32,${opacity}) 0%, transparent 70%)`,
});
const FAQ_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Ist BeAFox wirklich kostenlos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja — der Einstieg ist komplett kostenlos. Du kannst Lektionen absolvieren, Bea kennenlernen und deine erste Situation durchspielen. Für unbegrenzten Zugang gibt es BeAFox Unlimited.",
      },
    },
    {
      "@type": "Question",
      name: "Was macht Bea anders als andere Finanz-Apps?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bea ist kein Chatbot der Wikipedia zitiert. Bea kennt deine Lebenssituation — ob Azubi, Student oder Berufseinsteiger — und empfiehlt dir genau die Schritte, die jetzt für dich relevant sind.",
      },
    },
    {
      "@type": "Question",
      name: "Sind meine Daten sicher?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolut. BeAFox ist 100% DSGVO-konform, wird in Deutschland gehostet und verkauft keine Nutzerdaten. Wir sind unabhängig — keine Bank, kein Versicherer, kein Produktverkauf.",
      },
    },
    {
      "@type": "Question",
      name: "Für wen ist BeAFox geeignet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Für alle zwischen 16 und 30, die ihre Finanzen selbst in die Hand nehmen wollen — besonders Azubis, Studierende und Berufseinsteiger.",
      },
    },
  ],
} as const;

export default function HomePage() {
  // HOOKS
  const locale = useLocale();
  const t = useTranslations("home");
  // STATES
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  // CONSTANTS
  const stats: Stat[] = useMemo(
    () => [
      { value: "5,000+", label: t("stats.privateUsers"), icon: Users },
      { value: "10+", label: t("stats.schools.pre"), icon: Building2 },
    ],
    [t],
  );
  const availableLanguage = useMemo(
    () => (locale === "en" ? ["English"] : ["German"]),
    [locale],
  );
  const featureHighlights = useMemo(
    () =>
      APP_FEATURES.map(
        (f) => (t.raw(`appFeatures.${f.id}.highlights`) as string[]) ?? [],
      ),
    [t],
  );
  const activeFeature = APP_FEATURES[selectedFeature];
  const activeHighlights = featureHighlights[selectedFeature] ?? [];
  // FUNCTIONS
  const openDownloadModal = useCallback(() => setIsDownloadModalOpen(true), []);
  const closeDownloadModal = useCallback(
    () => setIsDownloadModalOpen(false),
    [],
  );
  const selectFeature = useCallback(
    (index: number) => setSelectedFeature(index),
    [],
  );

  return (
    <>
      {/* ─── 1. HERO ─── */}
      <LandingHero
        badge={t("hero.badge")}
        mascotAlt={t("hero.mascotAlt")}
        cardText={t("hero.aiIntroText")}
        mascotSrc="/Maskottchen/Maskottchen-Hero.png"
        title={
          <>
            <span className="sr-only">
              BeAFox — Die KI-gestützte Finanz-App für Azubis, Studierende und
              Berufseinsteiger.{" "}
            </span>
            {t("hero.headline.line1")}{" "}
            <span className="text-primaryOrange">
              {t("hero.headline.line2")}
            </span>
          </>
        }
        actions={
          <>
            <Button
              variant="primary"
              onClick={openDownloadModal}
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Download
                aria-hidden="true"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
              {t("hero.cta.download")}
            </Button>
            <Button
              href="/kontakt"
              variant="outline"
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Presentation
                aria-hidden="true"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
              {t("hero.cta.partner")}
            </Button>
          </>
        }
        chips={
          <>
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.value}
                  className="flex items-center gap-1.5 md:gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 md:px-4 py-1.5 md:py-2 shadow-sm max-w-fit"
                >
                  <Icon
                    className="w-5 h-5 md:w-6 md:h-6 text-darkerGray flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1">
                    <span className="text-sm md:text-base lg:text-lg font-bold text-primaryOrange">
                      {stat.value}
                    </span>
                    <span className="text-[10px] sm:text-xs md:text-base text-darkerGray font-medium leading-tight">
                      {stat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        }
      />

      {/* ─── 2. PARTNER LOGOS ─── */}
      <Section className="bg-primaryWhiteLight overflow-hidden py-4 md:py-0">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-primaryWhiteLight to-transparent z-10 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-primaryWhiteLight to-transparent z-10 pointer-events-none"
          />
          <div className="overflow-hidden">
            <div className="flex animate-scroll-left gap-0 items-center w-max">
              {[...PARTNER_IDS, ...PARTNER_IDS, ...PARTNER_IDS].map(
                (i, idx) => (
                  <div
                    key={`partner-${idx}`}
                    className="flex-shrink-0 w-20 h-12 md:w-40 md:h-24 lg:w-48 lg:h-28 flex items-center justify-center px-2 md:px-4 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <Image
                      width={100}
                      height={120}
                      loading="lazy"
                      src={`/Partners/${i}.png`}
                      style={{ width: "auto", height: "auto" }}
                      alt={t("partnersCarousel.alt", { index: i })}
                      className="object-contain max-w-full max-h-full w-auto h-auto"
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 3. EINE APP FÜR JEDEN EINSATZ ─── */}
      <Section className="bg-gray-50 py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-6 lg:mb-8"
          >
            <SectionHeader
              pillClassName="mb-6"
              preTitle={t("useCasesSection.title.pre")}
              highlight={t("useCasesSection.title.highlight")}
              subtitle={
                <>
                  <span className="block">
                    {t("useCasesSection.subtitle.lead")}
                  </span>
                  <span className="block mt-1">
                    <span className="text-primaryOrange">
                      {t("useCasesSection.subtitle.schools")}
                    </span>{" "}
                    {t("useCasesSection.subtitle.connector")}{" "}
                    <span className="text-primaryOrange">
                      {t("useCasesSection.subtitle.businesses")}
                    </span>
                  </span>
                </>
              }
            />
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {USE_CASES.map((useCase, index) => (
              <motion.div
                key={useCase.id}
                viewport={{ once: true }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primaryOrange/20 flex flex-col h-full"
              >
                <div className="flex flex-col md:flex-row flex-1 gap-4 md:gap-6 items-center md:items-stretch">
                  <div className="flex-1 min-w-0 flex flex-col text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-primaryOrange mb-2 md:mb-3">
                      {t(`useCases.${useCase.id}.title`)}
                    </h3>
                    <p className="text-sm md:text-base text-lightGray mb-4 md:mb-5 font-medium">
                      {t(`useCases.${useCase.id}.description`)}
                    </p>
                    <Button
                      variant="primary"
                      href={useCase.href}
                      className="mt-auto self-center md:self-start gap-2 px-6 py-2 text-sm md:text-base"
                    >
                      {t("useCasesSection.more")}
                      <ArrowRight
                        aria-hidden="true"
                        className="w-4 h-4 md:w-5 md:h-5 shrink-0"
                      />
                    </Button>
                  </div>
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <Image
                      width={200}
                      height={200}
                      loading="lazy"
                      aria-hidden="true"
                      src={useCase.mascot}
                      alt={useCase.mascotAlt}
                      className="object-contain w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 scale-150"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── 4. TESTIMONIALS ─── */}
      <Section className="bg-primaryWhite py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-10"
          >
            <SectionHeader
              preTitle={t("testimonialsSection.title.pre")}
              highlight={t("testimonialsSection.title.highlight")}
            />
          </motion.div>
          <TestimonialsCarousel />
        </div>
      </Section>

      {/* ─── 5. APP FEATURES ─── */}
      <Section className="bg-primaryWhite pb-8 md:pb-12 pt-8 sm:mt-8">
        <div className="text-center mb-8 md:mb-12">
          <SectionHeader
            pillClassName="mb-6 md:mb-8"
            title={
              <>
                {t("howItWorks.titlePre")}{" "}
                <span className="text-primaryOrange">
                  {t("howItWorks.titleHighlight")}
                </span>
                {t("howItWorks.titleSuffix")}
              </>
            }
          />
          {/* Feature Tabs */}
          <div className="relative mb-8 md:mb-12 w-full mx-auto">
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-primaryWhite to-transparent z-10 pointer-events-none md:hidden"
            />
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-primaryWhite to-transparent z-10 pointer-events-none"
            />
            <div
              style={{ WebkitOverflowScrolling: "touch" }}
              className="overflow-x-auto scrollbar-hide pb-2 md:pb-0 scroll-smooth px-4 md:px-0"
            >
              <div
                role="tablist"
                aria-label="App Features"
                className="flex gap-2 md:gap-3 justify-start md:justify-center min-w-max md:min-w-0"
              >
                {APP_FEATURES.map((feature, index) => (
                  <button
                    role="tab"
                    key={feature.id}
                    aria-controls="feature-panel"
                    onClick={() => selectFeature(index)}
                    aria-selected={selectedFeature === index}
                    className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all whitespace-nowrap flex-shrink-0 active:scale-95 ${
                      selectedFeature === index
                        ? "bg-primaryOrange text-white shadow-lg shadow-primaryOrange/20"
                        : "bg-gray-100 text-darkerGray hover:bg-gray-200"
                    }`}
                  >
                    {t(`appFeatures.${feature.id}.title`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            id="feature-panel"
            role="tabpanel"
            key={selectedFeature}
            exit={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            initial={{ opacity: 0, y: 20 }}
            className="w-full max-w-6xl mx-auto"
          >
            <div
              style={FEATURE_CARD_STYLE}
              className="relative rounded-3xl overflow-hidden px-5 py-6 md:px-12 md:py-12 lg:px-16 lg:py-14"
            >
              <div
                style={GLOW(0.08)}
                aria-hidden="true"
                className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full pointer-events-none"
              />
              <div className="relative z-10 grid md:grid-cols-2 gap-6 md:gap-12 items-center">
                {/* Mockup */}
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex justify-center order-2 md:order-1"
                >
                  <div className="relative">
                    <div
                      style={GLOW(0.1)}
                      aria-hidden="true"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] md:w-[320px] md:h-[320px] rounded-full pointer-events-none"
                    />
                    <Image
                      width={280}
                      height={600}
                      loading="lazy"
                      src={activeFeature.mockup}
                      className="relative z-10 object-contain w-[180px] h-auto md:w-[260px] lg:w-[280px]"
                      alt={t("howItWorks.mockupAlt", {
                        feature: t(`appFeatures.${activeFeature.id}.title`),
                      })}
                      style={{
                        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.18))",
                      }}
                    />
                  </div>
                </motion.div>
                {/* Content */}
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="order-1 md:order-2"
                  initial={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-2 md:mb-4">
                    {t(`appFeatures.${activeFeature.id}.title`)}
                  </h3>
                  <p className="text-sm md:text-base text-lightGray leading-relaxed mb-4 md:mb-5">
                    {t(`appFeatures.${activeFeature.id}.description`)}
                  </p>
                  {activeHighlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-5 md:mb-6">
                      {activeHighlights.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] md:text-[11px] font-semibold px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-gray-100 text-darkerGray"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="primary"
                      onClick={openDownloadModal}
                      className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-7 md:!py-3 text-sm md:text-base"
                    >
                      <Download
                        aria-hidden="true"
                        className="w-3.5 h-3.5 md:w-4 md:h-4"
                      />
                      {t("howItWorks.ctaDownload")}
                    </Button>
                    <Button
                      href="/kontakt"
                      variant="outline"
                      className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-7 md:!py-3 text-sm md:text-base"
                    >
                      <Presentation
                        aria-hidden="true"
                        className="w-3.5 h-3.5 md:w-4 md:h-4"
                      />
                      {t("howItWorks.ctaPartner")}
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Section>

      {/* ─── 6. DOWNLOAD BANNER ─── */}
      <DownloadBannerSection />

      {/* ─── 7. RATGEBER ─── */}
      <ContentShowcaseSection
        headerMotionDuration={0.5}
        sectionClassName="bg-gray-50 pt-10"
        headerMotionClassName="text-center mb-6 md:mb-8"
        sectionHeaderProps={{
          pillClassName: "mb-6",
          preTitle: t("ratgeberHomeSection.title.pre"),
          highlight: t("ratgeberHomeSection.title.highlight"),
          subtitle: (
            <>
              <span className="block">
                {t("ratgeberHomeSection.subtitleLine1")}
              </span>
              <span className="block mt-1">
                <span className="text-primaryOrange">
                  {t("ratgeberHomeSection.subtitleLine2")}
                </span>
              </span>
            </>
          ),
        }}
      >
        <RatgeberSection />
      </ContentShowcaseSection>

      {/* ─── 8. MINI FAQ ─── */}
      <Section className="bg-primaryWhite py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-6 md:mb-8"
          >
            <SectionHeader
              preTitle={t("faqSection.title.pre")}
              highlight={t("faqSection.title.highlight")}
            />
          </motion.div>
          <FaqAccordion
            listLabel={t("faqAccordionLabel")}
            items={t.raw("faqSection.items") as FaqAccordionItem[]}
          />
          <motion.div
            viewport={{ once: true }}
            className="text-center mt-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Button
              href="/faq"
              variant="primary"
              className="!px-5 py-4 text-base gap-2"
            >
              {t("faqSection.viewAll")}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* ─── 9. CTA ─── */}
      <DemoBookingCtaSection />

      {/* MODALS + STICKY */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={closeDownloadModal}
      />
      <StickyMobileCTA />

      {/* STRUCTURED DATA */}
      <StructuredData id="faq" data={FAQ_STRUCTURED_DATA} />
      <StructuredData
        id="organization"
        data={{
          "@type": "Organization",
          url: "https://beafox.app",
          "@context": "https://schema.org",
          name: "BeAFox UG (haftungsbeschränkt)",
          logo: "https://beafox.app/assets/logo.png",
          description: t("seo.organization.description"),
          address: {
            postalCode: "93073",
            addressCountry: "DE",
            "@type": "PostalAddress",
            streetAddress: "Siemensweg 2",
            addressLocality: "Neutraubling",
          },
          contactPoint: {
            availableLanguage,
            "@type": "ContactPoint",
            email: "info@beafox.app",
            telephone: "+49-178-2723-673",
            contactType: "customer service",
          },
          sameAs: [
            "https://twitter.com/beafox_app",
            "https://www.youtube.com/@beafox",
            "https://www.instagram.com/beafox_app",
            "https://www.linkedin.com/company/beafox",
          ],
        }}
      />
      <StructuredData
        id="website"
        data={{
          name: "BeAFox",
          "@type": "WebSite",
          url: "https://beafox.app",
          "@context": "https://schema.org",
          description: t("seo.website.description"),
          publisher: {
            "@type": "Organization",
            name: "BeAFox UG (haftungsbeschränkt)",
          },
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://beafox.app/search?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <StructuredData
        id="app"
        data={{
          name: "BeAFox",
          "@type": "SoftwareApplication",
          operatingSystem: "iOS, Android",
          "@context": "https://schema.org",
          applicationCategory: "EducationalApplication",
          description: t("seo.softwareApplication.description"),
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          aggregateRating: {
            bestRating: "5",
            worstRating: "1",
            ratingCount: "71",
            ratingValue: "5.0",
            "@type": "AggregateRating",
          },
        }}
      />
    </>
  );
}

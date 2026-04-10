"use client";

// STANDARD COMPONENTS
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
// CUSTOM COMPONENTS
import Button from "@/components/Button";
import Section from "@/components/Section";
import LandingHero from "@/components/LandingHero";
import SectionHeader from "@/components/SectionHeader";
import StructuredData from "@/components/StructuredData";
import StickyMobileCTA from "@/components/StickyMobileCta";
import BeaMiniChatDemo from "@/components/BeaMiniChatDemo";
import { type FaqAccordionItem } from "@/components/FaqAccordion";
import TransformationsTimeline from "@/components/TransformationsTimeline";
import ScrollStrikethroughHeading from "@/components/ScrollStrikethroughHeading";
// CUSTOM COMPONENTS
const DemoBookingCtaSection = dynamic(
  () => import("@/components/DemoBookingCtaSection"),
);
const ContentShowcaseSection = dynamic(
  () => import("@/components/ContentShowcaseSection"),
);
const BeaChatDemo = dynamic(() => import("@/components/BeaChatDemo"));
const RatgeberSection = dynamic(() => import("@/components/RatGeber"));
const FaqAccordion = dynamic(() => import("@/components/FaqAccordion"));
const DownloadModal = dynamic(() => import("@/components/DownloadModal"));
// IMPORTS
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useCallback, useMemo, type ReactNode } from "react";
// ICONS
import {
  Star,
  Users,
  Check,
  Download,
  Building2,
  ArrowRight,
  Presentation,
  type LucideIcon,
} from "lucide-react";
// TYPES
interface Stat {
  value: string;
  label: string;
  icon: LucideIcon;
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
const APP_STORE_URL = "https://apps.apple.com/de/app/beafox/id6746110612";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.tapelea.beafox&pcampaignid=web_share";
const ORANGE_GRADIENT = "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)";
const CHECK_BULLET_STYLE = {
  background: ORANGE_GRADIENT,
  boxShadow: "0 2px 6px rgba(232,119,32,0.3)",
} as const;
const PROBLEM_CARD_STYLE = {
  background: "#FFFFFF",
  border: "1px solid #F0E5D8",
  boxShadow:
    "0 1px 3px rgba(232,119,32,0.04), 0 8px 24px rgba(232,119,32,0.06)",
} as const;
const STORE_BUTTON_SHADOW =
  "0 12px 32px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.4)";
const FEATURE_CARD_STYLE = {
  border: "1px solid rgba(232,119,32,0.15)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.06), 0 0 0 1px rgba(232,119,32,0.04)",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
} as const;
const GLOW = (opacity: number) => ({
  background: `radial-gradient(circle, rgba(232,119,32,${opacity}) 0%, transparent 70%)`,
});
const USE_CASES: UseCase[] = [
  {
    id: "business",
    href: "/unternehmen",
    mascotAlt: "BeAFox für Unternehmen",
    mascot: "/Maskottchen/Maskottchen-Business.webp",
  },
  {
    id: "schools",
    href: "/schulen",
    mascotAlt: "BeAFox für Schulen",
    mascot: "/Maskottchen/Maskottchen-School.webp",
  },
];
const APP_FEATURES: AppFeature[] = [
  { id: "stufen", mockup: "/assets/Mockups/Mockup-Stufen.webp" },
  { id: "lernpfad", mockup: "/assets/Mockups/Mockup-Lernpfad.webp" },
  { id: "lektion", mockup: "/assets/Mockups/Mockup-Lektion.webp" },
  { id: "quiz", mockup: "/assets/Mockups/Mockup-Quiz.webp" },
  { id: "rangliste", mockup: "/assets/Mockups/Mockup-Rangliste.webp" },
  { id: "missionen", mockup: "/assets/Mockups/Mockup-Missionen.webp" },
  { id: "profil", mockup: "/assets/Mockups/Mockup-Profil.webp" },
];
const PARTNER_COUNT = 14;
const PARTNER_IDS = Array.from({ length: PARTNER_COUNT }, (_, i) => i + 1);
const TRIPLED_PARTNER_IDS = [...PARTNER_IDS, ...PARTNER_IDS, ...PARTNER_IDS];
const STAR_INDICES = [0, 1, 2, 3, 4] as const;
const TRUST_AVATARS = [
  "/Maskottchen/Maskottchen-Hero.webp",
  "/Maskottchen/Maskottchen-Freude.webp",
  "/Maskottchen/Maskottchen-Azubi.webp",
  "/Maskottchen/Maskottchen-School.webp",
] as const;
const COMPANY_ADDRESS = {
  postalCode: "93073",
  addressCountry: "DE",
  "@type": "PostalAddress",
  streetAddress: "Siemensweg 2",
  addressLocality: "Neutraubling",
} as const;
const COMPANY_CONTACT_BASE = {
  "@type": "ContactPoint",
  email: "info@beafox.app",
  telephone: "+49-178-2723-673",
  contactType: "customer service",
} as const;
const SOCIAL_LINKS = [
  "https://twitter.com/beafox_app",
  "https://www.youtube.com/@beafox",
  "https://www.instagram.com/beafox_app",
  "https://www.linkedin.com/company/beafox",
] as const;
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

// SUB-COMPONENTS
/** A bullet item in a benefits list — orange gradient circle with check icon + text. */
function BenefitListItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <div
        style={CHECK_BULLET_STYLE}
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
      >
        <Check
          strokeWidth={3}
          aria-hidden="true"
          className="w-3 h-3 text-white"
        />
      </div>
      <span className="text-sm md:text-base text-darkerGray leading-relaxed">
        {children}
      </span>
    </li>
  );
}
/** White rounded card used in the Problem section — title + mascot + text. */
interface ProblemCardProps {
  text: string;
  title: string;
  mascot: string;
  paddingClass?: string;
}
function ProblemCard({
  text,
  title,
  mascot,
  paddingClass = "p-6 md:p-7",
}: ProblemCardProps) {
  return (
    <div
      style={PROBLEM_CARD_STYLE}
      className={`relative rounded-2xl ${paddingClass} transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-xl md:text-2xl font-bold text-darkerGray leading-tight flex-1">
          {title}
        </h3>
        <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
          <Image
            fill
            src={mascot}
            alt="Maskottchen mit einem Problem"
            className="object-contain scale-125"
          />
        </div>
      </div>
      <p className="text-sm md:text-[15px] text-lightGray leading-relaxed">
        {text}
      </p>
    </div>
  );
}
/** App store / Google Play download button used in the Promise CTA. */
interface StoreButtonProps {
  href: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
}
function StoreButton({ href, imageSrc, imageAlt, label }: StoreButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-1 flex items-center gap-3 justify-center rounded-2xl bg-white px-5 py-4 hover:scale-[1.04] transition-all duration-300"
      style={{ boxShadow: STORE_BUTTON_SHADOW }}
    >
      <Image
        width={160}
        height={52}
        src={imageSrc}
        alt={imageAlt}
        className="object-contain w-[36px] h-auto shrink-0"
      />
      <span className="text-sm md:text-base font-black text-darkerGray text-left leading-tight">
        {label}
      </span>
    </a>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────

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
      { value: "10.000+", label: t("stats.privateUsers"), icon: Users },
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
  const problemBenefits = useMemo(
    () => t.raw("problemSection.benefits") as readonly string[],
    [t],
  );
  const solutionFeatures = useMemo(
    () => t.raw("solutionSection.features") as readonly string[],
    [t],
  );
  const faqItems = useMemo(
    () => t.raw("faqSection.items") as FaqAccordionItem[],
    [t],
  );
  const activeFeature = APP_FEATURES[selectedFeature];
  const activeHighlights = featureHighlights[selectedFeature] ?? [];
  // STRUCTURED DATA´
  const organizationStructuredData = useMemo(
    () => ({
      "@type": "Organization",
      url: "https://beafox.app",
      "@context": "https://schema.org",
      name: "BeAFox UG (haftungsbeschränkt)",
      logo: "https://beafox.app/assets/logo.webp",
      description: t("seo.organization.description"),
      address: COMPANY_ADDRESS,
      contactPoint: { ...COMPANY_CONTACT_BASE, availableLanguage },
      sameAs: SOCIAL_LINKS,
    }),
    [t, availableLanguage],
  );
  const websiteStructuredData = useMemo(
    () => ({
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
    }),
    [t],
  );
  const appStructuredData = useMemo(
    () => ({
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
    }),
    [t],
  );
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
        mascotClassName="scale-75 md:top-0"
        mascotSrc="/Maskottchen/Maskottchen-Hero.webp"
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
      <Section className="bg-primaryWhiteLight overflow-hidden py-4 md:py-0 relative bottom-4">
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
            {TRIPLED_PARTNER_IDS.map((i, idx) => (
              <div
                key={`partner-${idx}`}
                className="flex-shrink-0 w-20 h-12 md:w-40 md:h-24 lg:w-48 lg:h-28 flex items-center justify-center px-2 md:px-4 opacity-60 hover:opacity-100 transition-opacity"
              >
                <Image
                  width={100}
                  height={120}
                  loading="lazy"
                  src={`/Partners/${i}.webp`}
                  style={{ width: "auto", height: "auto" }}
                  alt={t("partnersCarousel.alt", { index: i })}
                  className="object-contain max-w-full max-h-full w-auto h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── 3. BEA CHAT DEMO ─── */}
      <Section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollStrikethroughHeading
            oldText={t("beaChatDemo.titleOld")}
            newPrefix={t("beaChatDemo.titleNewPrefix")}
            newHighlight={t("beaChatDemo.titleNewHighlight")}
          />
          <BeaChatDemo onCtaClick={openDownloadModal} />
        </div>
      </Section>

      {/* ─── 4. PROBLEM SECTION ─── */}
      <Section className="relative bg-primaryWhite py-16 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(232,119,32,0.04) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader
              preTitle={t("problemSection.eyebrowPre")}
              highlight={t("problemSection.eyebrowHighlight")}
            />
          </div>
          <div className="grid lg:grid-cols-[45%_55%] gap-6 lg:gap-10 items-start">
            {/* ─── LEFT COLUMN ─── */}
            <div className="order-2 lg:order-1">
              {/* Hero Visual Card */}
              <div
                className="relative aspect-[4/2] rounded-3xl overflow-hidden mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 50%, #FFE0C2 100%)",
                }}
              >
                {/* Decorative blob */}
                <div
                  aria-hidden="true"
                  className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(232,119,32,0.18) 0%, transparent 60%)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-24 -left-24 w-[280px] h-[280px] rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(232,119,32,0.12) 0%, transparent 60%)",
                  }}
                />
                {/* Center Mascot */}
                <div className="absolute inset-0 flex items-end justify-center">
                  <div className="relative w-full h-full max-w-[360px] max-h-[360px]">
                    <Image
                      fill
                      className="object-contain"
                      alt={t("problemSection.mascotAlt")}
                      src="/Maskottchen/Maskottchen-Buch.png"
                    />
                  </div>
                </div>
              </div>
              {/* Checkmark List */}
              <h3 className="text-base md:text-lg font-bold text-darkerGray mb-2">
                {t("problemSection.listTitle")}
              </h3>
              <ul className="space-y-3">
                {problemBenefits.map((benefit, idx) => (
                  <BenefitListItem key={idx}>{benefit}</BenefitListItem>
                ))}
              </ul>
            </div>
            {/* ─── RIGHT COLUMN ─── */}
            <div className="order-1 lg:order-2">
              {/* Headline */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray leading-[1.1] tracking-tight mb-8 relative top-1">
                {t("problemSection.titlePre")}{" "}
                <span className="text-primaryOrange">
                  {t("problemSection.titleHighlight")}
                </span>
                <br />
                {t("problemSection.titlePost")}
              </h2>
              {/* Two side-by-side problem cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mb-10">
                <ProblemCard
                  text={t("problemSection.card1Text")}
                  title={t("problemSection.card1Title")}
                  mascot="/Maskottchen/Maskottchen-Unklar.png"
                />
                <ProblemCard
                  paddingClass="p-6"
                  text={t("problemSection.card2Text")}
                  title={t("problemSection.card2Title")}
                  mascot="/Maskottchen/Maskottchen-Weinen.png"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 5. SOLUTION SECTION ─── */}
      <Section className="relative bg-gray-50 py-16 overflow-hidden">
        {/* Subtle ambient glow */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(232,119,32,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <SectionHeader
              pillClassName="!px-3 !py-1.5"
              preTitle={t("solutionSection.eyebrowPre")}
              highlight={t("solutionSection.eyebrowHighlight")}
            />
          </div>
          {/* Main Grid — Demo LEFT, Content RIGHT */}
          <div className="grid lg:grid-cols-[48%_52%] gap-4 lg:gap-14 items-center">
            {/* ─── LEFT — Chat Demo (Hero) ─── */}
            <div className="order-2 lg:order-1">
              <BeaMiniChatDemo />
            </div>
            {/* ─── RIGHT — Content ─── */}
            <div className="order-1 lg:order-2">
              {/* Headline */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray leading-[1.1] tracking-tight mb-5">
                {t("solutionSection.titlePre")}{" "}
                <span className="text-primaryOrange">
                  {t("solutionSection.titleHighlight")}
                </span>{" "}
                {t("solutionSection.titlePost")}
              </h2>
              {/* Description */}
              <p className="text-base md:text-lg text-lightGray leading-relaxed mb-7">
                {t("solutionSection.description")}
              </p>
              {/* Feature List */}
              <ul className="space-y-3 mb-8">
                {solutionFeatures.map((feature, idx) => (
                  <BenefitListItem key={idx}>{feature}</BenefitListItem>
                ))}
              </ul>
              {/* CTA */}
              <Link
                href="/unlimited"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm md:text-base transition-all hover:scale-[1.03]"
                style={{
                  background: ORANGE_GRADIENT,
                  boxShadow: "0 8px 24px rgba(232,119,32,0.3)",
                }}
              >
                {t("solutionSection.ctaLabel")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 6. PROMISE SECTION ─── */}
      <Section className="relative bg-primaryWhite py-16 overflow-hidden">
        {/* Subtle ambient gradient */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(232,119,32,0.06) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-14 md:mb-16">
            <SectionHeader
              pillClassName="!px-3 !py-1.5"
              title={t("promiseSection.eyebrow")}
            />
            {/* Main headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-darkerGray leading-[1.1] tracking-tight mt-6 mb-5 max-w-3xl mx-auto">
              {t("promiseSection.titlePre")}{" "}
              <span className="text-primaryOrange">
                {t("promiseSection.titleHighlight")}
              </span>
            </h2>
            {/* Trust badge — replaces subtitle */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
              {/* User avatars cluster */}
              <div className="flex items-center -space-x-2">
                {TRUST_AVATARS.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative w-9 h-9 rounded-full border-2 border-white bg-white overflow-hidden flex items-center justify-center"
                    style={{
                      zIndex: 10 - idx,
                      boxShadow: "0 2px 8px rgba(232,119,32,0.15)",
                    }}
                  >
                    <div className="relative w-7 h-7">
                      <Image
                        alt=""
                        fill
                        src={src}
                        sizes="28px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
                {/* +More circle */}
                <div
                  className="relative w-9 h-9 rounded-full border-2 border-white flex items-center justify-center"
                  style={{
                    background: ORANGE_GRADIENT,
                    boxShadow: "0 2px 8px rgba(232,119,32,0.25)",
                    zIndex: 5,
                  }}
                >
                  <span className="text-[10px] font-black text-white tracking-tight">
                    10k+
                  </span>
                </div>
              </div>
              {/* Divider — only on desktop */}
              <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-orange-200 to-transparent" />
              {/* Stars + Text */}
              <div className="flex flex-col items-center sm:items-start gap-1">
                {/* 5 stars */}
                <div className="flex items-center gap-0.5">
                  {STAR_INDICES.map((idx) => (
                    <Star
                      key={idx}
                      fill="#E87720"
                      strokeWidth={0}
                      aria-hidden="true"
                      className="w-4 h-4 text-primaryOrange"
                    />
                  ))}
                  <span className="ml-1.5 text-sm font-black text-darkerGray tabular-nums">
                    5.0
                  </span>
                </div>
                {/* Trust text */}
                <div className="text-xs md:text-sm text-lightGray font-medium">
                  Vertraut von{" "}
                  <span className="font-bold text-darkerGray">
                    10.000+ jungen Menschen
                  </span>{" "}
                  in Deutschland
                </div>
              </div>
            </div>
          </div>
          {/* ─── TRANSFORMATIONS — animated drawing path with cards ─── */}
          <TransformationsTimeline />
          {/* ─── CONVERSION CTA — high-stakes call to action ─── */}
          <div
            className="relative rounded-[2rem] overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #E87720 0%, #F08A3C 50%, #F5A155 100%)",
              boxShadow:
                "0 32px 80px rgba(232,119,32,0.35), 0 0 0 1px rgba(255,255,255,0.1)",
            }}
          >
            {/* ─── DECORATIVE BACKGROUND LAYER ─── */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
            >
              {/* Large radial blob top-right */}
              <div
                className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 60%)",
                }}
              />
              {/* Bottom-left blob */}
              <div
                className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 60%)",
                }}
              />
              {/* Subtle pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundSize: "24px 24px",
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                }}
              />
            </div>
            {/* ─── MAIN CONTENT GRID ─── */}
            <div className="relative z-10 grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-center p-8 md:p-12 lg:p-16">
              {/* ─── LEFT — Content ─── */}
              <div>
                {/* Eyebrow pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/20">
                  <div className="relative flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </div>
                  <div className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-widest">
                    {t("promiseSection.timeline.eyebrow")}
                  </div>
                </div>
                {/* Main headline */}
                <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight mb-8">
                  {t("promiseSection.timeline.title")}
                </h3>
                {/* ─── PRIMARY CTA — Store buttons ─── */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <StoreButton
                    href={APP_STORE_URL}
                    imageSrc="/assets/Apple.webp"
                    label={t("downloadBanner.storeLabels.apple")}
                    imageAlt={t("downloadBanner.storeBadges.appleAlt")}
                  />
                  <StoreButton
                    href={PLAY_STORE_URL}
                    imageSrc="/assets/Android.webp"
                    label={t("downloadBanner.storeLabels.google")}
                    imageAlt={t("downloadBanner.storeBadges.googleAlt")}
                  />
                </div>
              </div>
              {/* ─── RIGHT — Mascot only ─── */}
              <div className="relative flex items-center justify-center order-first lg:order-last">
                <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72">
                  <Image
                    fill
                    alt="Bea, dein KI-Coach"
                    className="object-contain"
                    src="/Maskottchen/Maskottchen-Hero.webp"
                    sizes="(max-width: 768px) 192px, (max-width: 1024px) 256px, 288px"
                    style={{
                      filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.25))",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 7. APP FEATURES ─── */}
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
            role="tabpanel"
            id="feature-panel"
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

      {/* ─── 8. RATGEBER ─── */}
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

      {/* ─── 9. EINE APP FÜR JEDEN EINSATZ ─── */}
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

      {/* ─── 10. MINI FAQ ─── */}
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
          <FaqAccordion listLabel={t("faqAccordionLabel")} items={faqItems} />
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

      {/* ─── 11. CTA ─── */}
      <DemoBookingCtaSection />

      {/* MODALS + STICKY */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={closeDownloadModal}
      />
      <StickyMobileCTA />

      {/* STRUCTURED DATA */}
      <StructuredData id="app" data={appStructuredData} />
      <StructuredData id="faq" data={FAQ_STRUCTURED_DATA} />
      <StructuredData id="website" data={websiteStructuredData} />
      <StructuredData id="organization" data={organizationStructuredData} />
    </>
  );
}

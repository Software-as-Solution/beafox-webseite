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
  Users,
  Check,
  Download,
  Building2,
  ArrowRight,
  type LucideIcon,
  Sparkles,
} from "lucide-react";
import TrustBadge from "@/components/Trustbadge";
// TYPES
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
const SCROLL_TOUCH_STYLE = {
  WebkitOverflowScrolling: "touch" as const,
} as const;
const MOCKUP_SHADOW_STYLE = {
  filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.16))",
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
const SOLUTION_AMBIENT_STYLE = {
  background:
    "radial-gradient(ellipse at center, rgba(232,119,32,0.05) 0%, transparent 70%)",
} as const;
const SOLUTION_CTA_STYLE = {
  background: ORANGE_GRADIENT,
  boxShadow: "0 8px 24px rgba(232,119,32,0.3)",
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
// CONSTANTS — Use Cases Section
const USE_CASES_AMBIENT_STYLE = {
  background:
    "radial-gradient(ellipse at center top, rgba(232,119,32,0.05) 0%, transparent 60%)",
} as const;
const USE_CASE_CARD_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFFCF8 100%)",
  border: "1px solid rgba(232,119,32,0.14)",
  boxShadow:
    "0 1px 3px rgba(232,119,32,0.04), 0 16px 48px rgba(232,119,32,0.06)",
} as const;
const USE_CASE_BLOB_STYLE = {
  background:
    "radial-gradient(circle, rgba(232,119,32,0.1) 0%, transparent 60%)",
} as const;
const USE_CASE_DOT_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow: "0 0 0 3px rgba(232,119,32,0.15)",
} as const;
const USE_CASE_PRIMARY_CTA_STYLE = {
  background: ORANGE_GRADIENT,
  boxShadow: "0 8px 20px rgba(232,119,32,0.3)",
} as const;
const USE_CASE_HALO_STYLE = {
  background:
    "radial-gradient(circle at center, rgba(232,119,32,0.18) 0%, transparent 60%)",
} as const;
const USE_CASE_TRUST_LOGOS: Record<string, { src: string; alt: string }[]> = {
  business: [
    { src: "/Partners/3.webp", alt: "IHK Akademie" },
    { src: "/Partners/8.webp", alt: "TechBase Regensburg" },
    { src: "/Partners/1.webp", alt: "Eckert Schulen" },
  ],
  schools: [
    { src: "/Partners/1.webp", alt: "Dr. Robert Eckert Schulen" },
    { src: "/Partners/3.webp", alt: "IHK Akademie" },
    { src: "/Partners/14.webp", alt: "Eduplaces" },
  ],
} as const;
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

// SUBCOMPONENTS
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
        <h3 className="text-2xl font-bold text-darkerGray leading-tight flex-1">
          {title}
        </h3>
        <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bottom-1 sm:bottom-0">
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

export default function HomePage() {
  // HOOKS
  const locale = useLocale();
  const t = useTranslations("home");
  // STATES
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  // CONSTANTS
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
        mascotClassName="scale-90 md:top-0"
        mascotSrc="/Maskottchen/Maskottchen-Handy.png"
        contentClassName="md:left-[7.5%]"
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
        storeButtons={{
          appleLabel: t("downloadBanner.storeLabels.apple"),
          appleAlt: t("downloadBanner.storeBadges.appleAlt"),
          googleLabel: t("downloadBanner.storeLabels.google"),
          googleAlt: t("downloadBanner.storeBadges.googleAlt"),
          appStoreUrl: "https://apps.apple.com/de/app/beafox/id6746110612",
          playStoreUrl:
            "https://play.google.com/store/apps/details?id=com.tapelea.beafox&pcampaignid=web_share",
        }}
      />

      {/* ─── 2. SOLUTION SECTION ─── */}
      <Section className="relative bg-gray-50 py-10 sm:py-16 overflow-hidden">
        <div
          aria-hidden="true"
          style={SOLUTION_AMBIENT_STYLE}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none"
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-0 sm:mb-14 md:mb-16">
            <ScrollStrikethroughHeading
              oldText={t("beaChatDemo.titleOld")}
              newPrefix={t("beaChatDemo.titleNewPrefix")}
              newHighlight={t("beaChatDemo.titleNewHighlight")}
            />
          </div>
          <div className="grid lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-center">
            <div className="relative bottom-12 sm:bottom-0 order-2 lg:order-1">
              <BeaChatDemo />
              <div className="mt-8 lg:hidden text-center">
                <Link
                  href="/bea-ai"
                  style={SOLUTION_CTA_STYLE}
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm md:text-base transition-all hover:scale-[1.03] hover:shadow-xl"
                >
                  {t("solutionSection.ctaLabel")}
                  <ArrowRight
                    aria-hidden="true"
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 items-center justify-center">
              <div className="hidden md:inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-primaryOrange/10 border border-primaryOrange/20 mb-5">
                <Sparkles
                  aria-hidden="true"
                  className="w-6 h-6 text-primaryOrange"
                />
                <span className="text-base font-bold text-primaryOrange uppercase tracking-wider">
                  {t("solutionSection.eyebrow")}
                </span>
              </div>
              <p className="text-base relative bottom-4 sm:bottom-0 sm:text-lg md:text-xl text-darkerGray leading-relaxed mb-0 sm:mb-8 font-medium">
                {t("solutionSection.description")}
              </p>
              <ul className="space-y-3.5 mb-9">
                {solutionFeatures.map((feature, idx) => (
                  <BenefitListItem key={idx}>{feature}</BenefitListItem>
                ))}
              </ul>
              <Link
                href="/bea-ai"
                style={SOLUTION_CTA_STYLE}
                className="group hidden lg:inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm md:text-base transition-all hover:scale-[1.03] hover:shadow-xl"
              >
                {t("solutionSection.ctaLabel")}
                <ArrowRight
                  aria-hidden="true"
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 3. PROBLEM SECTION ─── */}
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
          <div className="text-center mb-10">
            <SectionHeader
              preTitle={t("problemSection.eyebrowPre")}
              highlight={t("problemSection.eyebrowHighlight")}
            />
          </div>
          <div className="grid lg:grid-cols-[45%_55%] gap-6 lg:gap-10 items-start mt-2">
            <div className="order-2 lg:order-1 relative bottom-10 sm:bottom-0">
              <div
                className="relative aspect-[4/2] rounded-2xl overflow-hidden mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 50%, #FFE0C2 100%)",
                }}
              >
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
              <h3 className="text-lg font-bold text-darkerGray mb-2">
                {t("problemSection.listTitle")}
              </h3>
              <ul className="space-y-3">
                {problemBenefits.map((benefit, idx) => (
                  <BenefitListItem key={idx}>{benefit}</BenefitListItem>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray leading-[1.1] tracking-tight mb-8 relative top-1">
                {t("problemSection.titlePre")}{" "}
                <span className="text-primaryOrange">
                  {t("problemSection.titleHighlight")}
                </span>
                <br />
                {(() => {
                  const titlePost = t("problemSection.titlePost");
                  const highlight = "nächster Schritt.";
                  const fallbackHighlight = "nächster Schritt";
                  const normalizedTitlePost = titlePost.toLocaleLowerCase();
                  const startIndex = normalizedTitlePost.indexOf(
                    highlight.toLocaleLowerCase(),
                  );
                  const activeHighlight =
                    startIndex !== -1 ? highlight : fallbackHighlight;
                  const finalStartIndex =
                    startIndex !== -1
                      ? startIndex
                      : normalizedTitlePost.indexOf(
                          fallbackHighlight.toLocaleLowerCase(),
                        );

                  if (finalStartIndex === -1) return titlePost;

                  const endIndex = finalStartIndex + activeHighlight.length;
                  return (
                    <>
                      {titlePost.slice(0, finalStartIndex)}
                      <span className="text-primaryOrange">
                        {titlePost.slice(finalStartIndex, endIndex)}
                      </span>
                      {titlePost.slice(endIndex)}
                    </>
                  );
                })()}
              </h2>
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

      {/* ─── 4. PROMISE SECTION ─── */}
      <Section className="relative bg-primaryWhite py-16 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(232,119,32,0.06) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <SectionHeader
              preTitle={t("promiseSection.eyebrow")}
              highlight={t("promiseSection.eyebrowHighlight")}
            />
          </div>
          <div className="text-center mb-4 sm:mb-12 mt-4 relative bottom-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-darkerGray leading-[1.1] tracking-tight mt-6 mb-5 max-w-3xl mx-auto">
              {t("promiseSection.titlePre")}{" "}
              <span className="text-primaryOrange">
                {t("promiseSection.titleHighlight")}
              </span>
            </h2>
            <TrustBadge
              centerContent
              className="mx-auto justify-center items-center"
            />
          </div>
          <TransformationsTimeline />
          <div
            className="relative rounded-[2rem] overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #E87720 0%, #F08A3C 50%, #F5A155 100%)",
              boxShadow:
                "0 32px 80px rgba(232,119,32,0.35), 0 0 0 1px rgba(255,255,255,0.1)",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
            >
              <div
                className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 60%)",
                }}
              />
              <div
                className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 60%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundSize: "24px 24px",
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                }}
              />
            </div>
            <div className="relative z-10 grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-center p-8 md:p-12 lg:p-16">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md mb-2 sm:mb-6 border border-white/20">
                  <div className="relative flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest">
                    {t("promiseSection.timeline.eyebrow")}
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight mb-4 sm:mb-8">
                  {t("promiseSection.timeline.title")}
                </h3>
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
              <div className="relative flex items-center justify-center order-first lg:order-last">
                <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72">
                  <Image
                    fill
                    alt="Bea, dein KI-Coach"
                    className="object-contain scale-110 sm:scale-125 md:scale-150"
                    src="/Maskottchen/Maskottchen-Handy.png"
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

      {/* ─── 5. APP FEATURES ─── */}
      <Section className="bg-primaryWhite py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <SectionHeader
              pillClassName="mb-4 md:mb-5"
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
          </div>
          <div className="relative mb-6 md:mb-8 w-full mx-auto">
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-primaryWhite to-transparent z-10 pointer-events-none md:hidden"
            />
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-primaryWhite to-transparent z-10 pointer-events-none"
            />
            <div
              style={SCROLL_TOUCH_STYLE}
              className="overflow-x-auto scrollbar-hide pb-2 md:pb-0 scroll-smooth px-4 md:px-0"
            >
              <div
                role="tablist"
                aria-label="App Features"
                className="flex gap-2 justify-start md:justify-center min-w-max md:min-w-0"
              >
                {APP_FEATURES.map((feature, index) => (
                  <button
                    role="tab"
                    key={feature.id}
                    aria-controls="feature-panel"
                    onClick={() => selectFeature(index)}
                    aria-selected={selectedFeature === index}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all whitespace-nowrap flex-shrink-0 active:scale-95 ${
                      selectedFeature === index
                        ? "bg-primaryOrange text-white shadow-md shadow-primaryOrange/20"
                        : "bg-gray-100 text-darkerGray hover:bg-gray-200"
                    }`}
                  >
                    {t(`appFeatures.${feature.id}.title`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              role="tabpanel"
              id="feature-panel"
              key={selectedFeature}
              exit={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              initial={{ opacity: 0, y: 12 }}
              className="w-full max-w-5xl mx-auto"
            >
              <div
                style={FEATURE_CARD_STYLE}
                className="relative rounded-3xl overflow-hidden px-5 py-6 md:px-10 md:py-8"
              >
                <div
                  style={GLOW(0.08)}
                  aria-hidden="true"
                  className="absolute -top-20 -left-20 w-[260px] h-[260px] rounded-full pointer-events-none"
                />
                <div className="relative z-10 grid md:grid-cols-[40%_60%] gap-5 md:gap-8 items-center">
                  <motion.div
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="flex justify-center order-2 md:order-1"
                  >
                    <div className="relative">
                      <div
                        style={GLOW(0.1)}
                        aria-hidden="true"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full pointer-events-none"
                      />
                      <Image
                        width={240}
                        height={520}
                        loading="lazy"
                        src={activeFeature.mockup}
                        style={MOCKUP_SHADOW_STYLE}
                        className="relative z-10 object-contain w-[150px] h-auto md:w-[200px] lg:w-[220px]"
                        alt={t("howItWorks.mockupAlt", {
                          feature: t(`appFeatures.${activeFeature.id}.title`),
                        })}
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    animate={{ opacity: 1, x: 0 }}
                    className="order-1 md:order-2"
                    initial={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-darkerGray mb-2">
                      {t(`appFeatures.${activeFeature.id}.title`)}
                    </h3>
                    <p className="text-sm md:text-[15px] text-lightGray leading-relaxed mb-4">
                      {t(`appFeatures.${activeFeature.id}.description`)}
                    </p>
                    {activeHighlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {activeHighlights.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-darkerGray"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <Button
                        variant="primary"
                        onClick={openDownloadModal}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto !px-5 !py-2.5 text-sm"
                      >
                        <Download aria-hidden="true" className="w-3.5 h-3.5" />
                        {t("howItWorks.ctaDownload")}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Section>

      {/* ─── 6. RATGEBER ─── */}
      <ContentShowcaseSection
        headerMotionDuration={0.5}
        sectionClassName="bg-gray-50 py-16"
        headerMotionClassName="text-center mb-8"
        sectionHeaderProps={{
          pillClassName: "mb-4 sm:mb-6",
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

      {/* ─── 7. B2B USE CASES ─── */}
      <Section className="relative bg-primaryWhite py-16 overflow-hidden">
        <div
          aria-hidden="true"
          style={USE_CASES_AMBIENT_STYLE}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] pointer-events-none"
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7 max-w-6xl mx-auto">
            {USE_CASES.map((useCase, index) => (
              <motion.div
                key={useCase.id}
                viewport={{ once: true }}
                style={USE_CASE_CARD_STYLE}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative h-full rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primaryOrange/40"
              >
                <div
                  aria-hidden="true"
                  style={USE_CASE_BLOB_STYLE}
                  className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                />
                <div className="relative z-10 p-6 md:p-8 lg:p-10 pb-8">
                  <div className="mb-4 md:mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        style={USE_CASE_DOT_STYLE}
                        className="w-2 h-2 rounded-full"
                      />
                      <span className="text-[11px] md:text-xs font-bold text-primaryOrange uppercase tracking-widest">
                        {t(`useCases.${useCase.id}.eyebrow`)}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl lg:text-[32px] font-black text-darkerGray leading-[1.1]">
                      {t(`useCases.${useCase.id}.title`)}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                    <div className="flex flex-col h-full">
                      <p className="text-sm md:text-base text-lightGray leading-relaxed mb-2 sm:mb-6 max-w-md">
                        {t(`useCases.${useCase.id}.description`)}
                      </p>
                      <div className="flex flex-col gap-2 mb-6 text-xs text-lightGray">
                        <div className="flex items-center -space-x-1.5">
                          {(USE_CASE_TRUST_LOGOS[useCase.id] ?? []).map(
                            (logo) => (
                              <div
                                key={`${useCase.id}-${logo.src}`}
                                className="w-12 h-12 rounded-full bg-white border border-primaryOrange/50 shadow-sm overflow-hidden p-1"
                              >
                                <Image
                                  width={100}
                                  height={100}
                                  src={logo.src}
                                  alt={logo.alt}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            ),
                          )}
                        </div>
                        <span className="text-sm">
                          {t(`useCases.${useCase.id}.trustNote`)}
                        </span>
                      </div>
                      <Link
                        href={useCase.href}
                        style={USE_CASE_PRIMARY_CTA_STYLE}
                        className="hidden md:inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm md:text-base transition-all hover:scale-[1.03] hover:shadow-xl mt-2 md:mt-3 self-start"
                      >
                        {t(`useCases.${useCase.id}.ctaPrimary`)}
                        <ArrowRight
                          aria-hidden="true"
                          className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    </div>
                    <div className="relative w-full md:w-[160px] lg:w-[180px] flex items-center justify-center md:justify-end mx-auto">
                      <div
                        aria-hidden="true"
                        style={USE_CASE_HALO_STYLE}
                        className="absolute top-1/2 right-0 -translate-y-1/2 w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-full pointer-events-none"
                      />
                      <Image
                        width={300}
                        height={300}
                        loading="lazy"
                        aria-hidden="true"
                        src={useCase.mascot}
                        alt={useCase.mascotAlt}
                        className="relative object-contain scale-125 w-[120px] h-[120px] md:w-[170px] md:h-[170px] lg:w-[200px] lg:h-[200px] drop-shadow-[0_16px_32px_rgba(232,119,32,0.2)] group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <Link
                      href={useCase.href}
                      style={USE_CASE_PRIMARY_CTA_STYLE}
                      className="md:hidden inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm transition-all hover:shadow-xl self-start"
                    >
                      {t(`useCases.${useCase.id}.ctaPrimary`)}
                      <ArrowRight
                        aria-hidden="true"
                        className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── 8. MINI FAQ ─── */}
      <Section className="bg-gray-50 py-10 md:py-14">
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

      {/* ─── 9. CTA ─── */}
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

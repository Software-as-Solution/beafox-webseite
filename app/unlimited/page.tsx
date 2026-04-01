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
import TrustSignalBar from "@/components/TrustSignalBar";
import StructuredData from "@/components/StructuredData";
import DownloadBannerSection from "@/components/DownloadBannerSection";
// IMPORTS
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState, useCallback, useMemo } from "react";
// ICONS
import {
  X,
  Zap,
  User,
  Check,
  Users,
  Award,
  Clock,
  School,
  Target,
  Shield,
  Download,
  BookOpen,
  Sparkles,
  Briefcase,
  TrendingUp,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

// TYPES
interface Plan {
  id: string;
  title: string;
  price: string;
  period: string;
  monthly?: boolean;
  popular?: boolean;
  features: string[];
  excluded?: string[];
}
type IconId =
  | "school"
  | "graduationCap"
  | "briefcase"
  | "user"
  | "users"
  | "award"
  | "clock"
  | "trendingUp"
  | "bookOpen"
  | "target"
  | "zap"
  | "shield";

// CONSTANTS
const ICON_MAP: Record<IconId, LucideIcon> = {
  zap: Zap,
  user: User,
  users: Users,
  award: Award,
  clock: Clock,
  school: School,
  target: Target,
  shield: Shield,
  bookOpen: BookOpen,
  briefcase: Briefcase,
  trendingUp: TrendingUp,
  graduationCap: GraduationCap,
};
const GRADIENT_CARD_STYLE = {
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
} as const;
const PRO_CARD_STYLE = {
  border: "2px solid #E87720",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
  boxShadow:
    "0 20px 60px rgba(232,119,32,0.15), 0 0 0 1px rgba(232,119,32,0.1)",
} as const;
// HELPERS FUNCTIONS
const GLOW = (opacity: number) => ({
  background: `radial-gradient(circle, rgba(232,119,32,${opacity}) 0%, transparent 70%)`,
});

export default function BeAFoxUnlimitedPage() {
  // HOOKS
  const t = useTranslations("unlimited");
  // STATES
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
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
  // CONSTANTS
  const howItWorksSteps = useMemo(
    () =>
      (t.raw("howItWorks.steps") as { title: string; description: string }[]) ??
      [],
    [t],
  );
  const appFeatures = useMemo(
    () =>
      (t.raw("appFeatures.items") as {
        id: string;
        title: string;
        description: string;
        mockup: string;
      }[]) ?? [],
    [t],
  );
  const whyUnlimitedFeatures = useMemo(
    () =>
      (t.raw("whyUnlimited.features") as {
        iconId: IconId;
        title: string;
        description: string;
      }[]) ?? [],
    [t],
  );
  const plans: Plan[] = useMemo(
    () => (t.raw("pricing.plans") as Plan[]) ?? [],
    [t],
  );
  const activeFeature = appFeatures[selectedFeature];

  return (
    <>
      {/* ─── 1. HERO ─── */}
      <LandingHero
        badge={t("hero.tag")}
        mascotAlt={t("hero.tag")}
        cardText={t("hero.description")}
        mascotSrc="/Maskottchen/Maskottchen-Unlimited.png"
        title={
          <>
            {t("hero.title")}{" "}
            <span className="text-primaryOrange">{t("hero.highlight")}</span>
          </>
        }
        actions={
          <>
            <Button
              onClick={openDownloadModal}
              variant="primary"
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Download
                className="w-3.5 h-3.5 md:w-4 md:h-4"
                aria-hidden="true"
              />
              {t("hero.cta.download")}
            </Button>
          </>
        }
      />
      {/* ─── 2. TRUST SIGNAL ─── */}
      <TrustSignalBar showReviews />
      {/* ─── 3. FÜR WEN ─── */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <motion.div
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <SectionHeader
            pillClassName="mb-4 md:mb-6"
            title={
              <>
                {t("targetGroupsSection.titlePre")}
                <span className="text-primaryOrange">
                  {t("targetGroupsSection.titleHighlight")}
                </span>
                {t("targetGroupsSection.titlePost")}
              </>
            }
          />
        </motion.div>
        <RatgeberSection variant="unlimitedTargets" />
      </Section>
      {/* ─── 4. SO FUNKTIONIERT'S ─── */}
      <Section className="bg-gray-50 py-8 md:py-12 lg:py-16">
        <motion.div
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <SectionHeader
            pillClassName="mb-4 md:mb-6"
            title={
              <>
                {t("howItWorks.title.pre")}{" "}
                <span className="text-primaryOrange">
                  {t("howItWorks.title.highlight")}
                </span>
              </>
            }
          />
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(232,119,32,0.2) 15%, rgba(232,119,32,0.2) 85%, transparent)",
            }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.title}
                viewport={{ once: true }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative mb-4">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold transition-all group-hover:scale-110"
                    style={{
                      color: "#E87720",
                      border: "2px solid rgba(232,119,32,0.15)",
                      boxShadow: "0 4px 12px rgba(232,119,32,0.08)",
                      background:
                        "linear-gradient(135deg, #FFF8F3 0%, #FFF2E8 100%)",
                    }}
                  >
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-darkerGray mb-1.5 group-hover:text-primaryOrange transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-lightGray leading-relaxed max-w-[200px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
      {/* ─── 5. APP FEATURES + MOCKUPS ─── */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <motion.div
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <SectionHeader
            pillClassName="mb-4 md:mb-6"
            title={
              <>
                {t("appFeatures.title.pre")}{" "}
                <span className="text-primaryOrange">
                  {t("appFeatures.title.highlight")}
                </span>
              </>
            }
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-3">
            {appFeatures.map((feature, index) => (
              <motion.button
                type="button"
                key={feature.id}
                viewport={{ once: true }}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                onClick={() => selectFeature(index)}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={`w-full text-left rounded-xl p-4 md:p-5 border transition-all ${
                  selectedFeature === index
                    ? "border-primaryOrange/30 shadow-md"
                    : "border-gray-200 hover:border-primaryOrange/20"
                }`}
                style={
                  selectedFeature === index ? GRADIENT_CARD_STYLE : undefined
                }
              >
                <h3
                  className={`text-base md:text-lg font-bold mb-1 transition-colors ${
                    selectedFeature === index
                      ? "text-primaryOrange"
                      : "text-darkerGray"
                  }`}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-lightGray leading-relaxed">
                  {feature.description}
                </p>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center justify-center lg:sticky lg:top-24">
            <div className="relative">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] md:w-[340px] md:h-[340px] rounded-full pointer-events-none"
                style={GLOW(0.1)}
                aria-hidden="true"
              />
              <motion.div
                key={selectedFeature}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={
                    activeFeature?.mockup ?? "/assets/Mockups/Mockup-Start.png"
                  }
                  alt={t("appFeatures.mockupAlt", {
                    feature:
                      activeFeature?.title ??
                      t("appFeatures.defaultFeatureName"),
                  })}
                  width={280}
                  height={600}
                  loading="lazy"
                  className="relative z-10 object-contain w-[200px] md:w-[260px] lg:w-[280px] h-auto"
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.18))",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </Section>
      {/* ─── 6. WARUM UNLIMITED ─── */}
      <Section className="bg-gray-50 py-8 md:py-12 lg:py-16">
        <motion.div
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <SectionHeader
            pillClassName="mb-4 md:mb-6"
            title={
              <>
                {t("whyUnlimited.title.pre")}{" "}
                <span className="text-primaryOrange">
                  {t("whyUnlimited.title.highlight")}
                </span>
              </>
            }
          />
        </motion.div>
        <div className="max-w-6xl mx-auto">
          {/* Top row: 3 cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">
            {whyUnlimitedFeatures.slice(0, 3).map((feature, index) => {
              const Icon = ICON_MAP[feature.iconId] ?? BookOpen;
              return (
                <motion.div
                  key={feature.title}
                  viewport={{ once: true }}
                  style={GRADIENT_CARD_STYLE}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative overflow-hidden rounded-2xl p-5 md:p-6 border border-primaryOrange/15 hover:border-primaryOrange/30 transition-all hover:shadow-lg group"
                >
                  <div className="relative z-10">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{
                        background: "rgba(232,119,32,0.1)",
                        border: "1px solid rgba(232,119,32,0.15)",
                      }}
                    >
                      <Icon
                        aria-hidden="true"
                        className="w-5 h-5 text-primaryOrange"
                      />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-darkerGray mb-1 group-hover:text-primaryOrange transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-lightGray leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {/* Bottom row: 2 cards + Bea mascot card */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {whyUnlimitedFeatures.slice(3, 5).map((feature, index) => {
              const Icon = ICON_MAP[feature.iconId] ?? BookOpen;
              return (
                <motion.div
                  key={feature.title}
                  viewport={{ once: true }}
                  style={GRADIENT_CARD_STYLE}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index + 3) * 0.08 }}
                  className="relative overflow-hidden rounded-2xl p-5 md:p-6 border border-primaryOrange/15 hover:border-primaryOrange/30 transition-all hover:shadow-lg group"
                >
                  <div className="relative z-10">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{
                        background: "rgba(232,119,32,0.1)",
                        border: "1px solid rgba(232,119,32,0.15)",
                      }}
                    >
                      <Icon
                        className="w-5 h-5 text-primaryOrange"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-darkerGray mb-1 group-hover:text-primaryOrange transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-lightGray leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            {/* Bea mascot card */}
            <motion.div
              viewport={{ once: true }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative overflow-hidden rounded-2xl p-5 md:p-6 flex flex-col items-center justify-center text-center"
              style={{
                border: "2px solid rgba(232,119,32,0.2)",
                background: "linear-gradient(135deg, #FFF8F3 0%, #FFF2E8 100%)",
              }}
            >
              {whyUnlimitedFeatures[5] && (
                <>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <h3 className="text-base md:text-lg font-bold text-primaryOrange leading-tight">
                      {whyUnlimitedFeatures[5].title.split(" ").map((part) => (
                        <span key={part} className="block">
                          {part}
                        </span>
                      ))}
                    </h3>
                    <Image
                      alt=""
                      width={200}
                      height={200}
                      aria-hidden="true"
                      src="/Maskottchen/Maskottchen-Hero.png"
                      className="object-contain w-16 h-16 md:w-20 md:h-20 scale-150"
                      style={{
                        filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.08))",
                      }}
                    />
                  </div>
                  <p className="text-xs md:text-sm text-lightGray leading-relaxed">
                    {whyUnlimitedFeatures[5].description}
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </Section>
      {/* ─── 7. PRICING ─── */}
      <Section className="bg-primaryWhite py-10 md:py-16 lg:py-20">
        <motion.div
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-14"
        >
          <SectionHeader
            pillClassName="mb-4 md:mb-6"
            subtitle={t("pricing.subtitle")}
            title={
              <>
                {t("pricing.title.pre")}{" "}
                <span className="text-primaryOrange">
                  {t("pricing.title.highlight")}
                </span>
              </>
            }
          />
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, index) => {
            const isPro = plan.popular === true;
            return (
              <motion.div
                key={plan.id}
                viewport={{ once: true }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                style={isPro ? PRO_CARD_STYLE : undefined}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl flex flex-col ${
                  isPro
                    ? "p-6 md:p-8 md:-my-4 z-10"
                    : "p-5 md:p-7 border border-gray-200"
                }`}
              >
                {isPro && (
                  <div
                    style={GLOW(0.08)}
                    aria-hidden="true"
                    className="absolute -top-16 -right-16 w-[200px] h-[200px] rounded-full pointer-events-none"
                  />
                )}
                <div className="relative z-10 flex flex-col h-full">
                  {isPro && (
                    <div className="inline-flex items-center gap-1.5 bg-primaryOrange text-white text-[11px] font-bold uppercase tracking-wide rounded-full px-3 py-1 w-fit mb-3">
                      <Sparkles className="w-3 h-3" aria-hidden="true" />
                      {t("pricing.badges.popular")}
                    </div>
                  )}
                  {plan.monthly && (
                    <div className="inline-flex items-center gap-1.5 bg-primaryOrange/10 text-primaryOrange text-[11px] font-bold uppercase tracking-wide rounded-full px-3 py-1 w-fit mb-3">
                      {t("pricing.badges.monthlyCancelable")}
                    </div>
                  )}
                  <h3
                    className={`font-bold text-darkerGray mb-3 ${isPro ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}
                  >
                    {plan.title}
                  </h3>
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`font-bold text-primaryOrange ${isPro ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"}`}
                      >
                        {plan.price}
                      </span>
                      <span className="text-sm text-lightGray">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 mb-6 flex-1" role="list">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        <Check
                          aria-hidden="true"
                          className="w-4 h-4 text-primaryOrange flex-shrink-0 mt-0.5"
                        />
                        <span className="text-darkerGray">{feature}</span>
                      </li>
                    ))}
                    {plan.excluded?.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm opacity-40"
                      >
                        <X
                          aria-hidden="true"
                          className="w-4 h-4 text-lightGray flex-shrink-0 mt-0.5"
                        />
                        <span className="text-lightGray line-through">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={openDownloadModal}
                    variant={isPro ? "primary" : "outline"}
                    className={`w-full flex items-center justify-center gap-2 mt-auto text-sm md:text-base ${
                      isPro ? "!py-3 md:!py-4" : "!py-2.5 md:!py-3"
                    }`}
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    {t("pricing.cta.start")}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Conversion hint */}
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto mt-10 md:mt-12"
        >
          <div
            className="relative overflow-hidden rounded-2xl p-5 md:p-8"
            style={{
              border: "2px solid rgba(232,119,32,0.2)",
              boxShadow: "0 8px 32px rgba(232,119,32,0.1)",
              background:
                "linear-gradient(135deg, #FFF8F3 0%, #FFF2E8 60%, #FFEBDB 100%)",
            }}
          >
            {/* Glow */}
            <div
              aria-hidden="true"
              className="absolute -top-16 -left-16 w-[200px] h-[200px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(232,119,32,0.08) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 flex items-center gap-4 md:gap-6">
              <Image
                alt=""
                width={240}
                height={240}
                aria-hidden="true"
                src="/Maskottchen/Maskottchen-Hero.png"
                className="object-contain w-16 h-16 md:w-24 md:h-24 flex-shrink-0 scale-150"
                style={{
                  filter: "drop-shadow(0 6px 16px rgba(232,119,32,0.2))",
                }}
              />
              <div>
                <p className="text-sm md:text-base font-bold text-darkerGray mb-1">
                  {t("pricing.conversionHint.lead")}
                </p>
                <p className="text-xs md:text-sm text-lightGray leading-relaxed">
                  {t("pricing.conversionHint.body")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>
      {/* ─── 8. CTA ─── */}
      <DownloadBannerSection />
      {/* ─── 9. STRUCTURED DATA ─── */}
      <StructuredData
        id="unlimited-product"
        data={{
          name: "BeAFox Unlimited",
          "@type": "SoftwareApplication",
          operatingSystem: "iOS, Android",
          "@context": "https://schema.org",
          applicationCategory: "EducationalApplication",
          offers: {
            lowPrice: "3.99",
            highPrice: "19.99",
            priceCurrency: "EUR",
            "@type": "AggregateOffer",
          },
          aggregateRating: {
            bestRating: "5",
            ratingCount: "71",
            ratingValue: "5.0",
            "@type": "AggregateRating",
          },
        }}
      />
      {/* DOWNLOAD MODAL */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={closeDownloadModal}
      />
    </>
  );
}

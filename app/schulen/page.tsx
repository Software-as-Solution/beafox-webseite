"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// CUSTOM COMPONENTS
import Button from "@/components/Button";
import Section from "@/components/Section";
import LandingHero from "@/components/LandingHero";
import SectionHeader from "@/components/SectionHeader";
import TrustSignalBar from "@/components/TrustSignalBar";
import StructuredData from "@/components/StructuredData";
import DemoBookingCtaSection from "@/components/DemoBookingCtaSection";
// IMPORTS
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState, useCallback, useMemo } from "react";
// ICONS
import {
  Zap,
  Check,
  Award,
  Clock,
  Shield,
  Target,
  Calendar,
  BarChart,
  Sparkles,
  Presentation,
} from "lucide-react";

// CONSTANTS
const GRADIENT_CARD_STYLE = {
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
} as const;
const CAL_URL = "https://app.cal.eu/beafox";
const BENEFIT_ICONS = [Clock, BarChart, Target, Shield, Award, Zap] as const;
// HELPERS FUNCTIONS
const GLOW = (opacity: number) => ({
  background: `radial-gradient(circle, rgba(232,119,32,${opacity}) 0%, transparent 70%)`,
});
// TYPES
type SchoolProcessStep = {
  step: string;
  title: string;
  image: string;
  description: string;
};
type SDG = {
  id: string;
  name: string;
};

export default function ForSchoolsPage() {
  // HOOKS
  const t = useTranslations("schools");
  const home = useTranslations("home");
  // STATES
  const [selectedDashboard, setSelectedDashboard] = useState(0);
  // CONSTANTS
  const benefits = useMemo(() => {
    const raw =
      (t.raw("benefits.items") as { title: string; description: string }[]) ??
      [];
    return raw.map((b, i) => ({ ...b, icon: BENEFIT_ICONS[i] }));
  }, [t]);
  const sdgs = useMemo(() => {
    const raw = home.raw("whyFinance.sdgs") as SDG[] | undefined;
    return Array.isArray(raw) ? raw : [];
  }, [home]);
  const dashboardFeatures = useMemo(
    () =>
      (t.raw("dashboard.items") as {
        id: string;
        title: string;
        description: string;
        mockup: string;
      }[]) ?? [],
    [t],
  );
  const processSteps = useMemo((): SchoolProcessStep[] => {
    const block = t.raw("schoolProcess") as
      | { steps?: SchoolProcessStep[] }
      | undefined;
    const steps = block?.steps;
    return Array.isArray(steps) ? steps : [];
  }, [t]);
  const activeDashboard = dashboardFeatures[selectedDashboard];
  // FUNCTIONS
  const selectDashboard = useCallback(
    (index: number) => setSelectedDashboard(index),
    [],
  );

  return (
    <>
      {/* ─── 1. HERO ─── */}
      <LandingHero
        badge={t("hero.badge")}
        mascotAlt={t("hero.badge")}
        cardText={t("hero.description")}
        mascotSrc="/Maskottchen/Maskottchen-School.webp"
        title={
          <>
            <span className="text-primaryOrange">
              {t("hero.priceHighlight")}
            </span>{" "}
            {(() => {
              const post = t("hero.pricePost");
              const token = t("hero.beaName");
              const idx = post.indexOf(token);
              if (idx === -1) return post;

              return (
                <>
                  {post.slice(0, idx)}
                  <span className="text-primaryOrange">{token}</span>
                  {post.slice(idx + token.length)}
                </>
              );
            })()}
          </>
        }
        actions={
          <>
            <Button
              href="/kontakt"
              variant="primary"
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Presentation
                className="w-3.5 h-3.5 md:w-4 md:h-4"
                aria-hidden="true"
              />
              {t("hero.ctaPartner")}
            </Button>
            <Button
              href={CAL_URL}
              variant="outline"
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Calendar
                aria-hidden="true"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
              {t("hero.ctaBook")}
            </Button>
          </>
        }
      />
      {/* ─── 2. TRUST SIGNAL ─── */}
      <TrustSignalBar
        showPartners
        preTitle="15+ Schulen"
        highlight="vertrauen bereits auf Bea"
      />
      {/* ─── 3. PROBLEM ─── */}
      <Section className="bg-primaryWhite py-10 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            <SectionHeader
              titleClassName="!text-xl md:!text-2xl lg:!text-3xl"
              title={
                <>
                  {t("problemSolution.problemHeaderPre")}{" "}
                  <span className="text-red-500">
                    {t("problemSolution.problemHeaderHighlight")}
                  </span>
                </>
              }
            />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
            {/* Left: Mascot */}
            <motion.div
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative flex items-center justify-center"
            >
              <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%)",
                }}
              />
              <Image
                width={500}
                height={500}
                alt={t("images.problemMascotAlt")}
                src="/Maskottchen/Maskottchen-Langweilig.webp"
                style={{ filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.1))" }}
                className="relative z-10 object-contain w-[280px] md:w-[360px] lg:w-[420px] h-auto"
              />
            </motion.div>
            {/* Right: Pain points */}
            <motion.div
              viewport={{ once: true }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="mb-6 pb-6 border-b border-gray-100">
                <motion.span
                  viewport={{ once: true }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="text-4xl md:text-6xl font-bold text-red-500 inline-block"
                  style={{
                    textShadow:
                      "0 0 20px rgba(239,68,68,0.3), 0 0 40px rgba(239,68,68,0.15)",
                  }}
                >
                  {t("problemSolution.problemShockStatValue")}
                </motion.span>
                <h3 className="text-lg md:text-xl font-bold text-darkerGray mt-2 mb-2">
                  {t("problemSolution.problemShockStatHeadline")}
                </h3>
                <p className="text-sm md:text-base text-lightGray leading-relaxed">
                  {t("problemSolution.problemShockStatBody")}
                </p>
              </div>
              <div className="space-y-2.5">
                {(t.raw("problemSolution.problemBullets") as string[]).map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-xl p-3 md:p-3.5 border border-red-100 bg-red-50/30"
                    >
                      <div
                        aria-hidden="true"
                        className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 flex-shrink-0"
                      />
                      <span className="text-sm md:text-base text-darkerGray leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </Section>
      {/* ─── 4. SOLUTION ─── */}
      <Section className="bg-gray-50 py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            <SectionHeader
              titleClassName="!text-xl md:!text-2xl lg:!text-3xl"
              title={
                <>
                  {t("problemSolution.solutionHeaderPre")}{" "}
                  <span className="text-primaryOrange">
                    {t("problemSolution.solutionHeaderHighlight")}
                  </span>
                </>
              }
            />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="mb-6 pb-6 border-b border-primaryOrange/10">
                <motion.span
                  viewport={{ once: true }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="text-4xl md:text-6xl font-bold text-primaryOrange inline-block"
                  style={{
                    textShadow:
                      "0 0 20px rgba(232,119,32,0.3), 0 0 40px rgba(232,119,32,0.15)",
                  }}
                >
                  {t("problemSolution.solutionImpactStatValue")}
                </motion.span>
                <h3 className="text-lg md:text-xl font-bold text-darkerGray mt-2 mb-2">
                  {t("problemSolution.solutionImpactStatHeadline")}
                </h3>
                <p className="text-sm md:text-base text-lightGray leading-relaxed">
                  {t("problemSolution.solutionText")}{" "}
                  {t("problemSolution.solutionText2")}
                </p>
              </div>
              <div className="space-y-2.5 mb-6">
                {(t.raw("problemSolution.solutionBullets") as string[]).map(
                  (item) => (
                    <div
                      key={item}
                      style={GRADIENT_CARD_STYLE}
                      className="flex items-start gap-3 rounded-xl p-3 md:p-3.5 border border-primaryOrange/15"
                    >
                      <div
                        aria-hidden="true"
                        className="w-1.5 h-1.5 rounded-full bg-primaryOrange mt-2.5 flex-shrink-0"
                      />
                      <span className="text-sm md:text-base text-darkerGray leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <Button
                href="/kontakt"
                variant="primary"
                className="flex items-center justify-center gap-2 !px-6 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base w-full sm:w-auto"
              >
                <Presentation className="w-4 h-4" aria-hidden="true" />
                {t("problemSolution.ctaButton")}
              </Button>
            </motion.div>
            {/* Right: Mascot */}
            <motion.div
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative flex items-center justify-center order-1 md:order-2"
            >
              <div
                style={GLOW(0.06)}
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full pointer-events-none"
              />
              <Image
                width={500}
                height={500}
                alt={t("images.solutionMascotAlt")}
                src="/Maskottchen/Maskottchen-Freude.webp"
                style={{ filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.1))" }}
                className="relative z-10 object-contain w-[280px] md:w-[360px] lg:w-[420px] h-auto"
              />
            </motion.div>
          </div>
        </div>
      </Section>
      {/* ─── 5. BENEFITS ─── */}
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
                {t("benefits.title")}{" "}
                <span className="text-primaryOrange">
                  {t("benefits.titleHighlight")}
                </span>
              </>
            }
            subtitle={t("benefits.subtitle")}
          />
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto relative bottom-2">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
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
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-lightGray leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* ─── SDGs ─── */}
        <div className="mt-10 max-w-4xl mx-auto">
          <div className="text-center mb-5 md:mb-6">
            <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-lightGray">
              {t("benefits.sdgsIntro")}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {sdgs.map((sdg) => {
              const sdgId = String(sdg.id).padStart(2, "0");
              return (
                <Image
                  width={150}
                  height={150}
                  key={sdg.id}
                  alt={sdg.name ?? t("benefits.sdgFallbackAlt", { id: sdgId })}
                  src={`/Ziele/SDG-icon-DE-${sdgId}.webp`}
                  className="w-14 h-14 md:w-24 md:h-24 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 scale-110"
                />
              );
            })}
          </div>
        </div>
      </Section>
      {/* ─── 6. DASHBOARD + MOCKUPS ─── */}
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
                {t("dashboard.title")}{" "}
                <span className="text-primaryOrange">
                  {t("dashboard.titleHighlight")}
                </span>
              </>
            }
          />
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-3">
            {dashboardFeatures.map((feature, index) => (
              <motion.button
                key={feature.id}
                type="button"
                viewport={{ once: true }}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                onClick={() => selectDashboard(index)}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={`w-full text-left rounded-xl p-4 md:p-5 border transition-all ${
                  selectedDashboard === index
                    ? "border-primaryOrange/30 shadow-md"
                    : "border-gray-200 hover:border-primaryOrange/20"
                }`}
                style={
                  selectedDashboard === index ? GRADIENT_CARD_STYLE : undefined
                }
              >
                <h3
                  className={`text-base md:text-lg font-bold mb-1 transition-colors ${
                    selectedDashboard === index
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
            <div className="relative w-full">
              <div
                style={GLOW(0.08)}
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full pointer-events-none"
              />
              <motion.div
                key={selectedDashboard}
                transition={{ duration: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.95 }}
              >
                <Image
                  width={1200}
                  height={800}
                  loading="lazy"
                  alt={
                    activeDashboard?.title ?? t("dashboard.mockupAltFallback")
                  }
                  className="relative z-10 object-contain w-full h-auto rounded-lg"
                  src={
                    activeDashboard?.mockup ??
                    "/Mockup-Macbook/Live-Fortschritt.webp"
                  }
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </Section>
      {/* ─── 7. FÖRDERUNG ─── */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl p-6 md:p-10"
            style={{
              background:
                "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
              border: "2px solid rgba(232,119,32,0.2)",
              boxShadow: "0 16px 48px rgba(232,119,32,0.08)",
            }}
          >
            <div
              className="absolute -top-16 -left-16 w-[200px] h-[200px] rounded-full pointer-events-none"
              style={GLOW(0.06)}
              aria-hidden="true"
            />

            <div className="relative z-10">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-5"
                style={{
                  background: "rgba(232,119,32,0.1)",
                  border: "1px solid rgba(232,119,32,0.15)",
                }}
              >
                <Sparkles
                  className="w-3 h-3 text-primaryOrange"
                  aria-hidden="true"
                />
                <span className="text-[11px] font-bold text-primaryOrange uppercase tracking-wide">
                  {t("funding.badge")}
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-darkerGray mb-3">
                    {t("funding.titlePre")}{" "}
                    <span className="text-primaryOrange">
                      {t("funding.titleHighlight")}
                    </span>
                    {t("funding.titlePost")}
                  </h3>
                  <p className="text-sm md:text-base text-lightGray leading-relaxed mb-4">
                    {t("funding.description")}
                  </p>

                  <div className="space-y-2.5 mb-6">
                    {(
                      (t.raw("funding.bullets") as string[] | undefined) ?? []
                    ).map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-xl p-3 md:p-3.5 border border-primaryOrange/15 bg-white"
                      >
                        <Check
                          className="w-4 h-4 text-primaryOrange flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="text-sm md:text-base text-darkerGray leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    href="/kontakt"
                    variant="primary"
                    className="flex items-center justify-center gap-2 !px-6 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base w-full sm:w-auto"
                  >
                    <Presentation className="w-4 h-4" aria-hidden="true" />
                    {t("funding.ctaButton")}
                  </Button>
                </div>

                {/* Mascot */}
                <Image
                  src="/Maskottchen/Maskottchen-Hero.webp"
                  alt={t("images.fundingMascotAlt")}
                  width={200}
                  height={200}
                  className="object-contain w-28 h-28 md:w-36 md:h-36 flex-shrink-0"
                  style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.08))" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
      {/* ─── 8. PROCESS ─── */}
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
            preTitle={t("schoolProcess.title")}
            highlight={t("schoolProcess.titleHighlight")}
          />
        </motion.div>
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line — centered on the circles */}
          <div
            aria-hidden="true"
            className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(232,119,32,0.2) 5%, rgba(232,119,32,0.2) 95%, transparent)",
            }}
          />
          <div className="space-y-6 md:space-y-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                viewport={{ once: true }}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex items-center gap-5 md:gap-8"
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Number circle */}
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-base md:text-lg font-bold flex-shrink-0 relative z-10"
                  style={{
                    color: "#E87720",
                    border: "2px solid rgba(232,119,32,0.2)",
                    boxShadow: "0 4px 12px rgba(232,119,32,0.1)",
                    background:
                      "linear-gradient(135deg, #FFF8F3 0%, #FFF2E8 100%)",
                  }}
                >
                  {step.step}
                </div>

                {/* Card */}
                <div
                  style={GRADIENT_CARD_STYLE}
                  className="flex-1 rounded-2xl p-4 md:p-5 border border-primaryOrange/10 hover:border-primaryOrange/25 transition-all hover:shadow-md flex items-center gap-4 md:gap-5"
                >
                  <Image
                    alt={t("images.processStepMascotAlt", {
                      title: step.title,
                    })}
                    width={200}
                    height={200}
                    src={step.image}
                    className="object-contain w-16 h-16 md:w-24 md:h-24 flex-shrink-0 scale-150"
                    style={{
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.08))",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-darkerGray mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs md:text-sm text-lightGray leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
      {/* ─── 9. CTA ─── */}
      <DemoBookingCtaSection />
      {/* STRUCTURED DATA */}
      <StructuredData
        id="schools-service"
        data={{
          "@type": "Service",
          name: t("structuredData.serviceName"),
          "@context": "https://schema.org",
          description: t("structuredData.serviceDescription"),
          provider: {
            "@type": "Organization",
            url: "https://beafox.app",
            name: t("structuredData.providerName"),
          },
        }}
      />
    </>
  );
}

"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// CUSTOM COMPONENTS
import Button from "@/components/Button";
import Section from "@/components/Section";
import LandingHero from "@/components/LandingHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import DemoBookingCtaSection from "@/components/DemoBookingCtaSection";
import TrustSignalBar from "@/components/TrustSignalBar";
import IndividualOfferCtaSection from "@/components/IndividualOfferCtaSection";
import SectionHeader from "@/components/SectionHeader";
import StructuredData from "@/components/StructuredData";
// IMPORTS
import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
// ICONS
import {
  Check,
  ArrowRight,
  Users,
  School,
  BarChart,
  Clock,
  Shield,
  Award,
  Target,
  Zap,
  TrendingUp,
  Calendar,
  Presentation,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// CONSTANTS
const CAL_URL = "https://app.cal.eu/beafox";

const STAT_ICONS = [Users, School, TrendingUp, Clock] as const;
const BENEFIT_ICONS = [Clock, BarChart, Target, Shield, Award, Zap] as const;

const GRADIENT_CARD_STYLE = {
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
} as const;

const GLOW = (opacity: number) => ({
  background: `radial-gradient(circle, rgba(232,119,32,${opacity}) 0%, transparent 70%)`,
});

type SchoolProcessStep = {
  step: string;
  title: string;
  description: string;
  image: string;
};

// COMPONENT
export default function ForSchoolsPage() {
  // HOOKS
  const t = useTranslations("schools");

  // STATES
  const [selectedDashboard, setSelectedDashboard] = useState(0);

  // CALLBACKS
  const selectDashboard = useCallback(
    (index: number) => setSelectedDashboard(index),
    [],
  );

  // MEMOIZED DATA
  const stats = useMemo(() => {
    const raw = (t.raw("stats") as { value: string; label: string }[]) ?? [];
    return raw.map((s, i) => ({ ...s, icon: STAT_ICONS[i] }));
  }, [t]);

  const benefits = useMemo(() => {
    const raw =
      (t.raw("benefits.items") as { title: string; description: string }[]) ??
      [];
    return raw.map((b, i) => ({ ...b, icon: BENEFIT_ICONS[i] }));
  }, [t]);

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

  const testimonials = useMemo(
    () =>
      (t.raw("testimonials.items") as { quote: string; author: string }[]) ??
      [],
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

  return (
    <>
      {/* ─── 1. HERO ─── */}
      <LandingHero
        badge={t("hero.badge")}
        title={
          <>
            <span className="text-primaryOrange">
              {t("hero.priceHighlight")}
            </span>{" "}
            {t("hero.pricePost")}
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
                className="w-3.5 h-3.5 md:w-4 md:h-4"
                aria-hidden="true"
              />
              {t("hero.ctaBook")}
            </Button>
          </>
        }
        mascotSrc="/Maskottchen/Maskottchen-School.png"
        mascotAlt={t("hero.badge")}
        cardText="Ich begleite Ihre Schüler durch jede Finanzsituation — spielerisch, verständlich und lehrplanergänzend."
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <SectionHeader
              titleClassName="!text-xl md:!text-2xl lg:!text-3xl"
              title={
                <>
                  Finanzbildung fehlt im Lehrplan —{" "}
                  <span className="text-red-500">Ihre Schüler spüren es</span>
                </>
              }
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
            {/* Left: Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center justify-center"
            >
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />
              <Image
                src="/Maskottchen/Maskottchen-Verwirrt.png"
                alt="Fehlende Finanzbildung an Schulen"
                width={500}
                height={500}
                className="relative z-10 object-contain w-[280px] md:w-[360px] lg:w-[420px] h-auto"
                style={{ filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.1))" }}
              />
            </motion.div>

            {/* Right: Pain points */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="mb-6 pb-6 border-b border-gray-100">
                <motion.span
                  className="text-4xl md:text-5xl font-bold text-red-500 inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  style={{
                    textShadow:
                      "0 0 20px rgba(239,68,68,0.3), 0 0 40px rgba(239,68,68,0.15)",
                  }}
                >
                  93%
                </motion.span>
                <h3 className="text-lg md:text-xl font-bold text-darkerGray mt-2 mb-2">
                  der Schüler wünschen sich Finanzbildung in der Schule
                </h3>
                <p className="text-sm md:text-base text-lightGray leading-relaxed">
                  Doch Lehrkräfte haben weder Zeit noch Material für ein Thema,
                  das in keinem Lehrplan steht. Das Ergebnis: Schüler verlassen
                  die Schule ohne Finanzkompetenz.
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
                        className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 flex-shrink-0"
                        aria-hidden="true"
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <SectionHeader
              titleClassName="!text-xl md:!text-2xl lg:!text-3xl"
              title={
                <>
                  Schüler lernen selbstständig —{" "}
                  <span className="text-primaryOrange">
                    Sie behalten den Überblick
                  </span>
                </>
              }
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <div className="mb-6 pb-6 border-b border-primaryOrange/10">
                <motion.span
                  className="text-4xl md:text-5xl font-bold text-primaryOrange inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  style={{
                    textShadow:
                      "0 0 20px rgba(232,119,32,0.3), 0 0 40px rgba(232,119,32,0.15)",
                  }}
                >
                  98%
                </motion.span>
                <h3 className="text-lg md:text-xl font-bold text-darkerGray mt-2 mb-2">
                  Zufriedenheit bei Lehrkräften und Schülern
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
                      className="flex items-start gap-3 rounded-xl p-3 md:p-3.5 border border-primaryOrange/15"
                      style={GRADIENT_CARD_STYLE}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-primaryOrange mt-2.5 flex-shrink-0"
                        aria-hidden="true"
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
                Demo anfordern
              </Button>
            </motion.div>

            {/* Right: Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center justify-center order-1 md:order-2"
            >
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full pointer-events-none"
                style={GLOW(0.06)}
                aria-hidden="true"
              />
              <Image
                src="/Maskottchen/Maskottchen-School.png"
                alt="Bea — Finanzbildung für Schulen"
                width={500}
                height={500}
                className="relative z-10 object-contain w-[280px] md:w-[360px] lg:w-[420px] h-auto"
                style={{ filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.1))" }}
              />
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ─── 5. BENEFITS ─── */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
                ?
              </>
            }
            subtitle={t("benefits.subtitle")}
          />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative overflow-hidden rounded-2xl p-5 md:p-6 border border-primaryOrange/15 hover:border-primaryOrange/30 transition-all hover:shadow-lg group"
                style={GRADIENT_CARD_STYLE}
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
      </Section>

      {/* ─── 6. DASHBOARD + MOCKUPS ─── */}
      <Section className="bg-gray-50 py-8 md:py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
            subtitle={t("dashboard.subtitle")}
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-3">
            {dashboardFeatures.map((feature, index) => (
              <motion.button
                key={feature.id}
                type="button"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                onClick={() => selectDashboard(index)}
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
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full pointer-events-none"
                style={GLOW(0.08)}
                aria-hidden="true"
              />
              <motion.div
                key={selectedDashboard}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={
                    activeDashboard?.mockup ??
                    "/Mockup-Macbook/Live-Fortschritt.png"
                  }
                  alt={activeDashboard?.title ?? "Dashboard"}
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="relative z-10 object-contain w-full h-auto rounded-lg"
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 9. FÖRDERUNG ─── */}
      <Section className="bg-gray-50 py-8 md:py-12 lg:py-16">
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
                  Gut zu wissen
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-darkerGray mb-3">
                    BeAFox ist für Ihre Schule{" "}
                    <span className="text-primaryOrange">kostenlos</span>
                  </h3>
                  <p className="text-sm md:text-base text-lightGray leading-relaxed mb-4">
                    Viele Schulen nutzen BeAFox bereits vollständig über
                    bestehende Fördertöpfe und Budgets. Es gibt mehrere Wege,
                    Finanzbildung ohne eigenes Budget in Ihre Schule zu bringen.
                  </p>

                  <div className="space-y-2.5 mb-6">
                    {[
                      "Wir zeigen Ihnen welche Fördermöglichkeiten für Ihre Schule in Frage kommen",
                      "Wir unterstützen Sie bei der Antragstellung — Schritt für Schritt",
                      "Viele unserer Partnerschulen zahlen keinen Cent aus dem eigenen Budget",
                    ].map((item) => (
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
                    Kostenlose Beratung anfragen
                  </Button>
                </div>

                {/* Mascot */}
                <Image
                  src="/Maskottchen/Maskottchen-Hero.png"
                  alt=""
                  width={200}
                  height={200}
                  aria-hidden="true"
                  className="object-contain w-28 h-28 md:w-36 md:h-36 flex-shrink-0"
                  style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.08))" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ─── 7. PROCESS ─── */}
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
                    alt=""
                    width={200}
                    height={200}
                    src={step.image}
                    aria-hidden="true"
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

      {/* ─── 7. PRICING ─── */}
      <IndividualOfferCtaSection
        sectionClassName="bg-primaryWhite py-8 md:py-12 lg:py-16"
        headerTitle={
          <>
            {t("individualOffer.headingPre")}{" "}
            <span className="text-primaryOrange">
              {t("individualOffer.headingHighlight")}
            </span>
          </>
        }
        mascotSrc="/Maskottchen/Maskottchen-School.png"
        cardTitle={t("individualOffer.ctaCardTitle")}
        cardBodyLine1={t("individualOffer.ctaCardBodyLine1")}
        requestQuoteLabel={t("individualOffer.requestQuoteCta")}
        bookCallLabel={t("individualOffer.bookCta")}
        calUrl={CAL_URL}
      />

      {/* ─── 10. CTA ─── */}
      <DemoBookingCtaSection />

      {/* STRUCTURED DATA */}
      <StructuredData
        id="schools-service"
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "BeAFox für Schulen",
          description:
            "Digitale Finanzbildung für Schulen — 1€ pro Schüler pro Jahr",
          provider: {
            "@type": "Organization",
            name: "BeAFox UG (haftungsbeschränkt)",
            url: "https://beafox.app",
          },
          offers: {
            "@type": "Offer",
            price: "1.00",
            priceCurrency: "EUR",
            unitText: "pro Schüler / Jahr",
          },
        }}
      />
    </>
  );
}

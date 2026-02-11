"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useTranslations } from "next-intl";
import {
  Check,
  Sparkles,
  ArrowRight,
  School,
  Users,
  BarChart,
  Clock,
  Shield,
  BookOpen,
  Award,
  Target,
  Zap,
  TrendingUp,
  GraduationCap,
  ChevronDown,
  Calendar,
} from "lucide-react";

export default function ForSchoolsPage() {
  const t = useTranslations("schools");
  const [selectedDashboard, setSelectedDashboard] = useState(0);
  const [openFAQId, setOpenFAQId] = useState<number | null>(null);

  const dashboardFeatures = (t.raw("dashboard.items") as { id: string; title: string; description: string; mockup: string }[]) ?? [];
  const benefitsRaw = (t.raw("benefits.items") as { title: string; description: string }[]) ?? [];
  const benefitIcons = [Clock, BarChart, Target, Shield, Award, Zap];
  const benefits = benefitsRaw.map((b, i) => ({ ...b, icon: benefitIcons[i] }));
  const statsRaw = (t.raw("stats") as { value: string; label: string }[]) ?? [];
  const statIcons = [Users, School, TrendingUp, Clock];
  const stats = statsRaw.map((s, i) => ({ ...s, icon: statIcons[i] }));
  const useCasesRaw = (t.raw("useCases.items") as { title: string; description: string }[]) ?? [];
  const useCaseIcons = [BookOpen, GraduationCap, Target, Award];
  const useCases = useCasesRaw.map((u, i) => ({ ...u, icon: useCaseIcons[i] }));

  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.parentLabel"), href: "/preise" },
          { label: t("breadcrumbs.current"), href: "/fuer-schulen" },
        ]}
      />

      {/* Hero Section */}
      <Section className="bg-primaryWhite pt-12 md:pt-16 lg:pt-20 mt-14">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center lg:justify-start border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto lg:mx-0 mb-6"
              >
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
                <h1 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
                  {t("hero.badge")}
                </h1>
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-darkerGray mb-4 md:mb-6"
              >
                <span className="text-primaryOrange">{t("hero.priceHighlight")}</span>{" "}
                {t("hero.pricePost")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base md:text-xl text-lightGray mb-8 md:mb-12"
              >
                {t("hero.description")}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start items-center lg:items-start w-full sm:w-auto"
              >
                <Button
                  href="/kontakt"
                  variant="primary"
                  className="flex items-center justify-center gap-2 !px-4 !py-2 md:!px-8 md:!py-4 text-sm md:text-base w-full sm:w-auto"
                >
                  {t("hero.ctaPartner")}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <a
                  href="https://app.cal.eu/beafox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primaryOrange text-primaryOrange hover:bg-primaryOrange hover:text-primaryWhite px-4 py-2 md:px-8 md:py-4 rounded-full font-semibold transition-all duration-300 text-sm md:text-base w-full sm:w-auto shadow-lg hover:shadow-xl"
                >
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  {t("hero.ctaBook")}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              </motion.div>
            </div>

            {/* Right: App Mockups */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center relative"
            >
              <div className="relative flex items-center justify-center">
                {/* Mockup 1 - Left */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative z-10 transform rotate-[-8deg]"
                  style={{ marginRight: "-20px" }}
                >
                  <Image
                    src="/assets/Mockups/Mockup-Lernpfad.png"
                    alt={t("mockups.pathAlt")}
                    width={200}
                    height={428}
                    className="object-contain drop-shadow-2xl w-[100px] sm:w-[140px] md:w-[200px] lg:w-[240px] h-auto"
                  />
                </motion.div>

                {/* Mockup 2 - Center */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="relative z-20"
                >
                  <Image
                    src="/assets/Mockups/Mockup-Stufen.png"
                    alt={t("mockups.stufenAlt")}
                    width={240}
                    height={514}
                    className="object-contain drop-shadow-2xl w-[120px] sm:w-[160px] md:w-[240px] lg:w-[280px] h-auto"
                  />
                </motion.div>

                {/* Mockup 3 - Right */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="relative z-10 transform rotate-[8deg]"
                  style={{ marginLeft: "-20px" }}
                >
                  <Image
                    src="/assets/Mockups/Mockup-Rangliste.png"
                    alt={t("mockups.rankingAlt")}
                    width={200}
                    height={428}
                    className="object-contain drop-shadow-2xl w-[100px] sm:w-[140px] md:w-[200px] lg:w-[240px] h-auto"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center bg-primaryOrange/5 rounded-xl p-4 md:p-6 border-2 border-primaryOrange/20"
              >
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-primaryOrange mx-auto mb-2 md:mb-3" />
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-1 md:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm lg:text-base text-lightGray">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Problem Solution Section */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-0 sm:mb-4">
              {t("problemSolution.title")}{" "}
              <span className="text-primaryOrange">{t("problemSolution.titleHighlight")}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Problem */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-6 md:p-8 border-2 border-primaryOrange/20"
            >
              <h3 className="text-2xl font-bold text-darkerGray mb-4">
                {t("problemSolution.problemTitle")}
              </h3>
              <p className="hidden md:block text-lightGray mb-4 text-base md:text-lg">
                {t("problemSolution.problemText")}
              </p>
              <ul className="space-y-2">
                {(t.raw("problemSolution.problemBullets") as string[]).map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-lightGray"
                  >
                    <div className="w-2 h-2 rounded-full bg-primaryOrange mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right: Solution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 rounded-xl p-6 md:p-8 border-2 border-primaryOrange"
            >
              <h3 className="text-2xl font-bold text-primaryOrange mb-4">
                {t("problemSolution.solutionTitle")}
              </h3>
              <p className="text-lightGray mb-4 text-base md:text-lg">
                {t("problemSolution.solutionText")}
              </p>
              <p className="text-lightGray text-base md:text-lg mb-4">
                {t("problemSolution.solutionText2")}
              </p>
              <ul className="space-y-2">
                {(t.raw("problemSolution.solutionBullets") as string[]).map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-darkerGray"
                  >
                    <Check className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Benefits Section */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-2 sm:mb-4">
              {t("benefits.title")}{" "}
              <span className="text-primaryOrange">{t("benefits.titleHighlight")}</span>?
            </h2>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto">
              {t("benefits.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all shadow-sm"
              >
                <div className="bg-primaryOrange/10 rounded-lg p-3 w-fit mb-4">
                  <benefit.icon className="w-8 h-8 text-primaryOrange" />
                </div>
                <h3 className="text-xl font-bold text-darkerGray mb-3">
                  {benefit.title}
                </h3>
                <p className="text-lightGray">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Use Cases Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16 pt-0 md:pt-0 lg:pt-0">
        <div className="max-w-6xl mx-auto flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-2 sm:mb-4">
              {t("useCases.title")}{" "}
              <span className="text-primaryOrange">{t("useCases.titleHighlight")}</span>{t("useCases.titlePost")}
            </h2>
            <p className="text-lg md:text-xl text-lightGray">
              {t("useCases.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 mx-auto rounded-xl p-6 border-2 border-primaryOrange/20"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primaryOrange rounded-lg p-3 flex-shrink-0">
                    <useCase.icon className="w-6 h-6 text-primaryWhite" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-darkerGray mb-2">
                      {useCase.title}
                    </h3>
                    <p className="text-lightGray">{useCase.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 justify-center lg:justify-start items-center lg:items-start"
          >
            <Button
              href="/kontakt"
              variant="primary"
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4"
            >
              {t("useCases.cta")}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* How It Works Section */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-2 sm:mb-4">
              {t("howItWorks.title")}
            </h2>
            <p className="text-base md:text-xl text-lightGray">
              {t("howItWorks.subtitle")}
            </p>
          </motion.div>

          <div className="space-y-8">
            {((t.raw("howItWorks.steps") as { step: string; title: string; description: string }[]) ?? []).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start gap-6 bg-white rounded-xl p-6 border-2 border-primaryOrange/20"
              >
                <div className="bg-primaryOrange text-primaryWhite w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-darkerGray mb-2">
                    {item.title}
                  </h3>
                  <p className="text-lightGray">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Pricing Info Section */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-2 sm:mb-4">
              {t("pricing.title")}{" "}
              <span className="text-primaryOrange">{t("pricing.titleHighlight")}</span>
            </h2>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto">
              {t("pricing.subtitle")}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left: Price Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 md:p-10 lg:p-12 border-2 border-primaryOrange shadow-xl"
            >
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-primaryOrange">
                    {t("pricing.price")}
                  </span>
                </div>
                <div className="text-xl md:text-2xl text-lightGray mb-1">
                  {t("pricing.perPupil")}
                </div>
                <div className="text-xl md:text-2xl text-lightGray">
                  {t("pricing.perYear")}
                </div>
              </div>

              <div className="bg-primaryOrange/5 rounded-xl p-6 mb-8">
                <p className="text-base md:text-lg text-darkerGray font-medium text-center">
                  {t("pricing.tagline")}
                </p>
              </div>

              <div className="text-center">
                <Button
                  href="/kontakt"
                  variant="primary"
                  className="flex items-center justify-center gap-2 mx-auto w-full !px-6 !py-3 md:!px-8 md:!py-4"
                >
                  {t("pricing.partnerCta")}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </motion.div>

            {/* Right: Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl p-6 border-2 border-primaryOrange/20">
                <h3 className="text-xl md:text-2xl font-bold text-darkerGray mb-6">
                  {t("pricing.includedTitle")}
                </h3>
                <ul className="space-y-4">
                  {(t.raw("pricing.includedItems") as string[]).map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-darkerGray"
                    >
                      <Check className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                      <span className="text-base md:text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 rounded-xl p-6 border-2 border-primaryOrange/20">
                <h3 className="text-xl md:text-2xl font-bold text-darkerGray mb-6">
                  {t("pricing.extraTitle")}
                </h3>
                <ul className="space-y-4">
                  {(t.raw("pricing.extraItems") as string[]).map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-darkerGray"
                    >
                      <Check className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                      <span className="text-base md:text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Dashboard Features Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-0 sm:mb-4">
              {t("dashboard.title")}{" "}
              <span className="text-primaryOrange">{t("dashboard.titleHighlight")}</span>
            </h2>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto">
              {t("dashboard.subtitle")}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left: Feature Tabs */}
            <div className="space-y-4">
              {dashboardFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onMouseEnter={() => setSelectedDashboard(index)}
                  onClick={() => setSelectedDashboard(index)}
                  className={`bg-white rounded-xl p-4 md:p-6 border-2 transition-all cursor-pointer ${
                    selectedDashboard === index
                      ? "border-primaryOrange shadow-lg"
                      : "border-primaryOrange/20 hover:border-primaryOrange/40"
                  }`}
                >
                  <h3 className="text-lg md:text-xl font-bold text-darkerGray mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-lightGray">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Right: Mockup Display */}
            <div className="flex items-center justify-center lg:sticky lg:top-20 flex-col gap-4">
              <motion.div
                key={selectedDashboard}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-full"
              >
                {dashboardFeatures.length > 0 && (
                <Image
                  src={dashboardFeatures[Math.min(selectedDashboard, dashboardFeatures.length - 1)].mockup}
                  alt={dashboardFeatures[Math.min(selectedDashboard, dashboardFeatures.length - 1)].title}
                  width={1200}
                  height={800}
                  className="object-contain drop-shadow-2xl w-full h-auto rounded-lg border-2 border-primaryOrange/20"
                />
                )}
              </motion.div>
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 justify-center lg:justify-start items-center lg:items-start"
              >
                <Button
                  href="/kontakt"
                  variant="primary"
                  className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4"
                >
                  {t("dashboard.cta")}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      {/* Warum Finanzbildung Section */}
      <Section className="bg-primaryOrange/5 py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
                {t("whyFinance.badgeTitle")}
              </h2>
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Three Points */}
            <div className="space-y-6">
              {((t.raw("whyFinance.points") as { number: string; title: string; description: string }[]) ?? []).map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 border-2 border-primaryOrange/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-primaryOrange text-primaryWhite w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {point.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-darkerGray mb-2">
                        {point.title}
                      </h3>
                      <p className="text-lightGray">{point.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: Maskottchen */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center"
            >
              <div className="relative">
                <Image
                  src="/assets/Maskottchen.jpeg"
                  alt={t("mockups.mascotAlt")}
                  width={400}
                  height={400}
                  className="object-contain drop-shadow-2xl w-full max-w-[300px] md:max-w-[400px] h-auto rounded-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-2 sm:mb-4">
              {t("testimonials.title")}{" "}
              <span className="text-primaryOrange">{t("testimonials.titleHighlight")}</span>
            </h2>
            <p className="text-base md:text-xl text-lightGray">
              {t("testimonials.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {((t.raw("testimonials.items") as { quote: string; author: string }[]) ?? []).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primaryWhite rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all shadow-sm"
              >
                <div className="mb-4">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Award
                        key={i}
                        className="w-5 h-5 text-primaryOrange fill-primaryOrange"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-lightGray mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <p className="text-sm font-semibold text-darkerGray">
                  — {testimonial.author}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-2 sm:mb-4">
              {t("faq.title")}
            </h2>
            <p className="text-base md:text-xl text-lightGray">
              {t("faq.subtitle")}
            </p>
          </motion.div>

          <div className="space-y-4">
            {((t.raw("faq.items") as { id: number; question: string; answer: string }[]) ?? []).map((faq, index) => {
              const isOpen = openFAQId === faq.id;
              const handleToggle = () => {
                setOpenFAQId(isOpen ? null : faq.id);
              };

              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-primaryWhite rounded-xl border-2 border-primaryOrange/20 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="w-full text-left cursor-pointer focus:outline-none p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base md:text-xl font-bold text-darkerGray flex-1">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`w-5 h-5 md:w-6 md:h-6 text-primaryOrange flex-shrink-0 transition-transform duration-200 mt-1 ${
                          isOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-lightGray px-6 pb-6 pt-0">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8"
          >
            <Button
              href="/faq"
              variant="outline"
              className="flex items-center justify-center gap-2 mx-auto !px-6 !py-3 md:!px-8 md:!py-4"
            >
              {t("faq.viewAllCta")}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 py-8 md:py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <School className="w-16 h-16 text-primaryWhite mx-auto mb-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primaryWhite"
          >
            {t("cta.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl mb-8 text-primaryWhite/90"
          >
            {t("cta.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
          >
            <Button
              href="/kontakt"
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite"
            >
              {t("cta.cta")}{" "}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>
      </Section>
    </>
  );
}

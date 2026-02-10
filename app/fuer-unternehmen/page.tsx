"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import DownloadModal from "@/components/DownloadModal";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useTranslations } from "next-intl";
import {
  Check,
  Sparkles,
  ArrowRight,
  Briefcase,
  Users,
  BarChart,
  Clock,
  Shield,
  BookOpen,
  Award,
  Target,
  Zap,
  TrendingUp,
  Building2,
  Calendar,
  Trophy,
  MessageSquare,
  PlayCircle,
} from "lucide-react";

// Price Calculator Component
function PriceCalculator() {
  const t = useTranslations("business");
  const [learners, setLearners] = useState(50);

  // Calculate price per learner per month based on volume discounts
  const getPricePerLearnerPerMonth = (count: number): number => {
    if (count >= 100) return 4.99;
    if (count >= 50) return 5.99;
    if (count >= 10) return 6.99;
    return 6.99; // default
  };

  const pricePerLearnerPerMonth = getPricePerLearnerPerMonth(learners);
  const pricePerLearnerPerYear = pricePerLearnerPerMonth * 12;
  const totalYearlyPrice = learners * pricePerLearnerPerYear;

  // Format number with German locale
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Learners Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-base md:text-lg font-medium text-darkerGray">
            {t("calculator.employeesLabel")}
          </label>
          <span className="text-2xl md:text-3xl font-bold text-primaryOrange">
            {learners}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="500"
          step="1"
          value={learners}
          onChange={(e) => setLearners(Number(e.target.value))}
          className="w-full h-3 bg-primaryOrange/20 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${
              ((learners - 10) / (500 - 10)) * 100
            }%, #f3f4f6 ${
              ((learners - 10) / (500 - 10)) * 100
            }%, #f3f4f6 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-lightGray">
          <span>10</span>
          <span>500</span>
        </div>
      </div>

      <div className="border-t border-primaryOrange/20 pt-4 space-y-4">
        {/* Price per Account */}
        <div className="flex items-center justify-between">
          <span className="text-base md:text-lg text-darkerGray">
            {t("calculator.pricePerAccount")}
          </span>
          <span className="text-xl md:text-2xl font-bold text-primaryOrange">
            {formatPrice(pricePerLearnerPerMonth)} {t("calculator.perMonthSuffix")}
          </span>
        </div>

        {/* Total Yearly */}
        <div className="flex items-center justify-between pt-4 border-t border-primaryOrange/20">
          <span className="text-lg md:text-xl font-semibold text-darkerGray">
            {t("calculator.totalYear")}
          </span>
          <span className="text-xl md:text-2xl font-bold text-primaryOrange">
            {formatPrice(totalYearlyPrice)} €
          </span>
        </div>
      </div>

      {/* Volume Discount Info */}
      {learners >= 100 && (
        <div className="bg-primaryOrange/10 rounded-lg p-3 text-sm text-primaryOrange font-medium text-center">
          🎉 {t("calculator.bestPrice")}
        </div>
      )}
      {learners >= 50 && learners < 100 && (
        <div className="bg-primaryOrange/10 rounded-lg p-3 text-sm text-primaryOrange font-medium text-center">
          💰 {t("calculator.saveMore")}
        </div>
      )}
    </div>
  );
}

export default function ForBusinessPage() {
  const t = useTranslations("business");
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleAppStoreClick = (
    e?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    if (e) {
      e.preventDefault();
    }
    setIsDownloadModalOpen(true);
  };

  const statsRaw = (t.raw("stats") as { value: string; label: string }[]) ?? [];
  const statIcons = [Users, Building2, TrendingUp, Award];
  const stats = statsRaw.map((s, i) => ({ ...s, icon: statIcons[i] }));

  const benefitsRaw = (t.raw("benefits.items") as { title: string; description: string }[]) ?? [];
  const benefitIcons = [Target, BarChart, Award, Zap, Clock, Shield];
  const benefits = benefitsRaw.map((b, i) => ({ ...b, icon: benefitIcons[i] }));

  const features = (t.raw("features.items") as { id: string; title: string; description: string; mockup: string }[]) ?? [];

  const useCasesRaw = (t.raw("useCases.items") as { title: string; description: string }[]) ?? [];
  const useCaseIcons = [Target, Users, TrendingUp, Award];
  const useCases = useCasesRaw.map((u, i) => ({ ...u, icon: useCaseIcons[i] }));

  const processStepsRaw = (t.raw("process.steps") as { step: string; title: string; description: string }[]) ?? [];
  const processIcons = [MessageSquare, PlayCircle, Calendar, BookOpen, Trophy];
  const processSteps = processStepsRaw.map((p, i) => ({ ...p, icon: processIcons[i] }));

  const testimonials = [
    {
      quote:
        "BeAFox hat unsere Azubi-Ausbildung revolutioniert. Die Kombination aus Workshops und App sorgt dafür, dass das Wissen wirklich hängen bleibt. Unsere Azubis sind begeistert!",
      author: "Sarah Müller",
      role: "Ausbildungsleiterin",
      company: "Tech Solutions GmbH",
      rating: 5,
    },
    {
      quote:
        "Das Monitoring-Dashboard ist ein absoluter Game-Changer. Ich sehe sofort, welche Azubis aktiv sind und wo ich unterstützen muss. Die Investition hat sich bereits nach 3 Monaten gelohnt.",
      author: "Michael Schneider",
      role: "Personalleiter",
      company: "Industrie AG",
      rating: 5,
    },
    {
      quote:
        "Unsere Azubis sind motivierter denn je. Das spielerische System macht Lernen zum Spaß, und die Workshops sind immer ein Highlight. Top Empfehlung!",
      author: "Lisa Weber",
      role: "Geschäftsführerin",
      company: "Handwerk & Co.",
      rating: 5,
    },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.parentLabel"), href: "/preise" },
          { label: t("breadcrumbs.current"), href: "/fuer-unternehmen" },
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
                {t("hero.title")}{" "}
                <span className="text-primaryOrange">{t("hero.titleHighlight")}</span>
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
                    src="/assets/Mockups/Mockup-Training.png"
                    alt={t("mockups.trainingAlt")}
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
                    src="/assets/Mockups/Mockup-Lernpfad.png"
                    alt={t("mockups.pathAlt")}
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-2 sm:mb-4">
              {t("problemSolution.title")}{" "}
              <span className="text-primaryOrange">{t("problemSolution.titleHighlight")}</span>
            </h2>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto">
              {t("problemSolution.subtitle")}
            </p>
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

          {/* Subtle CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-6 sm:mt-12"
          >
            <p className="text-lightGray mb-4">
              {t("problemSolution.ctaText")}
            </p>
            <Button
              href="/kontakt"
              variant="outline"
              className="flex items-center justify-center gap-2 mx-auto !px-4 !py-2 md:!px-8 md:!py-4 text-sm md:text-base"
            >
              {t("problemSolution.ctaButton")}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
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
              {t("useCases.title")}{" "}
              <span className="text-primaryOrange">{t("useCases.titleHighlight")}</span>{t("useCases.titlePost")}
            </h2>
            <p className="text-base md:text-xl text-lightGray">
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
                className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 rounded-xl p-6 border-2 border-primaryOrange/20"
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

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8 sm:mt-12"
          >
            <Button
              href="/kontakt"
              variant="primary"
              className="flex items-center justify-center gap-2 mx-auto !px-4 !py-2 md:!px-8 md:!py-4 text-sm md:text-base"
            >
              {t("useCases.cta")}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* Features Section with Interactive Mockups */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-2 sm:mb-4">
              {t("features.title")}
            </h2>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto">
              {t("features.subtitle")}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left: Feature Tabs */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onMouseEnter={() => setSelectedFeature(index)}
                  onClick={() => setSelectedFeature(index)}
                  className={`bg-white rounded-xl p-4 md:p-6 border-2 transition-all cursor-pointer ${
                    selectedFeature === index
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
            <div className="flex items-center justify-center lg:sticky lg:top-20">
              <motion.div
                key={selectedFeature}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`relative w-full mx-auto ${
                  features[selectedFeature].mockup.includes("Macbook")
                    ? "max-w-[300px] md:max-w-[600px] lg:max-w-[700px]"
                    : "max-w-[180px] md:max-w-[280px] lg:max-w-[320px]"
                }`}
              >
                <Image
                  src={features[selectedFeature].mockup}
                  alt={features[selectedFeature].title}
                  width={
                    features[selectedFeature].mockup.includes("Macbook")
                      ? 1200
                      : 400
                  }
                  height={
                    features[selectedFeature].mockup.includes("Macbook")
                      ? 800
                      : 800
                  }
                  className="object-contain drop-shadow-2xl w-full h-auto rounded-lg border-2 border-primaryOrange/20"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      {/* Process Section */}
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
              {t("process.title")}
            </h2>
            <p className="text-base md:text-xl text-lightGray">
              {t("process.subtitle")}
            </p>
          </motion.div>

          <div className="space-y-8">
            {processSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start gap-4 sm:gap-6 bg-white rounded-xl p-4 sm:p-6 border-2 border-primaryOrange/20"
              >
                <div className="bg-primaryOrange text-primaryWhite w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="w-6 h-6 text-primaryOrange" />
                    <h3 className="text-xl font-bold text-darkerGray">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-lightGray">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      {/* <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Das sagen unsere{" "}
              <span className="text-primaryOrange">Kunden</span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray">
              Echte Erfahrungen von Unternehmen, die BeAFox nutzen
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
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
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-primaryOrange fill-primaryOrange"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-lightGray mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-primaryOrange/20 pt-4">
                  <p className="text-sm font-semibold text-darkerGray">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-lightGray">{testimonial.role}</p>
                  <p className="text-xs text-primaryOrange">
                    {testimonial.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div> */}

      {/* Subtle CTA after Social Proof */}
      {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12 pt-8 border-t border-primaryOrange/20"
          >
            <p className="text-lightGray mb-4 text-lg">
              Überzeugen Sie sich selbst – starten Sie noch heute
            </p>
            <Button
              href="/kontakt"
              variant="outline"
              className="flex items-center justify-center gap-2 mx-auto !px-6 !py-3 md:!px-8 md:!py-4"
            >
              Jetzt Partner werden
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>
      </Section> */}

      {/* IHK Partnership Section */}
      <Section className="bg-primaryWhite py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-2 sm:mb-4">
              {t("ihk.title")}{" "}
              <span className="text-primaryOrange">{t("ihk.titleHighlight")}</span>{" "}
              {t("ihk.titlePost")}
            </h2>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto">
              {t("ihk.subtitle")}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 bg-white rounded-xl p-6 md:p-8 border-2 border-primaryOrange/20"
            >
              <p className="text-base md:text-lg text-lightGray leading-relaxed">
                {t("ihk.text")}
              </p>

              {/* CTA Button */}
              <div className="pt-2 sm:pt-4 flex justify-center md:justify-start w-full">
                <Button
                  href="/kontakt"
                  variant="primary"
                  className="flex items-center justify-center gap-2 !px-4 !py-2 md:!px-8 md:!py-4 text-sm md:text-base"
                >
                  {t("ihk.cta")}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </motion.div>

            {/* Right: IHK Logo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center"
            >
              <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg border-2 border-primaryOrange/20 w-full max-w-md">
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src="/Partners/3.png"
                    alt="IHK Akademie Logo"
                    width={400}
                    height={200}
                    className="object-contain w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Price Calculator Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-2 sm:mb-4">
              {t("price.headingPre")} <span className="text-primaryOrange">{t("price.headingHighlight")}</span>{" "}
              {t("price.headingPost")}
            </h2>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Calculator */}
            {/* <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-primaryWhite rounded-2xl p-6 md:p-8 border-2 border-primaryOrange/20 shadow-lg"
            >
              <PriceCalculator />
            </motion.div> */}

            {/* Left: Price Box */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-primaryWhite rounded-2xl p-6 md:p-8 border-2 border-primaryOrange/20 shadow-lg"
            >
              <div className="text-center">
                <div className="mb-6">
                  <p className="text-sm md:text-base text-lightGray mb-2">{t("price.fromLabel")}</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primaryOrange">
                      {t("price.price")}
                    </span>
                    <span className="text-lg md:text-xl text-lightGray">
                      {t("price.perMonth")}
                    </span>
                  </div>
                  <p className="text-base md:text-lg text-lightGray mt-2">
                    {t("price.perEmployee")}
                  </p>
                </div>
                <a
                  href="https://app.cal.eu/beafox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primaryOrange hover:bg-primaryOrange/90 text-primaryWhite px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl w-full"
                >
                  <Calendar className="w-5 h-5" />
                  {t("price.bookCta")}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Right: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-base md:text-lg text-lightGray">
                {t("price.paragraph")}
              </p>

              {/* Individual Offer Info */}
              <div className="bg-primaryOrange/10 rounded-lg p-4 md:p-6 border-2 border-primaryOrange/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm md:text-base font-medium text-darkerGray mb-1">
                      {t("price.individualTitle")}
                    </p>
                    <p className="text-sm text-lightGray">
                      {t("price.individualText")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  href="/kontakt"
                  variant="outline"
                  className="flex items-center justify-center gap-2 !px-4 !py-2 md:!px-8 md:!py-4 text-sm md:text-base w-full md:w-auto"
                >
                  {t("price.moreInfoCta")}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 py-12 md:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <Briefcase className="w-16 h-16 text-primaryWhite mx-auto lg:mx-0 mb-4" />
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
                className="text-base md:text-xl mb-8 text-primaryWhite/90"
              >
                {t("cta.subtitle")}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start w-full sm:w-auto"
              >
                <Button
                  href="/kontakt"
                  variant="secondary"
                  className="flex items-center justify-center gap-2 !px-6 !py-3.5 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/95 !text-primaryOrange !border-primaryWhite font-semibold text-sm md:text-base shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                >
                  {t("cta.partnerCta")}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <Button
                  onClick={() => handleAppStoreClick()}
                  variant="secondary"
                  className="flex items-center justify-center gap-2 !px-6 !py-3.5 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/95 !text-primaryOrange !border-primaryWhite font-semibold text-sm md:text-base shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                >
                  {t("cta.downloadCta")}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Right: Mockups */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center relative"
            >
              <div className="relative flex items-center justify-center">
                {/* Mockup 1 - Left */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative z-10 transform rotate-[-8deg]"
                  style={{ marginRight: "-20px" }}
                >
                  <Image
                    src="/assets/Mockups/Mockup-Training.png"
                    alt={t("mockups.trainingAlt")}
                    width={200}
                    height={428}
                    className="object-contain drop-shadow-2xl w-[100px] sm:w-[140px] md:w-[200px] lg:w-[240px] h-auto"
                  />
                </motion.div>

                {/* Mockup 2 - Right */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative z-20 transform rotate-[8deg]"
                >
                  <Image
                    src="/assets/Mockups/Mockup-Lernpfad.png"
                    alt={t("mockups.pathAlt")}
                    width={240}
                    height={514}
                    className="object-contain drop-shadow-2xl w-[100px] sm:w-[140px] md:w-[200px] lg:w-[240px] h-auto"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onAppStoreClick={handleAppStoreClick}
      />
    </>
  );
}

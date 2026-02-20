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
  Sparkles,
  ArrowRight,
  Trophy,
  Brain,
  Shield,
  ArrowDown,
  CheckCircle2,
  Smartphone,
  Infinity,
  BarChart,
  Award,
  Users,
  UserCheck,
  Headphones,
  Gift,
  RefreshCw,
} from "lucide-react";

export default function ForClubsPage() {
  const t = useTranslations("clubs");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleAppStoreClick = (
    e?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    if (e) {
      e.preventDefault();
    }
    setIsDownloadModalOpen(true);
  };

  const coreMessage = {
    headline: t("hero.headline"),
    subheadline: t("hero.subheadline"),
    description: t("hero.description"),
    impact: t("hero.impact"),
  };

  const journeyProblems = (t.raw("journey.problems") as string[]) ?? [];
  const journeyBenefits = (t.raw("journey.benefits") as string[]) ?? [];
  const journey = [
    {
      step: "1",
      title: t("journey.withoutTitle"),
      problems: journeyProblems,
      color: "bg-red-50 border-red-200",
      iconColor: "bg-red-500",
    },
    {
      step: "2",
      title: t("journey.withTitle"),
      benefits: journeyBenefits,
      color: "bg-green-50 border-green-200",
      iconColor: "bg-green-500",
    },
  ];

  const benefitsRaw = (t.raw("benefits.items") as { title: string; description: string; stat: string; statLabel: string }[]) ?? [];
  const benefitIcons = [Brain, Trophy, Users, Shield];
  const benefits = benefitsRaw.map((b, i) => ({ ...b, icon: benefitIcons[i] }));

  const features = (t.raw("features.items") as { id: string; title: string; description: string; mockup: string }[]) ?? [];

  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.parentLabel"), href: "/preise" },
          { label: t("breadcrumbs.current"), href: "/fuer-clubs" },
        ]}
      />

      {/* Hero Section - Full Width Impact */}
      <Section className="bg-gradient-to-br from-primaryOrange via-primaryOrange/90 to-primaryOrange/80 py-12 md:py-20 lg:py-28 mt-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 md:mb-8"
          >
            <div className="inline-flex items-center gap-1.5 md:gap-2 text-primaryWhite text-xs md:text-base border-2 border-primaryWhite/40 rounded-full px-3 md:px-6 py-1.5 md:py-2.5 bg-primaryWhite/10 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 md:w-5 md:h-5 text-primaryWhite" />
              <span className="font-semibold text-xs md:text-base">
                {t("hero.tag")}
              </span>
              <Sparkles className="w-3 h-3 md:w-5 md:h-5 text-primaryWhite" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primaryWhite mb-4 md:mb-8 leading-tight"
          >
            {coreMessage.headline}
            <br />
            <span className="text-primaryWhite/95">
              {coreMessage.subheadline}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-2xl lg:text-3xl text-primaryWhite/95 mb-6 md:mb-8 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            {coreMessage.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full sm:w-auto"
          >
            <Button
              href="/kontakt"
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-4 !py-2.5 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite font-semibold shadow-lg text-sm md:text-base w-full sm:w-auto"
            >
              {t("hero.ctaPartner")}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ArrowDown className="w-5 h-5 md:w-6 md:h-6 text-primaryWhite/60 animate-bounce" />
        </motion.div>
      </Section>

      {/* Journey Section - Before/After */}
      <Section className="bg-white py-8 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-3 md:mb-4">
              {t("journey.title")} <span className="text-primaryOrange">{t("journey.titleHighlight")}</span>
            </h2>
            <p className="text-base md:text-xl text-lightGray">
              {t("journey.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-12">
            {journey.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`${
                  item.color
                } rounded-xl md:rounded-2xl p-4 md:p-8 border-2 ${
                  item.color.includes("red")
                    ? "border-red-300"
                    : "border-green-300"
                }`}
              >
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div
                    className={`${item.iconColor} text-primaryWhite w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg md:text-xl`}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-darkerGray">
                    {item.title}
                  </h3>
                </div>
                {item.problems && (
                  <ul className="space-y-2 md:space-y-3">
                    {item.problems.map((problem, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-darkerGray"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                        <span>{problem}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {item.benefits && (
                  <ul className="space-y-2 md:space-y-3">
                    {item.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-darkerGray"
                      >
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Benefits Section - Large Cards with Stats */}
      <Section className="bg-primaryWhite py-8 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-3 md:mb-4">
              {t("benefits.title")}{" "}
              <span className="text-primaryOrange">{t("benefits.titleHighlight")}</span>
              {t("benefits.titlePost")}
            </h2>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto">
              {t("benefits.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all shadow-lg"
              >
                <div className="flex items-start justify-between mb-4 md:mb-6">
                  <div className="bg-primaryOrange/10 rounded-lg md:rounded-xl p-2 md:p-4">
                    <benefit.icon className="w-6 h-6 md:w-10 md:h-10 text-primaryOrange" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-primaryOrange mb-1">
                      {benefit.stat}
                    </div>
                    <div className="text-xs md:text-sm text-lightGray">
                      {benefit.statLabel}
                    </div>
                  </div>
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-darkerGray mb-2 md:mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm md:text-lg text-lightGray">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Features Section - Vertical Layout */}
      <Section className="bg-white py-8 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-3 md:mb-4">
              {t("features.title")}{" "}
              <span className="text-primaryOrange">{t("features.titleHighlight")}</span>
              {t("features.titlePost")}
            </h2>
            <p className="text-base md:text-xl text-lightGray">
              {t("features.subtitle")}
            </p>
          </motion.div>

          <div className="space-y-8 md:space-y-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-6 md:gap-12 items-center`}
              >
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <div className="bg-primaryOrange text-primaryWhite w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-base md:text-lg">
                      {index + 1}
                    </div>
                    <h3 className="text-xl md:text-3xl font-bold text-darkerGray">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm md:text-lg text-lightGray">
                    {feature.description}
                  </p>
                </div>
                <div className="flex-1 flex justify-center w-full">
                  <div className="relative w-full max-w-[200px] md:max-w-[280px]">
                    <Image
                      src={feature.mockup}
                      alt={feature.title}
                      width={400}
                      height={800}
                      className="object-contain drop-shadow-2xl w-full h-auto rounded-lg border-2 border-primaryOrange/20"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials Section - Full Width Cards */}
      {/* <Section className="bg-gradient-to-br from-primaryOrange/5 via-primaryOrange/10 to-primaryWhite py-12 md:py-16 lg:py-20">
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
              <span className="text-primaryOrange">Partner-Vereine</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 md:p-8 border-2 border-primaryOrange/20 shadow-lg"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primaryOrange/10 rounded-full flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-primaryOrange" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-primaryOrange fill-primaryOrange"
                        />
                      ))}
                    </div>
                    <p className="text-lg text-lightGray mb-4 italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-primaryOrange/20">
                      <div>
                        <p className="font-semibold text-darkerGray">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-lightGray">
                          {testimonial.role}
                        </p>
                      </div>
                      <div className="text-primaryOrange font-semibold">
                        {testimonial.club}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-lightGray mb-4 text-lg">
              Werden Sie Teil der BeAFox-Community
            </p>
            <Button
              href="/kontakt"
              variant="outline"
              className="flex items-center justify-center gap-2 mx-auto !px-6 !py-3 md:!px-8 md:!py-4"
            >
              Pilotprojekt anfordern
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>
      </Section> */}

      {/* Features List - Compact Grid */}
      <Section className="bg-white py-8 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-3 md:mb-4">
              {t("package.title")}{" "}
              <span className="text-primaryOrange">{t("package.titleHighlight")}</span>
              {t("package.titlePost")}
            </h2>
            <p className="text-sm md:text-lg text-lightGray max-w-2xl mx-auto">
              {t("package.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {(
              (t.raw("package.items") as { title: string; description: string }[]) ?? []
            ).map((item, index) => {
              const packageIcons = [Smartphone, Infinity, BarChart, Award, Users, UserCheck, Shield, Headphones];
              const packageColors = [
                { color: "bg-blue-50 border-blue-200", iconColor: "text-blue-600" },
                { color: "bg-purple-50 border-purple-200", iconColor: "text-purple-600" },
                { color: "bg-green-50 border-green-200", iconColor: "text-green-600" },
                { color: "bg-yellow-50 border-yellow-200", iconColor: "text-yellow-600" },
                { color: "bg-orange-50 border-orange-200", iconColor: "text-orange-600" },
                { color: "bg-pink-50 border-pink-200", iconColor: "text-pink-600" },
                { color: "bg-indigo-50 border-indigo-200", iconColor: "text-indigo-600" },
                { color: "bg-teal-50 border-teal-200", iconColor: "text-teal-600" },
              ];
              const IconComponent = packageIcons[index];
              const { color, iconColor } = packageColors[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`${color} rounded-lg md:rounded-xl p-4 md:p-6 border-2 hover:shadow-lg transition-all cursor-default`}
                >
                  <div className="flex items-start gap-2 md:gap-3 mb-2 md:mb-3">
                    <div
                      className={`${iconColor} bg-white rounded-lg p-1.5 md:p-2 flex-shrink-0`}
                    >
                      <IconComponent className="w-4 h-4 md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm md:text-lg font-bold text-darkerGray mb-1">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-lightGray leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Rückführungsprogramm Section für kleinere Vereine */}
      <Section className="bg-gradient-to-br from-primaryOrange/5 via-primaryOrange/10 to-primaryWhite py-8 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 md:mb-6">
              <Gift className="w-8 h-8 md:w-10 md:h-10 text-primaryOrange" />
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-darkerGray">
                <span className="text-primaryOrange">{t("refundProgram.title")}</span>
                {t("refundProgram.titlePost")}
              </h2>
            </div>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto mb-6 md:mb-8">
              {t("refundProgram.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-primaryOrange/20 shadow-lg"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="bg-primaryOrange/10 rounded-lg md:rounded-xl p-3 md:p-4">
                  <RefreshCw className="w-6 h-6 md:w-8 md:h-8 text-primaryOrange" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-darkerGray">
                  {t("refundProgram.howTitle")}
                </h3>
              </div>
              <ol className="space-y-4 md:space-y-6">
                {((t.raw("refundProgram.steps") as { title: string; description: string }[]) ?? []).map((step, i) => (
                  <li key={i} className="flex items-start gap-3 md:gap-4">
                    <div className="bg-primaryOrange text-primaryWhite w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-darkerGray mb-1 md:mb-2 text-base md:text-lg">
                        {step.title}
                      </h4>
                      <p className="text-sm md:text-base text-lightGray">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-primaryOrange/20 shadow-lg"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="bg-primaryOrange/10 rounded-lg md:rounded-xl p-3 md:p-4">
                  <Trophy className="w-6 h-6 md:w-8 md:h-8 text-primaryOrange" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-darkerGray">
                  {t("refundProgram.benefitsTitle")}
                </h3>
              </div>
              <ul className="space-y-3 md:space-y-4">
                {((t.raw("refundProgram.benefits") as string[]) ?? []).map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primaryOrange flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base text-darkerGray">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-primaryOrange/20">
                <p className="text-sm md:text-base text-lightGray mb-4">
                  <strong className="text-darkerGray">{t("refundProgram.idealFor")}</strong>{" "}
                  {t("refundProgram.idealForText")}
                </p>
                <Button
                  href="/kontakt"
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 !px-4 !py-2.5 md:!px-6 md:!py-3 text-sm md:text-base"
                >
                  {t("refundProgram.cta")}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 py-8 md:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
        <div className="text-center max-w-3xl mx-auto relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 md:mb-6"
          >
            <Trophy className="w-12 h-12 md:w-16 md:h-16 text-primaryWhite mx-auto mb-3 md:mb-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-primaryWhite"
          >
            {t("cta.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl mb-6 md:mb-8 text-primaryWhite/90"
          >
            {t("cta.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full sm:w-auto"
          >
            <Button
              href="/kontakt"
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-4 !py-2.5 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite text-sm md:text-base w-full sm:w-auto"
            >
              {t("cta.ctaPartner")}
            </Button>
            <Button
              onClick={() => handleAppStoreClick()}
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-4 !py-2.5 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite text-sm md:text-base w-full sm:w-auto"
            >
              {t("cta.ctaApp")}
            </Button>
          </motion.div>
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

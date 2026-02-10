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
  User,
  GraduationCap,
  Briefcase,
  School,
  Award,
  Target,
  Zap,
  BookOpen,
  TrendingUp,
  Shield,
  Clock,
  Users,
} from "lucide-react";

export default function BeAFoxUnlimitedPage() {
  const t = useTranslations("unlimited");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(0);

  const handleAppStoreClick = (
    e?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    if (e) {
      e.preventDefault();
    }
    setIsDownloadModalOpen(true);
  };

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

  const iconById: Record<IconId, React.ElementType> = {
    school: School,
    graduationCap: GraduationCap,
    briefcase: Briefcase,
    user: User,
    users: Users,
    award: Award,
    clock: Clock,
    trendingUp: TrendingUp,
    bookOpen: BookOpen,
    target: Target,
    zap: Zap,
    shield: Shield,
  };

  const targetGroups = [
    {
      icon: School,
      title: t("hero.targetGroups.school.title"),
      description: t("hero.targetGroups.school.description"),
    },
    {
      icon: GraduationCap,
      title: t("hero.targetGroups.students.title"),
      description: t("hero.targetGroups.students.description"),
    },
    {
      icon: Briefcase,
      title: t("hero.targetGroups.apprentices.title"),
      description: t("hero.targetGroups.apprentices.description"),
    },
    {
      icon: User,
      title: t("hero.targetGroups.you.title"),
      description: t("hero.targetGroups.you.description"),
    },
  ];

  const statsItems =
    (t.raw("stats.items") as { iconId: IconId; value: string; label: string }[]) ??
    [];

  const howItWorksSteps =
    (t.raw("howItWorks.steps") as { title: string; description: string }[]) ?? [];

  const appFeatures =
    (t.raw("appFeatures.items") as {
      id: string;
      title: string;
      description: string;
      mockup: string;
    }[]) ?? [];

  const whyUnlimitedFeatures =
    (t.raw("whyUnlimited.features") as {
      iconId: IconId;
      title: string;
      description: string;
    }[]) ?? [];

  const plans =
    (t.raw("pricing.plans") as {
      title: string;
      price: string;
      period: string;
      yearlyNote?: string;
      features: string[];
      monthly?: boolean;
      popular?: boolean;
      cheapest?: boolean;
    }[]) ?? [];

  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[{ label: t("breadcrumbs.current"), href: "/beafox-unlimited" }]}
      />

      {/* Hero Section */}
      <Section className="bg-primaryWhite pt-12 md:pt-16 lg:pt-20 mt-14">
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h1 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              {t("hero.tag")}
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
            <span className="text-primaryOrange">{t("hero.highlight")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl text-lightGray max-w-3xl mx-auto mb-8 md:mb-12"
          >
            {t("hero.description")}
          </motion.p>

          {/* Target Groups Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto mb-8 md:mb-12">
            {targetGroups.map((group, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-4 md:p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all shadow-lg"
              >
                <group.icon className="w-8 h-8 md:w-10 md:h-10 text-primaryOrange mb-3 mx-auto" />
                <h3 className="text-lg md:text-xl font-bold text-darkerGray mb-2">
                  {group.title}
                </h3>
                <p className="text-sm md:text-base text-lightGray">
                  {group.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center w-full sm:w-auto"
          >
            <Button
              onClick={() => handleAppStoreClick()}
              variant="primary"
              className="flex items-center justify-center gap-2 !w-full sm:!w-auto !px-4 !py-2 md:!px-8 md:!py-4 text-sm md:text-base"
            >
              {t("hero.cta.download")}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="bg-white py-0 md:py-6 lg:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {statsItems.map((benefit, index) => {
              const Icon = iconById[benefit.iconId] ?? Users;
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center bg-primaryOrange/5 rounded-xl p-3 md:p-6 border-2 border-primaryOrange/20"
              >
                <Icon
                  className={`w-6 h-6 md:w-8 md:h-8 text-primaryOrange mx-auto mb-2 md:mb-3`}
                />
                <div className="text-xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-1 md:mb-2">
                  {benefit.value}
                </div>
                <div className="text-xs md:text-sm lg:text-base text-lightGray">
                  {benefit.label}
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      </Section>

      {/* How it Works Section */}
      <Section className="bg-primaryWhite mt-4 sm:mt-0 py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-0 sm:mb-4">
              {t("howItWorks.title.pre")}{" "}
              <span className="text-primaryOrange">
                {t("howItWorks.title.highlight")}
              </span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {howItWorksSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start gap-6 bg-white rounded-xl p-6 border-2 border-primaryOrange/20"
              >
                <div className="bg-primaryOrange text-primaryWhite w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {index + 1}
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

      {/* App Features with Mockups Section */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-0 sm:mb-4">
              {t("appFeatures.title.pre")}{" "}
              <span className="text-primaryOrange">
                {t("appFeatures.title.highlight")}
              </span>
            </h2>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto">
              {t("appFeatures.subtitle")}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 items-center">
            {/* Left: Feature Tabs */}
            <div className="space-y-4">
              {appFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 md:p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all cursor-pointer"
                  onMouseEnter={() => setSelectedFeature(index)}
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
            <div className="flex items-center justify-center lg:sticky lg:top-20 mt-8 md:mt-12 lg:mt-0">
              <motion.div
                key={selectedFeature}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <Image
                  src={appFeatures[selectedFeature]?.mockup ?? "/assets/Mockups/Mockup-Start.png"}
                  alt={t("appFeatures.mockupAlt", {
                    feature: appFeatures[selectedFeature]?.title ?? "BeAFox",
                  })}
                  width={300}
                  height={600}
                  className="object-contain drop-shadow-2xl w-full max-w-[200px] md:max-w-[350px] lg:max-w-[400px] h-auto"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-0 sm:mb-4">
              {t("whyUnlimited.title.pre")}{" "}
              <span className="text-primaryOrange">
                {t("whyUnlimited.title.highlight")}
              </span>
              {t("whyUnlimited.title.post")}
            </h2>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto">
              {t("whyUnlimited.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {whyUnlimitedFeatures.map((feature, index) => {
              const Icon = iconById[feature.iconId] ?? BookOpen;
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primaryWhite rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all shadow-sm h-full flex flex-col"
              >
                <div className="bg-primaryOrange/10 rounded-lg p-3 w-fit mb-4">
                  <Icon className="w-8 h-8 text-primaryOrange" />
                </div>
                <h3 className="text-xl font-bold text-darkerGray mb-3">
                  {feature.title}
                </h3>
                <p className="text-lightGray flex-1">{feature.description}</p>
              </motion.div>
            )})}
          </div>
        </div>
      </Section>

      {/* Pricing Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-0 sm:mb-4">
              {t("pricing.title.pre")}{" "}
              <span className="text-primaryOrange">{t("pricing.title.highlight")}</span>
            </h2>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto">
              {t("pricing.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white rounded-2xl border-2 shadow-xl flex flex-col h-full ${
                  plan.popular
                    ? "border-primaryOrange bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 p-7 md:p-9 lg:p-10"
                    : plan.cheapest
                    ? "border-primaryOrange/40 p-6 md:p-8"
                    : "border-primaryOrange/20 p-6 md:p-8"
                }`}
              >
                {plan.popular && (
                  <div className="bg-primaryOrange text-primaryWhite text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4">
                    {t("pricing.badges.popular")}
                  </div>
                )}
                {plan.cheapest && (
                  <div className="bg-primaryOrange/20 text-primaryOrange text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4">
                    {t("pricing.badges.cheapest")}
                  </div>
                )}
                {plan.monthly && (
                  <div className="bg-primaryOrange/20 text-primaryOrange text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4">
                    {t("pricing.badges.monthlyCancelable")}
                  </div>
                )}
                <h3 className="text-2xl font-bold text-darkerGray mb-2">
                  {plan.title}
                </h3>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-bold text-primaryOrange">
                      {plan.price}
                    </span>
                    <span className="text-lightGray">{plan.period}</span>
                  </div>
                  {plan.yearlyNote && (
                    <div className="text-xs md:text-sm text-lightGray mt-1">
                      {plan.yearlyNote}
                    </div>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-3 text-darkerGray"
                    >
                      <Check className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                      <span className="text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleAppStoreClick()}
                  variant={plan.popular ? "primary" : "outline"}
                  className={`w-full flex items-center justify-center gap-2 mt-auto !px-4 !py-2 md:!px-8 md:!py-3 text-sm md:text-base ${
                    plan.popular && "relative sm:top-1"
                  }`}
                >
                  {t("pricing.cta.start")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 py-8 md:py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
        <div className="grid md:grid-cols-2 gap-0 sm:gap-8 md:gap-12 items-center max-w-6xl mx-auto relative z-10">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left order-2 md:order-1"
          >
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
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start"
            >
              <Button
                onClick={() => handleAppStoreClick()}
                variant="secondary"
                className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite"
              >
                {t("cta.button")}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Mockups */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center justify-center order-1 md:order-2 mb-6 md:mb-0"
          >
            {/* Mockup 1 - Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10 transform rotate-[-8deg]"
              style={{ marginRight: "-20px" }}
            >
              <Image
                src="/assets/Mockups/Mockup-Start.png"
                alt={t("cta.mockups.profileAlt")}
                width={200}
                height={428}
                className="object-contain drop-shadow-2xl w-[140px] sm:w-[160px] md:w-[180px] lg:w-[220px] xl:w-[280px] h-auto"
              />
            </motion.div>

            {/* Mockup 2 - Right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative z-20 transform rotate-[8deg]"
            >
              <Image
                src="/assets/Mockups/Mockup-Lernpfad.png"
                alt={t("cta.mockups.pathAlt")}
                width={240}
                height={514}
                className="object-contain drop-shadow-2xl w-[140px] sm:w-[180px] md:w-[200px] lg:w-[240px] xl:w-[280px] h-auto"
              />
            </motion.div>
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

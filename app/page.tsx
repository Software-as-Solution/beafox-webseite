"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/Button";
import Section from "@/components/Section";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  CheckCircle,
  Users,
  School,
  Briefcase,
  Award,
  PawPrint,
  Building2,
  Clock,
  Activity,
  Calendar,
  Infinity,
  Smartphone,
  DollarSign,
  Lightbulb,
  Target,
  Handshake,
} from "lucide-react";
import Lottie from "lottie-react";
import DownloadModal from "@/components/DownloadModal";
import kontaktAnimation from "@/public/assets/Lottie/Kontakt.json";
import StructuredData from "@/components/StructuredData";

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(0);

  const words = (t.raw("hero.words") as string[]) ?? ["FREIHEIT", "SICHERHEIT"];

  const useCases = [
    {
      id: "unlimited",
      href: "/beafox-unlimited",
      icon: Smartphone,
      secondaryIcon: DollarSign,
      delay: 0.1,
    },
    {
      id: "business",
      href: "/fuer-unternehmen",
      icon: Building2,
      delay: 0.2,
    },
    {
      id: "schools",
      href: "/fuer-schulen",
      icon: School,
      delay: 0.3,
    },
    {
      id: "partners",
      href: "/fuer-clubs",
      icon: Handshake,
      delay: 0.4,
    },
  ];

  const appFeatures = [
    {
      id: "stufen",
      mockup: "/assets/Mockups/Mockup-Stufen.png",
      color: "primaryOrange",
    },
    {
      id: "lernpfad",
      mockup: "/assets/Mockups/Mockup-Lernpfad.png",
      color: "primaryOrange",
    },
    {
      id: "lektion",
      mockup: "/assets/Mockups/Mockup-Lektion.png",
      color: "primaryOrange",
    },
    {
      id: "quiz",
      mockup: "/assets/Mockups/Mockup-Quiz.png",
      color: "primaryOrange",
    },
    {
      id: "rangliste",
      mockup: "/assets/Mockups/Mockup-Rangliste.png",
      color: "primaryOrange",
    },
    {
      id: "missionen",
      mockup: "/assets/Mockups/Mockup-Missionen.png",
      color: "primaryOrange",
    },
    {
      id: "profil",
      mockup: "/assets/Mockups/Mockup-Profil.png",
      color: "primaryOrange",
    },
  ];

  // Check if device is mobile
  const isMobileDevice = () => {
    if (typeof window === "undefined") return false;
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768
    );
  };

  const handleAppStoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    if (!isMobileDevice()) {
      e.preventDefault();
      window.open(e.currentTarget.href, "_blank", "noopener,noreferrer");
    }
    // On mobile, let the default behavior happen (opens in app store)
  };

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (typedText.length < currentWord.length) {
          setTypedText(currentWord.slice(0, typedText.length + 1));
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // Deleting
        if (typedText.length > 0) {
          setTypedText(currentWord.slice(0, typedText.length - 1));
        } else {
          // Finished deleting, switch to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, currentWordIndex, isDeleting, words]);

  const stats = [
    { value: "5,000+", label: t("stats.privateUsers"), icon: Users },
    {
      value: "5+",
      label: t("stats.schools.pre"),
      label2: t("stats.schools.post"),
      icon: Building2,
    },
    {
      value: "3,000+",
      label: t("stats.learners.pre"),
      label2: t("stats.learners.post"),
      icon: School,
    },
  ];

  const availableLanguage =
    locale === "de" ? ["German"] : locale === "en" ? ["English"] : ["German"];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 pb-8 md:pb-4 md:pt-40 bg-primaryWhite">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-2 md:gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 md:space-y-8"
            >
              {/* Small Text with Icons */}
              <div className="flex items-center gap-2 text-lightGray text-xs md:text-sm border text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 py-1.5 md:py-2 w-full sm:w-auto sm:max-w-fit">
                <PawPrint className="w-3 h-3 md:w-4 md:h-4 text-primaryOrange flex-shrink-0" />
                <span className="font-bold text-center md:w-full">
                  {t("hero.badge")}
                </span>
                <PawPrint className="w-3 h-3 md:w-4 md:h-4 text-primaryOrange flex-shrink-0" />
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-darkerGray mb-3 md:mb-4 leading-tight">
                  {t("hero.headline.knowledge")}.{" "}
                  <span className="text-primaryOrange">
                    {t("hero.headline.money")}.
                  </span>{" "}
                  <span className="inline-block min-w-[180px] sm:min-w-[200px] md:min-w-[350px] text-left">
                    {typedText}
                    <span className="inline-block w-0.5 h-[1em] bg-primaryOrange ml-1 animate-pulse"></span>
                  </span>
                  .
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-lightGray leading-relaxed">
                  {t("hero.description")}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 lg:gap-4">
                <Button
                  onClick={() => setIsDownloadModalOpen(true)}
                  variant="primary"
                  className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-4 !py-2 md:!px-8 md:!py-3 text-sm md:text-base"
                >
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                  {t("hero.cta.download")}
                </Button>
                <Button
                  href="/kontakt"
                  variant="outline"
                  className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-4 !py-2 md:!px-8 md:!py-3 text-sm md:text-base"
                >
                  <Award className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                  {t("hero.cta.partner")}
                </Button>
              </div>

              {/* Stats - Small under buttons */}
              <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 mt-4 md:mt-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 md:gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 md:px-4 py-1.5 md:py-2 shadow-sm"
                    >
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primaryOrange flex-shrink-0"></div>
                      <IconComponent className="w-3.5 h-3.5 md:w-4 md:h-4 text-darkerGray flex-shrink-0" />
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1">
                        <span className="text-sm md:text-base lg:text-lg font-bold text-primaryOrange">
                          {stat.value}
                        </span>
                        <span className="text-[10px] sm:text-xs md:text-sm text-darkerGray font-medium leading-tight">
                          {stat.label}
                          {stat.label2 && <> {stat.label2}</>}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Side - Mockups */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="flex items-center justify-center relative">
                {/* Mockup 1 - Training (Left, slightly behind) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative z-10 transform rotate-[-8deg] hover:rotate-[-5deg] transition-transform -mr-6 sm:-mr-8 md:-mr-10 lg:-mr-12 xl:-mr-16"
                >
                  <Image
                    src="/assets/Mockups/Mockup-Training.png"
                    alt={t("hero.mockups.trainingAlt")}
                    width={200}
                    height={425}
                    className="object-contain drop-shadow-2xl w-[120px] h-auto sm:w-[180px] md:w-[220px] lg:w-[260px] xl:w-[300px] 2xl:w-[320px]"
                  />
                </motion.div>

                {/* Mockup 2 - Lernpfad (Center, most prominent) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative z-30 transform hover:scale-105 transition-transform"
                >
                  <Image
                    src="/assets/Mockups/Mockup-Lernpfad.png"
                    alt={t("hero.mockups.pathAlt")}
                    width={240}
                    height={473}
                    className="object-contain drop-shadow-2xl w-[140px] h-auto sm:w-[220px] md:w-[260px] lg:w-[300px] xl:w-[340px] 2xl:w-[380px]"
                  />
                </motion.div>

                {/* Mockup 3 - Rangliste (Right, slightly behind) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="relative z-10 transform rotate-[8deg] hover:rotate-[5deg] transition-transform -ml-6 sm:-ml-8 md:-ml-10 lg:-ml-12 xl:-ml-16"
                >
                  <Image
                    src="/assets/Mockups/Mockup-Rangliste.png"
                    alt={t("hero.mockups.rankingAlt")}
                    width={200}
                    height={425}
                    className="object-contain drop-shadow-2xl w-[120px] h-auto sm:w-[180px] md:w-[220px] lg:w-[260px] xl:w-[300px] 2xl:w-[320px]"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Logos Carousel */}
      <Section className="bg-primaryWhiteLight overflow-hidden py-4 md:py-0">
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-primaryWhiteLight to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-primaryWhiteLight to-transparent z-10 pointer-events-none"></div>

          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll">
              {/* First set of logos */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                <div
                  key={`first-${i}`}
                  className="flex-shrink-0 mx-2 md:mx-4 w-24 h-14 md:w-64 md:h-32 lg:w-80 lg:h-40 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src={`/Partners/${i}.png`}
                    alt={t("partnersCarousel.alt", { index: i })}
                    width={100}
                    height={120}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                <div
                  key={`second-${i}`}
                  className="flex-shrink-0 mx-2 md:mx-4 w-24 h-14 md:w-64 md:h-32 lg:w-80 lg:h-40 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src={`/Partners/${i}.png`}
                    alt={t("partnersCarousel.alt", { index: i })}
                    width={100}
                    height={120}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Eine App für jeden Einsatz Section */}
      <Section className="bg-gray-50 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 md:mb-10 lg:mb-14"
          >
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6 md:mb-8">
              <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
                {t("useCasesSection.title.pre")}{" "}
                <span className="text-primaryOrange">
                  {t("useCasesSection.title.highlight")}
                </span>
              </h2>
              <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
            <p className="text-lightGray text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
              {t("useCasesSection.subtitle")}
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {useCases.map((useCase) => {
              const IconComponent = useCase.icon;
              const SecondaryIconComponent = useCase.secondaryIcon;

              // Mobile order: Business (1), Schools (2), Partners (3), Unlimited (4)
              // Desktop order: Unlimited (1), Business (2), Schools (3), Partners (4)
              const getOrderClass = () => {
                switch (useCase.id) {
                  case "business":
                    return "order-1 md:order-2";
                  case "schools":
                    return "order-2 md:order-3";
                  case "partners":
                    return "order-3 md:order-4";
                  case "unlimited":
                    return "order-4 md:order-1";
                  default:
                    return "";
                }
              };

              return (
                <Link
                  key={useCase.id}
                  href={useCase.href}
                  className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primaryOrange/20 group flex flex-col h-full ${getOrderClass()}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: useCase.delay }}
                    className="flex flex-col h-full"
                  >
                    {/* Icon */}
                    <div className="mb-6 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 rounded-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0 animate-pulse">
                      {SecondaryIconComponent ? (
                        <div className="relative">
                          <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-primaryOrange animate-pulse" />
                          <SecondaryIconComponent
                            className={`w-4 h-4 md:w-5 md:h-5 text-primaryOrange absolute -top-1 -right-1 animate-pulse ${
                              useCase.id === "unlimited"
                                ? "bg-white rounded-full p-0.5"
                                : ""
                            }`}
                          />
                        </div>
                      ) : (
                        <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-primaryOrange animate-pulse" />
                      )}
                    </div>

                    {/* Title - Exakter Anchor-Text für SEO */}
                    <h3 className="text-xl md:text-2xl font-bold text-primaryOrange mb-3 md:mb-4 flex-shrink-0 group-hover:underline">
                      {t(`useCases.${useCase.id}.title`)}
                    </h3>

                    {/* Description */}
                    <p className="text-sm md:text-base text-lightGray mb-4 md:mb-6 flex-shrink-0">
                      {t(`useCases.${useCase.id}.description`)}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-3 md:space-y-4 flex-grow mb-6 md:mb-8">
                      {(t.raw(
                        `useCases.${useCase.id}.features`
                      ) as string[]).map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-primaryOrange flex-shrink-0 mt-0.5" />
                          <span className="text-sm md:text-base text-darkerGray">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA - pushed to bottom */}
                    <div className="mt-auto flex-shrink-0 flex items-center justify-center gap-2 text-primaryOrange font-semibold text-sm md:text-base group-hover:gap-3 transition-all">
                      {t("useCasesSection.more")}
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Finanzbildungs-Ökosystem Section */}
      <Section className="bg-white py-8 md:py-16 lg:py-20">
        <div className="text-center mb-8 md:mb-16">
          <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto">
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl">
              {t("ecosystem.title")}
            </h2>
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </div>
        </div>

        <div className="grid lg:grid-cols-7 gap-8 md:gap-10 items-center">
          {/* Left Features */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-right"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primaryOrange rounded-full mb-4">
                <Clock className="w-8 h-8 text-primaryWhite" />
              </div>
              <div className="flex items-center gap-2 text-lightGray text-sm border text-center justify-center border-primaryOrange rounded-full px-4 py-2 w-fit mb-2 mx-auto lg:mx-0 lg:ml-auto">
                <PawPrint className="w-4 h-4 text-primaryOrange" />
                <span className="font-bold">{t("ecosystem.left.anytime.title")}</span>
                <PawPrint className="w-4 h-4 text-primaryOrange" />
              </div>
              <p className="text-darkerGray text-sm">
                {t("ecosystem.left.anytime.text")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center lg:text-right"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primaryOrange rounded-full mb-4">
                <School className="w-8 h-8 text-primaryWhite" />
              </div>
              <div className="flex items-center gap-2 text-lightGray text-sm border text-center justify-center border-primaryOrange rounded-full px-4 py-2 w-fit mb-2 mx-auto lg:mx-0 lg:ml-auto">
                <PawPrint className="w-4 h-4 text-primaryOrange" />
                <span className="font-bold">{t("ecosystem.left.school.title")}</span>
                <PawPrint className="w-4 h-4 text-primaryOrange" />
              </div>
              <p className="text-darkerGray text-sm">
                {t("ecosystem.left.school.text")}
              </p>
            </motion.div>
          </div>

          {/* Center Mockups - Ecosystem */}
          <div
            className="lg:col-span-3 flex flex-row items-center justify-center relative gap-0 my-8 lg:my-0 overflow-x-auto md:overflow-visible"
            style={{ perspective: "1000px" }}
          >
            {/* Smartphone - Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative z-10 transition-transform -mr-12 sm:-mr-16 md:-mr-20 lg:-mr-24 xl:-mr-28"
            >
              <div className="[transform:scale(0.75)] sm:[transform:scale(0.8)] md:[transform:scale(0.85)] lg:[transform:scale(0.95)] xl:[transform:scale(1.05)]">
                <Image
                  src="/assets/Mockups/Mockup-Start.png"
                  alt={t("ecosystem.mockups.phoneAlt")}
                  width={200}
                  height={430}
                  className="object-contain drop-shadow-2xl w-[200px] h-auto"
                />
              </div>
            </motion.div>

            {/* Macbook - Center */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-20 transition-transform"
            >
              <div className="[transform:scale(0.65)] sm:[transform:scale(0.7)] md:[transform:scale(0.8)] lg:[transform:scale(0.9)] xl:[transform:scale(0.95)]">
                <Image
                  src="/assets/Mockups/Mockup-Macbook.png"
                  alt={t("ecosystem.mockups.laptopAlt")}
                  width={600}
                  height={400}
                  className="object-contain drop-shadow-2xl w-[600px] h-auto"
                />
              </div>
            </motion.div>

            {/* iPad - Right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative z-10 transition-transform -ml-12 sm:-ml-16 md:-ml-20 lg:-ml-24 xl:-ml-28"
            >
              <div className="[transform:scale(0.75)] sm:[transform:scale(0.8)] md:[transform:scale(0.85)] lg:[transform:scale(0.9)] xl:[transform:scale(0.95)]">
                <Image
                  src="/assets/Mockups/Mockup-Ipad.png"
                  alt={t("ecosystem.mockups.tabletAlt")}
                  width={300}
                  height={400}
                  className="object-contain drop-shadow-2xl w-[300px] h-auto"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Features */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primaryOrange rounded-full mb-4">
                <Briefcase className="w-8 h-8 text-primaryWhite" />
              </div>
              <div className="flex items-center gap-2 text-lightGray text-sm border text-center justify-center border-primaryOrange rounded-full px-4 py-2 w-fit mb-2 mx-auto lg:mx-0 lg:mr-auto">
                <PawPrint className="w-4 h-4 text-primaryOrange" />
                <span className="font-bold">
                  {t("ecosystem.right.training.title")}
                </span>
                <PawPrint className="w-4 h-4 text-primaryOrange" />
              </div>
              <p className="text-darkerGray text-sm">
                {t("ecosystem.right.training.text")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primaryOrange rounded-full mb-4">
                <Activity className="w-8 h-8 text-primaryWhite" />
              </div>
              <div className="flex items-center gap-2 text-lightGray text-sm border text-center justify-center border-primaryOrange rounded-full px-4 py-2 w-fit mb-2 mx-auto lg:mx-0 lg:mr-auto">
                <PawPrint className="w-4 h-4 text-primaryOrange" />
                <span className="font-bold">{t("ecosystem.right.clubs.title")}</span>
                <PawPrint className="w-4 h-4 text-primaryOrange" />
              </div>
              <p className="text-darkerGray text-sm">
                {t("ecosystem.right.clubs.text")}
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* App Features Section */}
      <Section className="bg-primaryWhite py-8 md:py-16 lg:py-20">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6 md:mb-8">
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl">
              {t("howItWorks.title")}
            </h2>
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </div>

          {/* Feature Tabs */}
          <div className="relative mb-8 md:mb-12 w-full mx-auto">
            {/* Gradient Overlay - Right */}
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-primaryWhite to-transparent z-10 pointer-events-none"></div>

            {/* Scrollable Tabs Container */}
            <div className="overflow-x-auto scrollbar-hide pb-2 md:pb-0 scroll-smooth px-4 md:px-0">
              <div className="flex gap-2 md:gap-3 justify-center md:justify-center min-w-max md:min-w-0">
                {appFeatures.map((feature, index) => (
                  <button
                    key={feature.id}
                    onClick={() => setSelectedFeature(index)}
                    className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                      selectedFeature === index
                        ? "bg-primaryOrange text-primaryWhite shadow-lg"
                        : "bg-gray-100 text-darkerGray hover:bg-gray-200"
                    }`}
                  >
                    {t(`appFeatures.${feature.id}.title`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Scroll Indicator - Only visible on mobile */}
            <div className="flex justify-center mt-2 md:hidden">
              <div className="flex items-center gap-2 text-primaryOrange">
                <ArrowRight className="w-3 h-3 rotate-180 animate-pulse" />
                <span className="text-xs font-medium">
                  {t("howItWorks.scrollMore")}
                </span>
                <ArrowRight className="w-3 h-3 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-50 rounded-2xl p-6 md:p-8 lg:p-12 w-full max-w-6xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: Mockup */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center order-2 md:order-1"
              >
                <Image
                  src={appFeatures[selectedFeature].mockup}
                  alt={t("howItWorks.mockupAlt", {
                    feature: t(`appFeatures.${appFeatures[selectedFeature].id}.title`),
                  })}
                  width={240}
                  height={520}
                  className="object-contain drop-shadow-2xl w-[240px] h-auto md:w-[280px] lg:w-[300px]"
                />
              </motion.div>

              {/* Right: Description */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="order-1 md:order-2"
              >
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-4 md:mb-6">
                  {t(`appFeatures.${appFeatures[selectedFeature].id}.title`)}
                </h3>
                <p className="text-base md:text-lg text-lightGray leading-relaxed mb-6">
                  {t(`appFeatures.${appFeatures[selectedFeature].id}.description`)}
                </p>
                <Button
                  href="/kontakt"
                  variant="primary"
                  className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-4 !py-2 md:!px-8 md:!py-3 text-sm md:text-base"
                >
                  {t("howItWorks.ctaPartner")} →
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Section>

      {/* BeAFox For Business Section */}
      {/* <Section className="bg-white py-8 md:py-16 lg:py-20 mt-4 md:mt-0">
        <div className="text-center mb-8 md:mb-16">
          <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto">
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              BeAFox for Business
            </h2>
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-darkerGray text-sm border-2 border-primaryOrange rounded-full px-4 py-2 w-fit mb-8">
              <PawPrint className="w-4 h-4 text-primaryOrange " />
              <span className="font-bold text-center">
                Bildungspakete gegen Fachkräftemangel
              </span>
              <PawPrint className="w-4 h-4 text-primaryOrange" />
            </div>

            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              <span className="text-darkerGray">
                Mitarbeitende, die Geld verstehen{" "}
              </span>
              <span className="text-primaryOrange">
                arbeiten fokussierter, bleiben gesünder und länger im
                Unternehmen.
              </span>
            </h3>

            <p className="text-darkerGray mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
              BeAFox verbindet digitales Lernen mit regelmäßigen Workshops. Für
              nachhaltige Verhaltensänderung statt kurzlebigem Wissen. Weniger
              finanzieller Stress, mehr Motivation und messbar bessere
              Performance.
            </p>

            <div className="mb-6 md:mb-8">
              <h4 className="text-lg md:text-xl font-bold text-darkerGray mb-3 md:mb-4">
                So funktioniert's:
              </h4>
              <p className="text-darkerGray text-base md:text-lg leading-relaxed">
                Alle 6 Monate vermitteln wir praxisrelevante Finanzthemen im
                Workshop. Dazwischen festigen Azubis und Mitarbeitende ihr
                Wissen spielerisch in der App. Flexibel im Alltag, mit klaren
                Fortschrittszielen und echter Lernmotivation.
              </p>
            </div>

            <div className="flex justify-center md:justify-start w-full">
              <Button
                href="/kontakt"
                variant="primary"
                className="flex items-center justify-center gap-1.5 md:gap-2 w-full md:w-auto !px-4 !py-2 md:!px-8 md:!py-3 text-sm md:text-base"
              >
                Jetzt Partner werden
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl relative">
              <Image
                width={400}
                height={300}
                alt="BeAFox Workshop"
                src="/assets/Business.png"
                className="object-cover w-full h-auto"
              />

              <div className="absolute bottom-0 right-0 bg-primaryOrange rounded-2xl p-4 md:p-6 m-2 md:m-4 max-w-[90%] sm:max-w-sm hidden md:block">
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-sm md:text-base font-medium">
                      Gezielte Workshops
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-sm md:text-base font-medium">
                      Monitoring Dashboards
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-sm md:text-base font-medium">
                      Offizielle Zertifikate
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-sm md:text-base font-medium">
                      Spielerische Lern-App
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-sm md:text-base font-medium">
                      Große PR-Aktion
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-sm md:text-base font-medium">
                      Motiviertere Azubis
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section> */}

      {/* BeAFox For Schools Section */}
      {/* <Section className="bg-white py-8 md:py-16 lg:py-20">
        <div className="text-center mb-8 md:mb-16">
          <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto">
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              BeAFox for Schools
            </h2>
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 md:order-1"
          >
   
            <div className="rounded-2xl overflow-hidden shadow-2xl relative mb-8">
              <Image
                src="/assets/School.png"
                alt="BeAFox Schule"
                width={600}
                height={375}
                className="object-cover w-full h-auto"
              />
            </div>

            <div className="relative -mt-24 mx-4 bg-primaryOrange rounded-2xl p-6 hidden md:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-sm font-medium">
                      Spielerisches System
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-sm font-medium">
                      Schritt für Schritt Lernpfad
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-sm font-medium">
                      Unabhängige Finanzbildung
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-sm font-medium">
                      Zeitersparnis
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-sm font-medium">
                      Fortschrittstracking
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-sm font-medium">
                      Didaktisch aufbereitet
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 order-1 md:order-2"
          >
            <div className="flex items-center justify-center mx-auto lg:mx-0 gap-2 text-darkerGray text-sm border-2 border-primaryOrange rounded-full px-4 py-2 w-fit mb-8">
              <PawPrint className="w-4 h-4 text-primaryOrange " />
              <span className="font-bold text-center">
                Finanzbildung als Ergänzung
              </span>
              <PawPrint className="w-4 h-4 text-primaryOrange" />
            </div>

            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              <span className="text-darkerGray">Wir schließen die Lücke </span>
              <span className="text-primaryOrange">in der Finanzbildung </span>
            </h3>

            <p className="text-darkerGray text-base md:text-lg leading-relaxed mb-4 md:mb-6">
              Ein Lehrer muss gleichzeitig mehrere Klassen betreuen? Kein
              Problem. Die Schüler arbeiten selbstständig und interaktiv mit
              BeAFox. Ganz ohne direkte Anwesenheit des Lehrers vor Ort.
            </p>

            <div className="mb-6 md:mb-8">
              <h4 className="text-lg md:text-xl font-bold text-darkerGray mb-3 md:mb-4">
                Für Lehrer & Schulleitung:
              </h4>
              <p className="text-darkerGray text-base md:text-lg leading-relaxed">
                Das integrierte Monitoring-Dashboard zeigt in Echtzeit, was
                jeder Schüler gerade lernt, wo er steht und wie er vorankommt.
                Schwächen werden sofort sichtbar und Fortschritte werden
                belohnt.
              </p>
            </div>

            <div className="flex justify-center md:justify-start w-full">
              <Button
                href="/kontakt"
                variant="primary"
                className="flex items-center justify-center gap-1.5 md:gap-2 w-full md:w-auto !px-4 !py-2 md:!px-8 md:!py-3 text-sm md:text-base"
              >
                Jetzt Partner werden
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </Section> */}

      {/* BeAFox For Clubs Section */}
      {/* <Section className="bg-white py-8 md:py-16 lg:py-20">
        <div className="text-center mb-8 md:mb-16">
          <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto">
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              BeAFox for Clubs
            </h2>
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center mx-auto gap-2 text-darkerGray text-sm border-2 border-primaryOrange rounded-full px-4 py-2 w-fit mb-8">
              <PawPrint className="w-4 h-4 text-primaryOrange " />
              <span className="font-bold text-center">
                Finanzbildung für Vereine
              </span>
              <PawPrint className="w-4 h-4 text-primaryOrange" />
            </div>

            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              <span className="text-darkerGray">
                Junge Sportler brauchen{" "}
                <span className="text-primaryOrange">
                  mehr als nur Training
                </span>
              </span>
            </h3>

            <p className="text-darkerGray text-base md:text-lg leading-relaxed mb-4 md:mb-6">
              Finanzielle Sicherheit schafft mentale Stärke und lässt Talente
              mit klarem Kopf auf dem Platz stehen. Mit BeAFox geben Vereine
              ihren Spielern das Wissen, das sie im Alltag stärkt und im Sport
              fokussiert hält. Das führt zu echter Entwicklung auf und neben dem
              Platz.
            </p>

            <div className="mb-6 md:mb-8">
              <h4 className="text-lg md:text-xl font-bold text-darkerGray mb-3 md:mb-4">
                Die Transformation:
              </h4>
              <div className="space-y-3">
                <p className="text-darkerGray text-base md:text-lg leading-relaxed">
                  <span className="font-semibold">
                    Ohne finanzielle Bildung:
                  </span>{" "}
                  Finanzielle Sorgen lenken ab, mentale Belastung, unfokussiert
                  auf dem Platz, keine Vorbereitung auf die Zukunft.
                </p>
                <p className="text-darkerGray text-base md:text-lg leading-relaxed">
                  <span className="font-semibold text-primaryOrange">
                    Mit BeAFox:
                  </span>{" "}
                  Finanzielle Sicherheit, mentale Stärke, Fokus auf dem Platz,
                  vorbereitet für die Zukunft.
                </p>
              </div>
            </div>

            <div className="flex justify-center md:justify-start w-full">
              <Button
                href="/kontakt"
                variant="primary"
                className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-4 !py-2 md:!px-8 md:!py-3 text-sm md:text-base"
              >
                Jetzt Partner werden
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl relative mb-8">
              <Image
                src="/assets/Vereine.png"
                alt="BeAFox Vereine"
                width={500}
                height={312}
                className="object-cover w-full h-auto"
              />
            </div>

            <div className="relative -mt-16 md:-mt-24 mx-2 md:mx-4 bg-primaryOrange rounded-2xl p-4 md:p-6 hidden md:block">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-xs md:text-sm font-medium">
                      Spielerisches System
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-xs md:text-sm font-medium">
                      Schritt für Schritt Lernpfad
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-xs md:text-sm font-medium">
                      Unabhängige Finanzbildung
                    </span>
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-xs md:text-sm font-medium">
                      Zeitersparnis
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-xs md:text-sm font-medium">
                      Fortschrittstracking
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-xs md:text-sm font-medium">
                      Didaktisch aufbereitet
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section> */}

      {/* Warum Finanzbildung Section */}
      <Section className="bg-primaryWhiteLight py-8 md:py-16 lg:py-20">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto">
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              {t("whyFinance.title")}
            </h2>
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Three Points */}
          <div className="space-y-4">
            {/* Point 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="text-5xl md:text-6xl font-bold text-primaryOrange mb-3">
                1
              </div>
              <h3 className="text-xl font-bold text-primaryOrange mb-3">
                {t("whyFinance.items.0.title")}
              </h3>
              <p className="text-sm md:text-base text-darkerGray leading-relaxed">
                {t("whyFinance.items.0.text")}
              </p>
            </motion.div>

            {/* Point 2 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="text-5xl md:text-6xl font-bold text-primaryOrange mb-3">
                2
              </div>
              <h3 className="text-xl font-bold text-primaryOrange mb-3">
                {t("whyFinance.items.1.title")}
              </h3>
              <p className="text-sm md:text-base text-darkerGray leading-relaxed">
                {t("whyFinance.items.1.text")}
              </p>
            </motion.div>

            {/* Point 3 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="text-5xl md:text-6xl font-bold text-primaryOrange mb-3">
                3
              </div>
              <h3 className="text-xl font-bold text-primaryOrange mb-3">
                {t("whyFinance.items.2.title")}
              </h3>
              <p className="text-sm md:text-base text-darkerGray leading-relaxed">
                {t("whyFinance.items.2.text")}
              </p>
            </motion.div>
          </div>

          {/* Right: Maskottchen Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center mt-8 md:mt-0"
          >
            <Image
              src="/assets/Maskottchen.jpeg"
              alt={t("whyFinance.mascotAlt")}
              width={400}
              height={400}
              className="object-contain rounded-2xl w-full max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-auto"
            />
          </motion.div>
        </div>
      </Section>

      {/* Download Banner Section */}
      <Section className="bg-primaryOrange/10 py-8 md:py-16 lg:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto px-4">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1 text-center md:text-left"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-4 md:mb-6 leading-tight">
              {t("downloadBanner.title.pre")}{" "}
              <span className="text-primaryOrange">
                {t("downloadBanner.title.highlight")}
              </span>{" "}
              {t("downloadBanner.title.post")}
            </h2>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-0 md:gap-4 mt-6 md:mt-8 items-center justify-center md:justify-start">
              <a
                href="https://apps.apple.com/de/app/beafox/id6746110612"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Image
                  src="/assets/Apple.png"
                  alt={t("downloadBanner.storeBadges.appleAlt")}
                  width={190}
                  height={60}
                  className="object-contain hover:opacity-80 transition-opacity w-[200px] sm:w-[150px] md:w-[175px] h-auto relative bottom-1"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.tapelea.beafox&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Image
                  src="/assets/Android.png"
                  alt={t("downloadBanner.storeBadges.googleAlt")}
                  width={180}
                  height={60}
                  className="object-contain hover:opacity-80 transition-opacity w-[200px] sm:w-[170px] md:w-[180px] h-auto relative bottom-[2px]"
                />
              </a>
            </div>
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
                src="/assets/Mockups/Mockup-Training.png"
                alt={t("downloadBanner.mockups.trainingAlt")}
                width={200}
                height={428}
                className="object-contain drop-shadow-2xl w-[160px] sm:w-[160px] md:w-[180px] lg:w-[220px] xl:w-[280px] h-auto"
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
                alt={t("downloadBanner.mockups.pathAlt")}
                width={240}
                height={514}
                className="object-contain drop-shadow-2xl w-[160px] sm:w-[180px] md:w-[200px] lg:w-[240px] xl:w-[280px] h-auto"
              />
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 relative overflow-hidden py-8 md:py-16 lg:py-20">
        <div className="grid md:grid-cols-2 gap-2 md:gap-12 items-center max-w-6xl mx-auto relative z-10">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left order-2 md:order-1"
          >
            <div className="flex items-center gap-2 text-primaryWhite text-xs md:text-sm border-2 border-primaryWhite/30 rounded-full px-3 md:px-4 py-1.5 md:py-2 w-fit mx-auto md:mx-0 mb-4 md:mb-6">
              <PawPrint className="w-3 h-3 md:w-4 md:h-4 text-primaryWhite" />
              <span className="font-bold">{t("cta.badge")}</span>
              <PawPrint className="w-3 h-3 md:w-4 md:h-4 text-primaryWhite" />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primaryWhite mb-3 md:mb-4">
              {t("cta.title")}
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-primaryWhite/90 mb-6 md:mb-8 leading-relaxed">
              {t("cta.description")}
            </p>

            <div className="flex flex-col gap-3 md:gap-4 justify-center md:justify-start">
              <Button
                href="/kontakt"
                variant="secondary"
                className="!bg-primaryWhite !text-primaryOrange hover:!bg-primaryWhite/90 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg flex justify-center items-center w-full sm:w-auto"
              >
                {t("cta.buttons.partner")}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Button>
              <a
                href="https://app.cal.eu/beafox"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-primaryWhite text-primaryWhite hover:bg-primaryWhite/10 px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold transition-all duration-300 text-base md:text-lg w-full sm:w-auto text-center"
              >
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                {t("cta.buttons.book")}
              </a>
            </div>
          </motion.div>

          {/* Right: Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center order-1 md:order-2 mb-0"
          >
            <div className="w-full max-w-[280px] md:max-w-md">
              <Lottie
                animationData={kontaktAnimation}
                loop={true}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Blog Section */}
      <Section className="bg-white py-8 md:py-16 lg:py-20">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-4 md:mb-6">
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h2 className="font-bold text-xl md:text-2xl lg:text-3xl text-darkerGray">
              {t("blogPreview.title")}
            </h2>
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </div>
          <p className="text-base md:text-lg text-lightGray max-w-2xl mx-auto px-4">
            {t("blogPreview.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
          {(t.raw("blogPreview.posts") as {
            image: string;
            imageAlt: string;
            title: string;
            excerpt: string;
          }[]).map((post, idx) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="border-2 border-primaryOrange rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="relative h-72 md:h-80 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-xl font-bold text-primaryOrange text-center mb-3">
                  {post.title}
                </h4>
                <p className="text-lightGray text-sm leading-relaxed flex-1 mb-4">
                  {post.excerpt}
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 bg-primaryOrange text-primaryWhite px-4 py-2 rounded-lg hover:bg-primaryOrange/90 transition-colors text-sm font-semibold mt-auto"
                >
                  {t("blogPreview.more")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onAppStoreClick={handleAppStoreClick}
      />

      {/* Structured Data for SEO */}
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "BeAFox UG (haftungsbeschränkt)",
          url: "https://beafox.app",
          logo: "https://beafox.app/assets/logo.png",
          description:
            t("seo.organization.description"),
          address: {
            "@type": "PostalAddress",
            streetAddress: "Siemensweg 2",
            addressLocality: "Neutraubling",
            postalCode: "93073",
            addressCountry: "DE",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+49-178-2723-673",
            contactType: "customer service",
            email: "info@beafox.app",
            availableLanguage,
          },
          sameAs: [
            "https://www.instagram.com/beafox_app",
            "https://www.linkedin.com/company/beafox",
            "https://twitter.com/beafox_app",
            "https://www.youtube.com/@beafox",
          ],
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "BeAFox",
          url: "https://beafox.app",
          description:
            t("seo.website.description"),
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
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "BeAFox",
          applicationCategory: "EducationalApplication",
          operatingSystem: "iOS, Android",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "EUR",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "150",
          },
          description:
            t("seo.softwareApplication.description"),
        }}
      />
    </>
  );
}

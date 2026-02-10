"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import DownloadModal from "@/components/DownloadModal";
import { useTranslations } from "next-intl";
import {
  Check,
  School,
  Briefcase,
  Users,
  GraduationCap,
  User,
  PawPrint,
  ArrowRight,
  Sparkles,
  Award,
  ChevronDown,
  Presentation,
  BookOpen,
  Target,
  Lightbulb,
  Infinity,
  Globe,
  Layers,
  FileText,
  BarChart,
  Book,
  CreditCard,
  Megaphone,
  Calendar,
  MessageSquare,
  Palette,
  Package,
  Headphones,
} from "lucide-react";

export default function PricingPage() {
  const t = useTranslations("pricing");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [openFAQId, setOpenFAQId] = useState<number | null>(null);

  const targetGroups = [
    {
      icon: School,
      title: t("hero.targetGroups.school.title"),
      description: t("hero.targetGroups.school.description"),
    },
    {
      icon: Briefcase,
      title: t("hero.targetGroups.apprentices.title"),
      description: t("hero.targetGroups.apprentices.description"),
    },
    {
      icon: GraduationCap,
      title: t("hero.targetGroups.students.title"),
      description: t("hero.targetGroups.students.description"),
    },
    {
      icon: User,
      title: t("hero.targetGroups.you.title"),
      description: t("hero.targetGroups.you.description"),
    },
  ];

  const schoolPlan = {
    price: "€1",
    period: "pro Schüler",
    period2: "pro Jahr",
    subtitle:
      "Flexible Staffelpreise: passgenau für Ihre Schule oder Institution,",
    features: [
      { text: "Lernen ohne Grenzen", icon: Infinity },
      { text: "Vollständige Lernmodule", icon: BookOpen },
      { text: "Lehrer-Dashboards", icon: BarChart },
      { text: "Karteikartensysteme", icon: CreditCard },
      { text: "Analoge Unterlagen", icon: FileText },
    ],
  };

  const businessPlans = [
    {
      title: "Ab 10 Lizenzen",
      price: "€6.99",
      period: "/ monat",
      setupFee: 199,
      features: [
        { text: "Lernen ohne Grenzen", icon: Infinity },
        { text: "Vollständige Lernmodule", icon: BookOpen },
        { text: "Integriertes Karteikartensystem", icon: Layers },
      ],
    },
    {
      title: "Ab 50 Lizenzen",
      price: "€5.99",
      period: "/ monat",
      setupFee: 299,
      features: [
        { text: "Lernen ohne Grenzen", icon: Infinity },
        { text: "Vollständige Lernmodule", icon: BookOpen },
        { text: "Integriertes Karteikartensystem", icon: Layers },
      ],
      popular: true,
    },
    {
      title: "Ab 100 Lizenzen",
      price: "€4.99",
      period: "/ monat",
      setupFee: 499,
      features: [
        { text: "Lernen ohne Grenzen", icon: Infinity },
        { text: "Vollständige Lernmodule", icon: BookOpen },
        { text: "Integriertes Karteikartensystem", icon: Layers },
      ],
    },
  ];

  const consumerPlans = [
    {
      title: "Standard-Abo",
      subtitle: "Monatlich kündbar.",
      price: "4,99 €",
      period: "/ monat",
      features: [
        "Vollständiger Zugang zu allen Lektionen",
        "Spielerisches Lernsystem",
        "Karteikartensystem",
        "Fortschritts-Tracking",
        "Monatlich kündbar",
      ],
      monthly: true,
    },
    {
      title: "Jahresabo",
      subtitle: "Am Beliebtesten",
      price: "3,99 €",
      period: "/ monat",
      yearlyNote: "pro Jahr",
      features: [
        "Vollständiger Zugang zu allen Lektionen",
        "Spielerisches Lernsystem",
        "Karteikartensystem",
        "Fortschritts-Tracking",
        "2 Monate gespart",
        "Jährlich kündbar",
      ],
      popular: true,
    },
    {
      title: "Lifetime",
      subtitle: "Am Billigsten",
      price: "49,99 €",
      period: "einmalig",
      features: [
        "Vollständiger Zugang zu allen Lektionen",
        "Spielerisches Lernsystem",
        "Karteikartensystem",
        "Fortschritts-Tracking",
        "Lebenslanger Zugang",
        "Alle zukünftigen Updates",
      ],
      cheapest: true,
    },
  ];

  return (
    <>
      {/* Hero - Unsere Ziele */}
      <Section className="bg-primaryWhite pt-12 md:pt-16 lg:pt-20 mt-12">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6 md:mb-8"
          >
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              {t("hero.tag")}
            </h2>
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-darkerGray mb-4 md:mb-6"
          >
            {t("hero.title")} <span className="text-primaryOrange">{t("hero.highlight")}</span>
          </motion.h1>

          {/* Target Groups Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
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
        </div>
      </Section>

      {/* Preise Section Header */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              {t("prices.tag")}
            </h2>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </motion.div>
        </div>

        {/* Für Unternehmen */}
        <div className="max-w-6xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-12"
          >
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-2 sm:mb-4">
              {t("business.heading.pre")}{" "}
              <span className="text-primaryOrange">{t("business.heading.highlight")}</span>{" "}
              {t("business.heading.post")}
            </h3>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
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
                  <p className="text-sm md:text-base text-lightGray mb-2">Ab</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primaryOrange">
                      3,99 €
                    </span>
                    <span className="text-lg md:text-xl text-lightGray">
                      / Monat
                    </span>
                  </div>
                  <p className="text-base md:text-lg text-lightGray mt-2">
                    pro Mitarbeiter
                  </p>
                </div>
                <a
                  href="https://app.cal.eu/beafox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primaryOrange hover:bg-primaryOrange/90 text-primaryWhite px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl w-full"
                >
                  <Calendar className="w-5 h-5" />
                  Termin vereinbaren
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
                Investieren Sie in den wichtigsten Future Skill für Ihre
                Mitarbeitenden und das bei Kosten, die nicht einmal 1 % eines
                Mitarbeitenden ausmachen.
              </p>

              {/* Individual Offer Info */}
              <div className="bg-primaryOrange/10 rounded-lg p-4 md:p-6 border-2 border-primaryOrange/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm md:text-base font-medium text-darkerGray mb-1">
                      Individuelle Pakete immer möglich
                    </p>
                    <p className="text-sm text-lightGray">
                      Jederzeit können wir ein maßgeschneidertes Angebot für Ihr
                      Unternehmen erstellen. Kontaktieren Sie uns einfach!
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
                  Mehr Informationen
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Für Endkunden */}
        <div className="max-w-6xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-4">
              Für Endkunden
            </h3>
            <p className="text-base md:text-xl text-lightGray">
              Wähle das Modell, das zu deinem Alltag passt.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {consumerPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 transition-all relative flex flex-col h-full ${
                  plan.popular
                    ? "border-primaryOrange scale-105 md:scale-105"
                    : plan.cheapest
                    ? "border-primaryOrange/40"
                    : "border-primaryOrange/20 hover:border-primaryOrange/40"
                }`}
              >
                {/* Badge/Subtitle */}
                <div className="flex-shrink-0 mb-4">
                  {plan.popular && (
                    <div className="bg-primaryOrange text-primaryWhite text-xs md:text-sm font-semibold px-3 md:px-4 py-1 rounded-full inline-block">
                      {plan.subtitle}
                    </div>
                  )}
                  {plan.cheapest && (
                    <div className="bg-green-500 text-primaryWhite text-xs md:text-sm font-semibold px-3 md:px-4 py-1 rounded-full inline-block">
                      {plan.subtitle}
                    </div>
                  )}
                  {!plan.popular && !plan.cheapest && (
                    <p className="text-sm text-lightGray">{plan.subtitle}</p>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-lg md:text-xl font-bold text-darkerGray mb-4 flex-shrink-0">
                  {plan.title}
                </h4>

                {/* Price */}
                <div className="mb-6 flex-shrink-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-primaryOrange">
                      {plan.price}
                    </span>
                    <span className="text-lg md:text-xl text-lightGray">
                      {plan.period}
                    </span>
                  </div>
                  {plan.yearlyNote && (
                    <p className="text-sm text-lightGray mt-1">
                      {plan.yearlyNote}
                    </p>
                  )}
                </div>

                {/* Features List - takes available space */}
                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-3 text-darkerGray"
                    >
                      <Check className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button - pushed to bottom */}
                <div className="flex justify-center md:justify-start mt-auto flex-shrink-0">
                  <Button
                    onClick={() => setIsDownloadModalOpen(true)}
                    variant={plan.popular ? "primary" : "outline"}
                    className="w-full md:w-auto flex items-center justify-center gap-2 !px-4 !py-2 md:!px-8 md:!py-3 text-sm md:text-base"
                  >
                    Jetzt downloaden
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Für Schulen */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-4">
              Für Schulen
            </h3>
            <p className="text-base md:text-xl text-lightGray">
              {schoolPlan.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 md:p-8 lg:p-10 border-2 border-primaryOrange shadow-xl"
          >
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: Price */}
              <div className="text-center md:text-left">
                <div className="mb-6">
                  <div className="flex items-baseline justify-center md:justify-start gap-2 mb-2">
                    <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-primaryOrange">
                      {schoolPlan.price}
                    </span>
                  </div>
                  <div className="text-lg md:text-xl text-lightGray mb-1">
                    {schoolPlan.period}
                  </div>
                  <div className="text-lg md:text-xl text-lightGray">
                    {schoolPlan.period2}
                  </div>
                </div>
                <div className="mb-6 flex flex-col gap-3 md:gap-4 items-center md:items-start">
                  <Button
                    href="/kontakt"
                    variant="primary"
                    className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 text-sm md:text-base !w-[240px] md:!w-[280px]"
                  >
                    Jetzt Partner werden
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                  <a
                    href="https://app.cal.eu/beafox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border-2 border-primaryOrange text-primaryOrange hover:bg-primaryOrange hover:text-primaryWhite px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold transition-all duration-300 text-sm md:text-base shadow-lg hover:shadow-xl w-[240px] md:w-[280px]"
                  >
                    <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                    Termin buchen
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </a>
                </div>
              </div>

              {/* Right: Features */}
              <div>
                <ul className="space-y-4">
                  {schoolPlan.features.map((feature, index) => {
                    const featureText =
                      typeof feature === "string" ? feature : feature.text;
                    const FeatureIcon =
                      typeof feature === "string"
                        ? Check
                        : feature.icon || Check;
                    return (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-darkerGray"
                      >
                        <FeatureIcon className="w-6 h-6 text-primaryOrange flex-shrink-0 mt-0.5" />
                        <span className="text-base md:text-lg">
                          {featureText}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Weitere Dienstleistungen Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6"
            >
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
                Weitere Dienstleistungen
              </h2>
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </motion.div>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto">
              Über die App hinaus bieten wir zusätzliche Services für eine
              ganzheitliche Finanzbildung – maßgeschneidert für Ihre
              Bedürfnisse.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              {
                icon: Presentation,
                title: "Finanzbildungs-Workshops",
                description:
                  "Interaktive Workshops vor Ort oder online. Theorie und Praxis verbinden für nachhaltiges Lernen.",
                features: [
                  "Erfahrene Referenten",
                  "Kleine Gruppen",
                  "Materialien zum Mitnehmen",
                  "Follow-up Support",
                ],
                cta: "Workshop anfragen",
              },
              {
                icon: Megaphone,
                title: "PR Events & Veranstaltungen",
                description:
                  "Professionelle Events zur Finanzbildung für Ihre Zielgruppe. Von Messen bis zu internen Veranstaltungen.",
                features: [
                  "Maßgeschneiderte Konzepte",
                  "Professionelle Durchführung",
                  "Branding möglich",
                  "Nachhaltige Wirkung",
                ],
                cta: "Event planen",
              },
              {
                icon: FileText,
                title: "Individuelle analoge Unterlagen",
                description:
                  "Maßgeschneiderte Lernmaterialien, Arbeitsblätter und Handouts für Ihre spezifischen Anforderungen.",
                features: [
                  "Individuelles Design",
                  "Branding Integration",
                  "Verschiedene Formate",
                  "Professionelle Qualität",
                ],
                cta: "Unterlagen anfragen",
              },
              {
                icon: MessageSquare,
                title: "Beratung & Consulting",
                description:
                  "Strategische Beratung zur Implementierung von Finanzbildung in Ihrer Organisation oder Institution.",
                features: [
                  "Strategieentwicklung",
                  "Best Practices",
                  "Implementierungsplan",
                  "Langfristige Begleitung",
                ],
                cta: "Beratung buchen",
              },
              {
                icon: BarChart,
                title: "Analytics & Reporting",
                description:
                  "Detaillierte Einblicke in den Lernfortschritt Ihrer Teilnehmer. Umfassende Reports und Analysen für datengetriebene Entscheidungen.",
                features: [
                  "Fortschritts-Tracking",
                  "Detaillierte Reports",
                  "Export-Funktionen",
                  "Individuelle Dashboards",
                ],
                cta: "Analytics anfragen",
              },
              {
                icon: GraduationCap,
                title: "Schulungen & Trainings",
                description:
                  "Schulungen für Lehrkräfte, Trainer oder Multiplikatoren zur effektiven Nutzung von BeAFox.",
                features: [
                  "Train-the-Trainer",
                  "Didaktische Schulungen",
                  "Technische Einweisung",
                  "Zertifikate",
                ],
                cta: "Schulung buchen",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all h-full flex flex-col group"
              >
                <div className="bg-primaryOrange/10 rounded-lg p-3 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-8 h-8 text-primaryOrange" />
                </div>
                <h3 className="text-xl font-bold text-darkerGray mb-3">
                  {service.title}
                </h3>
                <p className="text-lightGray text-sm md:text-base mb-4 flex-1">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-2 text-darkerGray"
                    >
                      <Check className="w-4 h-4 text-primaryOrange flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  href="/kontakt"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 mt-auto !px-4 !py-2 md:!px-8 md:!py-3 text-sm md:text-base"
                >
                  {service.cta}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 rounded-2xl p-6 md:p-8 lg:p-10 border-2 border-primaryOrange text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-darkerGray mb-4">
              Individuelle Lösungen für jeden Bedarf
            </h3>
            <p className="text-base text-lightGray mb-6 max-w-2xl mx-auto">
              Alle unsere Dienstleistungen können individuell kombiniert und
              angepasst werden. Sprechen Sie uns an, wir finden die perfekte
              Lösung für Ihre Anforderungen.
            </p>
            <div className="flex justify-center">
              <Button
                href="/kontakt"
                variant="primary"
                className="flex items-center justify-center gap-2 w-auto !px-4 !py-2 md:!px-8 md:!py-3 text-sm md:text-base"
              >
                Kostenlose Beratung anfragen
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Value Proposition Section */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-0 lg:mb-4">
              Warum <span className="text-primaryOrange">BeAFox</span>?
            </h2>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto">
              Investiere in die Zukunft deiner Schüler, Azubis oder Mitarbeiter
              – mit einem fairen Preis-Leistungs-Verhältnis.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Globe,
                title: "Das erste Finanzbildungsökosystem",
                description:
                  "BeAFox ist mehr als eine App – es ist ein ganzheitliches Ökosystem aus digitalen Lerninhalten, Workshops, analogen Materialien und Support. Alles perfekt aufeinander abgestimmt für maximalen Lernerfolg.",
              },
              {
                icon: Award,
                title: "Wissenschaftlich fundiert durch Forschung",
                description:
                  "Basierend auf einem umfangreichen Forschungsprojekt mit über 500 Teilnehmern. Unsere Methoden sind evidenzbasiert und erprobt – keine Experimente, sondern bewährte Didaktik.",
              },
              {
                icon: Target,
                title: "100% zielgruppenorientiert",
                description:
                  "Wir wissen genau, wie man Finanzbildung lehren muss. Jede Zielgruppe – Schüler, Azubis, Studenten, Mitarbeiter – erhält maßgeschneiderte Inhalte, die wirklich ankommen und nachhaltig wirken.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all"
              >
                <item.icon className="w-10 h-10 text-primaryOrange mb-4" />
                <h3 className="text-xl font-bold text-darkerGray mb-3">
                  {item.title}
                </h3>
                <p className="text-lightGray">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-0 lg:mb-4">
              Häufige Fragen zu den{" "}
              <span className="text-primaryOrange">Preisen</span>
            </h2>
          </motion.div>

          <div className="space-y-4 md:space-y-6">
            {[
              {
                id: 1,
                q: "Gibt es Rabatte für mehrere Klassen oder Standorte?",
                a: "Ja, wir bieten gestaffelte Preise für größere Institutionen. Kontaktieren Sie uns für ein individuelles Angebot, das perfekt auf Ihre Bedürfnisse zugeschnitten ist.",
              },
              {
                id: 2,
                q: "Kann ich die App vor dem Kauf testen?",
                a: "Ja, wir bieten gerne eine kostenlose Testphase an. Kontaktieren Sie uns für weitere Informationen und starten Sie Ihr Pilotprojekt.",
              },
              {
                id: 3,
                q: "Was ist im Preis enthalten?",
                a: "Der Preis beinhaltet den vollständigen Zugang zur App, alle Lernmodule, Monitoring-Dashboards (für Schulen/Unternehmen), Support und regelmäßige Updates.",
              },
              {
                id: 4,
                q: "Kann ich jederzeit kündigen?",
                a: "Bei Privatpersonen: Das monatliche Abo kann jederzeit gekündigt werden. Jahresabos laufen über die vereinbarte Laufzeit. Für Schulen und Unternehmen gelten individuelle Vereinbarungen.",
              },
              {
                id: 5,
                q: "Gibt es versteckte Kosten?",
                a: "Nein, alle Preise sind transparent. Bei Unternehmen fällt einmalig eine Einrichtungsgebühr an, die im Preis klar ausgewiesen ist.",
              },
            ].map((faq, index) => {
              const isOpen = openFAQId === faq.id;
              const handleToggle = () => {
                setOpenFAQId(isOpen ? null : faq.id);
              };

              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-primaryOrange/5 rounded-xl border border-primaryOrange/20 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="w-full text-left cursor-pointer focus:outline-none p-5 md:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base md:text-xl font-bold text-darkerGray flex-1">
                        {faq.q}
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
                        <p className="text-lightGray text-base md:text-lg px-5 md:px-6 pb-5 md:pb-6 pt-0">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Button href="/faq" variant="outline" className="!px-6 !py-3">
              Alle FAQ's ansehen
            </Button>
          </div>
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
            <Sparkles className="w-16 h-16 text-primaryWhite mx-auto mb-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primaryWhite"
          >
            Noch Fragen? Wir helfen gerne!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl mb-8 text-primaryWhite/90"
          >
            Kontaktiere uns für ein unverbindliches Beratungsgespräch und
            erhalte ein individuelles Angebot, das zu dir passt.
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
              className="flex items-center justify-center gap-2 !px-4 !py-2 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite text-sm md:text-base"
            >
              Kostenlose Beratung
            </Button>
            <Button
              href="/faq"
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-4 !py-2 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite text-sm md:text-base"
            >
              FAQ's durchsuchen
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </>
  );
}

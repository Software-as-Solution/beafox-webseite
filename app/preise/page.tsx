"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import DownloadModal from "@/components/DownloadModal";
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
  Presentation,
  BookOpen,
  Target,
  Lightbulb,
} from "lucide-react";

export default function PricingPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const targetGroups = [
    {
      icon: School,
      title: "Für Schüler",
      description: "Spielerische und simple Finanzbildung in der Schule.",
    },
    {
      icon: GraduationCap,
      title: "Für Studenten",
      description: "Praxis- und Alltagstaugliche Tipps für das Studentenleben.",
    },
    {
      icon: Briefcase,
      title: "Für Azubis",
      description: "Finde heraus, was mit deinem Gehalt heute möglich ist.",
    },
    {
      icon: User,
      title: "Für Dich",
      description: "Finanzbildung, die zu dir passt, unabhängig vom Alter.",
    },
  ];

  const schoolPlan = {
    price: "€1",
    period: "pro Schüler",
    period2: "pro Jahr",
    subtitle:
      "Flexible Staffelpreise: passgenau für Ihre Schule oder Institution",
    features: [
      "Lernen ohne Grenzen",
      "Vollständige Lernmodule",
      "Lehrer-Dashboards",
      "Karteikartensysteme",
      "Analoge Unterlagen",
    ],
  };

  const businessPlans = [
    {
      title: "Ab 10 Lizenzen",
      price: "€3.99",
      period: "/ monat",
      setupFee: 99,
      features: [
        "Lernen ohne Grenzen",
        "Vollständige Lernmodule",
        "Integriertes Karteikartensystem",
      ],
    },
    {
      title: "Ab 50 Lizenzen",
      price: "€3.49",
      period: "/ monat",
      setupFee: 149,
      features: [
        "Lernen ohne Grenzen",
        "Vollständige Lernmodule",
        "Integriertes Karteikartensystem",
      ],
      popular: true,
    },
    {
      title: "Ab 100 Lizenzen",
      price: "€2.99",
      period: "/ monat",
      setupFee: 199,
      features: [
        "Lernen ohne Grenzen",
        "Vollständige Lernmodule",
        "Integriertes Karteikartensystem",
      ],
    },
  ];

  const consumerPlans = [
    {
      title: "Standard-Abo",
      subtitle: "Monatlich kündbar.",
      price: "€4.99",
      period: "/ monat",
      features: [
        "Lernen ohne Grenzen",
        "Vollständige Lernmodule",
        "Integriertes Karteikartensystem",
      ],
    },
    {
      title: "Jahresabo",
      subtitle: "Am Beliebtesten",
      price: "€3.99",
      period: "/ monat",
      yearlyPrice: "€47.88",
      yearlyNote: "pro Jahr",
      features: [
        "Lernen ohne Grenzen",
        "Vollständige Lernmodule",
        "Integriertes Karteikartensystem",
      ],
      popular: true,
    },
    {
      title: "Lifetime",
      subtitle: "Am Billigsten",
      price: "€49.99",
      period: "/ Jahr",
      features: [
        "Lernen ohne Grenzen",
        "Vollständige Lernmodule",
        "Integriertes Karteikartensystem",
      ],
      cheapest: true,
    },
  ];

  return (
    <>
      {/* Hero - Unsere Ziele */}
      <Section className="bg-primaryWhite pt-12 md:pt-16 lg:pt-20 mt-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6 md:mb-8"
          >
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              Unsere Ziele
            </h2>
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-darkerGray mb-4 md:mb-6"
          >
            Finanzbildung für <span className="text-primaryOrange">alle</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto mb-8 md:mb-12"
          >
            Wir möchten das jeder seine Finanzen selbst in die Pfote nimmt!
          </motion.p>

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
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              Preise
            </h2>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </motion.div>
        </div>

        {/* Für Schulen */}
        <div className="max-w-5xl mx-auto mb-16 md:mb-20">
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
            <p className="text-lg md:text-xl text-lightGray">
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
                <div className="mb-6">
                  <Button
                    href="/kontakt"
                    variant="primary"
                    className="flex items-center justify-center md:justify-start gap-2 w-full md:w-auto !px-6 !py-3 md:!px-8 md:!py-4"
                  >
                    <span className="text-sm md:text-base text-center">
                      Pilotprojekt starten
                    </span>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
              </div>

              {/* Right: Features */}
              <div>
                <ul className="space-y-4">
                  {schoolPlan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-darkerGray"
                    >
                      <Check className="w-6 h-6 text-primaryOrange flex-shrink-0 mt-0.5" />
                      <span className="text-base md:text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Für Unternehmen */}
        <div className="max-w-6xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-4">
              Für Unternehmen
            </h3>
            <p className="text-lg md:text-xl text-lightGray">
              Optimierte Staffelpreise, die perfekt zu den Bedürfnissen Ihres
              Unternehmens passen.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {businessPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 transition-all ${
                  plan.popular
                    ? "border-primaryOrange scale-105 md:scale-105"
                    : "border-primaryOrange/20 hover:border-primaryOrange/40"
                }`}
              >
                {plan.popular && (
                  <div className="bg-primaryOrange text-primaryWhite text-xs md:text-sm font-semibold px-3 md:px-4 py-1 rounded-full inline-block mb-4">
                    Beliebteste Option
                  </div>
                )}
                <h4 className="text-lg md:text-xl font-bold text-darkerGray mb-4">
                  {plan.title}
                </h4>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-primaryOrange">
                      {plan.price}
                    </span>
                    <span className="text-lg md:text-xl text-lightGray">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-lightGray mt-2">
                    zzgl. einmaliger Einrichtungsgebühr von {plan.setupFee} €
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
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
                <Button
                  href="/kontakt"
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full flex items-center justify-center gap-2"
                >
                  Pilotprojekt starten
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Für Endkunden */}
        <div className="max-w-6xl mx-auto">
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
            <p className="text-lg md:text-xl text-lightGray">
              Wähle das Modell, das zu deinem Alltag passt – fair, flexibel und
              voller Wissen.
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
                className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 transition-all relative ${
                  plan.popular
                    ? "border-primaryOrange scale-105 md:scale-105"
                    : plan.cheapest
                    ? "border-primaryOrange/40"
                    : "border-primaryOrange/20 hover:border-primaryOrange/40"
                }`}
              >
                {plan.popular && (
                  <div className="bg-primaryOrange text-primaryWhite text-xs md:text-sm font-semibold px-3 md:px-4 py-1 rounded-full inline-block mb-4">
                    {plan.subtitle}
                  </div>
                )}
                {plan.cheapest && (
                  <div className="bg-green-500 text-primaryWhite text-xs md:text-sm font-semibold px-3 md:px-4 py-1 rounded-full inline-block mb-4">
                    {plan.subtitle}
                  </div>
                )}
                {!plan.popular && !plan.cheapest && (
                  <p className="text-sm text-lightGray mb-4">{plan.subtitle}</p>
                )}
                <h4 className="text-lg md:text-xl font-bold text-darkerGray mb-4">
                  {plan.title}
                </h4>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-primaryOrange">
                      {plan.price}
                    </span>
                    <span className="text-lg md:text-xl text-lightGray">
                      {plan.period}
                    </span>
                  </div>
                  {plan.yearlyPrice && (
                    <p className="text-sm md:text-base text-lightGray mt-2">
                      ({plan.yearlyPrice} {plan.yearlyNote})
                    </p>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
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
                <Button
                  onClick={() => setIsDownloadModalOpen(true)}
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full flex items-center justify-center gap-2"
                >
                  Jetzt downloaden
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Warum <span className="text-primaryOrange">BeAFox</span>?
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto">
              Investiere in die Zukunft deiner Schüler, Azubis oder Mitarbeiter
              – mit einem fairen Preis-Leistungs-Verhältnis.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Award,
                title: "Wissenschaftlich fundiert",
                description:
                  "Unsere Inhalte basieren auf bewährten Lehrmethoden und werden kontinuierlich aktualisiert.",
              },
              {
                icon: Users,
                title: "Unbegrenzte Nutzer",
                description:
                  "Bei Schulen und Unternehmen: Keine zusätzlichen Kosten bei mehr Teilnehmern.",
              },
              {
                icon: Sparkles,
                title: "Regelmäßige Updates",
                description:
                  "Neue Inhalte, Features und Verbesserungen – ohne zusätzliche Kosten.",
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

      {/* Warum BeAFox für Workshops Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
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
                Warum BeAFox für Workshops?
              </h2>
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </motion.div>
            <p className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto">
              Interaktive Finanzbildungs-Workshops, die Theorie und Praxis
              verbinden – für nachhaltiges Lernen und echte
              Kompetenzentwicklung.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
            {[
              {
                icon: Presentation,
                title: "Interaktive Formate",
                description:
                  "Praktische Übungen, Gruppenarbeiten und reale Fallbeispiele statt trockener Theorie.",
              },
              {
                icon: BookOpen,
                title: "Praxisnahe Inhalte",
                description:
                  "Inhalte, die direkt im Alltag anwendbar sind – von Budgetplanung bis Investitionen.",
              },
              {
                icon: Target,
                title: "Zielgruppenorientiert",
                description:
                  "Maßgeschneiderte Workshops für Schüler, Azubis, Studenten oder Mitarbeiter.",
              },
              {
                icon: Lightbulb,
                title: "Nachhaltiges Lernen",
                description:
                  "Kombination aus Workshop und App-Nutzung für langfristigen Lernerfolg.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all h-full"
              >
                <div className="bg-primaryOrange/10 rounded-lg p-3 w-fit mb-4">
                  <item.icon className="w-8 h-8 text-primaryOrange" />
                </div>
                <h3 className="text-xl font-bold text-darkerGray mb-3">
                  {item.title}
                </h3>
                <p className="text-lightGray text-sm md:text-base">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 rounded-2xl p-6 md:p-8 lg:p-10 border-2 border-primaryOrange"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-darkerGray mb-4">
                  Was macht unsere Workshops besonders?
                </h3>
                <ul className="space-y-3 mb-6">
                  {[
                    "Erfahrene Referenten mit Finanzexpertise",
                    "Kleine Gruppen für maximale Interaktion",
                    "Materialien zum Mitnehmen",
                    "Follow-up Support über die App",
                    "Flexible Durchführung vor Ort oder online",
                  ].map((item, index) => (
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
              <div className="bg-white rounded-xl p-6 border-2 border-primaryOrange/20">
                <h4 className="text-xl font-bold text-darkerGray mb-4">
                  Workshop-Themen
                </h4>
                <div className="space-y-2">
                  {[
                    "Grundlagen der Finanzplanung",
                    "Budgeting & Sparen",
                    "Investieren für Anfänger",
                    "Schulden vermeiden & abbauen",
                    "Altersvorsorge verstehen",
                  ].map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-lightGray"
                    >
                      <div className="w-2 h-2 rounded-full bg-primaryOrange"></div>
                      <span className="text-sm md:text-base">{topic}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-primaryOrange/20">
                  <p className="text-sm text-lightGray mb-4">
                    Individuelle Themen nach Bedarf möglich
                  </p>
                  <Button
                    href="/kontakt"
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    Workshop anfragen
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Häufige Fragen zu den{" "}
              <span className="text-primaryOrange">Preisen</span>
            </h2>
          </motion.div>

          <div className="space-y-4 md:space-y-6">
            {[
              {
                q: "Gibt es Rabatte für mehrere Klassen oder Standorte?",
                a: "Ja, wir bieten gestaffelte Preise für größere Institutionen. Kontaktieren Sie uns für ein individuelles Angebot, das perfekt auf Ihre Bedürfnisse zugeschnitten ist.",
              },
              {
                q: "Kann ich die App vor dem Kauf testen?",
                a: "Ja, wir bieten gerne eine kostenlose Testphase an. Kontaktieren Sie uns für weitere Informationen und starten Sie Ihr Pilotprojekt.",
              },
              {
                q: "Was ist im Preis enthalten?",
                a: "Der Preis beinhaltet den vollständigen Zugang zur App, alle Lernmodule, Monitoring-Dashboards (für Schulen/Unternehmen), Support und regelmäßige Updates.",
              },
              {
                q: "Kann ich jederzeit kündigen?",
                a: "Bei Privatpersonen: Das monatliche Abo kann jederzeit gekündigt werden. Jahresabos laufen über die vereinbarte Laufzeit. Für Schulen und Unternehmen gelten individuelle Vereinbarungen.",
              },
              {
                q: "Gibt es versteckte Kosten?",
                a: "Nein, alle Preise sind transparent. Bei Unternehmen fällt einmalig eine Einrichtungsgebühr an, die im Preis klar ausgewiesen ist.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-primaryOrange/5 rounded-xl p-5 md:p-6 border border-primaryOrange/20"
              >
                <h3 className="text-lg md:text-xl font-bold text-darkerGray mb-2">
                  {faq.q}
                </h3>
                <p className="text-lightGray text-base md:text-lg">{faq.a}</p>
              </motion.div>
            ))}
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
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 bg-darkerGray hover:bg-darkerGray/90 text-primaryWhite border-darkerGray"
            >
              Kostenlose Beratung
            </Button>
            <Button
              href="/faq"
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 bg-white/20 hover:bg-white/30 text-primaryWhite border-white"
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

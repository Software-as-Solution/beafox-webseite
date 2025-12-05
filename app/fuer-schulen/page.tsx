"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Image from "next/image";
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
} from "lucide-react";

export default function ForSchoolsPage() {
  const [selectedDashboard, setSelectedDashboard] = useState(0);
  const [openFAQId, setOpenFAQId] = useState<number | null>(null);

  const dashboardFeatures = [
    {
      id: "schueler",
      title: "Schüler verwalten",
      description:
        "Erstellen Sie einfach Schüler-Accounts, verwalten Sie Klassen und behalten Sie den Überblick über alle Teilnehmer.",
      mockup: "/Mockup-Macbook/Schueler.png",
    },
    {
      id: "fortschritt",
      title: "Live-Fortschritt",
      description:
        "Sehen Sie in Echtzeit, was jeder Schüler gerade lernt und wie er vorankommt.",
      mockup: "/Mockup-Macbook/Live-Fortschritt.png",
    },
    {
      id: "stufen",
      title: "Stufen-Tracking",
      description:
        "Verfolgen Sie den Fortschritt Ihrer Schüler durch alle Lernstufen. Sehen Sie auf einen Blick, wer welche Themen bereits abgeschlossen hat.",
      mockup: "/Mockup-Macbook/Stufen-Tracking.png",
    },
    {
      id: "verwalten",
      title: "Klasse verwalten",
      description:
        "Organisieren Sie Ihre Klassen, weisen Sie Lektionen zu und verwalten Sie den Zugriff.",
      mockup: "/Mockup-Macbook/Verwalten.png",
    },
    {
      id: "pdf",
      title: "Schüler-PDF Export",
      description:
        "Exportieren Sie detaillierte Reports und Fortschrittsberichte als PDF. Perfekt für Elterngespräche, Zeugnisse oder Dokumentation.",
      mockup: "/Mockup-Macbook/Schueler-PDF.png",
    },
    {
      id: "klasse",
      title: "Klasse erstellen",
      description:
        "Erstellen Sie neue Klassen mit wenigen Klicks. Laden Sie Schüler per CSV-Import ein oder fügen Sie sie manuell hinzu.",
      mockup: "/Mockup-Macbook/Klasse-erstellen.png",
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Zeitersparnis",
      description:
        "Schüler lernen selbstständig. Sie sparen wertvolle Unterrichtszeit und können sich auf andere wichtige Aufgaben konzentrieren.",
    },
    {
      icon: BarChart,
      title: "Echtzeit-Überblick",
      description:
        "Das Dashboard zeigt Ihnen jederzeit, was Ihre Schüler lernen, wo sie stehen und wie sie vorankommen.",
    },
    {
      icon: Target,
      title: "Gezielte Unterstützung",
      description:
        "Schwächen werden sofort sichtbar, sodass Sie gezielt unterstützen können. Stärken werden belohnt und motivieren zum Weitermachen.",
    },
    {
      icon: Shield,
      title: "DSGVO-konform",
      description:
        "Wir sammeln 0,0% Daten. Ihre Schülerdaten sind bei uns in besten Händen.",
    },
    {
      icon: Award,
      title: "Wissenschaftlich fundiert",
      description:
        "Unsere Inhalte basieren auf bewährten Lehrmethoden und wurden in einem Forschungsprojekt mit über 500 Teilnehmern getestet.",
    },
    {
      icon: Zap,
      title: "Motivierte Schüler",
      description:
        "Durch das spielerische System mit Punkten, Missionen und Ranglisten bleiben Ihre Schüler motiviert und lernen nachhaltig.",
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "1,000+",
      label: "Schüler nutzen BeAFox",
    },
    {
      icon: School,
      value: "5+",
      label: "Schulen vertrauen uns",
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "Zufriedenheit",
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Verfügbar",
    },
  ];

  const useCases = [
    {
      title: "Unterrichtsausfall",
      description:
        "Wenn ein Lehrer ausfällt, können Schüler selbstständig mit BeAFox lernen. Sie bleiben beschäftigt und lernen dabei wichtige Finanzkompetenzen.",
      icon: BookOpen,
    },
    {
      title: "Hausaufgaben & Vertiefung",
      description:
        "Schüler können zu Hause oder in der Freizeit mit BeAFox lernen. Das spielerische System motiviert sie, auch außerhalb des Unterrichts aktiv zu sein.",
      icon: GraduationCap,
    },
    {
      title: "Projektwochen",
      description:
        "Perfekt für Projektwochen zum Thema Finanzen. Schüler arbeiten selbstständig, Lehrer behalten den Überblick über den Fortschritt.",
      icon: Target,
    },
    {
      title: "Wahlpflichtfach",
      description:
        "BeAFox eignet sich ideal als Basis für ein Wahlpflichtfach Finanzbildung. Strukturierte Inhalte, klare Lernpfade und motivierendes Lernen.",
      icon: Award,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-primaryWhite pt-12 md:pt-16 lg:pt-20 mt-10">
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
                  BeAFox for Schools
                </h1>
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-darkerGray mb-4 md:mb-6"
              >
                Finanzbildung für{" "}
                <span className="text-primaryOrange">Ihre Schule</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg md:text-xl text-lightGray mb-8 md:mb-12"
              >
                Praxisnahe Finanzbildung, die Ihre Schüler selbstständig lernen.
                Mit vollständiger Kontrolle für Lehrer und Schulleitung über das
                Monitoring-Dashboard.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start items-center lg:items-start"
              >
                <Button
                  href="/kontakt"
                  variant="primary"
                  className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4"
                >
                  Jetzt Partner werden
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <Button
                  href="/preise"
                  variant="outline"
                  className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4"
                >
                  Preise ansehen
                </Button>
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
                    alt="BeAFox Lernpfad Mockup"
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
                    alt="BeAFox Stufen Mockup"
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
                    alt="BeAFox Rangliste Mockup"
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
                className="text-center bg-primaryOrange/5 rounded-xl p-6 border-2 border-primaryOrange/20"
              >
                <stat.icon className="w-8 h-8 text-primaryOrange mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-darkerGray mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-lightGray">
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Wir lösen das Problem von{" "}
              <span className="text-primaryOrange">Unterrichtsausfall</span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto">
              Ein Lehrer betreut mehrere Klassen? Kein Problem. Schüler lernen
              selbstständig mit BeAFox.
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
                Die Herausforderung
              </h3>
              <p className="text-lightGray mb-4 text-base md:text-lg">
                Ein Lehrer betreut gleichzeitig mehrere Klassen. Die Schüler
                benötigen eine Möglichkeit, selbstständig zu lernen, auch wenn
                der Lehrer nicht direkt vor Ort ist.
              </p>
              <ul className="space-y-2">
                {[
                  "Unterrichtsausfall durch Krankheit",
                  "Mehrere Klassen gleichzeitig betreuen",
                  "Schüler brauchen sinnvolle Beschäftigung",
                  "Finanzbildung fehlt im Lehrplan",
                ].map((item, index) => (
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
                Unsere Lösung
              </h3>
              <p className="text-lightGray mb-4 text-base md:text-lg">
                Die Schüler arbeiten selbstständig und interaktiv mit{" "}
                <strong>BeAFox</strong>. Ganz ohne direkte Anwesenheit des
                Lehrers vor Ort.
              </p>
              <p className="text-lightGray text-base md:text-lg mb-4">
                <strong>Für Lehrer:</strong> Das integrierte{" "}
                <strong>Monitoring-Dashboard</strong> zeigt in Echtzeit, was
                jeder Schüler gerade lernt, wo er steht und wie er vorankommt.
              </p>
              <ul className="space-y-2">
                {[
                  "Selbstständiges Lernen der Schüler",
                  "Echtzeit-Überblick für Lehrer",
                  "Sofortige Erkennung von Schwächen",
                  "Spielerisches System motiviert",
                ].map((item, index) => (
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

      {/* Dashboard Features Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Das{" "}
              <span className="text-primaryOrange">Monitoring-Dashboard</span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto">
              Vollständige Kontrolle über den Lernfortschritt Ihrer Schüler –
              alles auf einen Blick.
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
                <Image
                  src={dashboardFeatures[selectedDashboard].mockup}
                  alt={dashboardFeatures[selectedDashboard].title}
                  width={1200}
                  height={800}
                  className="object-contain drop-shadow-2xl w-full h-auto rounded-lg border-2 border-primaryOrange/20"
                />
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
                  Jetzt Partner werden
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </motion.div>
            </div>
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Warum{" "}
              <span className="text-primaryOrange">BeAFox for Schools</span>?
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto">
              Alle Vorteile für Ihre Schule, Lehrer und Schüler auf einen Blick.
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              So setzen Schulen{" "}
              <span className="text-primaryOrange">BeAFox</span> ein
            </h2>
            <p className="text-lg md:text-xl text-lightGray">
              Flexible Einsatzmöglichkeiten für verschiedene
              Unterrichtssituationen
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
              Jetzt Partner werden
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
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
            className="text-center mb-12"
          >
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
                Warum Finanzbildung?
              </h2>
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Three Points */}
            <div className="space-y-6">
              {[
                {
                  number: "1",
                  title: "Finanzbildung ist Allgemeinbildung",
                  description:
                    "Finanzielle Bildung ist ein wichtiger Teil der Allgemeinbildung. Jeder junge Mensch sollte die Möglichkeit haben, finanzielle Kompetenzen zu erlernen – unabhängig vom familiären Hintergrund.",
                },
                {
                  number: "2",
                  title: "Schulden-Prävention",
                  description:
                    "Statistisch gesehen wird sich mindestens ein:e Schüler:in pro Klasse im Laufe des Lebens überschulden. Hochwertige finanzielle Bildung beugt Überschuldung effektiv vor.",
                },
                {
                  number: "3",
                  title: "Chancengerechtigkeit",
                  description:
                    "Jede:r sollte über Finanzen Bescheid wissen, um sich eine eigene Meinung bilden zu können; unabhängig davon, welche eigenen finanziellen und familiären Ressourcen man mitbringt.",
                },
              ].map((point, index) => (
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
                  alt="BeAFox Maskottchen"
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Feedback von{" "}
              <span className="text-primaryOrange">Lehrkräften</span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray">
              Das sagen teilnehmende Lehrkräfte nach der Einführung von BeAFox.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                quote:
                  "Die Fortbildung war äußerst bereichernd und ist absolut empfehlenswert. Der Referentin gelang es hervorragend, ein komplexes Thema lebendig und verständlich darzustellen. Ich freue mich bereits darauf, die Unterlagen in meinem Unterricht einzusetzen.",
                author: "Lehrkraft, Gymnasium",
              },
              {
                quote:
                  "Die Fortbildung war mega interessant und hat viele praktische und im Unterricht leicht umsetzbare Methoden vermittelt. Die Materialen sind toll aufbereitet und sofort einsetzbar.",
                author: "Lehrkraft, Realschule",
              },
              {
                quote:
                  "Finanzielle Bildung wird hier sehr praxisnah und mit zahlreichen guten Anwendungstipps vermittelt. Danach gibt es eigentlich keine Gründe mehr dieses sehr wichtige und interessante Thema nicht in der Schule zu behandeln.",
                author: "Lehrkraft, Berufsschule",
              },
            ].map((testimonial, index) => (
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

      {/* Pricing Info Section */}
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
              Faire Preise für{" "}
              <span className="text-primaryOrange">Schulen</span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto">
              Flexible Staffelpreise: passgenau für Ihre Schule oder
              Institution.
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
                    €1
                  </span>
                </div>
                <div className="text-xl md:text-2xl text-lightGray mb-1">
                  pro Schüler
                </div>
                <div className="text-xl md:text-2xl text-lightGray">
                  pro Jahr
                </div>
              </div>

              <div className="bg-primaryOrange/5 rounded-xl p-6 mb-8">
                <p className="text-base md:text-lg text-darkerGray font-medium text-center">
                  Transparent, fair und ohne versteckte Kosten.
                </p>
              </div>

              <div className="text-center">
                <Button
                  href="/kontakt"
                  variant="primary"
                  className="flex items-center justify-center gap-2 mx-auto w-full !px-6 !py-3 md:!px-8 md:!py-4"
                >
                  Jetzt Partner werden
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
                  Im Preis enthalten:
                </h3>
                <ul className="space-y-4">
                  {[
                    "Vollständiger Zugang für alle Schüler",
                    "Monitoring-Dashboard für Lehrer",
                    "Unbegrenzte Lektionen & Features",
                    "PDF-Export für Reports",
                    "Support & Updates",
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

              <div className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 rounded-xl p-6 border-2 border-primaryOrange/20">
                <h3 className="text-xl md:text-2xl font-bold text-darkerGray mb-6">
                  Zusätzliche Vorteile:
                </h3>
                <ul className="space-y-4">
                  {[
                    "Keine versteckten Kosten",
                    "Monatlich kündbar",
                    "DSGVO-konform",
                    "Einfache Einrichtung",
                    "Persönlicher Ansprechpartner",
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
            </motion.div>
          </div>
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              So funktioniert's
            </h2>
            <p className="text-lg md:text-xl text-lightGray">
              In vier einfachen Schritten zu BeAFox in Ihrer Schule.
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Kostenlose Beratung",
                description:
                  "Wir besprechen Ihre Anforderungen und erstellen ein individuelles Angebot für Ihre Schule.",
              },
              {
                step: "2",
                title: "Einfache Einrichtung",
                description:
                  "Wir richten die App für Ihre Schule ein und erstellen Accounts für alle Schüler. Das geht schnell und unkompliziert.",
              },
              {
                step: "3",
                title: "Schüler starten",
                description:
                  "Die Schüler können jederzeit mit BeAFox lernen – im Unterricht, zu Hause oder in der Freizeit.",
              },
              {
                step: "4",
                title: "Sie behalten Überblick",
                description:
                  "Über das Monitoring-Dashboard sehen Sie in Echtzeit, welche Schüler aktiv sind, wo sie stehen und wie sie vorankommen.",
              },
            ].map((item, index) => (
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

      {/* FAQ Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Häufige Fragen
            </h2>
            <p className="text-lg md:text-xl text-lightGray">
              Alles, was Sie über BeAFox for Schools wissen müssen.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                id: 1,
                question: "Wie lange dauert die Einrichtung?",
                answer:
                  "Die Einrichtung geht schnell und unkompliziert. Nach der Beratung richten wir die App für Ihre Schule ein und erstellen Accounts für alle Schüler. Der gesamte Prozess dauert in der Regel nur wenige Tage.",
              },
              {
                id: 2,
                question: "Benötigen die Schüler eigene Geräte?",
                answer:
                  "Nein, BeAFox funktioniert auf allen gängigen Geräten – Smartphones, Tablets und Computern. Die Schüler können die App auf ihren eigenen Geräten nutzen oder auf schuleigenen Geräten.",
              },
              {
                id: 3,
                question: "Wie werden die Daten geschützt?",
                answer:
                  "Alle Daten werden sicher und DSGVO-konform gespeichert. Wir legen großen Wert auf Datenschutz und Sicherheit. Ihre Schülerdaten sind bei uns in besten Händen.",
              },
              {
                id: 4,
                question:
                  "Können wir BeAFox testen, bevor wir uns entscheiden?",
                answer:
                  "Ja, gerne! Wir bieten eine kostenlose Beratung und können Ihnen auch eine Testphase ermöglichen. Kontaktieren Sie uns einfach für weitere Informationen.",
              },
              {
                id: 5,
                question:
                  "Was passiert, wenn wir BeAFox nicht mehr nutzen möchten?",
                answer:
                  "Kein Problem! Sie können BeAFox jederzeit monatlich kündigen. Es gibt keine langfristigen Verträge oder versteckten Kosten.",
              },
              {
                id: 6,
                question: "Gibt es Schulungen für Lehrkräfte?",
                answer:
                  "Ja, wir bieten Fortbildungen für Lehrkräfte an, in denen wir das System, das Dashboard und die besten Praktiken für den Einsatz im Unterricht erklären.",
              },
            ].map((faq, index) => {
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
                      <h3 className="text-xl font-bold text-darkerGray flex-1">
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
              Alle FAQs ansehen
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
            Bereit, Finanzbildung in Ihre Schule zu bringen?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl mb-8 text-primaryWhite/90"
          >
            Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch und
            erhalten Sie ein individuelles Angebot für Ihre Schule.
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
              Jetzt Partner werden{" "}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>
      </Section>
    </>
  );
}

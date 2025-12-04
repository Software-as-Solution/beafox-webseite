"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Image from "next/image";
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
  CheckCircle,
  GraduationCap,
  FileText,
  Building2,
  Calendar,
  Trophy,
  Star,
  MessageSquare,
  PlayCircle,
  Download,
} from "lucide-react";

// Price Calculator Component
function PriceCalculator() {
  const [learners, setLearners] = useState(50);

  // Calculate price per learner based on volume discounts
  const getPricePerLearner = (count: number): number => {
    if (count >= 100) return 35.88; // €2.99/month * 12
    if (count >= 50) return 41.88; // €3.49/month * 12
    if (count >= 10) return 47.88; // €3.99/month * 12
    return 59.88; // €4.99/month * 12 (default)
  };

  const pricePerLearner = getPricePerLearner(learners);
  const totalPrice = learners * pricePerLearner;

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
            Mitarbeiter
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
            Preis pro Mitarbeiter
          </span>
          <span className="text-xl md:text-2xl font-bold text-primaryOrange">
            {formatPrice(pricePerLearner)} €/Jahr
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-4 border-t border-primaryOrange/20">
          <span className="text-lg md:text-xl font-semibold text-darkerGray">
            Gesamt
          </span>
          <span className="text-2xl md:text-3xl font-bold text-primaryOrange">
            {formatPrice(totalPrice)} €/Jahr
          </span>
        </div>
      </div>

      {/* Volume Discount Info */}
      {learners >= 100 && (
        <div className="bg-primaryOrange/10 rounded-lg p-3 text-sm text-primaryOrange font-medium text-center">
          🎉 Sie erhalten den besten Preis!
        </div>
      )}
      {learners >= 50 && learners < 100 && (
        <div className="bg-primaryOrange/10 rounded-lg p-3 text-sm text-primaryOrange font-medium text-center">
          💰 Sparen Sie noch mehr ab 100 Mitarbeitern!
        </div>
      )}
    </div>
  );
}

export default function ForBusinessPage() {
  const [selectedFeature, setSelectedFeature] = useState(0);

  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "Mitarbeiter nutzen BeAFox",
    },
    {
      icon: Building2,
      value: "20+",
      label: "Unternehmen vertrauen uns",
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Wissensretention",
    },
    {
      icon: Award,
      value: "4.8/5",
      label: "Bewertung",
    },
  ];

  const benefits = [
    {
      icon: Target,
      title: "Gezielte Workshops",
      description:
        "Alle 6 Monate veranstalten wir Workshops zu wechselnden Themen, die perfekt auf Ihre Mitarbeiter zugeschnitten sind.",
    },
    {
      icon: BarChart,
      title: "Monitoring Dashboards",
      description:
        "Behalten Sie den Überblick über den Lernfortschritt Ihrer Mitarbeiter in Echtzeit.",
    },
    {
      icon: Award,
      title: "Offizielle Zertifikate",
      description:
        "Ihre Mitarbeiter erhalten offizielle Zertifikate für ihre Fortschritte in der Finanzbildung.",
    },
    {
      icon: Zap,
      title: "Motiviertere Mitarbeiter",
      description:
        "Durch das spielerische System sind Ihre Mitarbeiter motivierter und engagierter beim Lernen.",
    },
    {
      icon: Clock,
      title: "Nachhaltiges Lernen",
      description:
        "Kombination aus Workshops und App sorgt für langfristige Wissensverankerung – kein Vergessen nach 2-3 Tagen.",
    },
    {
      icon: Shield,
      title: "DSGVO-konform",
      description:
        "Alle Daten werden sicher und DSGVO-konform gespeichert. Ihre Unternehmensdaten sind bei uns in besten Händen.",
    },
  ];

  const features = [
    {
      id: "app",
      title: "Spielerische Lern-App",
      description:
        "Ihre Mitarbeiter lernen mit einer modernen, spielerischen App, die Spaß macht und motiviert. Punkte, Missionen und Ranglisten sorgen für nachhaltiges Engagement.",
      mockup: "/assets/Mockups/Mockup-Lernpfad.png",
    },
    {
      id: "workshops",
      title: "Regelmäßige Workshops",
      description:
        "Alle 6 Monate veranstalten wir interaktive Workshops zu wechselnden Finanzthemen. Praxisnah, zielgruppenorientiert und sofort umsetzbar.",
      mockup: "/assets/Mockups/Mockup-Quiz.png",
    },
    {
      id: "dashboard",
      title: "Monitoring-Dashboard",
      description:
        "Behalten Sie den Überblick über den Lernfortschritt Ihrer Mitarbeiter. Sehen Sie in Echtzeit, wer aktiv ist und wo Unterstützung benötigt wird.",
      mockup: "/Mockup-Macbook/Live-Fortschritt.png",
    },
    {
      id: "zertifikate",
      title: "Offizielle Zertifikate",
      description:
        "Ihre Mitarbeiter erhalten nach erfolgreichem Abschluss offizielle Zertifikate, die sie in ihrer Bewerbungsmappe nutzen können.",
      mockup: "/assets/Mockups/Mockup-Profil.png",
    },
  ];

  const useCases = [
    {
      title: "Fachkräftemangel bekämpfen",
      description:
        "Stärken Sie Ihre Mitarbeiter durch praxisnahe Finanzbildung und machen Sie Ihr Unternehmen attraktiver für Talente.",
      icon: Target,
    },
    {
      title: "Mitarbeiter-Bindung erhöhen",
      description:
        "Zeigen Sie, dass Sie in die Zukunft Ihrer Mitarbeiter investieren. Finanzbildung ist ein wertvolles Benefit, das bindet.",
      icon: Users,
    },
    {
      title: "Selbstständigkeit fördern",
      description:
        "Finanzielle Kompetenz macht Ihre Mitarbeiter selbstständiger und verantwortungsvoller – auch im Berufsalltag.",
      icon: TrendingUp,
    },
    {
      title: "Employer Branding",
      description:
        "Positionieren Sie sich als modernes, zukunftsorientiertes Unternehmen, das sich für seine Mitarbeiter engagiert.",
      icon: Award,
    },
  ];

  const processSteps = [
    {
      step: "1",
      title: "Kostenlose Beratung",
      description:
        "Wir besprechen Ihre Anforderungen, die Anzahl Ihrer Mitarbeiter und erstellen ein individuelles Angebot für Ihr Unternehmen.",
      icon: MessageSquare,
    },
    {
      step: "2",
      title: "Setup & Onboarding",
      description:
        "Wir richten die App für Ihre Mitarbeiter ein, führen ein Onboarding durch und stellen sicher, dass alle startklar sind.",
      icon: PlayCircle,
    },
    {
      step: "3",
      title: "Erster Workshop",
      description:
        "Wir starten mit einem interaktiven Workshop zu einem relevanten Finanzthema, das perfekt auf Ihre Mitarbeiter zugeschnitten ist.",
      icon: Calendar,
    },
    {
      step: "4",
      title: "Kontinuierliches Lernen",
      description:
        "Ihre Mitarbeiter vertiefen das Gelernte in der App, wiederholen Inhalte und bereiten sich auf den nächsten Workshop vor.",
      icon: BookOpen,
    },
    {
      step: "5",
      title: "Regelmäßige Workshops",
      description:
        "Alle 6 Monate veranstalten wir einen neuen Workshop zu wechselnden Themen. So bleibt das Lernen abwechslungsreich und spannend.",
      icon: Trophy,
    },
  ];

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
                  BeAFox for Business
                </h1>
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-darkerGray mb-4 md:mb-6"
              >
                Bildungspakete gegen{" "}
                <span className="text-primaryOrange">Fachkräftemangel</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg md:text-xl text-lightGray mb-8 md:mb-12"
              >
                Mit unserer Lern-App in Kombination mit regelmäßigen Workshops
                lösen wir das klassische Problem: Nach 2–3 Tagen ist der
                Großteil des Gelernten wieder vergessen.
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
                  Pilotprojekt starten
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
                    src="/assets/Mockups/Mockup-Training.png"
                    alt="BeAFox Training Mockup"
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
                    alt="BeAFox Lernpfad Mockup"
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
              <span className="text-primaryOrange">Workshops</span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto">
              Traditionelle Workshops haben ein bekanntes Problem – wir haben
              die Lösung.
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
                Das Problem
              </h3>
              <p className="text-lightGray mb-4 text-base md:text-lg">
                Traditionelle Workshops haben ein bekanntes Problem: Nach 2–3
                Tagen ist der Großteil des Gelernten wieder vergessen. Die
                Investition in die Weiterbildung Ihrer Mitarbeiter verpufft
                schnell.
              </p>
              <ul className="space-y-2">
                {[
                  "Wissen wird schnell vergessen",
                  "Keine Nachhaltigkeit",
                  "Hohe Investition, geringer ROI",
                  "Mitarbeiter verlieren Motivation",
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
                <strong>So funktioniert's:</strong> Wir veranstalten alle 6
                Monate Workshops zu wechselnden Themen. Dazwischen vertiefen die
                Mitarbeiter die Inhalte mit <strong>BeAFox</strong>, wiederholen
                Gelerntes und bereiten sich gezielt auf das nächste Workshop
                vor.
              </p>
              <p className="text-lightGray text-base md:text-lg mb-4">
                So wird das Wissen nachhaltig verankert und Ihre Investition
                zahlt sich langfristig aus.
              </p>
              <ul className="space-y-2">
                {[
                  "Nachhaltige Wissensverankerung",
                  "Kombination aus Workshops & App",
                  "Langfristiger ROI",
                  "Motivierte, engagierte Mitarbeiter",
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

          {/* Subtle CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-lightGray mb-4">Bereit, das Problem zu lösen?</p>
            <Button
              href="/kontakt"
              variant="outline"
              className="flex items-center justify-center gap-2 mx-auto !px-6 !py-3 md:!px-8 md:!py-4"
            >
              Pilotprojekt starten
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Was Sie erhalten
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto">
              Ein umfassendes Paket aus App, Workshops und Support
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
                    ? "max-w-[500px] md:max-w-[600px] lg:max-w-[700px]"
                    : "max-w-[250px] md:max-w-[280px] lg:max-w-[320px]"
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
              <span className="text-primaryOrange">BeAFox for Business</span>?
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto">
              Alle Vorteile für Ihr Unternehmen und Ihre Mitarbeiter auf einen
              Blick.
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              So profitieren{" "}
              <span className="text-primaryOrange">Unternehmen</span> von BeAFox
            </h2>
            <p className="text-lg md:text-xl text-lightGray">
              Viele gute Gründe, warum Unternehmen BeAFox nutzen
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
            className="text-center mt-12"
          >
            <Button
              href="/kontakt"
              variant="primary"
              className="flex items-center justify-center gap-2 mx-auto !px-6 !py-3 md:!px-8 md:!py-4"
            >
              Pilotprojekt starten
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              So funktioniert's
            </h2>
            <p className="text-lg md:text-xl text-lightGray">
              In fünf einfachen Schritten zu BeAFox in Ihrem Unternehmen
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
                className="flex items-start gap-6 bg-white rounded-xl p-6 border-2 border-primaryOrange/20"
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
          </div>

          {/* Subtle CTA after Social Proof */}
          <motion.div
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
              Pilotprojekt starten
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* Features List Section */}
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
              Alle Features im Überblick
            </h2>
            <p className="text-lg md:text-xl text-lightGray">
              Alles, was im Paket enthalten ist
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Spielerische Lern-App",
              "Regelmäßige Workshops (alle 6 Monate)",
              "Monitoring-Dashboard für Ausbilder",
              "Offizielle Zertifikate",
              "Große PR-Aktion für Ihr Unternehmen",
              "Unbegrenzte Mitarbeiter",
              "Persönlicher Ansprechpartner",
              "Individuelle Anpassungen möglich",
              "DSGVO-konform & sicher",
              "Support & Updates",
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-center space-x-3 bg-white p-4 rounded-lg border-2 border-primaryOrange/20"
              >
                <CheckCircle className="w-6 h-6 text-primaryOrange flex-shrink-0" />
                <span className="text-darkerGray font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Price Calculator Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Calculator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-primaryWhite rounded-2xl p-6 md:p-8 border-2 border-primaryOrange/20 shadow-lg"
            >
              <PriceCalculator />
            </motion.div>

            {/* Right: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray">
                Wie viele Mitarbeiter seid ihr?
              </h2>
              <p className="text-lg md:text-xl text-lightGray">
                Ihre Mitarbeiter freuen sich über effektives Lernen mit Spaß –
                und Ihr Unternehmen freut sich über den Sonder-Jahrespreis.
              </p>
              <p className="text-base md:text-lg text-lightGray">
                Nutzen Sie den Rechner, um sofort zu sehen, was BeAFox for
                Business für Ihr Unternehmen kostet. Alle Preise verstehen sich
                pro Mitarbeiter pro Jahr inklusive Workshops, App-Zugang und
                Support.
              </p>
              <div className="pt-6">
                <p className="text-sm text-lightGray mb-3">
                  Bereit für den nächsten Schritt?
                </p>
                <Button
                  href="/kontakt"
                  variant="outline"
                  className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4"
                >
                  Pilotprojekt starten
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </motion.div>
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
            <Briefcase className="w-16 h-16 text-primaryWhite mx-auto mb-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primaryWhite"
          >
            Bereit, Ihre Mitarbeiter zu unterstützen?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl mb-8 text-primaryWhite/90"
          >
            Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch und
            erhalten Sie ein individuelles Angebot für Ihr Unternehmen.
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
              Pilotprojekt starten
            </Button>
            <Button
              href="/preise"
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 bg-white/20 hover:bg-white/30 text-primaryWhite border-white"
            >
              Preise ansehen
            </Button>
          </motion.div>
        </div>
      </Section>
    </>
  );
}

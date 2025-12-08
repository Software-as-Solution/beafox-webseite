"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import DownloadModal from "@/components/DownloadModal";
import Image from "next/image";
import {
  Check,
  Sparkles,
  ArrowRight,
  Trophy,
  Brain,
  Shield,
  Heart,
  Star,
  ArrowDown,
  CheckCircle2,
  Smartphone,
  Infinity,
  BarChart,
  Award,
  Users,
  UserCheck,
  Lock,
  Headphones,
  Gift,
  RefreshCw,
} from "lucide-react";

export default function ForClubsPage() {
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
    headline: "Geben Sie Ihren Sportlern BeAFox.",
    subheadline: "Sie konzentrieren sich auf den Sport – nicht auf Finanzen.",
    description:
      "Als Verein investieren Sie in die finanzielle Bildung Ihrer Sportler. Mit BeAFox geben Sie ihnen die Sicherheit, die sie brauchen, um sich voll auf ihre Sportart zu konzentrieren.",
    impact:
      "Ihre Sportler lernen verantwortungsvoll mit Geld umzugehen, während Sie den Überblick behalten. Finanzielle Sorgen gehören der Vergangenheit an – Ihre Talente können sich auf das Wesentliche fokussieren.",
  };

  const journey = [
    {
      step: "1",
      title: "Ohne BeAFox",
      problems: [
        "Sportler denken an Finanzen statt an Training",
        "Finanzielle Sorgen lenken vom Sport ab",
        "Mentale Belastung beeinträchtigt die Leistung",
        "Keine Unterstützung durch den Verein",
      ],
      color: "bg-red-50 border-red-200",
      iconColor: "bg-red-500",
    },
    {
      step: "2",
      title: "Mit BeAFox",
      benefits: [
        "Verein stellt BeAFox für alle Sportler bereit",
        "Sportler konzentrieren sich auf den Sport",
        "Finanzielle Bildung läuft automatisch",
        "Verein behält Überblick über Fortschritte",
      ],
      color: "bg-green-50 border-green-200",
      iconColor: "bg-green-500",
    },
  ];

  const benefits = [
    {
      icon: Brain,
      title: "Fokus auf den Sport",
      description:
        "Ihre Sportler müssen sich keine Sorgen um Finanzen machen. Sie konzentrieren sich voll auf Training und Wettkämpfe – dank BeAFox, das Sie als Verein bereitstellen.",
      stat: "85%",
      statLabel: "Bessere Fokussierung",
    },
    {
      icon: Trophy,
      title: "Bessere Leistungen",
      description:
        "Ausgeglichene Sportler ohne finanzielle Belastung zeigen messbar bessere Leistungen. Ihre Investition in die finanzielle Bildung zahlt sich auf dem Platz aus.",
      stat: "92%",
      statLabel: "Zufriedenheit",
    },
    {
      icon: Users,
      title: "Einfache Verwaltung",
      description:
        "Als Verein stellen Sie BeAFox für alle Ihre Sportler bereit. Einfache Verwaltung, klare Kosten, vollständige Übersicht über alle Aktivitäten.",
      stat: "200+",
      statLabel: "Sportler",
    },
    {
      icon: Shield,
      title: "Zukunftssicherheit",
      description:
        "Ihre Sportler lernen früh verantwortungsvoll mit Geld umzugehen – auch für die Zeit nach der Karriere. Eine Investition, die sich langfristig auszahlt.",
      stat: "15+",
      statLabel: "Vereine",
    },
  ];

  const features = [
    {
      id: "stufen",
      title: "Automatische Finanzbildung",
      description:
        "Wenn Sie als Verein BeAFox für Ihre Sportler bereitstellen, erhalten diese automatisch Zugang zu allen Lerninhalten. Sie müssen sich keine Gedanken über Finanzen machen – die App übernimmt die Bildung im Hintergrund, während sie sich auf den Sport konzentrieren.",
      mockup: "/assets/Mockups/Mockup-Stufen.png",
    },
    {
      id: "lernpfad",
      title: "Strukturiertes Lernen",
      description:
        "Ihre Sportler lernen Schritt für Schritt alles, was sie über Finanzen wissen müssen – ohne dass Sie als Verein eingreifen müssen. Die App führt jeden Sportler automatisch durch die wichtigsten Themen, perfekt für die Zeit zwischen Trainingseinheiten.",
      mockup: "/assets/Mockups/Mockup-Lernpfad.png",
    },
    {
      id: "rangliste",
      title: "Motivation durch Wettbewerb",
      description:
        "Ihre Sportler können untereinander antreten und sich gegenseitig motivieren. Ranglisten, Missionen und Challenges sorgen dafür, dass die Finanzbildung spielerisch bleibt – genau wie im Sport. So lernen sie, ohne es als Belastung zu empfinden.",
      mockup: "/assets/Mockups/Mockup-Rangliste.png",
    },
    {
      id: "profil",
      title: "Vollständige Übersicht für Vereine",
      description:
        "Als Verein behalten Sie den Überblick: Sie sehen, welche Sportler aktiv lernen, wie der Fortschritt aussieht und wo Unterstützung benötigt wird. Dank BeAFox haben Sie alle Informationen zentral verfügbar.",
      mockup: "/assets/Mockups/Mockup-Profil.png",
    },
  ];

  const testimonials = [
    {
      quote:
        "BeAFox hat unsere Nachwuchsarbeit revolutioniert. Unsere Sportler sind ausgeglichener und fokussierter – das merkt man auf dem Platz sofort.",
      author: "Michael Schmidt",
      role: "Nachwuchstrainer",
      club: "FC Musterstadt",
      rating: 5,
    },
    {
      quote:
        "Als Verein investieren wir nicht nur in die sportliche, sondern auch in die persönliche Entwicklung. BeAFox ist dabei ein wichtiger Baustein.",
      author: "Sarah Weber",
      role: "Sportdirektorin",
      club: "SV Beispiel",
      rating: 5,
    },
    {
      quote:
        "Die Sportler lernen verantwortungsvoll mit Geld umzugehen – das hilft ihnen nicht nur jetzt, sondern auch für die Zeit nach der Karriere.",
      author: "Thomas Müller",
      role: "Jugendleiter",
      club: "TSV Vorzeige",
      rating: 5,
    },
  ];

  return (
    <>
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
                BeAFox for Clubs
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
              Jetzt Partner werden
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
              Die <span className="text-primaryOrange">Transformation</span>
            </h2>
            <p className="text-base md:text-xl text-lightGray">
              Von finanziellen Sorgen zu mentaler Stärke.
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
              Warum Vereine <span className="text-primaryOrange">BeAFox</span>{" "}
              nutzen
            </h2>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto">
              Als Verein investieren Sie in die finanzielle Bildung Ihrer
              Sportler – mit messbaren Ergebnissen auf und neben dem Platz.
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
              So funktioniert{" "}
              <span className="text-primaryOrange">BeAFox for Clubs</span>
            </h2>
            <p className="text-base md:text-xl text-lightGray">
              Als Verein stellen Sie BeAFox bereit – Ihre Sportler lernen
              automatisch
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
              Jetzt Partner werden
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
              Was im <span className="text-primaryOrange">Paket</span> enthalten
              ist
            </h2>
            <p className="text-sm md:text-lg text-lightGray max-w-2xl mx-auto">
              Wenn Sie als Verein BeAFox für Ihre Sportler bereitstellen,
              erhalten diese vollständigen Zugang zu allen BeAFox-Features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[
              {
                icon: Smartphone,
                title: "Sportlerische Lern-App",
                description:
                  "Gamifizierte Finanzbildung, die Ihre Sportler motiviert und nachhaltig lernt",
                color: "bg-blue-50 border-blue-200",
                iconColor: "text-blue-600",
              },
              {
                icon: Infinity,
                title: "Vollständiger Zugang",
                description:
                  "Alle Lernmodule, Missionen und Features ohne Einschränkungen",
                color: "bg-purple-50 border-purple-200",
                iconColor: "text-purple-600",
              },
              {
                icon: BarChart,
                title: "Fortschritts-Tracking",
                description:
                  "Detaillierte Einblicke in den Lernfortschritt jedes einzelnen Sportlers",
                color: "bg-green-50 border-green-200",
                iconColor: "text-green-600",
              },
              {
                icon: Award,
                title: "Offizielle Zertifikate",
                description:
                  "Anerkannte Zertifikate für erfolgreich abgeschlossene Module",
                color: "bg-yellow-50 border-yellow-200",
                iconColor: "text-yellow-600",
              },
              {
                icon: Users,
                title: "Flexible Paketgröße",
                description:
                  "Stellen Sie BeAFox für einzelne Sportler oder das gesamte Team bereit – ganz nach Ihrem Bedarf",
                color: "bg-orange-50 border-orange-200",
                iconColor: "text-orange-600",
              },
              {
                icon: UserCheck,
                title: "Persönlicher Ansprechpartner",
                description:
                  "Dedizierter Account Manager für individuelle Betreuung",
                color: "bg-pink-50 border-pink-200",
                iconColor: "text-pink-600",
              },
              {
                icon: Shield,
                title: "DSGVO-konform",
                description:
                  "Vollständiger Datenschutz nach höchsten europäischen Standards",
                color: "bg-indigo-50 border-indigo-200",
                iconColor: "text-indigo-600",
              },
              {
                icon: Headphones,
                title: "Support & Updates",
                description:
                  "Kontinuierliche Updates und persönlicher Support bei Fragen",
                color: "bg-teal-50 border-teal-200",
                iconColor: "text-teal-600",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`${feature.color} rounded-lg md:rounded-xl p-4 md:p-6 border-2 hover:shadow-lg transition-all cursor-default`}
                >
                  <div className="flex items-start gap-2 md:gap-3 mb-2 md:mb-3">
                    <div
                      className={`${feature.iconColor} bg-white rounded-lg p-1.5 md:p-2 flex-shrink-0`}
                    >
                      <IconComponent className="w-4 h-4 md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm md:text-lg font-bold text-darkerGray mb-1">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-lightGray leading-relaxed">
                    {feature.description}
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
                <span className="text-primaryOrange">Rückführungsprogramm</span>{" "}
                für kleinere Vereine
              </h2>
            </div>
            <p className="text-base md:text-xl text-lightGray max-w-3xl mx-auto mb-6 md:mb-8">
              Als kleiner Verein können Sie auch ohne große Pakete von BeAFox
              profitieren – mit unserem Rückführungsprogramm.
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
                  So funktioniert's
                </h3>
              </div>
              <ol className="space-y-4 md:space-y-6">
                <li className="flex items-start gap-3 md:gap-4">
                  <div className="bg-primaryOrange text-primaryWhite w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-darkerGray mb-1 md:mb-2 text-base md:text-lg">
                      Partnercode erhalten
                    </h4>
                    <p className="text-sm md:text-base text-lightGray">
                      Als Partner-Verein erhalten Sie einen individuellen
                      Partnercode, den Sie an Ihre Mitglieder weitergeben
                      können.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 md:gap-4">
                  <div className="bg-primaryOrange text-primaryWhite w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-darkerGray mb-1 md:mb-2 text-base md:text-lg">
                      Mitglieder nutzen den Code
                    </h4>
                    <p className="text-sm md:text-base text-lightGray">
                      Wenn ein Vereinsmitglied BeAFox Unlimited mit Ihrem
                      Partnercode kauft, wird automatisch ein Teil des Betrags
                      an Ihren Verein gespendet.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 md:gap-4">
                  <div className="bg-primaryOrange text-primaryWhite w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-darkerGray mb-1 md:mb-2 text-base md:text-lg">
                      Verein profitiert
                    </h4>
                    <p className="text-sm md:text-base text-lightGray">
                      Die Spenden fließen direkt an Ihren Verein – ohne
                      zusätzlichen Aufwand für Sie. Ihre Mitglieder unterstützen
                      den Verein automatisch.
                    </p>
                  </div>
                </li>
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
                  Ihre Vorteile
                </h3>
              </div>
              <ul className="space-y-3 md:space-y-4">
                {[
                  "Keine Mindestanzahl erforderlich",
                  "Automatische Spenden ohne Verwaltungsaufwand",
                  "Ihre Mitglieder unterstützen den Verein",
                  "Finanzielle Bildung für alle Vereinsmitglieder",
                  "Flexibel und unkompliziert",
                ].map((benefit, index) => (
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
                  <strong className="text-darkerGray">Ideal für:</strong>{" "}
                  Kleinere Vereine, die ihre Mitglieder unterstützen möchten,
                  ohne große Pakete zu kaufen.
                </p>
                <Button
                  href="/kontakt"
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 !px-4 !py-2.5 md:!px-6 md:!py-3 text-sm md:text-base"
                >
                  Partnercode anfragen
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
            Bereit, BeAFox für Ihre Sportler bereitzustellen?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl mb-6 md:mb-8 text-primaryWhite/90"
          >
            Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch. Wir
            erstellen Ihnen ein individuelles Angebot für Ihren Verein – oder
            informieren Sie über unser Rückführungsprogramm für kleinere
            Vereine.
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
              Jetzt Partner werden
            </Button>
            <Button
              onClick={() => handleAppStoreClick()}
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-4 !py-2.5 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite text-sm md:text-base w-full sm:w-auto"
            >
              App herunterladen
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

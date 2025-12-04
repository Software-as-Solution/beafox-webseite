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
  Users,
  Trophy,
  Target,
  Brain,
  Shield,
  TrendingUp,
  Award,
  Heart,
  Zap,
  BarChart,
  Clock,
  BookOpen,
  Star,
  MessageSquare,
  PlayCircle,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";

export default function ForClubsPage() {
  const [selectedFeature, setSelectedFeature] = useState(0);

  const coreMessage = {
    headline: "Junge Spieler brauchen mehr als Training",
    subheadline: "Sie brauchen Stabilität",
    description:
      "Finanzielle Sicherheit schafft mentale Stärke und lässt Talente mit klarem Kopf auf dem Platz stehen.",
    impact:
      "Mit BeAFox geben Vereine ihren Spielern das Wissen, das sie im Alltag stärkt und im Sport fokussiert hält – das führt zu echter Entwicklung auf und neben dem Feld.",
  };

  const journey = [
    {
      step: "1",
      title: "Ohne finanzielle Bildung",
      problems: [
        "Finanzielle Sorgen lenken ab",
        "Mentale Belastung",
        "Unfokussiert auf dem Platz",
        "Keine Vorbereitung auf die Zukunft",
      ],
      color: "bg-red-50 border-red-200",
      iconColor: "bg-red-500",
    },
    {
      step: "2",
      title: "Mit BeAFox",
      benefits: [
        "Finanzielle Sicherheit",
        "Mentale Stärke",
        "Fokus auf dem Platz",
        "Vorbereitet für die Zukunft",
      ],
      color: "bg-green-50 border-green-200",
      iconColor: "bg-green-500",
    },
  ];

  const benefits = [
    {
      icon: Brain,
      title: "Mentale Stärke",
      description:
        "Finanzielle Sicherheit gibt Spielern die mentale Ruhe, die sie brauchen, um sich voll auf den Sport zu konzentrieren.",
      stat: "85%",
      statLabel: "Bessere Fokussierung",
    },
    {
      icon: Trophy,
      title: "Bessere Leistung",
      description:
        "Ausgeglichene Spieler ohne finanzielle Sorgen zeigen bessere Leistungen auf dem Platz.",
      stat: "92%",
      statLabel: "Zufriedenheit",
    },
    {
      icon: Heart,
      title: "Ganzheitliche Entwicklung",
      description:
        "BeAFox fördert nicht nur sportliche, sondern auch persönliche Entwicklung – für echte Talente.",
      stat: "200+",
      statLabel: "Spieler",
    },
    {
      icon: Shield,
      title: "Zukunftssicherheit",
      description:
        "Spieler lernen früh, verantwortungsvoll mit Geld umzugehen – auch für die Zeit nach der Karriere.",
      stat: "15+",
      statLabel: "Vereine",
    },
  ];

  const features = [
    {
      id: "app",
      title: "Spielerische Lern-App",
      description:
        "Ihre Spieler lernen mit einer modernen, spielerischen App, die Spaß macht und motiviert. Perfekt für die Zeit zwischen Trainingseinheiten.",
      mockup: "/assets/Mockups/Mockup-Lernpfad.png",
    },
    {
      id: "fortschritt",
      title: "Fortschritt verfolgen",
      description:
        "Behalten Sie den Überblick über den Lernfortschritt Ihrer Spieler. Sehen Sie, wer aktiv ist und wo Unterstützung benötigt wird.",
      mockup: "/assets/Mockups/Mockup-Stufen.png",
    },
    {
      id: "zertifikate",
      title: "Offizielle Zertifikate",
      description:
        "Ihre Spieler erhalten nach erfolgreichem Abschluss offizielle Zertifikate, die sie auch außerhalb des Sports nutzen können.",
      mockup: "/assets/Mockups/Mockup-Profil.png",
    },
    {
      id: "rangliste",
      title: "Motivation durch Ranglisten",
      description:
        "Spielerische Elemente wie Ranglisten und Missionen motivieren Ihre Spieler, auch außerhalb des Trainings aktiv zu bleiben.",
      mockup: "/assets/Mockups/Mockup-Rangliste.png",
    },
  ];

  const testimonials = [
    {
      quote:
        "BeAFox hat unsere Nachwuchsarbeit revolutioniert. Unsere Spieler sind ausgeglichener und fokussierter – das merkt man auf dem Platz sofort.",
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
        "Die Spieler lernen verantwortungsvoll mit Geld umzugehen – das hilft ihnen nicht nur jetzt, sondern auch für die Zeit nach der Karriere.",
      author: "Thomas Müller",
      role: "Jugendleiter",
      club: "TSV Vorzeige",
      rating: 5,
    },
  ];

  return (
    <>
      {/* Hero Section - Full Width Impact */}
      <Section className="bg-gradient-to-br from-primaryOrange via-primaryOrange/90 to-primaryOrange/80 py-16 md:py-24 lg:py-32 mt-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-primaryWhite/90 text-sm md:text-base border-2 border-primaryWhite/30 rounded-full px-4 py-2 w-fit mx-auto">
              <Sparkles className="w-4 h-4 text-primaryWhite" />
              <span className="font-semibold">BeAFox for Clubs</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primaryWhite mb-6 leading-tight"
          >
            {coreMessage.headline}
            <br />
            <span className="text-primaryWhite/90">
              {coreMessage.subheadline}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-primaryWhite/90 mb-8 max-w-3xl mx-auto"
          >
            {coreMessage.description}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-primaryWhite/80 mb-12 max-w-4xl mx-auto font-medium"
          >
            {coreMessage.impact}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              href="/kontakt"
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-8 !py-4 bg-primaryWhite hover:bg-primaryWhite/90 text-primaryOrange border-primaryWhite font-semibold"
            >
              Pilotprojekt starten
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              href="/preise"
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-8 !py-4 bg-primaryWhite/20 hover:bg-primaryWhite/30 text-primaryWhite border-primaryWhite"
            >
              Preise ansehen
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ArrowDown className="w-6 h-6 text-primaryWhite/60 animate-bounce" />
        </motion.div>
      </Section>

      {/* Journey Section - Before/After */}
      <Section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Die <span className="text-primaryOrange">Transformation</span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray">
              Von finanziellen Sorgen zu mentaler Stärke
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {journey.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`${item.color} rounded-2xl p-8 border-2 ${
                  item.color.includes("red")
                    ? "border-red-300"
                    : "border-green-300"
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`${item.iconColor} text-primaryWhite w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl`}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-darkerGray">
                    {item.title}
                  </h3>
                </div>
                {item.problems && (
                  <ul className="space-y-3">
                    {item.problems.map((problem, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-darkerGray"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                        <span>{problem}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {item.benefits && (
                  <ul className="space-y-3">
                    {item.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-darkerGray"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
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
      <Section className="bg-primaryWhite py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Was <span className="text-primaryOrange">BeAFox for Clubs</span>{" "}
              bewirkt
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto">
              Messbare Ergebnisse für Ihren Verein und Ihre Spieler
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all shadow-lg"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-primaryOrange/10 rounded-xl p-4">
                    <benefit.icon className="w-10 h-10 text-primaryOrange" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl md:text-5xl font-bold text-primaryOrange mb-1">
                      {benefit.stat}
                    </div>
                    <div className="text-sm text-lightGray">
                      {benefit.statLabel}
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-darkerGray mb-3">
                  {benefit.title}
                </h3>
                <p className="text-lightGray text-lg">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Features Section - Vertical Layout */}
      <Section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              So funktioniert{" "}
              <span className="text-primaryOrange">BeAFox for Clubs</span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray">
              Einfach, effektiv, nachhaltig
            </p>
          </motion.div>

          <div className="space-y-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 md:gap-12 items-center`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primaryOrange text-primaryWhite w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-darkerGray">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-lg text-lightGray">
                    {feature.description}
                  </p>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="relative w-full max-w-[280px]">
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
      <Section className="bg-gradient-to-br from-primaryOrange/5 via-primaryOrange/10 to-primaryWhite py-12 md:py-16 lg:py-20">
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

          {/* Subtle CTA */}
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
              Pilotprojekt starten
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* Features List - Compact Grid */}
      <Section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Im Paket enthalten
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Spielerische Lern-App",
              "Vollständiger Zugang",
              "Fortschritts-Tracking",
              "Offizielle Zertifikate",
              "Unbegrenzte Spieler",
              "Persönlicher Ansprechpartner",
              "DSGVO-konform",
              "Support & Updates",
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-primaryWhite rounded-lg p-4 border-2 border-primaryOrange/20 text-center"
              >
                <Check className="w-5 h-5 text-primaryOrange mx-auto mb-2" />
                <span className="text-sm font-medium text-darkerGray">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 py-12 md:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Trophy className="w-16 h-16 text-primaryWhite mx-auto mb-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primaryWhite"
          >
            Bereit, Ihre Spieler ganzheitlich zu fördern?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl mb-8 text-primaryWhite/90"
          >
            Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch und
            erhalten Sie ein individuelles Angebot für Ihren Verein.
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

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
  Smartphone,
  Users,
} from "lucide-react";

export default function BeAFoxUnlimitedPage() {
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

  const targetGroups = [
    {
      icon: School,
      title: "Für Schüler",
      description:
        "Spielerische und simple Finanzbildung für dein eigenes Tempo.",
    },
    {
      icon: GraduationCap,
      title: "Für Studenten",
      description: "Praxis- und alltagstaugliche Tipps für das Studentenleben.",
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

  const features = [
    {
      icon: BookOpen,
      title: "Vollständige Lernmodule",
      description:
        "Zugriff auf alle Lektionen und Themen rund um Finanzen – von Budgetplanung bis Investitionen.",
    },
    {
      icon: Target,
      title: "Spielerisches Lernen",
      description:
        "Punkte sammeln, Missionen abschließen und deinen Fortschritt verfolgen – so macht Lernen Spaß.",
    },
    {
      icon: Award,
      title: "Wissenschaftlich fundiert",
      description:
        "Unsere Inhalte basieren auf bewährten Lehrmethoden und werden kontinuierlich aktualisiert.",
    },
    {
      icon: Shield,
      title: "100% neutral & unabhängig",
      description:
        "Keine versteckten Verkaufsinteressen. Wir fokussieren uns auf reine Wissensvermittlung.",
    },
    {
      icon: TrendingUp,
      title: "Dein Tempo, deine Zeit",
      description:
        "Lerne wann und wo du willst. Die App passt sich deinem Alltag an.",
    },
    {
      icon: Zap,
      title: "Regelmäßige Updates",
      description:
        "Neue Inhalte, Features und Verbesserungen – ohne zusätzliche Kosten.",
    },
  ];

  const plans = [
    {
      title: "Standard-Abo",
      price: "€4.99",
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
      price: "€3.99",
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
      price: "€49.99",
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

  const benefits = [
    {
      icon: Users,
      value: "3,000+",
      label: "Aktive Privatnutzer",
    },
    {
      icon: Award,
      value: "98%",
      label: "Zufriedenheit",
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Verfügbar",
    },
    {
      icon: TrendingUp,
      value: "500+",
      label: "Lektionen",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-primaryWhite pt-12 md:pt-16 lg:pt-20 mt-10">
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h1 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              BeAFox Unlimited
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
            <span className="text-primaryOrange">Privatnutzer</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto mb-8 md:mb-12"
          >
            Lerne Finanzen auf deine Art – spielerisch, flexibel und in deinem
            eigenen Tempo. BeAFox Unlimited gibt dir Zugang zu allen Lernmodulen
            und Features.
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
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center"
          >
            <Button
              onClick={() => handleAppStoreClick()}
              variant="primary"
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4"
            >
              App herunterladen
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
      </Section>

      {/* Stats Section */}
      <Section className="bg-white pb-8 md:pb-12 lg:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center bg-primaryOrange/5 rounded-xl p-6 border-2 border-primaryOrange/20"
              >
                <benefit.icon
                  className={`w-8 h-8 text-primaryOrange mx-auto mb-3`}
                />
                <div className="text-3xl md:text-4xl font-bold text-darkerGray mb-2">
                  {benefit.value}
                </div>
                <div className="text-sm md:text-base text-lightGray">
                  {benefit.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* How it Works Section */}
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
              In drei einfachen Schritten zu deiner Finanzkompetenz
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "App herunterladen",
                description:
                  "Lade BeAFox kostenlos im App Store oder Google Play Store herunter.",
              },
              {
                step: "2",
                title: "Abo wählen",
                description:
                  "Wähle das Abo, das zu dir passt – monatlich, jährlich oder Lifetime.",
              },
              {
                step: "3",
                title: "Loslegen",
                description:
                  "Starte deine Finanzbildungs-Reise und lerne in deinem eigenen Tempo.",
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

      {/* App Features with Mockups Section */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              So funktioniert <span className="text-primaryOrange">BeAFox</span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto">
              Entdecke alle Features, die deine Finanzbildung zu einem Erlebnis
              machen.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 items-center">
            {/* Left: Feature Tabs */}
            <div className="space-y-4">
              {[
                {
                  id: "stufen",
                  title: "Stufen",
                  description:
                    "Wähle frei aus, was du lernen möchtest. Unsere Stufen-Struktur gibt dir die Flexibilität, Themen nach deinen Interessen und Bedürfnissen zu erkunden.",
                  mockup: "/assets/Mockups/Mockup-Stufen.png",
                },
                {
                  id: "lernpfad",
                  title: "Lernpfad",
                  description:
                    "Folge einem strukturierten Lernpfad, der dich Schritt für Schritt durch alle wichtigen Finanzthemen führt. Du weißt immer, wo du stehst.",
                  mockup: "/assets/Mockups/Mockup-Lernpfad.png",
                },
                {
                  id: "lektion",
                  title: "Lektionen",
                  description:
                    "Lerne Schritt für Schritt alles, was du über Finanzen wissen musst. Unsere interaktiven Lektionen vermitteln komplexe Themen einfach und verständlich.",
                  mockup: "/assets/Mockups/Mockup-Lektion.png",
                },
                {
                  id: "quiz",
                  title: "Quiz",
                  description:
                    "Teste dein Wissen mit interaktiven Quizzen und vertiefe das Gelernte. Mit jedem erfolgreich abgeschlossenen Quiz sammelst du Punkte.",
                  mockup: "/assets/Mockups/Mockup-Quiz.png",
                },
                {
                  id: "rangliste",
                  title: "Rangliste",
                  description:
                    "Vergleiche dich mit anderen Lernenden und motiviere dich durch freundschaftlichen Wettbewerb. Sammle Punkte und erreiche neue Level.",
                  mockup: "/assets/Mockups/Mockup-Rangliste.png",
                },
                {
                  id: "missionen",
                  title: "Missionen & Ziele",
                  description:
                    "Erfülle spannende Missionen und erreiche deine persönlichen Ziele. Jede erfolgreich abgeschlossene Mission wird belohnt.",
                  mockup: "/assets/Mockups/Mockup-Missionen.png",
                },
                {
                  id: "profil",
                  title: "Profil",
                  description:
                    "Sammle Statistiken über deinen Lernfortschritt und erhalte deinen persönlichen Fox Score. Dein Profil zeigt dir alle deine Leistungen.",
                  mockup: "/assets/Mockups/Mockup-Profil.png",
                },
              ].map((feature, index) => (
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
            <div className="flex items-center justify-center lg:sticky lg:top-20">
              <motion.div
                key={selectedFeature}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <Image
                  src={
                    [
                      "/assets/Mockups/Mockup-Stufen.png",
                      "/assets/Mockups/Mockup-Lernpfad.png",
                      "/assets/Mockups/Mockup-Lektion.png",
                      "/assets/Mockups/Mockup-Quiz.png",
                      "/assets/Mockups/Mockup-Rangliste.png",
                      "/assets/Mockups/Mockup-Missionen.png",
                      "/assets/Mockups/Mockup-Profil.png",
                    ][selectedFeature]
                  }
                  alt="BeAFox App Feature"
                  width={300}
                  height={600}
                  className="object-contain drop-shadow-2xl w-full max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-auto"
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Warum <span className="text-primaryOrange">BeAFox Unlimited</span>
              ?
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto">
              Alles, was du brauchst, um deine Finanzkompetenz zu steigern – in
              einer App.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primaryWhite rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all shadow-sm h-full flex flex-col"
              >
                <div className="bg-primaryOrange/10 rounded-lg p-3 w-fit mb-4">
                  <feature.icon className="w-8 h-8 text-primaryOrange" />
                </div>
                <h3 className="text-xl font-bold text-darkerGray mb-3">
                  {feature.title}
                </h3>
                <p className="text-lightGray flex-1">{feature.description}</p>
              </motion.div>
            ))}
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Wähle dein <span className="text-primaryOrange">Abo</span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto">
              Flexible Preise für jeden Bedarf – von monatlich bis lebenslang.
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
                    Beliebt
                  </div>
                )}
                {plan.cheapest && (
                  <div className="bg-primaryOrange/20 text-primaryOrange text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4">
                    Am Billigsten
                  </div>
                )}
                {plan.monthly && (
                  <div className="bg-primaryOrange/20 text-primaryOrange text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4">
                    Monatlich kündbar
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
                  className={`w-full flex items-center justify-center gap-2 mt-auto ${
                    plan.popular && "relative sm:top-1"
                  }`}
                >
                  Jetzt starten
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
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto relative z-10">
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
              Bereit, deine Finanzkompetenz zu steigern?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl mb-8 text-primaryWhite/90"
            >
              Lade BeAFox jetzt herunter und starte deine Reise zu mehr
              Finanzwissen.
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
                App herunterladen
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
                alt="BeAFox Profil Mockup"
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
                alt="BeAFox Rangliste Mockup"
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

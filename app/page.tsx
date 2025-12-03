"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/Button";
import Section from "@/components/Section";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Users,
  School,
  Briefcase,
  Award,
  PawPrint,
  Building2,
  Users as UsersIcon,
  Star as StarIcon,
  X,
  TrendingUp,
  Gamepad2,
  FlaskConical,
  Scale,
  Smartphone,
  Clock,
} from "lucide-react";
import Lottie from "lottie-react";
import kontaktAnimation from "@/public/assets/Lottie/Kontakt.json";

export default function HomePage() {
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(0);

  const words = ["FREIHEIT", "SICHERHEIT"];

  const appFeatures = [
    {
      id: "lernpfad",
      title: "Lernpfad",
      description:
        "Folge einem strukturierten Lernpfad, der dich Schritt für Schritt durch alle wichtigen Finanzthemen führt. Keine Verwirrung mehr – du weißt immer, wo du stehst und was als Nächstes kommt.",
      mockup: "/assets/Mockups/Mockup-Lernpfad.png",
      color: "primaryOrange",
    },
    {
      id: "training",
      title: "Training",
      description:
        "Vertiefe dein Wissen mit interaktiven Übungen und Quizzen. Das spielerische Training macht Lernen zum Vergnügen und hilft dir, das Gelernte nachhaltig zu verankern.",
      mockup: "/assets/Mockups/Mockup-Training.png",
      color: "primaryOrange",
    },
    {
      id: "rangliste",
      title: "Rangliste",
      description:
        "Vergleiche dich mit anderen Lernenden und motiviere dich durch freundschaftlichen Wettbewerb. Sammle Punkte, erreiche neue Level und werde zum Finanz-Experten.",
      mockup: "/assets/Mockups/Mockup-Rangliste.png",
      color: "primaryOrange",
    },
    {
      id: "dashboard",
      title: "Dashboard",
      description:
        "Behalte deinen Lernfortschritt immer im Blick. Das Dashboard zeigt dir auf einen Blick, was du bereits gelernt hast und welche Themen noch auf dich warten.",
      mockup: "/assets/Mockups/Mockup-Lernpfad.png",
      color: "primaryOrange",
    },
    {
      id: "zertifikate",
      title: "Zertifikate",
      description:
        "Erhalte offizielle Zertifikate für deine Fortschritte. Diese kannst du für deine Bewerbungen oder deinen Lebenslauf nutzen und zeigen, dass du Finanzkompetenz besitzt.",
      mockup: "/assets/Mockups/Mockup-Training.png",
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
  const features = [
    {
      icon: CheckCircle,
      title: "Schritt-Für-Schritt",
      description:
        "Nutzer müssen nicht mehr selbst herausfinden, wo sie anfangen sollen oder weitermachen.",
    },
    {
      icon: Award,
      title: "Spielerisches System",
      description:
        "Durch ein spielerisches System fühlt sich lernen nicht mehr wie eine lästige Pflicht an.",
    },
    {
      icon: School,
      title: "Wissenschaftlich fundiert",
      description:
        "Durch Lehrmethoden erstellen wir Lektionen, die erfolgreich dein Finanzwissen verbessern.",
    },
    {
      icon: CheckCircle,
      title: "Neutral & Unabhängig",
      description:
        "Wir fokussieren uns auf die reine Wissensvermittlung. Ohne versteckte Verkaufsinteresse.",
    },
  ];

  const stats = [
    { value: "3,000+", label: "Aktive Privatnutzer", icon: Users },
    {
      value: "5+",
      label: "Schulen & Ausbildungsbetriebe die",
      label2: "BeAFox nutzen",
      icon: Building2,
    },
    {
      value: "1,000+",
      label: "Schüler, Studenten und Azubis die",
      label2: "BeAFox nutzen",
      icon: School,
    },
  ];

  const trustStats = [
    { icon: Building2, value: "3+", label: "Städte" },
    { icon: School, value: "100+", label: "Schulen" },
    { icon: UsersIcon, value: "5k+", label: "Downloads" },
    { icon: StarIcon, value: "4.9/5", label: "Bewertung" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-primaryWhite">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Small Text with Icons */}
              <div className="flex items-center gap-2 text-lightGray text-sm border text-center justify-center border-primaryOrange rounded-full px-4 py-2 w-[50%]">
                <PawPrint className="w-4 h-4 text-primaryOrange" />
                <span className="font-bold">
                  Das erste Finanzbildungs-Ökosystem
                </span>
                <PawPrint className="w-4 h-4 text-primaryOrange" />
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="text-5xl md:text-7xl font-bold text-darkerGray mb-4 leading-tight">
                  WISSEN. <span className="text-primaryOrange">GELD.</span>{" "}
                  <span className="inline-block min-w-[200px] md:min-w-[350px] text-left">
                    {typedText}
                    <span className="inline-block w-0.5 h-[1em] bg-primaryOrange ml-1 animate-pulse"></span>
                  </span>
                  .
                </h1>
                <p className="text-xl text-lightGray leading-relaxed">
                  BeAFox ist die erste unabhängige, spielerische Lern-App für
                  Finanzbildung junger Menschen, die sich auf neutrale
                  Wissensvermittlung konzentriert und speziell für Schulen und
                  Ausbildungsbetriebe entwickelt wurde.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setIsDownloadModalOpen(true)}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  App herunterladen
                </Button>
                <Button
                  href="/kontakt"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  Pilotprojekt starten
                </Button>
              </div>

              {/* Stats - Small under buttons */}
              <div className="flex flex-wrap gap-3 md:gap-4 mt-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 shadow-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-primaryOrange flex-shrink-0"></div>
                      <IconComponent className="w-4 h-4 text-darkerGray flex-shrink-0" />
                      <div className="flex items-center gap-1">
                        <span className="text-base md:text-lg font-bold text-primaryOrange">
                          {stat.value}
                        </span>
                        <span className="text-xs md:text-sm text-darkerGray font-medium">
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
              className="relative"
            >
              <div className="flex items-center justify-center relative">
                {/* Mockup 1 - Training (Left, slightly behind) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative z-10 transform rotate-[-8deg] hover:rotate-[-5deg] transition-transform -mr-8 md:-mr-12"
                >
                  <Image
                    src="/assets/Mockups/Mockup-Training.png"
                    alt="BeAFox Training Mockup"
                    width={320}
                    height={680}
                    className="object-contain drop-shadow-2xl"
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
                    alt="BeAFox Lernpfad Mockup"
                    width={380}
                    height={750}
                    className="object-contain drop-shadow-2xl"
                  />
                </motion.div>

                {/* Mockup 3 - Rangliste (Right, slightly behind) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="relative z-10 transform rotate-[8deg] hover:rotate-[5deg] transition-transform -ml-8 md:-ml-12"
                >
                  <Image
                    src="/assets/Mockups/Mockup-Rangliste.png"
                    alt="BeAFox Rangliste Mockup"
                    width={320}
                    height={680}
                    className="object-contain drop-shadow-2xl"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Logos Carousel */}
      <Section className="bg-primaryWhiteLight overflow-hidden relative bottom-10">
        <div className="text-center mb-12">
          <div className="flex items-center gap-3 text-lightGray text-lg md:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-6 py-3 w-fit mx-auto mb-8">
            <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
            <h2 className="font-bold text-3xl md:text-4xl">
              Offizielle Partner
            </h2>
            <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
          </div>
        </div>
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-primaryWhiteLight to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-primaryWhiteLight to-transparent z-10 pointer-events-none"></div>

          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll">
              {/* First set of logos */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div
                  key={`first-${i}`}
                  className="flex-shrink-0 mx-8 w-64 h-32 md:w-80 md:h-40 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src={`/Partners/${i}.png`}
                    alt={`Partner ${i}`}
                    width={320}
                    height={160}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div
                  key={`second-${i}`}
                  className="flex-shrink-0 mx-8 w-64 h-32 md:w-80 md:h-40 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src={`/Partners/${i}.png`}
                    alt={`Partner ${i}`}
                    width={320}
                    height={160}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* App Features Section */}
      <Section className="bg-primaryWhite relative bottom-10">
        <div className="text-center mb-12">
          <div className="text-center mb-12">
            <div className="flex items-center gap-3 text-lightGray text-lg md:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-6 py-3 w-fit mx-auto mb-8">
              <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
              <h2 className="font-bold text-3xl md:text-4xl">
                So funktioniert BeAFox
              </h2>
              <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
            </div>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {appFeatures.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(index)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedFeature === index
                    ? "bg-primaryOrange text-primaryWhite shadow-lg"
                    : "bg-gray-100 text-darkerGray hover:bg-gray-200"
                }`}
              >
                {feature.title}
              </button>
            ))}
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
            className="bg-gray-50 rounded-2xl p-8 md:p-12 w-[90%] mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Mockup */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center"
              >
                <Image
                  src={appFeatures[selectedFeature].mockup}
                  alt={`BeAFox ${appFeatures[selectedFeature].title} Mockup`}
                  width={300}
                  height={650}
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Right: Description */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-darkerGray mb-6">
                  {appFeatures[selectedFeature].title}
                </h3>
                <p className="text-lg text-lightGray leading-relaxed mb-6">
                  {appFeatures[selectedFeature].description}
                </p>
                <Button href="/kontakt" variant="primary">
                  Mehr erfahren →
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Section>

      {/* Finanzbildungs-Ökosystem Section */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <div className="flex items-center gap-3 text-lightGray text-lg md:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-6 py-3 w-fit mx-auto mb-8">
            <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
            <h2 className="font-bold text-3xl md:text-4xl">
              Finanzbildungs-Ökosystem
            </h2>
            <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
          </div>
        </div>

        <div className="grid lg:grid-cols-7 gap-10 items-center">
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
                <Smartphone className="w-8 h-8 text-primaryWhite" />
              </div>
              <div className="flex items-center gap-2 text-lightGray text-sm border text-center justify-center border-primaryOrange rounded-full px-4 py-2 w-fit mb-2 ml-auto lg:ml-auto">
                <PawPrint className="w-4 h-4 text-primaryOrange" />
                <span className="font-bold">Finanzbildung jederzeit</span>
                <PawPrint className="w-4 h-4 text-primaryOrange" />
              </div>
              <p className="text-darkerGray text-sm">
                Lerne wann und wo du willst. Ob auf dem Smartphone in der Bahn,
                am Laptop zu Hause oder auf dem Tablet in der Pause – BeAFox
                passt sich deinem Alltag an. Dein Fortschritt wird automatisch
                synchronisiert, sodass du nahtlos zwischen Geräten wechseln
                kannst.
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
              <div className="flex items-center gap-2 text-lightGray text-sm border text-center justify-center border-primaryOrange rounded-full px-4 py-2 w-fit mb-2 ml-auto lg:ml-auto">
                <PawPrint className="w-4 h-4 text-primaryOrange" />
                <span className="font-bold">Finanzbildung in der Schule</span>
                <PawPrint className="w-4 h-4 text-primaryOrange" />
              </div>
              <p className="text-darkerGray text-sm">
                BeAFox ist speziell für den Einsatz im Unterricht entwickelt.
                Lehrkräfte können den Lernfortschritt ihrer Klasse verfolgen,
                individuelle Aufgaben zuweisen und spielerische Wettbewerbe
                starten. So wird Finanzbildung zum spannenden Fach, das
                Schülerinnen und Schüler wirklich begeistert.
              </p>
            </motion.div>
          </div>

          {/* Center Mockups - Ecosystem */}
          <div
            className="lg:col-span-3 flex items-center justify-center relative"
            style={{ perspective: "1000px" }}
          >
            {/* Smartphone - Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative z-10 transition-transform"
              style={{
                transform: "scale(0.8)",
                marginRight: "-40px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(0.85)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(0.8)";
              }}
            >
              <Image
                src="/assets/Mockups/Mockup-Start.png"
                alt="BeAFox Smartphone Mockup"
                width={200}
                height={430}
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Macbook - Center */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-20 transition-transform"
              style={{
                transform: "scale(0.7)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(0.75)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(0.7)";
              }}
            >
              <Image
                src="/assets/Mockups/Mockup-Macbook.png"
                alt="BeAFox Macbook Mockup"
                width={600}
                height={400}
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* iPad - Right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative z-10 transition-transform"
              style={{
                transform: "scale(0.75)",
                marginLeft: "-50px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(0.75)";
              }}
            >
              <Image
                src="/assets/Mockups/Mockup-Ipad.png"
                alt="BeAFox iPad Mockup"
                width={300}
                height={400}
                className="object-contain drop-shadow-2xl"
              />
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
              <div className="flex items-center gap-2 text-lightGray text-sm border text-center justify-center border-primaryOrange rounded-full px-4 py-2 w-fit mb-2 mr-auto lg:mr-auto">
                <PawPrint className="w-4 h-4 text-primaryOrange" />
                <span className="font-bold">
                  Finanzbildung in Ausbildungsbetriebe
                </span>
                <PawPrint className="w-4 h-4 text-primaryOrange" />
              </div>
              <p className="text-darkerGray text-sm">
                Auszubildende erhalten mit BeAFox praxisnahe Finanzbildung, die
                direkt im Berufsalltag anwendbar ist. Betriebe können ihren
                Nachwuchs gezielt fördern und zeigen, dass ihnen die finanzielle
                Zukunft ihrer Auszubildenden wichtig ist. Ein modernes Benefit,
                das wirklich ankommt.
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
                <Users className="w-8 h-8 text-primaryWhite" />
              </div>
              <div className="flex items-center gap-2 text-lightGray text-sm border text-center justify-center border-primaryOrange rounded-full px-4 py-2 w-fit mb-2 mr-auto lg:mr-auto">
                <PawPrint className="w-4 h-4 text-primaryOrange" />
                <span className="font-bold">Finanzbildung für Vereine</span>
                <PawPrint className="w-4 h-4 text-primaryOrange" />
              </div>
              <p className="text-darkerGray text-sm">
                Vereine und Organisationen können ihren Mitgliedern wertvolle
                Finanzbildung anbieten. Ob Sportverein, Jugendzentrum oder
                gemeinnützige Organisation – BeAFox hilft dabei, junge Menschen
                finanziell zu stärken und ihnen wichtige Lebenskompetenzen zu
                vermitteln.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* BeAFox For Business Section */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <div className="flex items-center gap-3 text-lightGray text-lg md:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-6 py-3 w-fit mx-auto mb-8">
            <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
            <h2 className="font-bold text-3xl md:text-4xl text-darkerGray">
              BeAFox for Business
            </h2>
            <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="flex items-center gap-2 text-darkerGray text-sm border-2 border-primaryOrange rounded-full px-4 py-2 w-fit mb-8">
              <PawPrint className="w-4 h-4 text-primaryOrange" />
              <span className="font-bold">
                Bildungspakete gegen Fachkräftemangel
              </span>
              <PawPrint className="w-4 h-4 text-primaryOrange" />
            </div>

            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-darkerGray">
                Wir lösen das Problem von{" "}
              </span>
              <span className="text-primaryOrange">Workshops</span>
            </h3>

            <p className="text-darkerGray mb-8 text-lg leading-relaxed">
              Mit unserer Lern-App in Kombination mit regelmäßigen Workshops
              lösen wir das klassische Problem: Nach 2-3 Tagen ist der Großteil
              des Gelernten wieder vergessen.
            </p>

            <div className="mb-8">
              <h4 className="text-xl font-bold text-darkerGray mb-4">
                So funktioniert's:
              </h4>
              <p className="text-darkerGray text-lg leading-relaxed">
                Wir veranstalten alle 6 Monate Workshops zu wechselnden Themen.
                Dazwischen vertiefen die Azubis die Inhalte mit Beafox,
                wiederholen Gelerntes und bereiten sich gezielt auf das nächste
                Workshop vor.
              </p>
            </div>

            <Button
              href="/kontakt"
              variant="primary"
              className="px-8 py-2 text-lg flex justify-center items-center w-[40%]"
            >
              Pilotprojekt anfragen
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Right: Image with Features Overlay */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Workshop Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl relative">
              <Image
                width={400}
                height={300}
                alt="BeAFox Workshop"
                src="/assets/Business.png"
                className="object-cover w-full h-auto"
              />

              {/* Features List Overlay */}
              <div className="absolute bottom-0 right-0 bg-primaryOrange rounded-2xl p-6 m-4 max-w-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-base font-medium">
                      Gezielte Workshops
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-base font-medium">
                      Monitoring Dashboards
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-base font-medium">
                      Offizielle Zertifikate
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-base font-medium">
                      Spielerische Lern-App
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-base font-medium">
                      Große PR-Aktion
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primaryWhite flex-shrink-0" />
                    <span className="text-primaryWhite text-base font-medium">
                      Motiviertere Azubis
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* BeAFox For Schools Section */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <div className="flex items-center gap-3 text-lightGray text-lg md:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-6 py-3 w-fit mx-auto mb-8">
            <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
            <h2 className="font-bold text-3xl md:text-4xl text-darkerGray">
              BeAFox for Schools
            </h2>
            <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Image with Features Overlay */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* School Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl relative mb-8">
              <Image
                src="/assets/School.png"
                alt="BeAFox Schule"
                width={600}
                height={375}
                className="object-cover w-full h-auto"
              />
            </div>

            {/* Features List Overlay - Orange Box (overlapping image) */}
            <div className="relative -mt-24 mx-4 bg-primaryOrange rounded-2xl p-6">
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

          {/* Right: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Badge */}
            <div className="flex items-center gap-2 text-darkerGray text-sm border-2 border-primaryOrange rounded-full px-4 py-2 w-fit">
              <PawPrint className="w-4 h-4 text-primaryOrange" />
              <span className="font-bold">Finanzbildung als Ergänzung</span>
              <PawPrint className="w-4 h-4 text-primaryOrange" />
            </div>

            <h3 className="text-3xl md:text-4xl font-bold">
              <span className="text-darkerGray">
                Wir lösen das Problem von{" "}
              </span>
              <span className="text-primaryOrange">Unterrichtsausfall</span>
            </h3>

            <p className="text-darkerGray text-lg leading-relaxed">
              Ein Lehrer betreut gleichzeitig mehrere Klassen oder Räume. Die
              Schüler arbeiten selbstständig und interaktiv mit BeAFox - ganz
              ohne direkte Anwesenheit des Lehrers vor Ort.
            </p>

            <div>
              <h4 className="text-xl font-bold text-darkerGray mb-4">
                Für Lehrer & Schulleitung:
              </h4>
              <p className="text-darkerGray text-lg leading-relaxed">
                Das integrierte Monitoring-Dashboard zeigt in Echtzeit, was
                jeder Schüler gerade lernt, wo er steht und wie er vorankommt.
                Schwächen werden sofort sichtbar und Fortschritte werden
                belohnt.
              </p>
            </div>

            <div className="flex justify-start">
              <Button
                href="/kontakt"
                variant="primary"
                className="px-10 py-4 text-lg flex justify-center items-center"
              >
                Pilotprojekt starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* BeAFox For Clubs Section */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <div className="flex items-center gap-3 text-lightGray text-lg md:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-6 py-3 w-fit mx-auto mb-8">
            <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
            <h2 className="font-bold text-3xl md:text-4xl text-darkerGray">
              BeAFox for Clubs
            </h2>
            <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Badge */}
            <div className="flex items-center gap-2 text-darkerGray text-sm border-2 border-primaryOrange rounded-full px-4 py-2 w-fit">
              <PawPrint className="w-4 h-4 text-primaryOrange" />
              <span className="font-bold">Finanzbildung für Vereine</span>
              <PawPrint className="w-4 h-4 text-primaryOrange" />
            </div>

            <h3 className="text-3xl md:text-4xl font-bold">
              <span className="text-darkerGray">
                Wir lösen das Problem von{" "}
              </span>
              <span className="text-primaryOrange">finanzieller Bildung</span>
            </h3>

            <p className="text-darkerGray text-lg leading-relaxed">
              Vereine und Organisationen können ihren Mitgliedern wertvolle
              Finanzbildung anbieten. Ob Sportverein, Jugendzentrum oder
              gemeinnützige Organisation – BeAFox hilft dabei, junge Menschen
              finanziell zu stärken.
            </p>

            <div>
              <h4 className="text-xl font-bold text-darkerGray mb-4">
                Für Vereine & Organisationen:
              </h4>
              <p className="text-darkerGray text-lg leading-relaxed">
                Das integrierte Monitoring-Dashboard zeigt in Echtzeit, was
                jeder Teilnehmer gerade lernt, wo er steht und wie er
                vorankommt. So können Sie gezielt unterstützen und Fortschritte
                belohnen.
              </p>
            </div>

            <div className="flex justify-start">
              <Button
                href="/kontakt"
                variant="primary"
                className="px-10 py-4 text-lg flex justify-center items-center"
              >
                Pilotprojekt starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* Right: Image with Features Overlay */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Vereine Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl relative mb-8">
              <Image
                src="/assets/Vereine.png"
                alt="BeAFox Vereine"
                width={500}
                height={312}
                className="object-cover w-full h-auto"
              />
            </div>

            {/* Features List Overlay - Orange Box (overlapping image) */}
            <div className="relative -mt-24 mx-4 bg-primaryOrange rounded-2xl p-6">
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
        </div>
      </Section>

      {/* Warum Finanzbildung Section */}
      <Section className="bg-primaryWhiteLight">
        <div className="text-center mb-16">
          <div className="flex items-center gap-3 text-lightGray text-lg md:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-6 py-3 w-fit mx-auto mb-8">
            <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
            <h2 className="font-bold text-3xl md:text-4xl text-darkerGray">
              Warum Finanzbildung?
            </h2>
            <PawPrint className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
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
                Finanzbildung ist Allgemeinbildung
              </h3>
              <p className="text-sm md:text-base text-darkerGray leading-relaxed">
                Das Deutsche Institut für Erwachsenenbildung (DIE) stuft
                finanzielle Bildung als Teil der Allgemeinbildung ein - deshalb
                muss jeder junge Mensch die Möglichkeit haben, finanzielle
                Bildung zu genießen.
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
                Schulden-Prävention
              </h3>
              <p className="text-sm md:text-base text-darkerGray leading-relaxed">
                Statistisch gesehen wird sich mindestens ein:e Schüler:in pro
                Klasse im Laufe des Lebens überschulden. Hochwertige finanzielle
                Bildung beugt Überschuldung effektiv vor.
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
                Chancengerechtigkeit
              </h3>
              <p className="text-sm md:text-base text-darkerGray leading-relaxed">
                Jede:r sollte über Finanzen Bescheid wissen, um sich eine eigene
                Meinung bilden zu können; unabhängig davon, welche eigenen
                finanziellen und familiären Ressourcen man mitbringt.
              </p>
            </motion.div>
          </div>

          {/* Right: Maskottchen Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center"
          >
            <Image
              src="/assets/Maskottchen.jpeg"
              alt="BeAFox Maskottchen"
              width={400}
              height={400}
              className="object-contain rounded-2xl"
            />
          </motion.div>
        </div>
      </Section>

      {/* Download Banner Section */}
      <Section className="bg-gray-50">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-6 leading-tight">
              Lade noch die{" "}
              <span className="text-primaryOrange">BeAFox-App</span> herunter
              und werde Experte deiner eigenen Finanzen!
            </h2>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a
                href="https://apps.apple.com/de/app/beafox/id6746110612"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Image
                  src="/assets/Apple.png"
                  alt="Download on the App Store"
                  width={180}
                  height={60}
                  className="object-contain hover:opacity-80 transition-opacity relative bottom-[16%]"
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
                  alt="GET IT ON Google Play"
                  width={180}
                  height={60}
                  className="object-contain hover:opacity-80 transition-opacity"
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
            className="relative flex items-center justify-center"
          >
            {/* Mockup 1 - Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10 transform rotate-[-8deg]"
              style={{ marginRight: "-40px" }}
            >
              <Image
                src="/assets/Mockups/Mockup-Training.png"
                alt="BeAFox Training Mockup"
                width={280}
                height={600}
                className="object-contain drop-shadow-2xl"
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
                alt="BeAFox Lernpfad Mockup"
                width={280}
                height={600}
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 relative overflow-hidden">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto relative z-10">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <div className="flex items-center gap-2 text-primaryWhite text-sm border-2 border-primaryWhite/30 rounded-full px-4 py-2 w-fit mx-auto md:mx-0 mb-6">
              <PawPrint className="w-4 h-4 text-primaryWhite" />
              <span className="font-bold text-1xl">Bereit für BeAFox?</span>
              <PawPrint className="w-4 h-4 text-primaryWhite" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-primaryWhite mb-4">
              Jetzt Pilotprojekt starten!
            </h2>

            <p className="text-lg md:text-xl text-primaryWhite/90 mb-8 leading-relaxed">
              Mit unserer Lern-App haben wir endlich eine Möglichkeit
              geschaffen, das oft als langweilig empfundene Thema Finanzen
              nachhaltig und verständlich zu vermitteln. Wir möchten, dass die
              junge Generation selbstständig und motiviert Finanzwissen erwirbt.
            </p>

            <div className="flex justify-center md:justify-start">
              <Button
                href="/kontakt"
                variant="secondary"
                className="!bg-primaryWhite !text-primaryOrange hover:!bg-primaryWhite/90 px-8 py-4 text-lg flex justify-center items-center"
              >
                Pilotprojekt starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* Right: Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-md">
              <Lottie
                animationData={kontaktAnimation}
                loop={true}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Download Modal */}
      <AnimatePresence>
        {isDownloadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsDownloadModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-primaryWhite rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Schließen"
              >
                <X className="w-5 h-5 text-darkerGray" />
              </button>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-primaryOrange mb-4 pr-8 text-center">
                BeAFox App herunterladen
              </h2>

              {/* Info Text */}
              <p className="text-lightGray mb-6">
                Die BeAFox App ist nur für mobile Geräte verfügbar. Öffne diesen
                Link auf deinem Smartphone oder Tablet, um die App
                herunterzuladen.
              </p>

              {/* App Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://apps.apple.com/de/app/beafox/id6746110612"
                  className="inline-block hover:opacity-80 transition-opacity"
                  onClick={handleAppStoreClick}
                >
                  <Image
                    src="/assets/Apple.png"
                    alt="Download on App Store"
                    width={175}
                    height={50}
                    className="object-contain relative bottom-[15%]"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.tapelea.beafox&pcampaignid=web_share"
                  className="inline-block hover:opacity-80 transition-opacity"
                  onClick={handleAppStoreClick}
                >
                  <Image
                    src="/assets/Android.png"
                    alt="Get it on Google Play"
                    width={180}
                    height={50}
                    className="object-contain"
                  />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

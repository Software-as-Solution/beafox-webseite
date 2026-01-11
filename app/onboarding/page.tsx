"use client";

// IMPORTS
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Gift } from "lucide-react";
// COMPONENTS
import Button from "@/components/Button";

export default function OnboardingPage() {
  // STATE
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  // CONSTANTS
  const words = ["FREIHEIT", "SICHERHEIT"];
  // USE EFFECTS
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < currentWord.length) {
          setTypedText(currentWord.slice(0, typedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(currentWord.slice(0, typedText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, currentWordIndex, isDeleting, words]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 pt-20 sm:pt-24 md:pt-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Hero Section */}
        <section className="mb-8 sm:mb-10 md:mb-14">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline */}
            <motion.div
              className="mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-darkerGray mb-3 sm:mb-4 leading-tight px-2">
                WISSEN. <span className="text-primaryOrange">GELD.</span>{" "}
                <span className="inline-block min-w-[140px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[350px] text-left">
                  {typedText}
                  <span className="inline-block w-0.5 h-[1em] bg-primaryOrange ml-1 animate-pulse"></span>
                </span>
                .
              </h1>
            </motion.div>
            {/* Mockups */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 mb-6 sm:mb-8 overflow-x-auto pb-2 sm:pb-0"
            >
              <div className="relative z-10 transform rotate-[-8deg] hover:rotate-[-5deg] transition-transform flex-shrink-0">
                <Image
                  width={160}
                  height={360}
                  alt="BeAFox Training Mockup"
                  src="/assets/Mockups/Mockup-Training.png"
                  className="object-contain drop-shadow-2xl w-[80px] sm:w-[120px] md:w-[160px] lg:w-[180px] xl:w-[190px] h-auto"
                />
              </div>
              <div className="relative z-30 transform hover:scale-105 transition-transform flex-shrink-0">
                <Image
                  width={200}
                  height={420}
                  alt="BeAFox Lernpfad Mockup"
                  src="/assets/Mockups/Mockup-Lernpfad.png"
                  className="object-contain drop-shadow-2xl w-[100px] sm:w-[140px] md:w-[200px] lg:w-[240px] h-auto"
                />
              </div>
              <div className="relative z-10 transform rotate-[8deg] hover:rotate-[5deg] transition-transform flex-shrink-0">
                <Image
                  width={160}
                  height={360}
                  alt="BeAFox Rangliste Mockup"
                  src="/assets/Mockups/Mockup-Rangliste.png"
                  className="object-contain drop-shadow-2xl w-[80px] sm:w-[120px] md:w-[160px] lg:w-[180px] xl:w-[190px] h-auto"
                />
              </div>
            </motion.div>
          </div>
        </section>
        {/* Discount Code Section */}
        <section className="mb-8 sm:mb-12">
          <motion.div
            className="max-w-3xl mx-auto"
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border-2 border-primaryOrange/20 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full mb-4 sm:mb-6">
                  <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 px-2 leading-tight">
                  Hast du einen Rabattcode oder Empfehlungscode erhalten?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-white mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
                  Dann registriere dich jetzt für{" "}
                  <span className="font-bold">BeAFox Unlimited</span> und
                  nutze deinen Code beim Checkout, um von exklusiven Vorteilen
                  zu profitieren!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-2">
                  <Link href="/registrierung" className="w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      className="!bg-white !text-primaryOrange hover:!bg-white/90 !px-6 sm:!px-8 !py-3 sm:!py-4 text-base sm:text-lg font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      Jetzt registrieren
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white/10 transition-all font-semibold text-base sm:text-lg">
                      Ich habe einen Account
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        {/* CTA Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="max-w-2xl mx-auto text-center px-2"
          >
            <p className="text-lightGray text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">
              Kein Code? Kein Problem! <br className="hidden sm:block" /> Du kannst dich trotzdem registrieren und
              später jederzeit BeAFox Unlimited freischalten.
            </p>
            <Link href="/registrierung" className="inline-block">
              <Button
                variant="outline"
                className="!px-6 sm:!px-8 !py-2.5 sm:!py-3 text-sm sm:text-base md:text-lg w-full sm:w-auto"
              >
                Weiter zur Registrierung
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

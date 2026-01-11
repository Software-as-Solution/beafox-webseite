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
    <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 pt-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Section */}
        <section className="mb-10 md:mb-14">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-darkerGray mb-4 leading-tight">
                WISSEN. <span className="text-primaryOrange">GELD.</span>{" "}
                <span className="inline-block min-w-[180px] sm:min-w-[200px] md:min-w-[350px] text-left">
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
              className="flex items-center justify-center gap-4 md:gap-8 mb-8"
            >
              <div className="relative z-10 transform rotate-[-8deg] hover:rotate-[-5deg] transition-transform">
                <Image
                  width={160}
                  height={360}
                  alt="BeAFox Training Mockup"
                  src="/assets/Mockups/Mockup-Training.png"
                  className="object-contain drop-shadow-2xl w-[120px] h-auto sm:w-[160px] md:w-[180px] lg:w-[190px]"
                />
              </div>
              <div className="relative z-30 transform hover:scale-105 transition-transform">
                <Image
                  width={200}
                  height={420}
                  alt="BeAFox Lernpfad Mockup"
                  src="/assets/Mockups/Mockup-Lernpfad.png"
                  className="object-contain drop-shadow-2xl w-[140px] h-auto sm:w-[200px] md:w-[240px] lg:w-[240px]"
                />
              </div>
              <div className="relative z-10 transform rotate-[8deg] hover:rotate-[5deg] transition-transform">
                <Image
                  width={160}
                  height={360}
                  alt="BeAFox Rangliste Mockup"
                  src="/assets/Mockups/Mockup-Rangliste.png"
                  className="object-contain drop-shadow-2xl w-[120px] h-auto sm:w-[160px] md:w-[180px] lg:w-[190px]"
                />
              </div>
            </motion.div>
          </div>
        </section>
        {/* Discount Code Section */}
        <section className="mb-12">
          <motion.div
            className="max-w-3xl mx-auto"
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-primaryOrange/20 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                  <Gift className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                  Hast du einen Rabattcode oder Empfehlungscode erhalten?
                </h2>
                <p className="text-lg md:text-xl text-white mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                  Dann registriere dich jetzt für{" "}
                  <span className="font-bold">BeAFox Unlimited</span> und
                  nutze deinen Code beim Checkout, um von exklusiven Vorteilen
                  zu profitieren!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/registrierung">
                    <Button
                      variant="secondary"
                      className="!bg-white !text-primaryOrange hover:!bg-white/90 !px-8 !py-4 text-lg font-semibold flex items-center gap-2"
                    >
                      Jetzt registrieren
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white/10 transition-all font-semibold text-lg">
                      Ich habe bereits einen Account
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
            className="max-w-2xl mx-auto text-center"
          >
            <p className="text-lightGray text-base md:text-lg mb-6">
              Kein Code? Kein Problem! <br /> Du kannst dich trotzdem registrieren und
              später jederzeit BeAFox Unlimited freischalten.
            </p>
            <Link href="/registrierung">
              <Button
                variant="outline"
                className="!px-8 !py-3 text-base md:text-lg"
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

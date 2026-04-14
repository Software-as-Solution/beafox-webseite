"use client";

// ─── WelcomeGreeting ──────────────────────────────────────
// First welcome step: Bea waves with a speech bubble, big mascot,
// and CTA "Jetzt loslegen".

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

// CONSTANTS
const C = {
  brand: "#E87720",
  brandLight: "#F08A3C",
  brandShadow: "rgba(232,119,32,0.18)",
} as const;

interface Props {
  onContinue: () => void;
}

export default function WelcomeGreeting({ onContinue }: Props) {
  return (
    <motion.div
      key="greeting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30, transition: { duration: 0.35 } }}
      className="relative flex max-w-md flex-col items-center px-4 text-center sm:px-0"
    >
      {/* Mascot + Speech Bubble */}
      <div className="relative mb-4 flex h-[220px] w-full items-end justify-center sm:mb-6 sm:h-[260px] md:h-[300px]">
        {/* Halo behind mascot */}
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-2xl sm:h-56 sm:w-56 md:h-64 md:w-64"
          style={{
            background:
              "radial-gradient(circle, rgba(232,119,32,0.28) 0%, transparent 65%)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Mascot — gentle bob */}
        <motion.div
          className="relative h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56"
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <motion.div
            className="h-full w-full"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/Maskottchen/Maskottchen-Hero.webp"
              alt="Bea"
              fill
              priority
              className="scale-110 object-contain drop-shadow-[0_20px_40px_rgba(232,119,32,0.3)]"
            />
          </motion.div>
        </motion.div>

        {/* Speech Bubble */}
        <motion.div
          className="absolute left-[32.5%] sm:left-1/2 top-[-40px] sm:top-[-20px] z-20 -translate-x-[55%]"
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.65, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[3rem] blur-3xl"
            style={{ background: "rgba(232,119,32,0.1)" }}
          />
          <div className="relative h-[88px] w-[220px] sm:h-[100px] sm:w-[250px] md:h-[118px] md:w-[290px]">
            <svg
              fill="none"
              width="100%"
              height="100%"
              viewBox="0 0 310 118"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
              style={{
                filter:
                  "drop-shadow(0 12px 32px rgba(232,119,32,0.15)) drop-shadow(0 2px 6px rgba(0,0,0,0.05))",
              }}
            >
              <defs>
                <linearGradient
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                  id="beaWelcomeBubble"
                >
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FFF8F0" />
                </linearGradient>
              </defs>
              <path
                d="M 44 1 L 266 1 Q 309 1 309 44 Q 309 87 266 87 L 130 87 Q 118 102 78 116 Q 100 100 92 87 L 44 87 Q 1 87 1 44 Q 1 1 44 1 Z"
                fill="url(#beaWelcomeBubble)"
                stroke="rgba(232,119,32,0.3)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute left-0 right-0 top-0 flex h-[74px] items-center gap-3 px-4 md:h-[88px] md:gap-4 md:px-5">
              <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 overflow-hidden md:h-12 md:w-12">
                <Image
                  src="/assets/Logos/Logo.webp"
                  alt="Bea Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-white bg-green-500"
                />
              </div>
              <div className="flex flex-col items-start text-left leading-tight">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primaryOrange">
                  Bea
                </span>
                <span className="whitespace-nowrap text-sm sm:text-base font-bold text-darkerGray md:text-lg">
                  Hey, ich bin Bea
                  <span aria-hidden="true" className="ml-1">
                    👋
                  </span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.p
        className="mb-5 mt-2 text-lg font-medium leading-snug text-darkerGray sm:mb-6 sm:text-xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        Deine beste Freundin{" "}
        <span className="text-primaryOrange">für Finanzen.</span>
      </motion.p>

      <motion.button
        type="button"
        onClick={onContinue}
        className="group relative inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:scale-[1.04] sm:gap-2.5 sm:px-8 sm:py-4 sm:text-base"
        style={{
          background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandLight} 100%)`,
          boxShadow: `0 10px 30px ${C.brandShadow}`,
        }}
        initial={{ opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${C.brand}` }}
          animate={{ scale: [1, 1.15, 1.15], opacity: [0.6, 0, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 2,
          }}
        />
        <Sparkles className="h-5 w-5" />
        Jetzt loslegen
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </motion.div>
  );
}

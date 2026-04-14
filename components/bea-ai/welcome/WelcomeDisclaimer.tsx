"use client";

// ─── WelcomeDisclaimer ────────────────────────────────────
// Second welcome step: Beta-Disclaimer-Karte mit Maskottchen oben.

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import LegalDisclaimer from "@/components/bea-ai/shared/LegalDisclaimer";

// CONSTANTS
const C = {
  brand: "#E87720",
  brandLight: "#F08A3C",
  brandBg: "rgba(232,119,32,0.05)",
  brandBgMed: "rgba(232,119,32,0.10)",
  brandBorder: "rgba(232,119,32,0.22)",
  brandShadow: "rgba(232,119,32,0.18)",
} as const;

interface Props {
  onContinue: () => void;
  onBack: () => void;
}

export default function WelcomeDisclaimer({ onContinue, onBack }: Props) {
  return (
    <motion.div
      key="disclaimer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex max-w-md flex-col items-center px-4 text-center sm:px-0"
    >
      <motion.div
        className="relative z-10 mb-[-36px] h-24 w-24 sm:mb-[-40px] sm:h-28 sm:w-28"
        initial={{ y: -20, opacity: 0, rotate: -8 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 180,
          damping: 14,
        }}
      >
        <motion.div
          className="h-full w-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/Maskottchen/Maskottchen-Herzen.webp"
            alt="Bea mit Herzen"
            fill
            className="scale-125 object-contain drop-shadow-[0_12px_24px_rgba(232,119,32,0.25)]"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="relative w-full rounded-3xl p-6 pt-10 sm:p-8 sm:pt-12"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
          border: `1.5px solid ${C.brandBorder}`,
          boxShadow: `0 24px 64px rgba(232,119,32,0.12), 0 0 0 1px ${C.brandBg}`,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <motion.div
          className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{
            background: C.brandBgMed,
            border: `1px solid ${C.brandBorder}`,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <span className="text-base font-black uppercase tracking-widest text-primaryOrange">
            Beta
          </span>
        </motion.div>

        <motion.h3
          className="mb-4 text-xl font-bold text-darkerGray md:text-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          Kurz, bevor wir loslegen
        </motion.h3>

        <motion.p
          className="mb-7 text-sm leading-relaxed text-lightGray md:text-[15px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          Ich bin noch in meiner{" "}
          <span className="font-bold text-primaryOrange">Beta-Phase</span> und
          lerne jeden Tag dazu! Wenn ich mal einen Fehler mache, dann sag mir
          Bescheid. Ich freu mich über jeden Hinweis, um besser zu werden
        </motion.p>

        <motion.div
          className="mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <LegalDisclaimer variant="compact" />
        </motion.div>

        <motion.button
          type="button"
          onClick={onContinue}
          className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] md:text-base"
          style={{
            background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandLight} 100%)`,
            boxShadow: `0 8px 24px ${C.brandShadow}`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          Alles klar, lass uns starten
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
        </motion.button>

        <motion.button
          type="button"
          onClick={onBack}
          className="mt-4 text-xs font-medium text-gray-400 transition-colors hover:text-primaryOrange"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.4 }}
        >
          ← Zurück
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

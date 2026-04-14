"use client";

// ─── RechnerCard ──────────────────────────────────────────
// Inline mini-calculator. Phase-1 stub with basic inputs and
// formula-based output. Backend integration in Phase 2.

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { RechnerType } from "@/lib/bea-ai/chat/chatTypes";

// STYLES
const CARD_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFFAF5 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 4px 16px rgba(232,119,32,0.08)",
} as const;

interface Props {
  rechnerType: RechnerType;
  onResult?: (value: number) => void;
}

const TITLES: Record<RechnerType, string> = {
  notgroschen: "Notgroschen-Rechner",
  sparziel: "Sparziel-Rechner",
  zinseszins: "Zinseszins-Rechner",
};

const PROMPTS: Record<RechnerType, string> = {
  notgroschen: "Wie hoch sind deine monatlichen Fixkosten?",
  sparziel: "Wie viel willst du sparen?",
  zinseszins: "Mit welchem Startkapital rechnen wir?",
};

function calculate(type: RechnerType, value: number): number {
  switch (type) {
    case "notgroschen":
      return Math.round(value * 3); // 3 Monate Fixkosten
    case "sparziel":
      return Math.round(value / 12); // pro Monat (1 Jahr Horizont)
    case "zinseszins":
      // Stark vereinfacht: 5% p.a., 10 Jahre
      return Math.round(value * Math.pow(1.05, 10));
  }
}

export default function RechnerCard({ rechnerType, onResult }: Props) {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(input);
    if (Number.isNaN(value) || value <= 0) return;
    const r = calculate(rechnerType, value);
    setResult(r);
    onResult?.(r);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={CARD_STYLE}
      className="mx-auto w-full max-w-[85%] overflow-hidden rounded-3xl rounded-bl-md p-5 md:max-w-[68%] md:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 md:h-14 md:w-14">
          <Image
            src="/Maskottchen/Maskottchen-Rechner.webp"
            alt="Rechner"
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primaryOrange">
            Rechner
          </span>
          <h3 className="mt-0.5 text-base font-black leading-tight text-darkerGray md:text-lg">
            {TITLES[rechnerType]}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-lightGray md:text-sm">
            {PROMPTS[rechnerType]}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            inputMode="decimal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Betrag in €"
            className="w-full rounded-full border border-primaryOrange/25 bg-white px-4 py-2 pr-10 text-sm text-darkerGray outline-none focus:border-primaryOrange"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            €
          </span>
        </div>
        <button
          type="submit"
          className="rounded-full bg-primaryOrange px-4 py-2 text-xs font-black text-white transition-transform hover:scale-[1.02] md:text-sm"
        >
          Rechnen
        </button>
      </form>
      {result !== null && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-xl bg-primaryOrange/10 p-3 text-center"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-primaryOrange">
            Ergebnis
          </span>
          <div className="mt-1 text-2xl font-black text-darkerGray">
            {result.toLocaleString("de-DE")} €
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

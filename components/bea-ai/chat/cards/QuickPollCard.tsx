"use client";

// ─── QuickPollCard ────────────────────────────────────────
// Bea asks a quick A/B/C question. User picks → answer is injected
// as a user-message back into the chat.

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PollOption } from "@/lib/bea-ai/chat/chatTypes";

// STYLES
const CARD_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFFAF5 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 4px 16px rgba(232,119,32,0.08)",
} as const;
const OPTION_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid rgba(232,119,32,0.25)",
} as const;

interface Props {
  question: string;
  options: PollOption[];
  onAnswer?: (value: string) => void;
}

export default function QuickPollCard({ question, options, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (value: string) => {
    if (selected) return;
    setSelected(value);
    onAnswer?.(value);
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
            src="/Maskottchen/Maskottchen-Unklar.webp"
            alt="Bea fragt"
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primaryOrange">
            Mini-Frage
          </span>
          <h3 className="mt-0.5 text-base font-black leading-snug text-darkerGray md:text-lg">
            {question}
          </h3>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((opt, i) => {
          const isSelected = selected === opt.value;
          return (
            <motion.button
              key={opt.value}
              type="button"
              disabled={!!selected}
              onClick={() => handleClick(opt.value)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              whileTap={{ scale: 0.96 }}
              whileHover={!selected ? { y: -2 } : {}}
              style={{
                ...OPTION_STYLE,
                background: isSelected
                  ? "linear-gradient(135deg, #E87720, #F08A3C)"
                  : "#FFFFFF",
                color: isSelected ? "#FFFFFF" : "#161616",
                opacity: selected && !isSelected ? 0.4 : 1,
              }}
              className="rounded-xl px-4 py-2.5 text-sm font-bold transition-all disabled:cursor-default"
            >
              {opt.label}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

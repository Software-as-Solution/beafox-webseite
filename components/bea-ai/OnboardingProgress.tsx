"use client";

// ─── OnboardingProgress ───────────────────────────────────
// Sticky-style progress bar shown above each onboarding step.

import Image from "next/image";
import { motion } from "framer-motion";
import { getOnboardingEncouragement } from "@/lib/bea-ai/chat/helpers";

// STYLES
const C = {
  brand: "#E87720",
  brandLight: "#F08A3C",
  brandBg: "rgba(232,119,32,0.05)",
  brandBgMed: "rgba(232,119,32,0.10)",
  brandShadow: "rgba(232,119,32,0.18)",
} as const;

interface Props {
  current: number;
  total: number;
}

export default function OnboardingProgress({ current, total }: Props) {
  const percent = Math.round((current / total) * 100);
  const displayCurrent = Math.min(current + 1, total);
  const encouragement = getOnboardingEncouragement(current, total);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden md:h-9 md:w-9">
            <Image
              src="/assets/Logos/Logo.webp"
              alt="Bea"
              fill
              className="object-contain"
              sizes="40px"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[9px] font-bold uppercase tracking-wider text-primaryOrange md:text-[10px]">
              Dein Weg mit Bea
            </span>
            <span className="text-xs font-bold text-darkerGray md:text-sm">
              Frage {displayCurrent} von {total}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-semibold text-darkerGray/60 sm:inline md:text-sm">
            {encouragement}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold text-primaryOrange md:text-xs"
            style={{ background: C.brandBgMed }}
          >
            {percent}%
          </span>
        </div>
      </div>
      <div
        className="relative h-2 w-full overflow-hidden rounded-full"
        style={{ background: C.brandBg }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${C.brand} 0%, ${C.brandLight} 100%)`,
            boxShadow: `0 0 12px ${C.brandShadow}`,
          }}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

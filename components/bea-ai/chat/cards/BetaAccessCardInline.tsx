"use client";

// ─── BetaAccessCardInline ─────────────────────────────────
// Bea-styled inline card asking the user if they want Early-Access.
// Triggered after a configurable number of user messages.

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// STYLES
const CARD_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFFAF5 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 4px 16px rgba(232,119,32,0.08)",
} as const;
const PRIMARY_BUTTON_STYLE = {
  background: "linear-gradient(135deg, #E87720, #F08A3C)",
  boxShadow: "0 4px 12px rgba(232,119,32,0.28)",
} as const;

interface Props {
  onAccept: () => void;
  onDismiss: () => void;
}

export default function BetaAccessCardInline({ onAccept, onDismiss }: Props) {
  const t = useTranslations("beaAi.chat.betaAccessCard");

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
            src="/Maskottchen/Maskottchen-Herzen.webp"
            alt="Bea mit Herzen"
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-bold text-darkerGray md:text-sm">
            {t("intro")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-darkerGray/80 md:text-[13px]">
            {t("body")}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-primaryOrange/40 hover:text-primaryOrange md:text-[13px]"
        >
          {t("dismiss")}
        </button>
        <button
          type="button"
          onClick={onAccept}
          style={PRIMARY_BUTTON_STYLE}
          className="rounded-full px-4 py-2 text-xs font-black text-white transition-transform hover:scale-[1.02] md:text-[13px]"
        >
          {t("accept")}
        </button>
      </div>
    </motion.div>
  );
}

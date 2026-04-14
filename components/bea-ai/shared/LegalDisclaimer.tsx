"use client";

// IMPORTS
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// TYPES
interface LegalDisclaimerProps {
  variant: "compact" | "full";
}

// CONSTANTS
const COMPACT_STYLE = {
  color: "#9CA3AF",
} as const;
const FULL_CONTAINER_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.18)",
  boxShadow: "0 4px 16px rgba(232,119,32,0.06)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
} as const;
const FULL_BADGE_STYLE = {
  background: "rgba(232,119,32,0.1)",
  border: "1px solid rgba(232,119,32,0.2)",
} as const;

/**
 * LEGAL DISCLAIMER
 *
 * Positions Bea clearly as a learning companion (Lernbegleiterin),
 * NOT a licensed financial advisor — but in a warm, first-person voice
 * that feels like Bea talking directly to the user.
 *
 * Two variants:
 * - "compact": Single line, small grey text — for inline hints
 * - "full": Block element with border — for welcome/newsletter phases
 */
export default function LegalDisclaimer({ variant }: LegalDisclaimerProps) {
  const t = useTranslations("onboarding.beaAi.legalDisclaimer");

  if (variant === "compact") {
    return (
      <p
        className="text-center text-[11px] font-medium leading-relaxed md:text-xs"
        style={COMPACT_STYLE}
      >
        {t("compact")}
      </p>
    );
  }

  return (
    <motion.div
      style={FULL_CONTAINER_STYLE}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 md:p-6"
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg relative bottom-1" aria-hidden="true">
          🧡
        </span>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primaryOrange"
              style={FULL_BADGE_STYLE}
            >
              {t("full.badge")}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-darkerGray/85 md:text-[15px]">
            {t.rich("full.body", {
              strong: (chunks) => (
                <span className="font-semibold text-darkerGray">{chunks}</span>
              ),
            })}
          </p>
          <p className="mt-2.5 text-xs leading-relaxed text-darkerGray/60 md:text-[13px]">
            {t("full.legal")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

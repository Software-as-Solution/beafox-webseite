"use client";

// ─────────────────────────────────────────────────────────────
// ConsentBanner — DSGVO-konformer Einwilligungsdialog
// ─────────────────────────────────────────────────────────────
// Erscheint einmal beim ersten Besuch (solange keine Entscheidung
// getroffen wurde). Separate Checkboxen pro Zweck, kein Dark Pattern.
// Default: alle off. Buttons: "Nur notwendig" + "Auswahl speichern"
// + "Alles akzeptieren" (gleichwertig, nicht hervorgehoben).
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useConsent } from "@/hooks/useConsent";
import type { ConsentPurpose } from "@/lib/analytics";

// CONSTANTS
const PANEL_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 24px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(232,119,32,0.08)",
} as const;
const PRIMARY_BUTTON_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow: "0 8px 20px rgba(232,119,32,0.30)",
} as const;
const SECONDARY_BUTTON_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  color: "#161616",
} as const;

interface PurposeConfig {
  id: ConsentPurpose;
  titleKey: string;
  descKey: string;
  required?: boolean;
}

// CONSTANTS
const PURPOSES: readonly PurposeConfig[] = [
  { id: "analytics", titleKey: "analytics.title", descKey: "analytics.desc" },
  {
    id: "prompt_iteration",
    titleKey: "prompt_iteration.title",
    descKey: "prompt_iteration.desc",
  },
  {
    id: "model_training",
    titleKey: "model_training.title",
    descKey: "model_training.desc",
  },
  {
    id: "profile_tracking",
    titleKey: "profile_tracking.title",
    descKey: "profile_tracking.desc",
  },
] as const;

export default function ConsentBanner() {
  const t = useTranslations("consent");
  const { consent, hasDecision, setPurpose, acceptAll, rejectAll } =
    useConsent();
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Nur öffnen, wenn noch keine Entscheidung vorliegt
  useEffect(() => {
    if (!hasDecision) {
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
    setIsOpen(false);
  }, [hasDecision]);

  const handleSaveSelection = () => {
    // Einzelne Purposes wurden schon per setPurpose getoggelt — einfach schließen.
    setIsOpen(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    setIsOpen(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 md:pb-6"
          role="dialog"
          aria-labelledby="consent-title"
          aria-describedby="consent-desc"
        >
          <div
            style={PANEL_STYLE}
            className="w-full max-w-3xl overflow-hidden rounded-2xl"
          >
            <div className="p-5 md:p-6">
              <h2
                id="consent-title"
                className="mb-2 text-lg font-black text-darkerGray md:text-xl"
              >
                {t("title")}
              </h2>
              <p
                id="consent-desc"
                className="text-sm leading-relaxed text-lightGray md:text-[15px]"
              >
                {t("intro")}
              </p>

              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-3 text-xs font-semibold text-primaryOrange underline-offset-2 hover:underline md:text-sm"
              >
                {expanded ? t("collapse") : t("expand")}
              </button>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {PURPOSES.map((p) => {
                        const granted =
                          consent[p.id].granted &&
                          consent[p.id].revoked_at === null;
                        return (
                          <label
                            key={p.id}
                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#F0E5D8] bg-white p-3 transition-colors hover:border-primaryOrange/40"
                          >
                            <input
                              type="checkbox"
                              checked={granted}
                              onChange={(e) =>
                                setPurpose(p.id, e.target.checked)
                              }
                              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-primaryOrange"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-bold text-darkerGray">
                                {t(p.titleKey)}
                              </div>
                              <div className="mt-0.5 text-xs leading-relaxed text-lightGray md:text-[13px]">
                                {t(p.descKey)}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-2 border-t border-[#F0E5D8] bg-[#FFFDFB] p-4 sm:flex-row sm:justify-end md:p-5">
              <button
                type="button"
                onClick={handleRejectAll}
                style={SECONDARY_BUTTON_STYLE}
                className="rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:scale-[1.02] md:text-base"
              >
                {t("reject_all")}
              </button>
              {expanded && (
                <button
                  type="button"
                  onClick={handleSaveSelection}
                  style={SECONDARY_BUTTON_STYLE}
                  className="rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:scale-[1.02] md:text-base"
                >
                  {t("save_selection")}
                </button>
              )}
              <button
                type="button"
                onClick={handleAcceptAll}
                style={PRIMARY_BUTTON_STYLE}
                className="rounded-full px-5 py-2.5 text-sm font-black text-white transition-transform hover:scale-[1.02] md:text-base"
              >
                {t("accept_all")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

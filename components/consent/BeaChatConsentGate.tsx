"use client";

// ─────────────────────────────────────────────────────────────
// BeaChatConsentGate — KI-Einwilligung direkt im Bea-Chat
// ─────────────────────────────────────────────────────────────
// Bewusst NICHT Teil des Cookie-Banners: Die KI-spezifische
// Einwilligung (prompt_iteration, model_training) wird direkt
// beim Start des Bea-Chats eingeholt. So sieht der Nutzer den
// Hinweis im Kontext seiner Chat-Interaktion, nicht vermischt
// mit allgemeinen Webseiten-Cookies.
//
// Verhalten:
// - Hat der Nutzer noch keine Entscheidung zu den KI-Zwecken:
//   Overlay mit kurzem Hinweis + "Chat starten"-Button.
// - Klick auf "Chat starten" → prompt_iteration + model_training
//   werden auf true gesetzt, Chat wird freigegeben.
// - Hat der Nutzer bereits eine Entscheidung (egal ob erteilt
//   oder widerrufen), wird der Chat direkt gerendert. Widerruf
//   geht jederzeit über die Profil-Einstellungen.
//
// Verwendung:
//   <BeaChatConsentGate>
//     <MeinLiveChat />
//   </BeaChatConsentGate>
// ─────────────────────────────────────────────────────────────

import { useCallback, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useConsent } from "@/hooks/useConsent";
import { AI_PURPOSES } from "./ConsentPrimitives";

// ═══════════════════════════════════════════════════════════
// STYLE
// ═══════════════════════════════════════════════════════════

const CARD_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 18px 48px rgba(0,0,0,0.08), 0 0 0 1px rgba(232,119,32,0.06)",
} as const;

const PRIMARY_BUTTON_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow: "0 8px 20px rgba(232,119,32,0.3)",
} as const;

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface BeaChatConsentGateProps {
  children: ReactNode;
  /**
   * Wenn true, wird der Gate IMMER angezeigt, bis der Nutzer
   * "Chat starten" klickt — unabhängig vom vorherigen Status.
   * Default: false.
   */
  forceGate?: boolean;
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

export default function BeaChatConsentGate({
  children,
  forceGate = false,
}: BeaChatConsentGateProps) {
  const t = useTranslations("bea_chat_gate");
  const { consent, setPurpose } = useConsent();

  // Hat der Nutzer bereits für mindestens einen KI-Zweck entschieden
  // (erteilt oder widerrufen)? Dann Chat direkt rendern.
  const hasAiDecision = AI_PURPOSES.some((p) => {
    const entry = consent[p.id];
    return entry.granted_at !== null || entry.revoked_at !== null;
  });

  const showGate = forceGate || !hasAiDecision;

  const handleStart = useCallback(() => {
    for (const p of AI_PURPOSES) {
      setPurpose(p.id, true);
    }
  }, [setPurpose]);

  if (!showGate) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Hinter dem Gate wird der Chat bereits gerendert, aber
          nicht interaktiv — so ist der Kontext sichtbar. */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none opacity-40 blur-[2px]"
      >
        {children}
      </div>

      <AnimatePresence>
        <motion.div
          key="bea-chat-gate"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="absolute inset-0 z-20 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bea-chat-gate-title"
        >
          <div
            style={CARD_STYLE}
            className="w-full max-w-md rounded-3xl p-5 md:p-6"
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="relative mb-3 h-16 w-16 overflow-hidden rounded-full md:h-20 md:w-20"
                style={{ background: "rgba(232,119,32,0.08)" }}
              >
                <Image
                  src="/Maskottchen/Maskottchen-Hero.webp"
                  alt="Bea"
                  fill
                  priority
                  className="object-contain"
                  sizes="80px"
                />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-primaryOrange">
                Bea
              </span>
              <h2
                id="bea-chat-gate-title"
                className="mt-0.5 text-lg font-black leading-tight text-darkerGray md:text-xl"
              >
                {t("title")}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-lightGray md:text-[15px]">
                {t("message")}
              </p>

              <button
                type="button"
                onClick={handleStart}
                style={PRIMARY_BUTTON_STYLE}
                className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black text-white transition-transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 md:text-[15px]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {t("start_button")}
              </button>

              <p className="mt-3 text-[11px] leading-relaxed text-darkerGray/60 md:text-xs">
                {t("revoke_hint")}{" "}
                <Link
                  href="/datenschutz"
                  className="font-bold text-primaryOrange hover:underline"
                >
                  {t("privacy_link")}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

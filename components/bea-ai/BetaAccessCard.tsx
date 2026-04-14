"use client";

// ─────────────────────────────────────────────────────────────
// BetaAccessCard — Dezenter Hinweis unter dem Chat
// ─────────────────────────────────────────────────────────────
// Kein Gate. User muss nichts eintragen um den Chat zu nutzen.
// Zeigt den Beta-Status an und lädt optional ein, sich für den
// Early-Access-Zugang mit E-Mail einzutragen.
// Nach erfolgreichem Eintrag wird ein freundlicher Bestätigungs-Status
// gezeigt. Wenn der User weg-klickt oder ignoriert, bleibt der Chat
// uneingeschränkt nutzbar.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Check, Loader2, X as XIcon } from "lucide-react";

// CONSTANTS
const PANEL_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFFAF3 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 4px 16px rgba(232,119,32,0.08)",
} as const;
const INPUT_FOCUS_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #E87720",
  boxShadow: "0 2px 12px rgba(232,119,32,0.18)",
} as const;
const INPUT_DEFAULT_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid rgba(232,119,32,0.22)",
} as const;
const SUBMIT_BUTTON_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow: "0 4px 12px rgba(232,119,32,0.28)",
} as const;

interface Props {
  /**
   * Wird aufgerufen, wenn der User die E-Mail abschickt.
   * Muss bei Fehler eine Exception werfen, damit der Status korrekt zurückspringt.
   */
  onSubmit?: (email: string) => Promise<void> | void;
}

export default function BetaAccessCard({ onSubmit }: Props) {
  // STATE
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // FUNCTIONS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus("submitting");
    setErrorMsg(null);
    try {
      if (onSubmit) {
        await onSubmit(trimmed);
      } else {
        // Fallback: direkter Call an bestehenden Newsletter-Endpoint
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmed }),
        });
        if (!res.ok) throw new Error("Newsletter signup failed");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Irgendwas ist schiefgelaufen. Probier's gleich nochmal.",
      );
    }
  };

  // Dismissed → nichts zeigen
  if (isDismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      style={PANEL_STYLE}
      className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl"
    >
      {/* Collapsed header (Info + Toggle) */}
      {!isOpen && status !== "success" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left md:px-5 md:py-3"
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
            style={{ background: "rgba(232,119,32,0.12)" }}
          >
            <Info className="h-3.5 w-3.5 text-primaryOrange" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-bold text-darkerGray md:text-[13px]">
              <span className="text-primaryOrange">Beta-Phase</span> · Bea kann
              Fehler machen
            </div>
            <div className="truncate text-[11px] text-lightGray md:text-xs">
              Tipp: Melde dich für Early-Access an und teste mich voll
            </div>
          </div>
          <span className="ml-auto hidden shrink-0 rounded-full bg-primaryOrange/10 px-2.5 py-0.5 text-[10px] font-bold text-primaryOrange sm:inline-block">
            Öffnen
          </span>
        </button>
      )}

      {/* Expanded state (Email form) */}
      <AnimatePresence initial={false}>
        {isOpen && status !== "success" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="relative px-4 pb-4 pt-3 md:px-5 md:pb-5 md:pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Schließen"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-darkerGray"
              >
                <XIcon className="h-4 w-4" />
              </button>

              <div className="flex items-start gap-2.5 pr-6">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(232,119,32,0.12)" }}
                >
                  <Info className="h-4 w-4 text-primaryOrange" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold leading-snug text-darkerGray md:text-sm">
                    Ich bin in der{" "}
                    <span className="text-primaryOrange">Beta-Phase</span>
                  </p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-lightGray md:text-[13px]">
                    Ich mache manchmal Fehler und lerne jeden Tag dazu. Wenn du
                    mich komplett testen und Early-Access bekommen möchtest,
                    trag deine Mail ein — dann schalten wir dich frei. Ohne
                    Spam, versprochen 🧡
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch"
              >
                <div
                  className="flex flex-1 items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-200"
                  style={isFocused ? INPUT_FOCUS_STYLE : INPUT_DEFAULT_STYLE}
                >
                  <svg
                    className="h-4 w-4 shrink-0 text-primaryOrange"
                    fill="none"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    disabled={status === "submitting"}
                    placeholder="deine@mail.de"
                    aria-label="E-Mail für Early-Access"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full bg-transparent text-sm text-darkerGray outline-none placeholder:text-gray-400 disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "submitting" || !email.trim()}
                  style={SUBMIT_BUTTON_STYLE}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-black text-white transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sende…</span>
                    </>
                  ) : (
                    <>Eintragen</>
                  )}
                </button>
              </form>

              {errorMsg && (
                <p className="mt-2 text-[11px] font-semibold text-red-600">
                  {errorMsg}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success-State */}
      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 px-4 py-3 md:px-5"
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
            style={{ background: "rgba(34,197,94,0.12)" }}
          >
            <Check className="h-4 w-4 text-green-600" strokeWidth={3} />
          </div>
          <p className="flex-1 text-[12px] font-semibold text-darkerGray md:text-sm">
            Eingetragen! Ich schreibe dir, sobald dein Zugang freigeschaltet
            ist. 🧡
          </p>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Hinweis ausblenden"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-darkerGray"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

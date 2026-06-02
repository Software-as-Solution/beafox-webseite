"use client";

// ─── SessionLimitScreen ───────────────────────────────────
// Highest-Intent-Moment im Funnel: User hat die Demo komplett
// durchgespielt. Primary CTA ist die App, Secondary ist Email
// für Early-Access. Tertiary "Unterhaltung speichern" ist hinter
// einem Flag, bis Persistenz (Finding 8) live ist.

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
// ICONS
import { Plus, Check, Download, Loader2, BookmarkPlus } from "lucide-react";
// CUSTOM COMPONENTS
import DownloadModal from "@/components/DownloadModal";

// TYPES
interface Props {
  onReset: () => void;
  onBetaSubmit?: (email: string) => Promise<void> | void;
  onSaveConversation?: () => void;
  enableConversationSave?: boolean;
}
type EmailStatus = "idle" | "submitting" | "success" | "error";

// STYLE CONSTANTS
const CARD_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFFAF3 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 8px 28px rgba(232,119,32,0.10)",
} as const;
const PRIMARY_CTA_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow: "0 6px 18px rgba(232,119,32,0.32)",
} as const;
const INPUT_DEFAULT_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid rgba(232,119,32,0.22)",
} as const;
const INPUT_FOCUS_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #E87720",
  boxShadow: "0 2px 12px rgba(232,119,32,0.18)",
} as const;

export default function SessionLimitScreen({
  onReset,
  onBetaSubmit,
  onSaveConversation,
  enableConversationSave = false,
}: Props) {
  // STATES
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [status, setStatus] = useState<EmailStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // FUNCTIONS
  const handleBetaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus("submitting");
    setErrorMsg(null);
    try {
      if (onBetaSubmit) {
        await onBetaSubmit(trimmed);
      } else {
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
          : "Hat nicht geklappt. Probier es gleich nochmal.",
      );
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={CARD_STYLE}
        className="mx-auto my-6 w-full max-w-md overflow-hidden rounded-2xl sm:my-8"
      >
        {/* MASCOT + COPY */}
        <div className="flex flex-col items-center px-6 pt-7 text-center sm:px-8 sm:pt-8">
          <div className="relative mb-4 h-20 w-20 sm:h-24 sm:w-24">
            <Image
              fill
              alt="Bea winkt"
              className="object-contain"
              src="/Maskottchen/Maskottchen-Herzen.webp"
            />
          </div>
          <h3 className="mb-1.5 text-lg font-bold text-darkerGray">
            Du warst richtig dabei. 🧡
          </h3>
          <p className="text-sm leading-relaxed text-lightGray">
            Das war die Demo. In der App quatschen wir unbegrenzt weiter, und
            ich kenne deinen Lernpfad, deine Ziele und deinen Fortschritt.
          </p>
        </div>

        {/* PRIMARY CTA */}
        <div className="px-6 pt-5 sm:px-8">
          <button
            type="button"
            onClick={() => setIsDownloadOpen(true)}
            style={PRIMARY_CTA_STYLE}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-white transition-transform hover:scale-[1.015]"
          >
            <Download className="h-4 w-4" />
            BeAFox App holen
          </button>
        </div>

        {/* SECONDARY CTA — Beta-Email */}
        <div className="px-6 pb-5 pt-4 sm:px-8">
          <AnimatePresence initial={false} mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 rounded-xl bg-green-50 px-3 py-2.5"
              >
                <Check
                  className="h-4 w-4 shrink-0 text-green-600"
                  strokeWidth={3}
                />
                <p className="text-xs font-semibold text-darkerGray">
                  Eingetragen! Ich melde mich, sobald dein Zugang offen ist.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-lightGray">
                  Oder: Early-Access sichern
                </p>
                <form
                  onSubmit={handleBetaSubmit}
                  className="flex flex-col gap-2 sm:flex-row"
                >
                  <div
                    style={isFocused ? INPUT_FOCUS_STYLE : INPUT_DEFAULT_STYLE}
                    className="flex flex-1 items-center rounded-full px-4 py-2.5 transition-all"
                  >
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
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-primaryOrange/30 bg-white px-5 py-2.5 text-sm font-bold text-primaryOrange transition-colors hover:bg-primaryOrange/5 disabled:opacity-60"
                  >
                    {status === "submitting" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Eintragen"
                    )}
                  </button>
                </form>
                {errorMsg && (
                  <p className="mt-2 text-[11px] font-semibold text-red-600">
                    {errorMsg}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TERTIARY ROW */}
        <div className="flex items-center justify-center gap-4 border-t border-primaryOrange/10 bg-white/50 px-6 py-3 text-xs sm:px-8">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 font-semibold text-lightGray transition-colors hover:text-primaryOrange"
          >
            <Plus className="h-3.5 w-3.5" />
            Neuer Chat
          </button>
          {enableConversationSave && onSaveConversation && (
            <>
              <span className="h-3 w-px bg-gray-300" aria-hidden="true" />
              <button
                type="button"
                onClick={onSaveConversation}
                className="inline-flex items-center gap-1.5 font-semibold text-lightGray transition-colors hover:text-primaryOrange"
              >
                <BookmarkPlus className="h-3.5 w-3.5" />
                Unterhaltung speichern
              </button>
            </>
          )}
        </div>
      </motion.div>

      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </>
  );
}

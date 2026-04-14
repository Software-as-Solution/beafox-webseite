"use client";

// ─────────────────────────────────────────────────────────────
// ConsentBanner — DSGVO-konformer Einwilligungsdialog
// ─────────────────────────────────────────────────────────────
// First-visit consent dialog with warm, human-centered UX.
//
// Design principles:
// - Details are ALWAYS visible, never hidden behind "expand" — users
//   shouldn't have to click to see what they're agreeing to.
// - Toggles instead of checkboxes — user feels in control.
// - Local toggle state, committed only on button click — no race
//   conditions between individual toggles and bulk accept/reject.
// - "Necessary" category shown at top as always-on — transparent
//   about what the user has no choice over.
// - Saved state with confirmation — clicking a button doesn't
//   feel like an abrupt dismissal.
// - Bea avatar in the header — consistent with the rest of the app.
// - Full a11y: role=dialog, focus management, scroll lock, keyboard
//   navigation, aria-describedby per purpose.
// ─────────────────────────────────────────────────────────────

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { useConsent } from "@/hooks/useConsent";
import type { ConsentPurpose } from "@/lib/analytics";
import { ConsentBadge, ConsentToggle, PURPOSES } from "./ConsentPrimitives";

// ═══════════════════════════════════════════════════════════
// STYLE CONSTANTS
// ═══════════════════════════════════════════════════════════

const BACKDROP_STYLE = {
  background: "rgba(0,0,0,0.28)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
} as const;

const PANEL_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(232,119,32,0.08)",
} as const;

const PRIMARY_BUTTON_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow: "0 8px 20px rgba(232,119,32,0.3)",
} as const;

const SECONDARY_BUTTON_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  color: "#161616",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
} as const;

const CARD_STYLE_INACTIVE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
} as const;

const CARD_STYLE_ACTIVE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  border: "1.5px solid rgba(232,119,32,0.35)",
  boxShadow: "0 2px 8px rgba(232,119,32,0.1)",
} as const;

const CARD_STYLE_NECESSARY = {
  background: "#F9FAFB",
  border: "1.5px solid #E5E7EB",
} as const;

const FOOTER_HINT_STYLE = {
  background: "rgba(232,119,32,0.04)",
  border: "1px dashed rgba(232,119,32,0.25)",
} as const;

// ═══════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════

const BANNER_OPEN_DELAY_MS = 600;
const SAVED_STATE_DURATION_MS = 1600;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type BannerPhase = "hidden" | "open" | "saved";

type SelectionState = Record<ConsentPurpose, boolean>;

// ═══════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════

/**
 * Lock body scroll while a dialog is open. Restores the original
 * overflow value on cleanup so we don't stomp on other style changes.
 */
function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

/**
 * Focus the first focusable element inside the ref when `active`
 * becomes true. Keeps keyboard users oriented when the dialog opens.
 */
function useAutoFocus(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    // Defer to next tick so the element is mounted and animations don't
    // fight our focus call
    const raf = requestAnimationFrame(() => {
      const first = ref.current?.querySelector<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [active, ref]);
}

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

// ─── Bea Avatar Header ─────────────────────────────────────

function BannerHeader({ title }: { title: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full md:h-12 md:w-12"
        style={{ background: "rgba(232,119,32,0.08)" }}
      >
        <Image
          src="/Maskottchen/Maskottchen-Hero.webp"
          alt="Bea"
          fill
          priority
          className="object-contain"
          sizes="48px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primaryOrange">
          Bea
        </span>
        <h2
          id="consent-title"
          className="text-base font-black leading-tight text-darkerGray md:text-lg"
        >
          {title}
        </h2>
      </div>
    </div>
  );
}

// ─── Necessary (always-on) Card ────────────────────────────

interface NecessaryCardProps {
  title: string;
  desc: string;
  badgeLabel: string;
}

function NecessaryCard({ title, desc, badgeLabel }: NecessaryCardProps) {
  return (
    <div style={CARD_STYLE_NECESSARY} className="rounded-xl p-3.5 md:p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-darkerGray md:text-[15px]">
              {title}
            </h3>
            <ConsentBadge type="necessary">{badgeLabel}</ConsentBadge>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-lightGray md:text-[13px]">
            {desc}
          </p>
        </div>
        <ConsentToggle
          id="consent-necessary"
          checked={true}
          disabled
          onChange={() => {}}
          label={title}
        />
      </div>
    </div>
  );
}

// ─── Purpose Card ──────────────────────────────────────────

interface PurposeCardProps {
  id: ConsentPurpose;
  title: string;
  desc: string;
  recommendation: "recommended" | "optional";
  recommendationLabel: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
}

function PurposeCard({
  id,
  title,
  desc,
  recommendation,
  recommendationLabel,
  checked,
  onToggle,
}: PurposeCardProps) {
  const descId = `consent-${id}-desc`;

  return (
    <div
      style={checked ? CARD_STYLE_ACTIVE : CARD_STYLE_INACTIVE}
      className="rounded-xl p-3.5 transition-all duration-200 md:p-4"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor={`consent-${id}`}
              className="cursor-pointer text-sm font-bold text-darkerGray md:text-[15px]"
            >
              {title}
            </label>
            <ConsentBadge type={recommendation}>
              {recommendationLabel}
            </ConsentBadge>
          </div>
          <p
            id={descId}
            className="mt-1 text-xs leading-relaxed text-lightGray md:text-[13px]"
          >
            {desc}
          </p>
        </div>
        <ConsentToggle
          id={`consent-${id}`}
          checked={checked}
          onChange={onToggle}
          label={title}
        />
      </div>
    </div>
  );
}

// ─── Saved State ───────────────────────────────────────────

interface SavedStateProps {
  title: string;
  message: string;
}

function SavedState({ title, message }: SavedStateProps) {
  return (
    <motion.div
      key="saved"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="flex flex-col items-center p-8 text-center md:p-10"
    >
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.1,
          type: "spring",
          stiffness: 220,
          damping: 14,
        }}
        className="relative mb-4 h-16 w-16 overflow-hidden rounded-full md:h-20 md:w-20"
      >
        <Image
          src="/Maskottchen/Maskottchen-Herzen.webp"
          alt="Bea"
          fill
          className="object-contain"
          sizes="80px"
        />
      </motion.div>
      <h3 className="mb-1.5 text-lg font-black text-darkerGray md:text-xl">
        {title}
      </h3>
      <p className="max-w-xs text-sm leading-relaxed text-lightGray md:text-[15px]">
        {message}
      </p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

/**
 * Build the initial local selection state from the current consent
 * hook state. Used on mount and when the banner opens.
 */
function buildInitialSelection(
  consent: ReturnType<typeof useConsent>["consent"],
): SelectionState {
  const next = {} as SelectionState;
  for (const p of PURPOSES) {
    next[p.id] = consent[p.id].granted && consent[p.id].revoked_at === null;
  }
  return next;
}

export default function ConsentBanner() {
  const t = useTranslations("consent");
  const { consent, hasDecision, setPurpose, acceptAll, rejectAll } =
    useConsent();

  const [phase, setPhase] = useState<BannerPhase>("hidden");
  const [selection, setSelection] = useState<SelectionState>(() =>
    buildInitialSelection(consent),
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const savedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ─── Open the banner on first visit ──────────────────────
  useEffect(() => {
    if (hasDecision || phase !== "hidden") return;
    const timer = setTimeout(() => {
      setSelection(buildInitialSelection(consent));
      setPhase("open");
    }, BANNER_OPEN_DELAY_MS);
    return () => clearTimeout(timer);
    // We intentionally only watch hasDecision here — consent is read
    // fresh via buildInitialSelection when the banner opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDecision]);

  // ─── Lifecycle: clear saved-state timer on unmount ───────
  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  // ─── Scroll lock + focus management ──────────────────────
  useBodyScrollLock(phase === "open");
  useAutoFocus(panelRef, phase === "open");

  // ─── Handlers ────────────────────────────────────────────
  const handleToggle = useCallback((id: ConsentPurpose, checked: boolean) => {
    setSelection((prev) => ({ ...prev, [id]: checked }));
  }, []);

  /** Transition to the saved state, then auto-close after a short delay. */
  const finishWithSavedState = useCallback(() => {
    setPhase("saved");
    savedTimerRef.current = setTimeout(() => {
      setPhase("hidden");
    }, SAVED_STATE_DURATION_MS);
  }, []);

  const handleAcceptAll = useCallback(() => {
    acceptAll();
    finishWithSavedState();
  }, [acceptAll, finishWithSavedState]);

  const handleRejectAll = useCallback(() => {
    rejectAll();
    finishWithSavedState();
  }, [rejectAll, finishWithSavedState]);

  const handleSaveSelection = useCallback(() => {
    // Commit all toggle states atomically — no race with individual
    // per-toggle saves during the session
    for (const p of PURPOSES) {
      setPurpose(p.id, selection[p.id]);
    }
    finishWithSavedState();
  }, [selection, setPurpose, finishWithSavedState]);

  // ─── Derived values ──────────────────────────────────────
  const isVisible = phase === "open" || phase === "saved";

  const getBadgeLabel = (rec: "recommended" | "optional") =>
    rec === "recommended" ? t("recommended_badge") : t("optional_badge");

  // ─── Render ──────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="consent-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={BACKDROP_STYLE}
            className="fixed inset-0 z-40"
            aria-hidden="true"
          />

          {/* Panel wrapper */}
          <motion.div
            key="consent-panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center px-3 pb-3 sm:items-center sm:px-4 sm:pb-4 md:pb-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-title"
            aria-describedby="consent-desc"
          >
            <div
              ref={panelRef}
              style={PANEL_STYLE}
              className="pointer-events-auto flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl sm:max-h-[88vh]"
            >
              <AnimatePresence mode="wait">
                {phase === "saved" ? (
                  <SavedState
                    key="saved-content"
                    title={t("saved.title")}
                    message={t("saved.message")}
                  />
                ) : (
                  <motion.div
                    key="open-content"
                    initial={false}
                    exit={{ opacity: 0 }}
                    className="flex min-h-0 flex-1 flex-col"
                  >
                    {/* ─── Scrollable content ─── */}
                    <div className="flex-1 overflow-y-auto p-5 md:p-6">
                      <BannerHeader title={t("title")} />

                      <p
                        id="consent-desc"
                        className="mb-5 mt-3 text-sm leading-relaxed text-lightGray md:text-[15px]"
                      >
                        {t("intro")}
                      </p>

                      {/* Items list */}
                      <div className="space-y-2.5">
                        <NecessaryCard
                          title={t("necessary.title")}
                          desc={t("necessary.desc")}
                          badgeLabel={t("always_on_badge")}
                        />

                        {PURPOSES.map((p) => (
                          <PurposeCard
                            key={p.id}
                            id={p.id}
                            title={t(p.titleKey)}
                            desc={t(p.descKey)}
                            recommendation={p.recommendation}
                            recommendationLabel={getBadgeLabel(
                              p.recommendation,
                            )}
                            checked={selection[p.id]}
                            onToggle={(checked) => handleToggle(p.id, checked)}
                          />
                        ))}
                      </div>

                      {/* Footer hint */}
                      <div
                        style={FOOTER_HINT_STYLE}
                        className="mt-5 flex flex-col gap-2 rounded-xl p-3.5 md:flex-row md:items-center md:justify-between md:gap-3"
                      >
                        <p className="text-[11px] leading-relaxed text-darkerGray/70 md:text-xs">
                          {t("footer.change_hint")}
                        </p>
                        <Link
                          href="/datenschutz"
                          className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-primaryOrange hover:underline md:text-xs"
                        >
                          {t("footer.privacy_link")}
                          <ExternalLink
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </div>

                    {/* ─── Sticky button row ─── */}
                    <div className="shrink-0 border-t border-[#F0E5D8] bg-white/80 p-4 backdrop-blur-sm md:p-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <button
                          type="button"
                          onClick={handleRejectAll}
                          style={SECONDARY_BUTTON_STYLE}
                          className="rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 md:text-[15px]"
                        >
                          {t("reject_all")}
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveSelection}
                          style={SECONDARY_BUTTON_STYLE}
                          className="rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 md:text-[15px]"
                        >
                          {t("save_selection")}
                        </button>
                        <button
                          type="button"
                          onClick={handleAcceptAll}
                          style={PRIMARY_BUTTON_STYLE}
                          className="rounded-full px-5 py-2.5 text-sm font-black text-white transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 md:text-[15px]"
                        >
                          {t("accept_all")}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

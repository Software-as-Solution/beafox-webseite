"use client";

// STANDARD COMPONENTS
import Link from "next/link";
import Image from "next/image";
// CUSTOM COMPONENTS
import { ConsentBadge, ConsentToggle } from "./ConsentPrimitives";
// IMPORTS
import { useTranslations } from "next-intl";
import { useConsent } from "@/hooks/useConsent";
import type { ConsentPurpose } from "@/lib/analytics";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
// ICONS
import { ChevronDown, ExternalLink, Settings2, X } from "lucide-react";

// TYPES
type CategoryId = "analytics" | "marketing";
type BannerPhase = "hidden" | "bar" | "expanded" | "saved";
type SelectionState = Record<CategoryId, boolean>;
interface CookieDetail {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
}
interface CategoryConfig {
  id: CategoryId;
  titleKey: string;
  descKey: string;
  recommendation: "recommended" | "optional";
  beaPurposes: readonly ConsentPurpose[];
  cookies: readonly CookieDetail[];
}
interface LegacyPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}
interface LegacyStored {
  date: string;
  version: string;
  preferences: LegacyPreferences;
}

// CONSTANTS
const REOPEN_EVENT = "openCookieSettings";
const LEGACY_STORAGE_KEY = "cookieConsent";
const LEGACY_CONSENT_VERSION = "1.0";
const BANNER_OPEN_DELAY_MS = 600;
const SAVED_STATE_DURATION_MS = 1400;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const CATEGORIES: readonly CategoryConfig[] = [
  {
    id: "analytics",
    titleKey: "category.analytics.title",
    descKey: "category.analytics.desc",
    recommendation: "recommended",
    beaPurposes: ["analytics", "profile_tracking"],
    cookies: [
      {
        name: "_ga",
        provider: "Google LLC",
        purpose: "Eindeutige Nutzer-ID für Statistiken",
        duration: "2 Jahre",
      },
      {
        name: "_ga_*",
        provider: "Google LLC",
        purpose: "Speichert Sitzungsstatus für GA4",
        duration: "2 Jahre",
      },
    ],
  },
  {
    id: "marketing",
    titleKey: "category.marketing.title",
    descKey: "category.marketing.desc",
    recommendation: "optional",
    beaPurposes: [],
    cookies: [
      {
        name: "_fbp",
        provider: "Meta Platforms Ireland Ltd.",
        purpose: "Conversion-Tracking und Retargeting",
        duration: "90 Tage",
      },
    ],
  },
] as const;

const NECESSARY_COOKIES: readonly CookieDetail[] = [
  {
    name: "cookieConsent",
    provider: "BeAFox",
    purpose: "Speichert deine Cookie-Einwilligung",
    duration: "365 Tage",
  },
  {
    name: "NEXT_LOCALE",
    provider: "BeAFox",
    purpose: "Speichert deine Spracheinstellung",
    duration: "1 Jahr",
  },
  {
    name: "beafox.consent",
    provider: "BeAFox",
    purpose: "Speichert deine Analyse-Einwilligung für Bea",
    duration: "localStorage",
  },
] as const;

// STYLE CONSTANTS
const TABLE_TOGGLE_STYLE = {
  color: "#E87720",
} as const;

const CARD_STYLE_NECESSARY = {
  background: "#F9FAFB",
  border: "1.5px solid #E5E7EB",
} as const;

const CARD_STYLE_INACTIVE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
} as const;

const FOOTER_HINT_STYLE = {
  background: "rgba(232,119,32,0.04)",
  border: "1px dashed rgba(232,119,32,0.25)",
} as const;

const SECONDARY_BUTTON_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  color: "#161616",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
} as const;

const PANEL_BACKDROP_STYLE = {
  background: "rgba(0,0,0,0.28)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
} as const;

const CARD_STYLE_ACTIVE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  border: "1.5px solid rgba(232,119,32,0.35)",
  boxShadow: "0 2px 8px rgba(232,119,32,0.1)",
} as const;

const PRIMARY_BUTTON_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow: "0 8px 20px rgba(232,119,32,0.3)",
} as const;

const PANEL_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(232,119,32,0.08)",
} as const;

const BAR_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow:
    "0 -4px 24px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(232,119,32,0.06)",
} as const;

// HELPERS FUNCTIONS
export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(REOPEN_EVENT));
}

function persistLegacyConsent(selection: SelectionState): void {
  if (typeof window === "undefined") return;
  const payload: LegacyStored = {
    version: LEGACY_CONSENT_VERSION,
    date: new Date().toISOString(),
    preferences: {
      necessary: true,
      analytics: selection.analytics,
      marketing: selection.marketing,
    },
  };
  try {
    window.localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Silent fail — Private Mode / Quota
  }
}

function updateGtagConsent(selection: SelectionState): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: selection.analytics ? "granted" : "denied",
    ad_storage: selection.marketing ? "granted" : "denied",
    ad_user_data: selection.marketing ? "granted" : "denied",
    ad_personalization: selection.marketing ? "granted" : "denied",
  });
}

function buildInitialSelection(
  consent: ReturnType<typeof useConsent>["consent"],
): SelectionState {
  const next = {} as SelectionState;
  for (const cat of CATEGORIES) {
    if (cat.beaPurposes.length === 0) {
      next[cat.id] = false;
    } else {
      const first = cat.beaPurposes[0];
      next[cat.id] =
        consent[first].granted && consent[first].revoked_at === null;
    }
  }
  return next;
}

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

function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const container = ref.current;

    const rafId = requestAnimationFrame(() => {
      const first = container.querySelector<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [active, ref]);
}

// SUBCOMPONENTS
function BannerHeader({ title }: { title: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full md:h-11 md:w-11"
        style={{ background: "rgba(232,119,32,0.08)" }}
        aria-hidden="true"
      >
        <Image
          src="/Maskottchen/Maskottchen-Hero.webp"
          alt=""
          fill
          priority
          className="object-contain"
          sizes="44px"
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

interface CookieTableProps {
  cookies: readonly CookieDetail[];
  label: string;
  headers: {
    name: string;
    provider: string;
    purpose: string;
    duration: string;
  };
}
function CookieTable({ cookies, label, headers }: CookieTableProps) {
  // STATES
  const [open, setOpen] = useState(false);

  if (cookies.length === 0) return null;

  return (
    <div className="mt-2.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={TABLE_TOGGLE_STYLE}
        className="inline-flex items-center gap-1 text-[11px] font-bold transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2"
        aria-expanded={open}
      >
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
        {label} ({cookies.length})
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="mt-2 overflow-x-auto rounded-lg border border-[#F0E5D8] bg-white/60">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-[#F0E5D8] text-left text-darkerGray">
                    <th className="px-2.5 py-2 font-semibold">
                      {headers.name}
                    </th>
                    <th className="px-2.5 py-2 font-semibold">
                      {headers.provider}
                    </th>
                    <th className="hidden px-2.5 py-2 font-semibold sm:table-cell">
                      {headers.purpose}
                    </th>
                    <th className="px-2.5 py-2 font-semibold">
                      {headers.duration}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cookies.map((c) => (
                    <tr
                      key={c.name}
                      className="border-b border-[#F0E5D8]/60 text-lightGray last:border-b-0"
                    >
                      <td className="px-2.5 py-2 font-mono text-darkerGray">
                        {c.name}
                      </td>
                      <td className="px-2.5 py-2">{c.provider}</td>
                      <td className="hidden px-2.5 py-2 sm:table-cell">
                        {c.purpose}
                      </td>
                      <td className="px-2.5 py-2">{c.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface NecessaryCardProps {
  title: string;
  desc: string;
  badgeLabel: string;
  cookieLabel: string;
  cookies: readonly CookieDetail[];
  tableHeaders: CookieTableProps["headers"];
}
function NecessaryCard({
  title,
  desc,
  badgeLabel,
  cookieLabel,
  cookies,
  tableHeaders,
}: NecessaryCardProps) {
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
          <CookieTable
            cookies={cookies}
            label={cookieLabel}
            headers={tableHeaders}
          />
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

interface CategoryCardProps {
  id: CategoryId;
  title: string;
  desc: string;
  checked: boolean;
  cookieLabel: string;
  recommendationLabel: string;
  recommendation: "recommended" | "optional";
  onToggle: (checked: boolean) => void;
  cookies: readonly CookieDetail[];
  tableHeaders: CookieTableProps["headers"];
}
function CategoryCard({
  id,
  title,
  desc,
  checked,
  cookieLabel,
  recommendationLabel,
  recommendation,
  onToggle,
  cookies,
  tableHeaders,
}: CategoryCardProps) {
  return (
    <motion.div
      layout
      style={checked ? CARD_STYLE_ACTIVE : CARD_STYLE_INACTIVE}
      className="rounded-xl p-3.5 transition-colors duration-200 md:p-4"
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
          <p className="mt-1 text-xs leading-relaxed text-lightGray md:text-[13px]">
            {desc}
          </p>
          <CookieTable
            cookies={cookies}
            label={cookieLabel}
            headers={tableHeaders}
          />
        </div>
        <ConsentToggle
          id={`consent-${id}`}
          checked={checked}
          onChange={onToggle}
          label={title}
        />
      </div>
    </motion.div>
  );
}

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
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className="flex items-center gap-3 p-4 md:justify-center md:p-5"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.08,
          type: "spring",
          stiffness: 240,
          damping: 14,
        }}
        className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full md:h-11 md:w-11"
        aria-hidden="true"
      >
        <Image
          src="/Maskottchen/Maskottchen-Herzen.webp"
          alt=""
          fill
          className="object-contain"
          sizes="44px"
        />
      </motion.div>
      <div className="min-w-0">
        <p className="text-sm font-black text-darkerGray">{title}</p>
        <p className="text-xs text-lightGray">{message}</p>
      </div>
    </motion.div>
  );
}

// CONSENT_BANNER
export default function ConsentBanner() {
  // HOOKS
  const t = useTranslations("consent");
  const { consent, hasDecision, setPurpose } = useConsent();
  const panelRef = useRef<HTMLDivElement>(null);
  const savedTimerRef = useRef<NodeJS.Timeout | null>(null);
  // STATES
  const [phase, setPhase] = useState<BannerPhase>("hidden");
  const [selection, setSelection] = useState<SelectionState>(() =>
    buildInitialSelection(consent),
  );
  // CONSTANTS
  const showBar = phase === "bar" || phase === "saved";
  const showExpanded = phase === "expanded";

  const barMessage = useMemo(() => {
    try {
      return t("bar.message");
    } catch {
      return t("intro");
    }
  }, [t]);

  const tableHeaders = useMemo(
    () => ({
      name: t("table.name"),
      provider: t("table.provider"),
      purpose: t("table.purpose"),
      duration: t("table.duration"),
    }),
    [t],
  );
  // FUNCTIONS
  const applySelection = useCallback(
    (values: SelectionState) => {
      for (const cat of CATEGORIES) {
        for (const p of cat.beaPurposes) {
          setPurpose(p, values[cat.id]);
        }
      }
      updateGtagConsent(values);
      persistLegacyConsent(values);
    },
    [setPurpose],
  );

  const finishWithSavedState = useCallback(() => {
    setPhase("saved");
    savedTimerRef.current = setTimeout(() => {
      setPhase("hidden");
    }, SAVED_STATE_DURATION_MS);
  }, []);

  const handleToggle = useCallback((id: CategoryId, checked: boolean) => {
    setSelection((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const handleAcceptAll = useCallback(() => {
    const all = {} as SelectionState;
    for (const cat of CATEGORIES) all[cat.id] = true;
    applySelection(all);
    finishWithSavedState();
  }, [applySelection, finishWithSavedState]);

  const handleRejectAll = useCallback(() => {
    const none = {} as SelectionState;
    for (const cat of CATEGORIES) none[cat.id] = false;
    applySelection(none);
    finishWithSavedState();
  }, [applySelection, finishWithSavedState]);

  const handleSaveSelection = useCallback(() => {
    applySelection(selection);
    finishWithSavedState();
  }, [applySelection, selection, finishWithSavedState]);

  const handleOpenSettings = useCallback(() => {
    setSelection(buildInitialSelection(consent));
    setPhase("expanded");
  }, [consent]);

  const handleCloseSettings = useCallback(() => {
    setPhase(hasDecision ? "hidden" : "bar");
  }, [hasDecision]);

  const getBadgeLabel = useCallback(
    (rec: "recommended" | "optional") =>
      rec === "recommended" ? t("recommended_badge") : t("optional_badge"),
    [t],
  );

  useEffect(() => {
    if (hasDecision || phase !== "hidden") return;
    const timer = setTimeout(() => {
      setSelection(buildInitialSelection(consent));
      setPhase("bar");
    }, BANNER_OPEN_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDecision]);

  useEffect(() => {
    const handler = () => {
      setSelection(buildInitialSelection(consent));
      setPhase("expanded");
    };
    window.addEventListener(REOPEN_EVENT, handler);
    return () => window.removeEventListener(REOPEN_EVENT, handler);
  }, [consent]);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "expanded") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhase(hasDecision ? "hidden" : "bar");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, hasDecision]);

  useBodyScrollLock(phase === "expanded");
  useFocusTrap(panelRef, phase === "expanded");

  return (
    <AnimatePresence>
      {/* ─── 1. COLLAPSED BAR ─── */}
      {showBar && (
        <motion.div
          key="consent-bar"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="fixed inset-x-0 bottom-0 z-[9998] flex justify-center px-3 pb-3 sm:px-4 sm:pb-4"
          role="region"
          aria-label={t("title")}
        >
          <div
            style={BAR_STYLE}
            className="pointer-events-auto w-full max-w-4xl overflow-hidden rounded-2xl"
          >
            <AnimatePresence mode="wait">
              {phase === "saved" ? (
                <SavedState
                  key="bar-saved"
                  title={t("saved.title")}
                  message={t("saved.message")}
                />
              ) : (
                <motion.div
                  key="bar-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3 p-3.5 sm:p-4 md:flex-row md:items-center md:gap-4"
                >
                  <div className="flex items-start gap-2.5 md:flex-1">
                    <div
                      className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full sm:h-9 sm:w-9"
                      style={{ background: "rgba(232,119,32,0.08)" }}
                      aria-hidden="true"
                    >
                      <Image
                        src="/Maskottchen/Maskottchen-Hero.webp"
                        alt=""
                        fill
                        priority
                        className="object-contain"
                        sizes="36px"
                      />
                    </div>
                    <p className="min-w-0 flex-1 text-xs leading-relaxed text-darkerGray sm:text-[13px]">
                      {barMessage}{" "}
                      <Link
                        href="/datenschutz"
                        className="font-bold text-primaryOrange hover:underline"
                      >
                        {t("footer.privacy_link")}
                      </Link>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 md:shrink-0">
                    <button
                      type="button"
                      onClick={handleRejectAll}
                      style={SECONDARY_BUTTON_STYLE}
                      className="flex-1 rounded-full px-3.5 py-2 text-xs font-bold transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 sm:flex-none sm:text-[13px]"
                    >
                      {t("reject_all")}
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenSettings}
                      style={SECONDARY_BUTTON_STYLE}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 sm:flex-none sm:text-[13px]"
                    >
                      <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {t("bar.manage")}
                    </button>
                    <button
                      type="button"
                      onClick={handleAcceptAll}
                      style={PRIMARY_BUTTON_STYLE}
                      className="flex-1 rounded-full px-4 py-2 text-xs font-black text-white transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 sm:flex-none sm:text-[13px]"
                    >
                      {t("accept_all")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* ─── 2. EXPANDED PANEL ─── */}
      {showExpanded && (
        <>
          <motion.div
            key="consent-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={PANEL_BACKDROP_STYLE}
            className="fixed inset-0 z-[9998]"
            aria-hidden="true"
            onClick={handleCloseSettings}
          />

          <motion.div
            key="consent-panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="pointer-events-none fixed inset-0 z-[9999] flex items-end justify-center px-3 pb-3 sm:items-center sm:px-4 sm:pb-4 md:pb-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-title"
            aria-describedby="consent-desc"
          >
            <div
              ref={panelRef}
              style={PANEL_STYLE}
              className="pointer-events-auto relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl sm:max-h-[88vh]"
            >
              <button
                type="button"
                onClick={handleCloseSettings}
                aria-label={t("bar.close_settings")}
                className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-darkerGray/50 transition-colors hover:bg-black/5 hover:text-darkerGray focus:outline-none focus:ring-2 focus:ring-primaryOrange md:right-4 md:top-4"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto p-5 md:p-6">
                  <BannerHeader title={t("title")} />

                  <p
                    id="consent-desc"
                    className="mb-5 mt-3 text-sm leading-relaxed text-lightGray md:text-[15px]"
                  >
                    {t("intro")}
                  </p>

                  <div className="space-y-2.5">
                    <NecessaryCard
                      title={t("necessary.title")}
                      desc={t("necessary.desc")}
                      badgeLabel={t("always_on_badge")}
                      cookieLabel={t("cookie_list")}
                      cookies={NECESSARY_COOKIES}
                      tableHeaders={tableHeaders}
                    />

                    {CATEGORIES.map((cat) => (
                      <CategoryCard
                        key={cat.id}
                        id={cat.id}
                        title={t(cat.titleKey)}
                        desc={t(cat.descKey)}
                        checked={selection[cat.id]}
                        cookieLabel={t("cookie_list")}
                        recommendationLabel={getBadgeLabel(cat.recommendation)}
                        recommendation={cat.recommendation}
                        onToggle={(checked) => handleToggle(cat.id, checked)}
                        cookies={cat.cookies}
                        tableHeaders={tableHeaders}
                      />
                    ))}
                  </div>

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
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

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
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// GLOBAL AUGMENTATIONS
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, string>,
    ) => void;
  }
}

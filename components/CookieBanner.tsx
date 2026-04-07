"use client";

// IMPORTS
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
// ICONS
import { X, Cookie, Settings, CheckCircle } from "lucide-react";

// CONSTANTS
const BANNER_DELAY_MS = 300;
const CONSENT_VERSION = "1.0";
const CONSENT_EXPIRY_DAYS = 365;
const STORAGE_KEY = "cookieConsent";
const REOPEN_EVENT = "openCookieSettings";

// TYPES
interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}
interface StoredConsent {
  date: string;
  version: string;
  preferences: CookiePreferences;
}
interface CookieDetail {
  name: string;
  purpose: string;
  provider: string;
  duration: string;
}
// CONSTANTS
const COOKIE_DETAILS: Record<keyof CookiePreferences, CookieDetail[]> = {
  necessary: [
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
  ],
  analytics: [
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
  marketing: [
    {
      name: "_fbp",
      provider: "Meta Platforms Ireland Ltd.",
      purpose: "Conversion-Tracking und Retargeting",
      duration: "90 Tage",
    },
  ],
};
// HELPER FUNCTIONS
function loadConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (!parsed.preferences || !parsed.version) return null;
    return parsed;
  } catch {
    return null;
  }
}
function isConsentValid(stored: StoredConsent): boolean {
  if (stored.version !== CONSENT_VERSION) return false;

  const consentDate = new Date(stored.date);
  const now = new Date();
  const diffDays =
    (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays < CONSENT_EXPIRY_DAYS;
}
function persistConsent(preferences: CookiePreferences): void {
  const consent: StoredConsent = {
    preferences,
    version: CONSENT_VERSION,
    date: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // localStorage unavailable
  }
}
function updateGtagConsent(preferences: CookiePreferences): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("consent", "update", {
    analytics_storage: preferences.analytics ? "granted" : "denied",
    ad_storage: preferences.marketing ? "granted" : "denied",
    ad_user_data: preferences.marketing ? "granted" : "denied",
    ad_personalization: preferences.marketing ? "granted" : "denied",
  });
}

// PUBLIC API — used by Footer to reopen the settings modal
export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(REOPEN_EVENT));
}

export default function CookieBanner() {
  // HOOKS
  const t = useTranslations("cookie");
  // STATES
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  // REFS
  const modalRef = useRef<HTMLDivElement>(null);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // CONSTANTS
  const slideVariants = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 100, opacity: 0 },
      };

  const scaleVariants = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { scale: 0.92, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.92, opacity: 0 },
      };
  // FUNCTIONS
  const saveAndClose = useCallback((prefs: CookiePreferences) => {
    persistConsent(prefs);
    updateGtagConsent(prefs);
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
  }, []);
  const handleAcceptAll = useCallback(() => {
    saveAndClose({ necessary: true, analytics: true, marketing: true });
  }, [saveAndClose]);
  const handleRejectAll = useCallback(() => {
    saveAndClose({ necessary: true, analytics: false, marketing: false });
  }, [saveAndClose]);
  const handleSavePreferences = useCallback(() => {
    saveAndClose(preferences);
  }, [saveAndClose, preferences]);
  const togglePreference = useCallback((key: keyof CookiePreferences) => {
    if (key === "necessary") return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);
  // USE EFFECT
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  useEffect(() => {
    const stored = loadConsent();

    if (stored && isConsentValid(stored)) {
      setPreferences(stored.preferences);
      updateGtagConsent(stored.preferences);
    } else {
      bannerTimerRef.current = setTimeout(
        () => setShowBanner(true),
        BANNER_DELAY_MS,
      );
    }

    return () => {
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    };
  }, []);
  // Listen for global "openCookieSettings" event (triggered from Footer)
  useEffect(() => {
    const handler = () => {
      const stored = loadConsent();
      if (stored?.preferences) {
        setPreferences(stored.preferences);
      }
      setShowSettings(true);
    };
    window.addEventListener(REOPEN_EVENT, handler);
    return () => window.removeEventListener(REOPEN_EVENT, handler);
  }, []);
  useEffect(() => {
    if (showSettings) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSettings]);
  useEffect(() => {
    if (!showSettings && !showBanner) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showSettings) {
          setShowSettings(false);
        }
        // Don't close banner on escape — user must make a choice
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showSettings, showBanner]);

  return (
    <>
      <AnimatePresence>
        {showBanner && !showSettings && (
          <motion.div
            {...slideVariants}
            exit="exit"
            role="region"
            initial="initial"
            animate="animate"
            aria-label={t("banner.title")}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-[9998] bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Icon & Text */}
                <div className="flex items-start gap-3 flex-1">
                  <div className="bg-primaryOrange/10 rounded-full p-2.5 flex-shrink-0">
                    <Cookie
                      aria-hidden="true"
                      className="w-5 h-5 text-primaryOrange"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-darkerGray mb-1 text-base">
                      {t("banner.title")}
                    </h3>
                    <p className="text-lightGray text-sm leading-relaxed">
                      {t("banner.text")}{" "}
                      <Link
                        href="/datenschutz"
                        className="text-primaryOrange hover:underline font-medium"
                      >
                        {t("banner.more")}
                      </Link>
                    </p>
                  </div>
                </div>
                {/* Buttons — visually equivalent (DSGVO compliant) */}
                <div className="flex flex-col gap-2.5 w-full md:w-auto md:flex-row md:items-center">
                  {/* Settings — separate group, less visual weight by design */}
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-5 py-2.5 text-darkerGray rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm whitespace-nowrap inline-flex items-center justify-center gap-1.5 underline-offset-4 hover:underline"
                  >
                    <Settings className="w-3.5 h-3.5" aria-hidden="true" />
                    {t("banner.settings")}
                  </button>
                  {/* Reject + Accept — ALWAYS together, ALWAYS equivalent */}
                  <div className="flex gap-2.5 w-full md:w-auto">
                    <button
                      onClick={handleRejectAll}
                      className="flex-1 md:flex-none px-5 py-2.5 border-2 border-darkerGray/25 text-darkerGray rounded-full font-semibold hover:border-darkerGray/50 hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
                    >
                      {t("banner.reject")}
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 md:flex-none px-5 py-2.5 border-2 border-primaryOrange text-primaryOrange rounded-full font-semibold hover:bg-primaryOrange/5 transition-colors text-sm whitespace-nowrap"
                    >
                      {t("banner.acceptAll")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ═══ COOKIE SETTINGS MODAL ═══ */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            role="presentation"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowSettings(false)}
            className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              {...scaleVariants}
              exit="exit"
              role="dialog"
              ref={modalRef}
              initial="initial"
              animate="animate"
              aria-modal="true"
              aria-label={t("modal.title")}
              onClick={(e) => e.stopPropagation()}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="bg-primaryOrange/10 rounded-full p-2">
                    <Settings
                      aria-hidden="true"
                      className="w-4 h-4 text-primaryOrange"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-darkerGray">
                    {t("modal.title")}
                  </h2>
                </div>
                <button
                  aria-label="Einstellungen schließen"
                  onClick={() => setShowSettings(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              {/* Content */}
              <div className="p-6 space-y-5">
                <p className="text-lightGray text-sm leading-relaxed">
                  {t("modal.intro")}{" "}
                  <Link
                    href="/datenschutz"
                    className="text-primaryOrange hover:underline font-medium"
                  >
                    {t("modal.privacy")}
                  </Link>
                  .
                </p>
                {/* ── Cookie Categories ── */}
                {(["necessary", "analytics", "marketing"] as const).map(
                  (key) => {
                    const locked = key === "necessary";
                    const cookies = COOKIE_DETAILS[key];
                    return (
                      <CookieCategory
                        key={key}
                        locked={locked}
                        categoryKey={key}
                        cookies={cookies}
                        enabled={preferences[key]}
                        title={t(`modal.${key}.title`)}
                        description={t(`modal.${key}.text`)}
                        lockedLabel={t("modal.necessary.alwaysOn")}
                        cookieListLabel={t("modal.cookieList")}
                        tableHeaders={{
                          name: t("modal.table.name"),
                          purpose: t("modal.table.purpose"),
                          provider: t("modal.table.provider"),
                          duration: t("modal.table.duration"),
                        }}
                        onToggle={() => togglePreference(key)}
                      />
                    );
                  },
                )}
                {/* Save Buttons */}
                <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-5 py-2 border border-gray-200 text-darkerGray rounded-full font-semibold hover:bg-gray-50 transition-colors text-sm"
                  >
                    {t("modal.cancel")}
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-5 py-2 border-2 border-primaryOrange text-primaryOrange rounded-full font-semibold hover:bg-primaryOrange/5 transition-colors text-sm"
                  >
                    {t("modal.save")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// SUBCOMPONENTS
interface CookieCategoryProps {
  title: string;
  locked: boolean;
  enabled: boolean;
  description: string;
  lockedLabel: string;
  cookies: CookieDetail[];
  cookieListLabel: string;
  categoryKey: keyof CookiePreferences;
  tableHeaders: {
    name: string;
    purpose: string;
    provider: string;
    duration: string;
  };
  onToggle: () => void;
}
function CookieCategory({
  title,
  locked,
  enabled,
  cookies,
  categoryKey,
  description,
  lockedLabel,
  tableHeaders,
  cookieListLabel,
  onToggle,
}: CookieCategoryProps) {
  // STATES
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {locked && (
            <CheckCircle
              aria-hidden="true"
              className="w-4 h-4 text-primaryOrange"
            />
          )}
          <h3 className="font-bold text-darkerGray text-sm">{title}</h3>
        </div>
        {locked ? (
          <span className="bg-primaryOrange/10 text-primaryOrange px-3 py-0.5 rounded-full text-[11px] font-semibold">
            {lockedLabel}
          </span>
        ) : (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              aria-label={title}
              onChange={onToggle}
              className="sr-only peer"
            />
            <div className="w-10 h-[22px] bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primaryOrange/30 rounded-full peer peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-primaryOrange" />
          </label>
        )}
      </div>
      <p className="text-lightGray text-xs leading-relaxed mb-2">
        {description}
      </p>
      {/* Cookie list expandable details */}
      {cookies.length > 0 && (
        <details
          open={expanded}
          className="mt-2"
          onToggle={(e) => setExpanded((e.target as HTMLDetailsElement).open)}
        >
          <summary className="text-[11px] font-semibold text-primaryOrange cursor-pointer hover:underline list-none flex items-center gap-1">
            <span>
              {expanded ? "▾" : "▸"} {cookieListLabel} ({cookies.length})
            </span>
          </summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-gray-200 text-left text-darkerGray">
                  <th className="pb-2 pr-3 font-semibold">
                    {tableHeaders.name}
                  </th>
                  <th className="pb-2 pr-3 font-semibold">
                    {tableHeaders.provider}
                  </th>
                  <th className="pb-2 pr-3 font-semibold">
                    {tableHeaders.purpose}
                  </th>
                  <th className="pb-2 font-semibold">
                    {tableHeaders.duration}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cookies.map((cookie) => (
                  <tr
                    key={`${categoryKey}-${cookie.name}`}
                    className="border-b border-gray-100 last:border-b-0 text-lightGray"
                  >
                    <td className="py-2 pr-3 font-mono text-darkerGray">
                      {cookie.name}
                    </td>
                    <td className="py-2 pr-3">{cookie.provider}</td>
                    <td className="py-2 pr-3">{cookie.purpose}</td>
                    <td className="py-2">{cookie.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}

// GLOBAL TYPE FOR GTAG (GA4 CONSENT MODE V2)
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, string>,
    ) => void;
  }
}

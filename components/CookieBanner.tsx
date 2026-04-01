"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, Settings, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

// CONSTANTS
const BANNER_DELAY_MS = 1000;
const CONSENT_VERSION = "1.0";
const CONSENT_EXPIRY_DAYS = 365;
const STORAGE_KEY = "cookieConsent";
const STORAGE_DATE_KEY = "cookieConsentDate";
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
  // Check version match
  if (stored.version !== CONSENT_VERSION) return false;

  // Check expiry
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
    localStorage.setItem(STORAGE_DATE_KEY, consent.date);
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
            role="dialog"
            initial="initial"
            animate="animate"
            aria-modal="false"
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
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-5 py-2 border border-primaryOrange/30 text-primaryOrange rounded-full font-semibold hover:bg-primaryOrange/5 transition-colors text-sm whitespace-nowrap inline-flex items-center justify-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5" aria-hidden="true" />
                    {t("banner.settings")}
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-5 py-2 border border-gray-200 text-darkerGray rounded-full font-semibold hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
                  >
                    {t("banner.reject")}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-5 py-2 bg-primaryOrange text-white rounded-full font-semibold hover:bg-primaryOrange/90 transition-colors text-sm whitespace-nowrap"
                    style={{
                      boxShadow: "0 2px 8px rgba(232,119,32,0.25)",
                    }}
                  >
                    {t("banner.acceptAll")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ═══ Cookie Settings Modal ═══ */}
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
              ref={modalRef}
              {...scaleVariants}
              exit="exit"
              role="dialog"
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
                      className="w-4 h-4 text-primaryOrange"
                      aria-hidden="true"
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
                {[
                  {
                    locked: true,
                    key: "necessary" as const,
                    icon: (
                      <CheckCircle
                        className="w-4 h-4 text-primaryOrange"
                        aria-hidden="true"
                      />
                    ),
                  },
                  { key: "analytics" as const, locked: false, icon: null },
                  { key: "marketing" as const, locked: false, icon: null },
                ].map((category) => (
                  <div
                    key={category.key}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <h3 className="font-bold text-darkerGray text-sm">
                          {t(`modal.${category.key}.title`)}
                        </h3>
                      </div>
                      {category.locked ? (
                        <span className="bg-primaryOrange/10 text-primaryOrange px-3 py-0.5 rounded-full text-[11px] font-semibold">
                          {t("modal.necessary.alwaysOn")}
                        </span>
                      ) : (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={preferences[category.key]}
                            aria-label={t(`modal.${category.key}.title`)}
                            onChange={() => togglePreference(category.key)}
                          />
                          <div className="w-10 h-[22px] bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primaryOrange/30 rounded-full peer peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-primaryOrange" />
                        </label>
                      )}
                    </div>
                    <p className="text-lightGray text-xs leading-relaxed">
                      {t(`modal.${category.key}.text`)}
                    </p>
                  </div>
                ))}
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
                    className="px-5 py-2 bg-primaryOrange text-white rounded-full font-semibold hover:bg-primaryOrange/90 transition-colors text-sm"
                    style={{
                      boxShadow: "0 2px 8px rgba(232,119,32,0.25)",
                    }}
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

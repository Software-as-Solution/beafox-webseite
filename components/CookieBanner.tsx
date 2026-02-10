"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, Settings, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const t = useTranslations("cookie");
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Immer aktiviert
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Prüfe ob Cookie-Einstellungen bereits gespeichert sind
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Zeige Banner nach kurzer Verzögerung
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Lade gespeicherte Präferenzen
      try {
        const savedPreferences = JSON.parse(cookieConsent);
        setPreferences(savedPreferences);
      } catch (e) {
        // Fallback falls Parsing fehlschlägt
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(onlyNecessary);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookieConsent", JSON.stringify(prefs));
    localStorage.setItem("cookieConsentDate", new Date().toISOString());

    // Google Analytics basierend auf Präferenzen aktivieren/deaktivieren
    if (prefs.analytics) {
      // Google Analytics aktivieren
      if (window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
        });
      } else {
        // Lade Google Analytics Script falls noch nicht geladen
        const script = document.createElement("script");
        script.src = "https://www.googletagmanager.com/gtag/js?id=G-J0GWX92CNH";
        script.async = true;
        document.head.appendChild(script);

        // Warte bis Script geladen ist
        script.onload = () => {
          if (window.gtag) {
            window.gtag("consent", "default", {
              analytics_storage: "granted",
            });
            window.gtag("config", "G-J0GWX92CNH");
          }
        };
      }
    } else {
      // Google Analytics deaktivieren
      if (window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "denied",
        });
      }
    }
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === "necessary") return; // Notwendige Cookies können nicht deaktiviert werden
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primaryOrange shadow-2xl"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Cookie Icon & Text */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-primaryOrange/10 rounded-full p-3 flex-shrink-0">
                    <Cookie className="w-6 h-6 text-primaryOrange" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-darkerGray mb-2 text-lg">
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
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={handleOpenSettings}
                    className="px-6 py-2.5 border-2 border-primaryOrange text-primaryOrange rounded-full font-semibold hover:bg-primaryOrange/10 transition-colors text-sm whitespace-nowrap"
                  >
                    <Settings className="w-4 h-4 inline-block mr-2" />
                    {t("banner.settings")}
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-6 py-2.5 border-2 border-gray-300 text-darkerGray rounded-full font-semibold hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
                  >
                    {t("banner.reject")}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-2.5 bg-primaryOrange text-white rounded-full font-semibold hover:bg-primaryOrange/90 transition-colors text-sm whitespace-nowrap shadow-lg"
                  >
                    {t("banner.acceptAll")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b-2 border-primaryOrange px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primaryOrange/10 rounded-full p-2">
                    <Settings className="w-5 h-5 text-primaryOrange" />
                  </div>
                  <h2 className="text-2xl font-bold text-darkerGray">
                    {t("modal.title")}
                  </h2>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-lightGray hover:text-darkerGray transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
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

                {/* Necessary Cookies */}
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primaryOrange" />
                      <h3 className="font-bold text-darkerGray">
                        {t("modal.necessary.title")}
                      </h3>
                    </div>
                    <span className="bg-primaryOrange/10 text-primaryOrange px-3 py-1 rounded-full text-xs font-semibold">
                      {t("modal.necessary.alwaysOn")}
                    </span>
                  </div>
                  <p className="text-lightGray text-sm mt-2">
                    {t("modal.necessary.text")}
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-darkerGray">
                        {t("modal.analytics.title")}
                      </h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => handleTogglePreference("analytics")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primaryOrange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primaryOrange"></div>
                    </label>
                  </div>
                  <p className="text-lightGray text-sm mt-2">
                    {t("modal.analytics.text")}
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-darkerGray">
                        {t("modal.marketing.title")}
                      </h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => handleTogglePreference("marketing")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primaryOrange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primaryOrange"></div>
                    </label>
                  </div>
                  <p className="text-lightGray text-sm mt-2">
                    {t("modal.marketing.text")}
                  </p>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-2.5 border-2 border-gray-300 text-darkerGray rounded-full font-semibold hover:bg-gray-50 transition-colors"
                  >
                    {t("modal.cancel")}
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-2.5 bg-primaryOrange text-white rounded-full font-semibold hover:bg-primaryOrange/90 transition-colors shadow-lg"
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

// TypeScript Declaration für gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: {
        [key: string]: string;
      }
    ) => void;
  }
}

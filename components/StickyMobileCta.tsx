"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
// ICONS
import { ArrowRight } from "lucide-react";

// TYPES
type Platform = "ios" | "android" | "desktop";
// CONSTANTS
const FOOTER_OFFSET = 300;
const SCROLL_THRESHOLD = 500;
const DISMISS_KEY = "beafox_cta_dismissed";
const MOBILE_QUERY = "(max-width: 1023px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const APP_STORE_URL = "https://apps.apple.com/de/app/beafox/id6746110612";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.tapelea.beafox&pcampaignid=web_share";
const CONTAINER_STYLE = {
  border: "1px solid rgba(232,119,32,0.15)",
  boxShadow: "0 -2px 24px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)",
} as const;
const CTA_BUTTON_STYLE = {
  boxShadow: "0 4px 14px rgba(232,119,32,0.25)",
} as const;
// HELPER FUNCTIONS
function getPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

// COMPONENT
export default function StickyMobileCTA() {
  // HOOKS
  const t = useTranslations("home.stickyMobileCta");
  // STATES
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  // REFS
  const rafRef = useRef<number | null>(null);
  const hasTrackedImpression = useRef(false);
  // CONSTANTS
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  }, []);
  // FUNCTIONS
  const handleScroll = useCallback(() => {
    if (isDismissed) return;

    // rAF throttle — skip if a frame is already queued
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const nearBottom = scrollY + viewportHeight > docHeight - FOOTER_OFFSET;
      const next = scrollY > SCROLL_THRESHOLD && !nearBottom;
      setIsVisible((prev) => (prev === next ? prev : next));
    });
  }, [isDismissed]);
  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // sessionStorage unavailable
    }
  }, []);
  const handleDownload = useCallback(() => {
    const platform = getPlatform();
    if (platform === "ios") {
      window.location.href = APP_STORE_URL;
    } else if (platform === "android") {
      window.location.href = PLAY_STORE_URL;
    } else {
      const el = document.getElementById("download-banner");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  // EFFECTS
  // Check dismiss state from sessionStorage
  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "true") {
        setIsDismissed(true);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);
  // Mobile detection via MediaQuery
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  // Scroll listener with rAF cleanup
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [handleScroll]);
  // Impression tracking
  useEffect(() => {
    if (isVisible && !hasTrackedImpression.current) {
      hasTrackedImpression.current = true;
      // trackEvent("sticky_cta_impression");
    }
  }, [isVisible]);

  // Early return for desktop
  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          role="complementary"
          aria-label={t("regionAria")}
          className="fixed left-0 right-0"
          style={{ bottom: 0, zIndex: 9999 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          exit={prefersReducedMotion ? { opacity: 0 } : { y: 100, opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
          initial={
            prefersReducedMotion ? { opacity: 0 } : { y: 100, opacity: 0 }
          }
        >
          <div
            className="mx-3 mb-3 rounded-2xl px-3 py-2.5 bg-white"
            style={{
              ...CONTAINER_STYLE,
              marginBottom: "calc(env(safe-area-inset-bottom, 8px) + 12px)",
            }}
          >
            <div className="flex items-center gap-2.5">
              {/* App icon */}
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-primaryOrange/20">
                <Image
                  width={40}
                  height={40}
                  loading="lazy"
                  src="/Logo.png"
                  alt="BeAFox App Icon"
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-darkerGray leading-tight truncate">
                  {t("title")}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div
                    className="flex items-center"
                    aria-label={t("ratingLabel")}
                  >
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="11"
                        height="11"
                        stroke="none"
                        fill="#F97316"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] text-lightGray ml-0.5">5.0</span>
                </div>
              </div>
              {/* CTA Button */}
              <button
                onClick={handleDownload}
                style={CTA_BUTTON_STYLE}
                aria-label={t("ctaAria")}
                className="flex items-center gap-1 bg-primaryOrange text-white text-[13px] font-bold pl-4 pr-3 py-2 rounded-xl flex-shrink-0 active:scale-95 transition-transform"
              >
                {t("ctaButton")}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              aria-label={t("dismissAria")}
              className="w-full text-center mt-1.5 text-[10px] text-gray-400 hover:text-gray-500 transition-colors"
            >
              {t("dismiss")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

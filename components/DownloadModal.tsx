"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { useTranslations } from "next-intl";
import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// ICONS
import { X, Sparkles, Zap } from "lucide-react";
// ANALYTICS
import { trackDownloadClick } from "@/components/AhrefsAnalytics";

// TYPES
interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppStoreClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
// CONSTANTS
const APP_STORE_URL = "https://apps.apple.com/de/app/beafox/id6746110612";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.tapelea.beafox&pcampaignid=web_share";
const MODAL_STYLE = {
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 65%, #FFF2E8 100%)",
  border: "1px solid rgba(232,119,32,0.2)",
  boxShadow: "0 24px 64px rgba(0,0,0,0.08), 0 0 0 1px rgba(232,119,32,0.06)",
} as const;
const GLOW_TOP_STYLE = {
  background:
    "radial-gradient(circle, rgba(232,119,32,0.12) 0%, transparent 70%)",
} as const;
const GLOW_BOTTOM_STYLE = {
  background:
    "radial-gradient(circle, rgba(232,119,32,0.07) 0%, transparent 70%)",
} as const;
const GRID_PATTERN_STYLE = {
  backgroundImage:
    "linear-gradient(rgba(232,119,32,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(232,119,32,0.12) 1px, transparent 1px)",
  backgroundSize: "42px 42px",
} as const;
const SPARKLE_BADGE_STYLE = {
  boxShadow: "0 4px 12px rgba(232,119,32,0.4)",
} as const;
const DIVIDER_STYLE = {
  background: "rgba(73,73,73,0.2)",
} as const;
const FEATURE_PILLS = [
  { label: "100% kostenlos", icon: Zap },
  { label: "KI-personalisiert", icon: Sparkles },
] as const;

export default function DownloadModal({
  isOpen,
  onClose,
  onAppStoreClick,
}: DownloadModalProps) {
  // HOOKS
  const tHome = useTranslations("home");
  const t = useTranslations("downloadModal");
  // FUNCTIONS
  const handleAppStoreClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onAppStoreClick?.(e);
    },
    [onAppStoreClick],
  );
  // EFFECTS
  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          onClick={onClose}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          aria-labelledby="download-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            style={MODAL_STYLE}
            onClick={(e) => e.stopPropagation()}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative max-w-md w-full overflow-hidden rounded-3xl"
          >
            {/* DECORATIVE GLOWS */}
            <div
              aria-hidden="true"
              style={GLOW_TOP_STYLE}
              className="absolute -top-32 -right-32 w-[380px] h-[380px] rounded-full pointer-events-none"
            />
            <div
              aria-hidden="true"
              style={GLOW_BOTTOM_STYLE}
              className="absolute -bottom-24 -left-24 w-[320px] h-[320px] rounded-full pointer-events-none"
            />
            {/* GRID PATTERN */}
            <div
              aria-hidden="true"
              style={GRID_PATTERN_STYLE}
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
            />
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              aria-label={t("closeAria")}
              className="absolute top-4 right-4 z-20 p-1.5 rounded-full border border-primaryOrange/20 bg-primaryWhite/70 hover:bg-primaryOrange/10 transition-colors"
            >
              <X className="w-4 h-4 text-darkerGray/60" aria-hidden="true" />
            </button>
            {/* CONTENT */}
            <div className="relative z-10 px-6 pt-8 pb-6 md:px-8 md:pt-10 md:pb-8">
              {/* Mascot + Sparkle */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primaryOrange/30 flex items-center justify-center">
                    <Image
                      width={70}
                      height={70}
                      alt="BeAFox"
                      className="object-contain"
                      src="/assets/Logos/Logo.webp"
                    />
                  </div>
                  <motion.div
                    aria-hidden="true"
                    style={SPARKLE_BADGE_STYLE}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-primaryOrange flex items-center justify-center"
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
              </div>
              {/* Title */}
              <h2
                id="download-modal-title"
                className="text-2xl md:text-3xl font-bold text-center mb-3 text-darkerGray"
              >
                Dein Begleiter
                <br />
                <span className="text-primaryOrange">wartet auf dich.</span>
              </h2>
              {/* Feature pills */}
              <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                {FEATURE_PILLS.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-primaryOrange/10 border border-primaryOrange/20 text-primaryOrange"
                  >
                    <Icon className="w-3 h-3" aria-hidden="true" />
                    {label}
                  </div>
                ))}
              </div>
              {/* Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5 items-stretch">
                <a
                  target="_blank"
                  href={APP_STORE_URL}
                  rel="noopener noreferrer"
                  onClick={(e) => { handleAppStoreClick(e); trackDownloadClick("ios"); }}
                  className="flex-1 min-w-[190px] flex items-center gap-2 md:gap-4 justify-center md:justify-start rounded-lg border border-darkerGray/20 p-2 bg-white/80 hover:scale-[1.02] transition-transform"
                >
                  <Image
                    width={160}
                    height={52}
                    src="/assets/Apple.webp"
                    alt={tHome("downloadBanner.storeBadges.appleAlt")}
                    className="object-contain w-[40px] h-auto shrink-0"
                  />
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-darkerGray text-left">
                    {tHome("downloadBanner.storeLabels.apple")}
                  </span>
                </a>
                <a
                  target="_blank"
                  href={PLAY_STORE_URL}
                  rel="noopener noreferrer"
                  onClick={(e) => { handleAppStoreClick(e); trackDownloadClick("android"); }}
                  className="flex-1 min-w-[190px] flex items-center gap-2 md:gap-4 justify-center md:justify-start rounded-lg border border-darkerGray/20 p-2 bg-white/80 hover:scale-[1.02] transition-transform"
                >
                  <Image
                    width={160}
                    height={52}
                    src="/assets/Android.webp"
                    alt={tHome("downloadBanner.storeBadges.googleAlt")}
                    className="object-contain w-[40px] h-auto shrink-0"
                  />
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-darkerGray text-left">
                    {tHome("downloadBanner.storeLabels.google")}
                  </span>
                </a>
              </div>
              {/* Social proof */}
              <div className="flex items-center justify-center gap-3">
                <div
                  className="flex items-center gap-1"
                  aria-label="Bewertung 5 von 5 Sternen"
                >
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="14"
                      height="14"
                      stroke="none"
                      fill="#F97316"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="text-darkerGray/70 text-xs font-semibold ml-1">
                    5.0
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  style={DIVIDER_STYLE}
                  className="w-px h-3.5 rounded-full"
                />
                <span className="text-darkerGray/45 text-xs">
                  10.000+ aktive Nutzer
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

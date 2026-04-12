"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";
// ICONS
import { Sparkles } from "lucide-react";
// COMPONENTS
import TrustBadge from "./Trustbadge";

// TYPES
interface StoreButtonsConfig {
  appleAlt: string;
  googleAlt: string;
  appleLabel: string;
  appStoreUrl: string;
  googleLabel: string;
  playStoreUrl: string;
}
interface LandingHeroProps {
  badge: string;
  mascotSrc: string;
  mascotAlt: string;
  title: React.ReactNode;
  mascotClassName?: string;
  contentClassName?: string;
  actions?: React.ReactNode;
  description?: React.ReactNode;
  storeButtons?: StoreButtonsConfig;
}
// CONSTANTS
const GLOW_STYLE = {
  background: "rgba(232,119,32,0.1)",
} as const;
const STORE_BUTTON_STYLE = {
  border: "1px solid rgba(232,119,32,0.2)",
  boxShadow: "0 8px 24px rgba(232,119,32,0.1), 0 2px 4px rgba(0,0,0,0.04)",
} as const;
const BUBBLE_SVG_STYLE = {
  filter:
    "drop-shadow(0 12px 32px rgba(232,119,32,0.15)) drop-shadow(0 2px 6px rgba(0,0,0,0.05))",
} as const;

// SUBCOMPONENTS
interface StoreButtonProps {
  href: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
}
function StoreButton({ href, imageSrc, imageAlt, label }: StoreButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={STORE_BUTTON_STYLE}
      className="group flex flex-1 items-center gap-2 md:gap-3 justify-start sm:justify-center rounded-xl md:rounded-2xl bg-white px-3 py-2.5 md:px-5 md:py-4 hover:scale-[1.04] transition-all duration-300"
    >
      <Image
        width={160}
        height={52}
        src={imageSrc}
        alt={imageAlt}
        className="object-contain w-[24px] md:w-[36px] h-auto shrink-0"
      />
      <span className="text-xs md:text-base font-black text-darkerGray text-left leading-tight">
        {label}
      </span>
    </a>
  );
}

export default function LandingHero({
  badge,
  title,
  actions,
  mascotSrc,
  mascotAlt,
  description,
  storeButtons,
  mascotClassName,
  contentClassName,
}: LandingHeroProps) {
  const t = useTranslations("home.hero");
  const hasActions = Boolean(actions) || Boolean(storeButtons);

  return (
    <section className="pt-32 pb-4 md:pb-0 md:pt-36 bg-primaryWhite">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-lightGray text-xs md:text-sm border text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 py-1.5 md:py-2">
            <Sparkles
              aria-hidden="true"
              className="w-6 h-6 text-primaryOrange flex-shrink-0"
            />
            <span className="font-bold whitespace-pre-line text-center leading-tight text-sm md:text-base">
              {badge}
            </span>
            <Sparkles
              aria-hidden="true"
              className="w-6 h-6 text-primaryOrange flex-shrink-0"
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 items-center">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, x: -20 }}
            className={twMerge(
              "mt-4 lg:mt-0 relative md:left-[5%]",
              contentClassName,
            )}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-darkerGray mb-3 md:mb-4 leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm md:text-base lg:text-lg text-lightGray mb-4 md:mb-5 max-w-xl leading-relaxed">
                {description}
              </p>
            )}
            {hasActions && (
              <div className="flex flex-row gap-2 md:gap-3 lg:gap-4 max-w-[280px] sm:max-w-md">
                {storeButtons && (
                  <>
                    <StoreButton
                      imageSrc="/assets/Apple.webp"
                      href={storeButtons.appStoreUrl}
                      label={storeButtons.appleLabel}
                      imageAlt={storeButtons.appleAlt}
                    />
                    <StoreButton
                      imageSrc="/assets/Android.webp"
                      href={storeButtons.playStoreUrl}
                      label={storeButtons.googleLabel}
                      imageAlt={storeButtons.googleAlt}
                    />
                  </>
                )}
                {actions}
              </div>
            )}
            <TrustBadge />
          </motion.div>
          <motion.div
            className="mt-12 lg:mt-0"
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative flex items-center justify-center">
              <div className="relative z-10 w-full max-w-[220px] sm:max-w-[380px]">
                <Image
                  priority
                  width={450}
                  height={450}
                  src={mascotSrc}
                  alt={mascotAlt}
                  className={twMerge(
                    "object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.16)] scale-100 relative right-[5%] sm:right-[10%] md:top-8",
                    mascotClassName,
                  )}
                />
              </div>
              <motion.div
                animate={{ opacity: 1, y: 0, scale: 1 }}
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="absolute -top-6 right-2 sm:-top-2 md:top-0 md:right-0 z-20"
              >
                <div
                  style={GLOW_STYLE}
                  aria-hidden="true"
                  className="absolute inset-0 blur-3xl pointer-events-none rounded-[3rem]"
                />
                <div className="relative w-[200px] h-[78px] sm:w-[280px] sm:h-[108px] md:w-[310px] md:h-[118px]">
                  <svg
                    fill="none"
                    width="100%"
                    height="100%"
                    viewBox="0 0 310 118"
                    style={BUBBLE_SVG_STYLE}
                    className="absolute inset-0"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                        id="beaBubbleGradient"
                      >
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#FFF8F0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 44 1
                         L 266 1
                         Q 309 1 309 44
                         Q 309 87 266 87
                         L 130 87
                         Q 118 102 78 116
                         Q 100 100 92 87
                         L 44 87
                         Q 1 87 1 44
                         Q 1 1 44 1 Z"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      fill="url(#beaBubbleGradient)"
                      stroke="rgba(232,119,32,0.3)"
                    />
                  </svg>
                  <div className="absolute top-0 left-0 right-0 h-[58px] sm:h-[80px] md:h-[88px] flex items-center gap-2 sm:gap-4 pl-2 sm:pl-3 pr-3 sm:pr-5">
                    <div className="relative left-[2%] w-6 h-6 sm:w-14 sm:h-14 overflow-hidden flex-shrink-0">
                      <Image
                        width={400}
                        height={400}
                        alt={t("aiAvatarAlt")}
                        src="/assets/Logos/Logo.webp"
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <span className="text-base sm:text-lg relative left-[1.5%] sm:left-0 md:text-2xl font-bold text-darkerGray whitespace-nowrap">
                      {t("aiIntroTitle")}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

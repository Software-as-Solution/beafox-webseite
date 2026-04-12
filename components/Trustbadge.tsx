"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
// ICONS
import { Star } from "lucide-react";

// CONSTANTS
const TRUST_AVATARS = [
  "/Maskottchen/Maskottchen-Hero.webp",
  "/Maskottchen/Maskottchen-Freude.webp",
  "/Maskottchen/Maskottchen-Azubi.webp",
  "/Maskottchen/Maskottchen-School.webp",
] as const;
const STAR_INDICES = [0, 1, 2, 3, 4] as const;
const AVATAR_RING_STYLE = {
  boxShadow: "0 4px 12px rgba(232,119,32,0.18), 0 1px 3px rgba(0,0,0,0.06)",
} as const;
// TYPES
interface TrustBadgeProps {
  className?: string;
  noAnimation?: boolean;
  centerContent?: boolean;
}

export default function TrustBadge({
  className,
  noAnimation = false,
  centerContent = false,
}: TrustBadgeProps) {
  const t = useTranslations("home.trustBadge");
  const Wrapper = noAnimation ? "div" : motion.div;
  const animationProps = noAnimation
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.35 },
      };

  return (
    <Wrapper
      {...animationProps}
      className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-5 mt-5 md:mt-7 ${className ?? ""}`}
    >
      <div className="flex items-center -space-x-2.5 md:-space-x-3">
        <div
          style={AVATAR_RING_STYLE}
          className="relative z-10 w-9 h-9 md:w-14 md:h-14 rounded-full bg-primaryOrange border-2 border-white flex items-center justify-center"
        >
          <span className="text-[9px] md:text-xs font-black text-white tracking-tight">
            {t("kpi")}
          </span>
        </div>
        {TRUST_AVATARS.map((src, idx) => (
          <div
            key={idx}
            style={AVATAR_RING_STYLE}
            className="relative w-8 h-8 md:w-11 md:h-11 rounded-full bg-white border-2 border-white overflow-hidden flex items-center justify-center"
          >
            <Image
              src={src}
              width={80}
              height={80}
              alt={t("avatarAlt")}
              className="object-contain w-full h-full p-0.5"
            />
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="hidden md:block w-px h-12 bg-gray-200"
      />
      <div
        className={`flex flex-col gap-0.5 ${centerContent ? "items-center text-center" : ""}`}
      >
        <div
          className={`flex items-center gap-1.5 md:gap-2 ${centerContent ? "justify-center" : ""}`}
        >
          <div
            className={`flex items-center gap-0.5 ${centerContent ? "justify-center" : ""}`}
          >
            {STAR_INDICES.map((i) => (
              <Star
                key={i}
                aria-hidden="true"
                className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] fill-primaryOrange text-primaryOrange"
              />
            ))}
          </div>
          <span className="text-xs md:text-base font-bold text-darkerGray">
            {t("rating")}
          </span>
        </div>
        <p
          className={`text-sm text-lightGray leading-snug ${centerContent ? "text-center" : ""}`}
        >
          {t("trustedByPrefix")}{" "}
          <span className="font-bold text-darkerGray">
            {t("trustedByHighlight")}
          </span>{" "}
        </p>
      </div>
    </Wrapper>
  );
}

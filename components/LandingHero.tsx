"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
// ICONS
import { Sparkles } from "lucide-react";

// TYPES
interface LandingHeroProps {
  badge: string;
  cardText: string;
  mascotSrc: string;
  mascotAlt: string;
  title: React.ReactNode;
  chips?: React.ReactNode;
  mascotClassName?: string;
  contentClassName?: string;
  actions: React.ReactNode;
  description?: React.ReactNode;
}
// CONSTANTS
const BUBBLE_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.25)",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F0 100%)",
  boxShadow: "0 8px 32px rgba(232,119,32,0.12), 0 2px 8px rgba(0,0,0,0.04)",
} as const;
const GLOW_STYLE = {
  background: "rgba(232,119,32,0.1)",
} as const;

export default function LandingHero({
  badge,
  title,
  chips,
  actions,
  cardText,
  mascotSrc,
  mascotAlt,
  description,
  mascotClassName,
  contentClassName,
}: LandingHeroProps) {
  return (
    <section className="pt-32 pb-4 md:pb-0 md:pt-36 bg-primaryWhite">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-lightGray text-xs md:text-sm border text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 py-1.5 md:py-2">
            <Sparkles
              aria-hidden="true"
              className="w-3 h-3 md:w-6 md:h-6 text-primaryOrange flex-shrink-0"
            />
            <span className="font-bold whitespace-pre-line text-center leading-tight text-base">
              {badge}
            </span>
            <Sparkles
              aria-hidden="true"
              className="w-3 h-3 md:w-6 md:h-6 text-primaryOrange flex-shrink-0"
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 items-center">
          {/* Left — Content */}
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, x: -20 }}
            className={twMerge(
              "mt-4 lg:mt-0 relative md:left-[7.5%]",
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
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 lg:gap-4">
              {actions}
            </div>
            {chips && (
              <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 mt-4 md:mt-6 flex-col">
                {chips}
              </div>
            )}
          </motion.div>
          {/* Right — Mascot + Chat Bubble */}
          <motion.div
            className="mt-4 lg:mt-0"
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative flex items-center justify-center">
              <div className="relative z-10 w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[400px]">
                <Image
                  priority
                  width={450}
                  height={450}
                  src={mascotSrc}
                  alt={mascotAlt}
                  className={twMerge(
                    "object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.16)] scale-125 relative right-[10%] md:top-8",
                    mascotClassName,
                  )}
                />
              </div>
              <motion.div
                animate={{ opacity: 1, y: 0, scale: 1 }}
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="absolute top-20 right-2 md:top-6 z-20 max-w-[300px]"
              >
                <div
                  style={GLOW_STYLE}
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-3xl blur-xl pointer-events-none"
                />
                <div
                  style={BUBBLE_STYLE}
                  className="relative rounded-2xl px-4 py-3 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 overflow-hidden flex-shrink-0">
                      <Image
                        alt="Bea"
                        width={500}
                        height={500}
                        className="object-contain"
                        src="/assets/Logos/Logo.png"
                      />
                    </div>
                    <span className="text-sm font-bold text-darkerGray">
                      Hi, ich bin Bea 👋
                    </span>
                    <span
                      aria-hidden="true"
                      className="relative flex h-2 w-2 ml-auto"
                    >
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                  </div>
                  <p className="text-xs md:text-sm leading-relaxed pl-10">
                    {cardText}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

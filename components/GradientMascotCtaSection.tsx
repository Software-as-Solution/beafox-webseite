"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// CUSTOM COMPONENTS
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
// IMPORTS
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { Transition } from "framer-motion";

// CONSTANTS
const GLOW = (opacity: number) => ({
  background: `radial-gradient(circle, rgba(232,119,32,${opacity}) 0%, transparent 70%)`,
});
const CARD_SURFACE_FULL = {
  border: "2px solid rgba(232,119,32,0.2)",
  boxShadow: "0 16px 48px rgba(232,119,32,0.08)",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
} as const;
const CARD_SURFACE_COMPACT = {
  border: "2px solid rgba(232,119,32,0.2)",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
} as const;
// TYPES
export type GradientMascotCtaVariant = "default" | "compact";

export type GradientMascotCtaCardProps = {
  title: ReactNode;
  mascotSrc: string;
  mascotAlt?: string;
  actions: ReactNode;
  mascotWidth?: number;
  mascotHeight?: number;
  titleAs?: "h2" | "h3";
  description: ReactNode;
  cardClassName?: string;
  titleClassName?: string;
  mascotClassName?: string;
  cardMotionDelay?: number;
  animateOnMount?: boolean;
  contentRowClassName?: string;
  mountTransition?: Transition;
  cardPaddingClassName?: string;
  descriptionClassName?: string;
  actionsWrapperClassName?: string;
  variant?: GradientMascotCtaVariant;
  glowCorner?: "top-right" | "top-left";
};

export function GradientMascotCtaCard({
  title,
  actions,
  mascotSrc,
  description,
  cardClassName,
  mascotAlt = "",
  titleAs = "h3",
  titleClassName,
  mascotClassName,
  mountTransition,
  mascotWidth = 160,
  mascotHeight = 160,
  contentRowClassName,
  variant = "default",
  cardMotionDelay = 0,
  cardPaddingClassName,
  descriptionClassName,
  animateOnMount = false,
  actionsWrapperClassName,
  glowCorner = "top-right",
}: GradientMascotCtaCardProps) {
  // CONSTANTS
  const isCompact = variant === "compact";
  const glowPositionClass =
    glowCorner === "top-left"
      ? "absolute -top-16 -left-16 w-[200px] h-[200px] rounded-full pointer-events-none"
      : isCompact
        ? "absolute -top-10 -right-10 w-[120px] h-[120px] rounded-full pointer-events-none"
        : "absolute -top-16 -right-16 w-[200px] h-[200px] rounded-full pointer-events-none";
  const defaultMascotClass = isCompact
    ? "object-contain w-14 h-14 flex-shrink-0 scale-150"
    : "object-contain w-24 h-24 md:w-32 md:h-32 flex-shrink-0 scale-150";
  const defaultPadding = isCompact ? "p-5 md:p-6" : "p-6 md:p-10";
  const defaultRow = isCompact
    ? "relative z-10 flex items-start gap-4"
    : "relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10";
  const defaultTitleClass = isCompact
    ? "text-sm font-bold text-darkerGray mb-1"
    : "text-xl md:text-2xl font-bold text-darkerGray mb-2";
  const defaultDescClass = isCompact
    ? "text-xs text-lightGray leading-relaxed mb-3"
    : "text-sm md:text-base text-lightGray leading-relaxed mb-5";
  const defaultActionsWrap = isCompact
    ? undefined
    : "flex flex-col sm:flex-row gap-3 justify-center md:justify-start";
  const transition = mountTransition ?? {
    duration: 0.5,
    delay: cardMotionDelay,
  };
  const cardInner = (
    <>
      <div
        style={GLOW(0.06)}
        aria-hidden="true"
        className={glowPositionClass}
      />
      <div className={twMerge(defaultRow, contentRowClassName)}>
        <Image
          src={mascotSrc}
          alt={mascotAlt}
          width={mascotWidth}
          height={mascotHeight}
          aria-hidden={mascotAlt ? undefined : true}
          className={twMerge(defaultMascotClass, mascotClassName)}
          style={{
            filter: isCompact
              ? "drop-shadow(0 4px 8px rgba(0,0,0,0.08))"
              : "drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
          }}
        />
        <div
          className={twMerge(
            "flex-1",
            !isCompact && "text-center md:text-left",
            isCompact && "min-w-0",
          )}
        >
          {titleAs === "h2" ? (
            <h2 className={twMerge(defaultTitleClass, titleClassName)}>
              {title}
            </h2>
          ) : (
            <h3 className={twMerge(defaultTitleClass, titleClassName)}>
              {title}
            </h3>
          )}
          <p className={twMerge(defaultDescClass, descriptionClassName)}>
            {description}
          </p>
          {defaultActionsWrap ? (
            <div
              className={twMerge(defaultActionsWrap, actionsWrapperClassName)}
            >
              {actions}
            </div>
          ) : (
            actions
          )}
        </div>
      </div>
    </>
  );
  const cardClassNames = twMerge(
    "relative overflow-hidden rounded-2xl",
    defaultPadding,
    cardPaddingClassName,
    cardClassName,
  );

  if (animateOnMount) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className={cardClassNames}
        style={isCompact ? CARD_SURFACE_COMPACT : CARD_SURFACE_FULL}
      >
        {cardInner}
      </motion.div>
    );
  }

  return (
    <motion.div
      transition={transition}
      viewport={{ once: true }}
      className={cardClassNames}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      style={isCompact ? CARD_SURFACE_COMPACT : CARD_SURFACE_FULL}
    >
      {cardInner}
    </motion.div>
  );
}

export type GradientMascotCtaSectionProps = GradientMascotCtaCardProps & {
  headerTitle?: ReactNode;
  sectionClassName?: string;
  containerClassName?: string;
  headerPillClassName?: string;
  headerMotionClassName?: string;
};

export default function GradientMascotCtaSection({
  headerTitle,
  cardMotionDelay,
  headerMotionClassName,
  headerPillClassName = "mb-4 md:mb-6",
  containerClassName = "max-w-4xl mx-auto",
  sectionClassName = "bg-gray-50 py-8 md:py-12 lg:py-16",
  ...cardProps
}: GradientMascotCtaSectionProps) {
  const delay = cardMotionDelay ?? (headerTitle ? 0.1 : 0);

  return (
    <Section className={sectionClassName}>
      <div className={containerClassName}>
        {headerTitle ? (
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={twMerge(
              "text-center mb-8 md:mb-12",
              headerMotionClassName,
            )}
          >
            <SectionHeader
              title={headerTitle}
              pillClassName={headerPillClassName}
            />
          </motion.div>
        ) : null}
        <GradientMascotCtaCard {...cardProps} cardMotionDelay={delay} />
      </div>
    </Section>
  );
}

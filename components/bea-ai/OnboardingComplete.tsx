"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import {
  useMemo,
  useState,
  useCallback,
  type ReactNode,
  type ChangeEvent,
  type ComponentProps,
} from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
// LIB
import {
  LIFE_VALUES,
  generateInsights,
  CRISIS_RESOURCES,
  type StepId,
  type Insight,
  type LifeValue,
  type InsightTone,
  type UserProfile,
  type Inconsistency,
} from "@/lib/bea-ai/onboarding";
// CUSTOM COMPONENTS
import LegalDisclaimer from "@/components/bea-ai/shared/LegalDisclaimer";

// TYPES
interface OnboardingCompleteProps {
  profile: UserProfile;
  onStartChat: () => void;
  onEditStep?: (stepId: StepId) => void;
  onAdditionalContext?: (text: string) => void;
  onNewsletterSubmit?: (email: string) => Promise<void> | void;
}
type Phase = "summary" | "newsletter" | "confirmed";
// ANIMATION CONSTANTS
const DELAYS = {
  beaBubble: 0,
  crisis: 0.28,
  mainCTA: 0.98,
  heroCard: 0.22,
  heroIcon: 0.32,
  zielbild: 0.84,
  beaBubbleText: 0.18,
  heroLabelOffset: 0.1,
  secondaryPills: 0.68,
  heroDescOffset: 0.38,
  heroTitleOffset: 0.18,
  inconsistencies: 0.76,
  insightCardsBase: 0.42,
  additionalContext: 0.9,
  heroTaglineOffset: 0.28,
  insightCardStagger: 0.08,
} as const;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
// STYLE CONSTANTS
const BUBBLE_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.22)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  boxShadow: "0 8px 24px rgba(232,119,32,0.1), 0 0 0 1px rgba(232,119,32,0.04)",
} as const;
const HERO_CARD_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.28)",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 40%, #FFEEDB 100%)",
  boxShadow:
    "0 20px 48px rgba(232,119,32,0.15), 0 0 0 1px rgba(232,119,32,0.08)",
} as const;
const HERO_EMOJI_BG_STYLE = {
  border: "2px solid rgba(232,119,32,0.35)",
  boxShadow: "0 10px 28px rgba(232,119,32,0.25)",
  background: "linear-gradient(135deg, #FFF8F3 0%, #FED4B0 100%)",
} as const;
const HERO_BLOB_STYLE = {
  background:
    "radial-gradient(circle, rgba(232,119,32,0.15) 0%, transparent 60%)",
} as const;
const INSIGHT_CARD_NEUTRAL_STYLE = {
  border: "1.5px solid #F0E5D8",
  boxShadow: "0 2px 12px rgba(232,119,32,0.06)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFFCF8 100%)",
} as const;
const INSIGHT_CARD_CAUTIOUS_STYLE = {
  border: "1.5px solid rgba(245,158,11,0.35)",
  boxShadow: "0 2px 12px rgba(245,158,11,0.08)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8EF 100%)",
} as const;
const INSIGHT_CARD_POSITIVE_STYLE = {
  border: "1.5px solid rgba(16,185,129,0.25)",
  boxShadow: "0 2px 12px rgba(16,185,129,0.08)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%)",
} as const;
const SECONDARY_PILL_POSITIVE_STYLE = {
  background: "#F0FDF4",
  border: "1px solid rgba(16,185,129,0.3)",
} as const;
const SECONDARY_PILL_NEUTRAL_STYLE = {
  background: "#FFF8EF",
  border: "1px solid rgba(245,158,11,0.3)",
} as const;
const INCONSISTENCY_BLOCK_STYLE = {
  border: "1.5px dashed rgba(232,119,32,0.3)",
  background: "linear-gradient(180deg, #FFFBF5 0%, #FFF8EF 100%)",
} as const;
const INCONSISTENCY_ITEM_STYLE = {
  background: "#FFFFFF",
  border: "1px solid rgba(232,119,32,0.12)",
} as const;
const ZIELBILD_CARD_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.2)",
  boxShadow: "0 4px 16px rgba(232,119,32,0.08)",
  background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
} as const;
const VALUE_CHIP_STYLE = {
  background: "#FFFFFF",
  border: "1px solid rgba(232,119,32,0.25)",
} as const;
const ADDITIONAL_CONTEXT_BLOCK_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 4px 16px rgba(232,119,32,0.06)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
} as const;
const ADDITIONAL_CONTEXT_TEXTAREA_DEFAULT_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
} as const;
const ADDITIONAL_CONTEXT_TEXTAREA_FOCUS_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #E87720",
  boxShadow:
    "0 4px 16px rgba(232,119,32,0.12), 0 0 0 3px rgba(232,119,32,0.08)",
} as const;
const EMAIL_INPUT_DEFAULT_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  boxShadow: "0 4px 16px rgba(232,119,32,0.06)",
} as const;
const EMAIL_INPUT_FOCUS_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #E87720",
  boxShadow:
    "0 8px 24px rgba(232,119,32,0.18), 0 0 0 4px rgba(232,119,32,0.08)",
} as const;
const PRIMARY_BUTTON_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow: "0 10px 24px rgba(232,119,32,0.3)",
} as const;
const SECONDARY_BUTTON_STYLE = {
  color: "#161616",
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
} as const;
const SECTION_EDIT_BUTTON_STYLE = {
  background: "#FFFFFF",
  border: "1px solid rgba(232,119,32,0.2)",
  boxShadow: "0 1px 4px rgba(232,119,32,0.08)",
} as const;
const CRISIS_CARD_STYLE = {
  border: "1.5px solid rgba(217,119,6,0.3)",
  boxShadow: "0 4px 16px rgba(217,119,6,0.08)",
  background: "linear-gradient(180deg, #FFFBF5 0%, #FFF5EB 100%)",
} as const;
const CRISIS_RESOURCE_STYLE = {
  background: "#FFFFFF",
  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
  border: "1px solid rgba(217,119,6,0.18)",
} as const;
const CONFIRMED_GLOW_STYLE = {
  background:
    "radial-gradient(circle, rgba(232,119,32,0.25) 0%, transparent 70%)",
} as const;
// CONSTANTS
const ADDITIONAL_CONTEXT_MAX_LENGTH = 500;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEVERITY_ORDER: Record<Inconsistency["severity"], number> = {
  low: 1,
  high: 3,
  medium: 2,
} as const;
// HELPER FUNCTIONS
function resolveCardStyle(tone: InsightTone) {
  if (tone === "positive") return INSIGHT_CARD_POSITIVE_STYLE;
  if (tone === "cautious") return INSIGHT_CARD_CAUTIOUS_STYLE;
  return INSIGHT_CARD_NEUTRAL_STYLE;
}
/** Short hedging label for non-assertive insights. */
function confidenceToLabelKey(confidence: number): "firstAssessment" | "stillVague" | null {
  if (confidence >= 0.8) return null;
  if (confidence >= 0.5) return "firstAssessment";
  return "stillVague";
}

// SUBCOMPONENTS
interface BeaMessageBubbleProps {
  delay?: number;
  children: ReactNode;
}
function BeaMessageBubble({
  children,
  delay = 0,
}: BeaMessageBubbleProps) {
  const t = useTranslations("onboarding.beaAi.complete.shared");

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 16 }}
      className="mb-5 flex items-start gap-3"
      transition={{ delay, duration: 0.45, ease: EASE_OUT }}
    >
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        className="relative flex-shrink-0"
        initial={{ scale: 0.7, opacity: 0 }}
        transition={{
          damping: 18,
          type: "spring",
          stiffness: 200,
          delay: delay + 0.08,
        }}
      >
        <div className="relative h-10 w-10 overflow-hidden md:h-12 md:w-12">
          <Image
            fill
            priority
            alt={t("beaAlt")}
            className="object-contain"
            src="/Maskottchen/Maskottchen-Right.png"
          />
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 flex h-3 w-3"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-green-500" />
        </span>
      </motion.div>
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primaryOrange">
            {t("speakerBea")}
          </span>
        </div>
        <motion.div
          style={BUBBLE_STYLE}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          className="relative inline-block max-w-xl rounded-2xl rounded-tl-md px-4 py-3 md:px-5 md:py-3.5"
          transition={{
            duration: 0.4,
            ease: EASE_OUT,
            delay: delay + DELAYS.beaBubbleText,
          }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}

interface FinancialTypeHeroProps {
  icon: string;
  label: string;
  tagline: string;
  description: string;
}
function FinancialTypeHero({
  icon,
  label,
  tagline,
  description,
}: FinancialTypeHeroProps) {
  const t = useTranslations("onboarding.beaAi.complete.financialType");

  return (
    <motion.div
      style={HERO_CARD_STYLE}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      className="relative mb-5 overflow-hidden rounded-3xl p-5 md:p-6"
      transition={{ delay: DELAYS.heroCard, duration: 0.5, ease: EASE_OUT }}
    >
      <div
        aria-hidden="true"
        style={HERO_BLOB_STYLE}
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
      />

      <div className="relative flex flex-col items-center gap-4 text-center md:flex-row md:gap-6 md:text-left">
        <motion.div
          style={HERO_EMOJI_BG_STYLE}
          animate={{ scale: 1, rotate: 0 }}
          initial={{ scale: 0, rotate: -15 }}
          className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full text-5xl md:h-24 md:w-24 md:text-6xl"
          transition={{
            damping: 15,
            type: "spring",
            stiffness: 180,
            delay: DELAYS.heroIcon,
          }}
        >
          {icon}
        </motion.div>
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-primaryOrange md:text-[11px]"
            transition={{
              duration: 0.35,
              delay: DELAYS.heroIcon + DELAYS.heroLabelOffset,
            }}
          >
            {t("label")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-1.5 text-xl font-black leading-tight text-darkerGray md:text-[28px]"
            transition={{
              duration: 0.45,
              delay: DELAYS.heroIcon + DELAYS.heroTitleOffset,
            }}
          >
            {label}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2.5 text-xs font-semibold italic text-primaryOrange md:text-sm"
            transition={{
              duration: 0.45,
              delay: DELAYS.heroIcon + DELAYS.heroTaglineOffset,
            }}
          >
            „{tagline}"
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs leading-relaxed text-darkerGray/80 md:text-sm"
            transition={{
              duration: 0.45,
              delay: DELAYS.heroIcon + DELAYS.heroDescOffset,
            }}
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

function CrisisSafetyNet() {
  const t = useTranslations("onboarding.beaAi.complete.crisis");

  return (
    <motion.div
      role="region"
      style={CRISIS_CARD_STYLE}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-5 rounded-3xl p-5 md:p-6"
      aria-label={t("ariaLabel")}
      transition={{ delay: DELAYS.crisis, duration: 0.45, ease: EASE_OUT }}
    >
      <div className="mb-3 flex items-start gap-2.5">
        <span className="text-xl" aria-hidden="true">
          💛
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold leading-snug text-darkerGray md:text-base">
            {t("title")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-darkerGray/70 md:text-sm">
            {t("description")}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {CRISIS_RESOURCES.map((resource) => {
          const href =
            resource.url ?? (resource.phone ? `tel:${resource.phone}` : "#");
          const isExternal = resource.url !== undefined;
          return (
            <a
              href={href}
              key={resource.name}
              style={CRISIS_RESOURCE_STYLE}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-1 rounded-xl p-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2"
            >
              <span className="text-xs font-bold text-darkerGray group-hover:text-primaryOrange md:text-sm">
                {resource.name}
              </span>
              <span className="text-[11px] leading-snug text-darkerGray/60">
                {resource.description}
              </span>
              {resource.phone && (
                <span className="mt-0.5 text-[11px] font-bold text-primaryOrange">
                  📞 {resource.phone}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </motion.div>
  );
}

interface InsightCardProps {
  label: string;
  delay: number;
  insight: Insight;
}
function InsightCard({ label, insight, delay }: InsightCardProps) {
  const t = useTranslations("onboarding.beaAi.complete.insightCard");
  const confidenceLabel = confidenceToLabelKey(insight.confidence);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 16 }}
      style={resolveCardStyle(insight.tone)}
      transition={{ delay, duration: 0.4, ease: EASE_OUT }}
      className="relative flex flex-col gap-2 rounded-2xl p-4 md:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-3xl md:text-4xl" aria-hidden="true">
          {insight.icon}
        </div>
        <div className="flex flex-col items-end gap-0.5 text-right">
          <span className="text-[9px] font-bold uppercase tracking-widest text-darkerGray/40 md:text-[10px]">
            {label}
          </span>
          {confidenceLabel && (
            <span className="text-[9px] font-semibold uppercase tracking-wider text-darkerGray/35">
              {t(`confidence.${confidenceLabel}`)}
            </span>
          )}
        </div>
      </div>
      <h3 className="text-sm font-black leading-tight text-darkerGray md:text-base">
        {insight.title}
      </h3>
      <p className="text-xs leading-relaxed text-darkerGray/75 md:text-[13px]">
        {insight.description}
      </p>
    </motion.div>
  );
}

interface SecondaryInsightPillsProps {
  strength: Insight | null;
  challenge: Insight | null;
}
function SecondaryInsightPills({
  strength,
  challenge,
}: SecondaryInsightPillsProps) {
  const t = useTranslations("onboarding.beaAi.complete.secondaryInsights");
  if (!strength && !challenge) return null;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 12 }}
      className="mb-5 flex flex-wrap items-center gap-2"
      transition={{
        duration: 0.4,
        ease: EASE_OUT,
        delay: DELAYS.secondaryPills,
      }}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-darkerGray/40">
        {t("title")}
      </span>
      {strength && (
        <div
          style={SECONDARY_PILL_POSITIVE_STYLE}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5"
        >
          <span className="text-sm" aria-hidden="true">
            {strength.icon}
          </span>
          <span className="truncate text-[11px] font-bold text-emerald-900 md:text-xs">
            {strength.title}
          </span>
        </div>
      )}
      {challenge && (
        <div
          style={SECONDARY_PILL_NEUTRAL_STYLE}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5"
        >
          <span className="text-sm" aria-hidden="true">
            {challenge.icon}
          </span>
          <span className="truncate text-[11px] font-bold text-amber-900 md:text-xs">
            {challenge.title}
          </span>
        </div>
      )}
    </motion.div>
  );
}

interface InconsistenciesBlockProps {
  inconsistencies: Inconsistency[];
}
function InconsistenciesBlock({ inconsistencies }: InconsistenciesBlockProps) {
  const t = useTranslations("onboarding.beaAi.complete.inconsistencies");
  const top = useMemo(
    () =>
      [...inconsistencies]
        .sort((a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity])
        .slice(0, 2),
    [inconsistencies],
  );

  if (top.length === 0) return null;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 16 }}
      style={INCONSISTENCY_BLOCK_STYLE}
      className="mb-5 rounded-2xl p-4 md:p-5"
      transition={{
        duration: 0.45,
        ease: EASE_OUT,
        delay: DELAYS.inconsistencies,
      }}
    >
      <div className="mb-3 flex items-start gap-2.5">
        <span className="text-lg" aria-hidden="true">
          👀
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold leading-snug text-darkerGray md:text-[15px]">
            {t("title")}
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-darkerGray/60 md:text-xs">
            {t("description")}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {top.map((item) => (
          <div
            key={item.id}
            style={INCONSISTENCY_ITEM_STYLE}
            className="rounded-xl p-3 md:p-3.5"
          >
            <p className="text-xs italic leading-relaxed text-darkerGray/85 md:text-[13px]">
              „{item.chatPrompt}"
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface ZielbildAndValuesCardProps {
  zielbild: string;
  values: LifeValue[];
  onEdit?: () => void;
}
function ZielbildAndValuesCard({
  values,
  zielbild,
  onEdit,
}: ZielbildAndValuesCardProps) {
  const t = useTranslations("onboarding.beaAi.complete.goalAndValues");
  const hasZielbild = zielbild.trim().length > 0;
  const valueOptions = useMemo(
    () =>
      values
        .map((v) => LIFE_VALUES.find((o) => o.id === v))
        .filter((v): v is (typeof LIFE_VALUES)[number] => v !== undefined),
    [values],
  );
  const hasValues = valueOptions.length > 0;
  if (!hasZielbild && !hasValues) return null;

  return (
    <motion.div
      style={ZIELBILD_CARD_STYLE}
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 16 }}
      className="relative mb-5 rounded-2xl p-5 md:p-6"
      transition={{ delay: DELAYS.zielbild, duration: 0.45, ease: EASE_OUT }}
    >
      {hasZielbild && (
        <>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primaryOrange md:text-[11px]">
              {t("goalTitle")}
            </span>
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                aria-label={t("editAriaLabel")}
                style={SECTION_EDIT_BUTTON_STYLE}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-primaryOrange transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2"
              >
                <svg
                  fill="none"
                  strokeWidth={2.5}
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-2.5 w-2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                {t("editButton")}
              </button>
            )}
          </div>
          <div className="relative pl-5">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 text-3xl leading-none text-primaryOrange/40 md:text-4xl"
            >
              „
            </span>
            <p className="text-sm font-semibold italic leading-relaxed text-darkerGray md:text-[15px]">
              {zielbild}
            </p>
          </div>
        </>
      )}
      {hasValues && (
        <div
          className={
            hasZielbild
              ? "mt-3 flex flex-wrap items-center gap-1.5 border-t border-primaryOrange/15 pt-3"
              : "flex flex-wrap items-center gap-1.5"
          }
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-primaryOrange/70 md:text-[11px]">
            {hasZielbild ? t("valuesLabelWithGoal") : t("valuesLabelWithoutGoal")}
          </span>
          {valueOptions.map((v) => (
            <div
              key={v.id}
              style={VALUE_CHIP_STYLE}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1"
            >
              <span className="text-xs" aria-hidden="true">
                {v.icon}
              </span>
              <span className="text-[11px] font-bold text-darkerGray">
                {v.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

interface AdditionalContextFieldProps {
  value: string;
  onChange: (text: string) => void;
}
function AdditionalContextField({
  value,
  onChange,
}: AdditionalContextFieldProps) {
  const t = useTranslations("onboarding.beaAi.complete.additionalContext");
  const [isFocused, setIsFocused] = useState(false);
  const remaining = ADDITIONAL_CONTEXT_MAX_LENGTH - value.length;
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value.slice(0, ADDITIONAL_CONTEXT_MAX_LENGTH));
    },
    [onChange],
  );

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 12 }}
      style={ADDITIONAL_CONTEXT_BLOCK_STYLE}
      className="mb-5 rounded-2xl p-4 md:p-5"
      transition={{
        duration: 0.45,
        ease: EASE_OUT,
        delay: DELAYS.additionalContext,
      }}
    >
      <div className="mb-3 flex items-start gap-2.5">
        <span className="text-lg" aria-hidden="true">
          ✍️
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold leading-snug text-darkerGray md:text-[15px]">
            {t("title")}
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-darkerGray/60 md:text-xs">
            {t("description")}
          </p>
        </div>
      </div>

      <div
        style={
          isFocused
            ? ADDITIONAL_CONTEXT_TEXTAREA_FOCUS_STYLE
            : ADDITIONAL_CONTEXT_TEXTAREA_DEFAULT_STYLE
        }
        className="overflow-hidden rounded-xl transition-all duration-300"
      >
        <textarea
          rows={3}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={ADDITIONAL_CONTEXT_MAX_LENGTH}
          aria-label={t("ariaLabel")}
          placeholder={t("placeholder")}
          className="w-full resize-none bg-transparent px-3.5 py-2.5 text-xs leading-relaxed text-darkerGray outline-none placeholder:text-gray-400 md:text-[13px]"
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">{t("optional")}</span>
        <span
          className={`text-[10px] font-semibold ${
            remaining < 50 ? "text-primaryOrange" : "text-darkerGray/40"
          }`}
        >
          {t("remainingChars", { count: remaining })}
        </span>
      </div>
    </motion.div>
  );
}

interface ConfirmedPhaseProps {
  email: string;
  onStartChat: () => void;
}
function ConfirmedPhase({
  email,
  onStartChat,
}: ConfirmedPhaseProps) {
  const t = useTranslations("onboarding.beaAi.complete.confirmed");

  return (
    <motion.div
      key="confirmed"
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="flex flex-col items-center text-center"
    >
      <motion.div
        animate={{ scale: 1, rotate: 0 }}
        initial={{ scale: 0, rotate: -20 }}
        className="relative mb-5 h-40 w-40 md:h-52 md:w-52"
        transition={{
          delay: 0.15,
          damping: 14,
          type: "spring",
          stiffness: 180,
        }}
      >
        <Image
          fill
          priority
          alt={t("imageAlt")}
          className="object-contain"
          src="/Maskottchen/Maskottchen-Herzen.webp"
          style={{
            filter: "drop-shadow(0 20px 40px rgba(232,119,32,0.3))",
          }}
        />
        <div
          aria-hidden="true"
          style={CONFIRMED_GLOW_STYLE}
          className="pointer-events-none absolute inset-0 -z-10"
        />
      </motion.div>
      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 12 }}
        transition={{ delay: 0.4, duration: 0.45 }}
        className="mb-4 text-2xl font-black leading-tight text-darkerGray md:text-4xl"
      >
        {t("title")}
      </motion.h2>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 12 }}
        style={INSIGHT_CARD_NEUTRAL_STYLE}
        transition={{ delay: 0.65, duration: 0.45 }}
        className="mb-5 w-full max-w-md text-center rounded-2xl p-5 md:p-6"
      >
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primaryOrange">
          {t("whatToExpectTitle")}
        </p>
        <p className="text-sm font-semibold leading-snug text-darkerGray md:text-base">
          {t("singleLine")}
        </p>
      </motion.div>
      <motion.button
        type="button"
        onClick={onStartChat}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.04 }}
        style={PRIMARY_BUTTON_STYLE}
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 12 }}
        transition={{ delay: 1.15, duration: 0.45 }}
        className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2"
      >
        {t("ctaTryBeaNow")}
      </motion.button>
    </motion.div>
  );
}

/**
 * ONBOARDING COMPLETE
 *
 * The payoff moment after the 12-step journey. Three phases:
 * 1. Summary — Bea presents financial type, insights, secondary insights,
 *    inconsistencies, combined zielbild+values, and an optional textarea.
 * 2. Newsletter — honest beta signup gate with clear legal framing.
 * 3. Confirmed — warm closing + expectations for what's next.
 *
 * Compact-first design: all blocks are dense, total scroll is minimized.
 */
export default function OnboardingComplete({
  profile,
  onEditStep,
  onStartChat,
  onNewsletterSubmit,
  onAdditionalContext,
}: OnboardingCompleteProps) {
  // STATE
  const t = useTranslations("onboarding.beaAi.complete");
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("summary");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [additionalContext, setAdditionalContext] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  // CONSTANTS
  const insights = useMemo(() => generateInsights(profile), [profile]);
  // FUNCTIONS
  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setSubmitError(null);
  }, []);
  const handleNewsletterSubmit: NonNullable<
    ComponentProps<"form">["onSubmit"]
  > = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      const trimmed = email.trim();
      if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
        setSubmitError(t("newsletter.form.errors.invalidEmail"));
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await onNewsletterSubmit?.(trimmed);
        setPhase("confirmed");
      } catch {
        setSubmitError(t("newsletter.form.errors.generic"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, isSubmitting, onNewsletterSubmit, t],
  );
  const handleContinueToNewsletter = useCallback(() => {
    setPhase("newsletter");
  }, []);
  const handleBackToSummary = useCallback(() => {
    setPhase("summary");
  }, []);
  const handleEditZielbild = useCallback(() => {
    onEditStep?.("zielbild");
  }, [onEditStep]);
  const handleAdditionalContextChange = useCallback(
    (text: string) => {
      setAdditionalContext(text);
      onAdditionalContext?.(text);
    },
    [onAdditionalContext],
  );

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-4 pb-12 pt-6 md:px-6 md:pb-16 md:pt-8">
      <AnimatePresence mode="wait">
        {/* ═══════════════════════════════════════════════ */}
        {/* PHASE 1 — SUMMARY                                 */}
        {/* ═══════════════════════════════════════════════ */}
        {phase === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <BeaMessageBubble delay={DELAYS.beaBubble}>
              <p className="text-sm font-semibold leading-relaxed text-darkerGray md:text-[15px]">
                {t("summary.bubble.line1Prefix")}{" "}
                <span className="text-primaryOrange">
                  {t("summary.bubble.line1Highlight")}
                </span>
                {t("summary.bubble.line1Suffix")}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-lightGray md:text-[13px]">
                {t("summary.bubble.line2")}
              </p>
            </BeaMessageBubble>
            <FinancialTypeHero
              icon={insights.financialType.icon}
              label={insights.financialType.label}
              tagline={insights.financialType.tagline}
              description={insights.financialType.description}
            />
            {insights.crisisSignals.length > 0 && <CrisisSafetyNet />}
            <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              <InsightCard
                label={t("summary.insightLabels.strength")}
                delay={DELAYS.insightCardsBase}
                insight={insights.primaryStrength}
              />
              <InsightCard
                label={t("summary.insightLabels.challenge")}
                insight={insights.primaryChallenge}
                delay={DELAYS.insightCardsBase + DELAYS.insightCardStagger}
              />
              <InsightCard
                label={t("summary.insightLabels.startingPoint")}
                insight={insights.startingPoint}
                delay={DELAYS.insightCardsBase + DELAYS.insightCardStagger * 2}
              />
            </div>
            <SecondaryInsightPills
              strength={insights.secondaryStrength}
              challenge={insights.secondaryChallenge}
            />
            <InconsistenciesBlock inconsistencies={insights.inconsistencies} />
            <ZielbildAndValuesCard
              zielbild={profile.zielbild}
              values={profile.lebenswerte}
              onEdit={onEditStep ? handleEditZielbild : undefined}
            />
            <AdditionalContextField
              value={additionalContext}
              onChange={handleAdditionalContextChange}
            />
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 12 }}
              className="mt-2 flex flex-col items-center gap-3"
              transition={{ delay: DELAYS.mainCTA, duration: 0.45 }}
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.04 }}
                style={PRIMARY_BUTTON_STYLE}
                onClick={handleContinueToNewsletter}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 md:text-base"
              >
                {t("summary.ctaContinue")}
                <svg
                  fill="none"
                  strokeWidth={3}
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4 md:h-5 md:w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
        {/* ═══════════════════════════════════════════════ */}
        {/* PHASE 2 — NEWSLETTER GATE                         */}
        {/* ═══════════════════════════════════════════════ */}
        {phase === "newsletter" && (
          <motion.div
            key="newsletter"
            exit={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <BeaMessageBubble >
              <p className="text-sm font-semibold leading-relaxed text-darkerGray md:text-[15px]">
                {t("newsletter.bubble.line1")}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-darkerGray md:text-[13px]">
                {t("newsletter.bubble.line2Prefix")}{" "}
                <span className="font-bold text-primaryOrange">
                  {t("newsletter.bubble.line2Highlight")}
                </span>{" "}
                {t("newsletter.bubble.line2Suffix")}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-lightGray md:text-[13px]">
                {t("newsletter.bubble.line3")}
              </p>
            </BeaMessageBubble>
            <div className="flex flex-col items-end">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-darkerGray/60">
                  {t("newsletter.form.speakerYou")}
                </span>
              </div>
              <form
                onSubmit={handleNewsletterSubmit}
                className="w-full max-w-md self-end"
                aria-label={t("newsletter.form.ariaLabel")}
              >
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.3, duration: 0.45 }}
                  className="overflow-hidden rounded-2xl rounded-tr-md p-1.5 transition-all duration-300"
                  style={
                    isEmailFocused
                      ? EMAIL_INPUT_FOCUS_STYLE
                      : EMAIL_INPUT_DEFAULT_STYLE
                  }
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <div className="flex flex-1 items-center gap-2.5 px-3 py-2.5">
                      <svg
                        className="h-4 w-4 flex-shrink-0 text-primaryOrange md:h-5 md:w-5"
                        fill="none"
                        strokeWidth={2}
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <input
                        type="email"
                        value={email}
                        inputMode="email"
                        autoComplete="email"
                        disabled={isSubmitting}
                        placeholder={t("newsletter.form.emailPlaceholder")}
                        aria-label={t("newsletter.form.emailAriaLabel")}
                        aria-invalid={!!submitError}
                        onChange={handleEmailChange}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                        className="w-full bg-transparent text-sm font-semibold text-darkerGray outline-none placeholder:text-gray-400 disabled:opacity-60 md:text-base"
                        aria-describedby={
                          submitError ? "newsletter-error" : undefined
                        }
                      />
                    </div>
                    <motion.button
                      type="submit"
                      style={PRIMARY_BUTTON_STYLE}
                      disabled={isSubmitting || !email.trim()}
                      whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                      whileHover={!isSubmitting ? { scale: 1.03 } : {}}
                      className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 disabled:opacity-60 md:text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-4 w-4 animate-spin"
                          >
                            <circle
                              r="10"
                              cx="12"
                              cy="12"
                              strokeWidth="4"
                              stroke="currentColor"
                              className="opacity-25"
                            />
                            <path
                              fill="currentColor"
                              className="opacity-75"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          {t("newsletter.form.submit.loading")}
                        </>
                      ) : (
                        <>
                          {t("newsletter.form.submit.default")}
                          <svg
                            fill="none"
                            strokeWidth={3}
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3.5 w-3.5"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
                <AnimatePresence>
                  {submitError && (
                    <motion.p
                      role="alert"
                      id="newsletter-error"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-right text-[11px] font-semibold text-red-500"
                    >
                      {submitError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleBackToSummary}
                className="mt-4 self-center text-[11px] font-semibold text-lightGray underline underline-offset-4 hover:text-darkerGray focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 md:text-xs"
              >
                {t("newsletter.form.backButton")}
              </button>
            </div>
          </motion.div>
        )}
        {/* ═══════════════════════════════════════════════ */}
        {/* PHASE 3 — CONFIRMED                               */}
        {/* ═══════════════════════════════════════════════ */}
        {phase === "confirmed" && (
          <ConfirmedPhase
            email={email}
            onStartChat={onStartChat}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

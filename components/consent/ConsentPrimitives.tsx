"use client";

// ─────────────────────────────────────────────────────────────
// ConsentPrimitives — Shared building blocks for consent UI
// ─────────────────────────────────────────────────────────────
// Lives in its own file so ConsentBanner and ConsentPreferences
// share the same PURPOSES config, Toggle component, and Badge
// component — no drift between first-time and settings flows.
// ─────────────────────────────────────────────────────────────

import type { ReactNode } from "react";
import type { ConsentPurpose } from "@/lib/analytics";

// ─── Types ──────────────────────────────────────────────────

export type ConsentRecommendation = "recommended" | "optional";

export interface PurposeConfig {
  id: ConsentPurpose;
  titleKey: string;
  descKey: string;
  /**
   * Whether Bea recommends this purpose to the user. Only the 1-2 most
   * value-adding options should be "recommended" — abusing this would
   * feel manipulative and defeat the trust signal.
   */
  recommendation: ConsentRecommendation;
}

// ─── Config ─────────────────────────────────────────────────

/**
 * All non-essential consent purposes in display order. Recommended items
 * come first so users see the most-valued options before the optional
 * ones — people read top-to-bottom and decision fatigue is real.
 *
 * When adding a new purpose:
 * 1. Add it to the `ConsentPurpose` union in @/lib/analytics
 * 2. Add translation keys under `consent.{purpose_id}.{title,desc}`
 * 3. Add it here with the appropriate recommendation
 */
export const PURPOSES: readonly PurposeConfig[] = [
  {
    id: "profile_tracking",
    titleKey: "profile_tracking.title",
    descKey: "profile_tracking.desc",
    recommendation: "recommended",
  },
  {
    id: "analytics",
    titleKey: "analytics.title",
    descKey: "analytics.desc",
    recommendation: "recommended",
  },
  {
    id: "prompt_iteration",
    titleKey: "prompt_iteration.title",
    descKey: "prompt_iteration.desc",
    recommendation: "optional",
  },
  {
    id: "model_training",
    titleKey: "model_training.title",
    descKey: "model_training.desc",
    recommendation: "optional",
  },
] as const;

// ─── Badge ──────────────────────────────────────────────────

const BADGE_STYLES = {
  necessary: {
    background: "rgba(107,114,128,0.12)",
    color: "#4B5563",
  },
  recommended: {
    background: "rgba(16,185,129,0.12)",
    color: "#047857",
  },
  optional: {
    background: "rgba(107,114,128,0.08)",
    color: "#6B7280",
  },
} as const;

interface ConsentBadgeProps {
  type: "necessary" | "recommended" | "optional";
  children: ReactNode;
}

export function ConsentBadge({ type, children }: ConsentBadgeProps) {
  return (
    <span
      style={BADGE_STYLES[type]}
      className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider md:text-[10px]"
    >
      {children}
    </span>
  );
}

// ─── Toggle ─────────────────────────────────────────────────

interface ConsentToggleProps {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible label — required for screen readers. */
  label: string;
}

/**
 * Accessible toggle switch with iOS-style visual. Uses role="switch"
 * (not checkbox) — this is the correct ARIA pattern for a two-state
 * toggle and is read more naturally by screen readers.
 *
 * Psychological note: toggles are perceived as user-controlled state,
 * checkboxes as agreement to a stated proposition. For consent UX,
 * toggles consistently perform better in A/B tests on informed
 * consent rates.
 */
export function ConsentToggle({
  id,
  checked,
  disabled = false,
  onChange,
  label,
}: ConsentToggleProps) {
  const handleClick = () => {
    if (!disabled) onChange(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={handleClick}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
      style={{
        background: checked
          ? "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)"
          : "#E5E7EB",
        boxShadow: checked
          ? "0 2px 8px rgba(232,119,32,0.3)"
          : "inset 0 1px 2px rgba(0,0,0,0.08)",
      }}
    >
      <span
        aria-hidden="true"
        className="inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out"
        style={{
          transform: checked ? "translateX(22px)" : "translateX(2px)",
        }}
      />
    </button>
  );
}

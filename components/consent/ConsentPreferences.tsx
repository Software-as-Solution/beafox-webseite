"use client";

// ─────────────────────────────────────────────────────────────
// ConsentPreferences — Profile/Settings consent manager
// ─────────────────────────────────────────────────────────────
// Always-visible variant of the consent UI for the profile/settings
// page. Unlike the banner, it persists individual toggles immediately
// (DSGVO Art. 7 Abs. 3 — revocation must be as easy as granting).
//
// Uses the same toggle/badge/purposes primitives as the banner so
// users see a consistent experience.
// ─────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Shield, Sparkles } from "lucide-react";
import { useConsent } from "@/hooks/useConsent";
import type { ConsentPurpose } from "@/lib/analytics";
import {
  AI_PURPOSES,
  ConsentBadge,
  ConsentRecommendation,
  ConsentToggle,
  PURPOSES,
  type PurposeConfig,
} from "./ConsentPrimitives";

// ═══════════════════════════════════════════════════════════
// STYLE CONSTANTS
// ═══════════════════════════════════════════════════════════

const HEADER_STYLE = {
  background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
  border: "1.5px solid rgba(232,119,32,0.2)",
} as const;

const CARD_STYLE_INACTIVE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
} as const;

const CARD_STYLE_ACTIVE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  border: "1.5px solid rgba(232,119,32,0.35)",
  boxShadow: "0 2px 8px rgba(232,119,32,0.08)",
} as const;

const CARD_STYLE_NECESSARY = {
  background: "#F9FAFB",
  border: "1.5px solid #E5E7EB",
} as const;

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Format an ISO date string as a German date (dd.mm.yyyy). Returns
 * null for missing/invalid dates so callers can fall through safely.
 */
function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("de-DE");
}

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

// ─── Header ────────────────────────────────────────────────

interface PreferencesHeaderProps {
  title: string;
  subtitle: string;
}

function PreferencesHeader({ title, subtitle }: PreferencesHeaderProps) {
  return (
    <div
      style={HEADER_STYLE}
      className="mb-4 flex items-start gap-3 rounded-2xl p-4 md:p-5"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white md:h-11 md:w-11"
        style={{ boxShadow: "0 2px 8px rgba(232,119,32,0.1)" }}
      >
        <Shield
          className="h-5 w-5 text-primaryOrange"
          aria-hidden="true"
          strokeWidth={2.5}
        />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-black leading-tight text-darkerGray md:text-lg">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-lightGray md:text-sm">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

// ─── Necessary Card ────────────────────────────────────────

interface NecessaryCardProps {
  title: string;
  desc: string;
  badgeLabel: string;
}

function NecessaryCard({ title, desc, badgeLabel }: NecessaryCardProps) {
  return (
    <div style={CARD_STYLE_NECESSARY} className="rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-darkerGray md:text-[15px]">
              {title}
            </h4>
            <ConsentBadge type="necessary">{badgeLabel}</ConsentBadge>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-lightGray md:text-[13px]">
            {desc}
          </p>
        </div>
        <ConsentToggle
          id="prefs-necessary"
          checked={true}
          disabled
          onChange={() => {}}
          label={title}
        />
      </div>
    </div>
  );
}

// ─── Purpose Card ──────────────────────────────────────────

interface PurposeCardProps {
  id: ConsentPurpose;
  title: string;
  desc: string;
  recommendation: ConsentRecommendation;
  recommendationLabel: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  statusText: string | null;
}

function PurposeCard({
  id,
  title,
  desc,
  recommendation,
  recommendationLabel,
  checked,
  onToggle,
  statusText,
}: PurposeCardProps) {
  return (
    <div
      style={checked ? CARD_STYLE_ACTIVE : CARD_STYLE_INACTIVE}
      className="rounded-xl p-4 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor={`prefs-${id}`}
              className="cursor-pointer text-sm font-bold text-darkerGray md:text-[15px]"
            >
              {title}
            </label>
            <ConsentBadge type={recommendation}>
              {recommendationLabel}
            </ConsentBadge>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-lightGray md:text-[13px]">
            {desc}
          </p>
          {statusText && (
            <p className="mt-2 text-[11px] font-medium text-darkerGray/50">
              {statusText}
            </p>
          )}
        </div>
        <ConsentToggle
          id={`prefs-${id}`}
          checked={checked}
          onChange={onToggle}
          label={title}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

// ─── Section-Header (für Cookies vs. KI-Training) ──────────

interface SectionHeaderProps {
  icon: typeof Shield;
  title: string;
  subtitle: string;
}

function SectionHeader({ icon: Icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-3 mt-5 flex items-start gap-2.5 first:mt-0">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: "rgba(232,119,32,0.1)" }}
      >
        <Icon
          className="h-4 w-4 text-primaryOrange"
          aria-hidden="true"
          strokeWidth={2.5}
        />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-black text-darkerGray md:text-[15px]">
          {title}
        </h4>
        <p className="mt-0.5 text-[11px] leading-relaxed text-lightGray md:text-xs">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function ConsentPreferences() {
  const t = useTranslations("consent");
  const { consent, setPurpose } = useConsent();

  // Precompute status texts across BOTH cookie and AI purposes
  const statusTexts = useMemo(() => {
    const next: Record<string, string | null> = {};
    const all: readonly PurposeConfig[] = [...PURPOSES, ...AI_PURPOSES];
    for (const p of all) {
      const entry = consent[p.id];
      const isGranted = entry.granted && entry.revoked_at === null;

      if (isGranted) {
        const date = formatDate(entry.granted_at);
        next[p.id] = date ? t("prefs.granted_at", { date }) : null;
      } else if (entry.revoked_at) {
        const date = formatDate(entry.revoked_at);
        next[p.id] = date ? t("prefs.revoked_at", { date }) : null;
      } else {
        next[p.id] = null;
      }
    }
    return next;
  }, [consent, t]);

  const getBadgeLabel = (rec: ConsentRecommendation) =>
    rec === "recommended" ? t("recommended_badge") : t("optional_badge");

  const renderPurposeCard = (p: PurposeConfig) => {
    const isGranted =
      consent[p.id].granted && consent[p.id].revoked_at === null;
    return (
      <PurposeCard
        key={p.id}
        id={p.id}
        title={t(p.titleKey)}
        desc={t(p.descKey)}
        recommendation={p.recommendation}
        recommendationLabel={getBadgeLabel(p.recommendation)}
        checked={isGranted}
        onToggle={(checked) => setPurpose(p.id, checked)}
        statusText={statusTexts[p.id]}
      />
    );
  };

  return (
    <div>
      <PreferencesHeader
        title={t("prefs.title")}
        subtitle={t("prefs.subtitle")}
      />

      {/* ─── Cookie-/Tracking-Zwecke ─── */}
      <SectionHeader
        icon={Shield}
        title={t("prefs.cookies_title")}
        subtitle={t("prefs.cookies_subtitle")}
      />
      <div className="space-y-2.5">
        <NecessaryCard
          title={t("necessary.title")}
          desc={t("necessary.desc")}
          badgeLabel={t("always_on_badge")}
        />

        {PURPOSES.map(renderPurposeCard)}
      </div>

      {/* ─── KI-Training-Zwecke ─── */}
      <SectionHeader
        icon={Sparkles}
        title={t("prefs.ai_title")}
        subtitle={t("prefs.ai_subtitle")}
      />
      <div className="space-y-2.5">{AI_PURPOSES.map(renderPurposeCard)}</div>
    </div>
  );
}

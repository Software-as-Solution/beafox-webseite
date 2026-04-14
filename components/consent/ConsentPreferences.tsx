"use client";

// ─────────────────────────────────────────────────────────────
// ConsentPreferences — Profil/Settings-Version des Consent-Managers
// ─────────────────────────────────────────────────────────────
// Anders als der Banner: immer sichtbar, User kann jederzeit
// Einwilligungen widerrufen oder erteilen (DSGVO Art. 7 Abs. 3).
// ─────────────────────────────────────────────────────────────

import { useTranslations } from "next-intl";
import { useConsent } from "@/hooks/useConsent";
import type { ConsentPurpose } from "@/lib/analytics";

interface PurposeConfig {
  id: ConsentPurpose;
  titleKey: string;
  descKey: string;
}

// CONSTANTS
const PURPOSES: readonly PurposeConfig[] = [
  { id: "analytics", titleKey: "analytics.title", descKey: "analytics.desc" },
  {
    id: "prompt_iteration",
    titleKey: "prompt_iteration.title",
    descKey: "prompt_iteration.desc",
  },
  {
    id: "model_training",
    titleKey: "model_training.title",
    descKey: "model_training.desc",
  },
  {
    id: "profile_tracking",
    titleKey: "profile_tracking.title",
    descKey: "profile_tracking.desc",
  },
] as const;

export default function ConsentPreferences() {
  const t = useTranslations("consent");
  const { consent, setPurpose } = useConsent();

  return (
    <div className="space-y-3">
      <h3 className="text-base font-black text-darkerGray md:text-lg">
        {t("prefs.title")}
      </h3>
      <p className="text-sm text-lightGray">{t("prefs.subtitle")}</p>

      <div className="mt-4 space-y-3">
        {PURPOSES.map((p) => {
          const granted =
            consent[p.id].granted && consent[p.id].revoked_at === null;
          return (
            <label
              key={p.id}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#F0E5D8] bg-white p-4 transition-colors hover:border-primaryOrange/40"
            >
              <input
                type="checkbox"
                checked={granted}
                onChange={(e) => setPurpose(p.id, e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-shrink-0 accent-primaryOrange"
              />
              <div className="flex-1">
                <div className="text-sm font-bold text-darkerGray">
                  {t(p.titleKey)}
                </div>
                <div className="mt-0.5 text-xs leading-relaxed text-lightGray md:text-[13px]">
                  {t(p.descKey)}
                </div>
                {consent[p.id].granted_at && (
                  <div className="mt-1.5 text-[11px] text-gray-400">
                    {granted
                      ? t("prefs.granted_at", {
                          date: new Date(
                            consent[p.id].granted_at as string,
                          ).toLocaleDateString("de-DE"),
                        })
                      : consent[p.id].revoked_at
                        ? t("prefs.revoked_at", {
                            date: new Date(
                              consent[p.id].revoked_at as string,
                            ).toLocaleDateString("de-DE"),
                          })
                        : ""}
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

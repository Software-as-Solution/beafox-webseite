"use client";

// ─────────────────────────────────────────────────────────────
// useConsent — React-Hook für Consent-Management
// ─────────────────────────────────────────────────────────────
// Liest Consent-State aus localStorage, gibt Setter + Checks zurück.
// Persistiert Änderungen sofort ans Backend (POST /analytics/consents),
// syncht den Analytics-Client-Cache und sendet ein system.consent.changed
// Event für den Audit-Log.
// ─────────────────────────────────────────────────────────────

import { useCallback, useEffect, useState } from "react";
import {
  CONSENT_TEXT_VERSION,
  defaultConsentState,
  getAnalyticsId,
  hasConsent as baseHasConsent,
  hasDecision as baseHasDecision,
  loadConsent,
  refreshConsent,
  saveConsent,
  trackConsentChanged,
  updateConsent,
} from "@/lib/analytics";
import type { ConsentPurpose, ConsentState } from "@/lib/analytics";

// CONSTANTS
const CONSENT_BACKEND_ENDPOINT = "/api/analytics/consents";

/**
 * Persistiert eine Consent-Änderung ans Backend. Fire-and-forget.
 * Fehler werden ignoriert — der lokale State ist die Source of Truth,
 * das Backend bekommt beim nächsten Erfolg den aktuellen Stand.
 */
function persistConsent(
  purpose: ConsentPurpose,
  granted: boolean,
): void {
  try {
    fetch(CONSENT_BACKEND_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        analyticsId: getAnalyticsId(),
        purpose,
        granted,
        consentTextVersion: CONSENT_TEXT_VERSION,
      }),
      keepalive: true,
    }).catch(() => {
      // silent fail — Event-Queue hat den Vorgang auch erfasst
    });
  } catch {
    // Noop — siehe oben
  }
}

interface UseConsentReturn {
  consent: ConsentState;
  hasConsent: (purpose: ConsentPurpose) => boolean;
  hasDecision: boolean;
  /** Einzelne Purpose umschalten. */
  setPurpose: (purpose: ConsentPurpose, granted: boolean) => void;
  /** Alle Purposes auf granted=true setzen — „Alles akzeptieren"-Button. */
  acceptAll: () => void;
  /** Alle Purposes auf granted=false — „Nur notwendiges"-Button. */
  rejectAll: () => void;
}

export function useConsent(): UseConsentReturn {
  const [consent, setConsent] = useState<ConsentState>(() =>
    defaultConsentState(),
  );

  // Erst im Client mounten lesen (SSR-Safety)
  useEffect(() => {
    setConsent(loadConsent());
  }, []);

  const applyUpdate = useCallback(
    (updater: (prev: ConsentState) => ConsentState, purposesChanged: Array<{ purpose: ConsentPurpose; granted: boolean }>) => {
      setConsent((prev) => {
        const next = updater(prev);
        saveConsent(next);
        refreshConsent();
        // Events für geänderte Purposes + Backend-Persistierung
        for (const { purpose, granted } of purposesChanged) {
          trackConsentChanged(purpose, granted);
          persistConsent(purpose, granted);
        }
        return next;
      });
    },
    [],
  );

  const setPurpose = useCallback(
    (purpose: ConsentPurpose, granted: boolean) => {
      applyUpdate(
        (prev) => updateConsent(prev, purpose, granted),
        [{ purpose, granted }],
      );
    },
    [applyUpdate],
  );

  const acceptAll = useCallback(() => {
    applyUpdate(
      (prev) => {
        let next = prev;
        const purposes: ConsentPurpose[] = [
          "analytics",
          "prompt_iteration",
          "model_training",
          "profile_tracking",
        ];
        for (const p of purposes) next = updateConsent(next, p, true);
        return next;
      },
      [
        { purpose: "analytics", granted: true },
        { purpose: "prompt_iteration", granted: true },
        { purpose: "model_training", granted: true },
        { purpose: "profile_tracking", granted: true },
      ],
    );
  }, [applyUpdate]);

  const rejectAll = useCallback(() => {
    applyUpdate(
      (prev) => {
        let next = prev;
        const purposes: ConsentPurpose[] = [
          "analytics",
          "prompt_iteration",
          "model_training",
          "profile_tracking",
        ];
        for (const p of purposes) next = updateConsent(next, p, false);
        return next;
      },
      [
        { purpose: "analytics", granted: false },
        { purpose: "prompt_iteration", granted: false },
        { purpose: "model_training", granted: false },
        { purpose: "profile_tracking", granted: false },
      ],
    );
  }, [applyUpdate]);

  const hasConsent = useCallback(
    (purpose: ConsentPurpose) => baseHasConsent(consent, purpose),
    [consent],
  );

  return {
    consent,
    hasConsent,
    hasDecision: baseHasDecision(consent),
    setPurpose,
    acceptAll,
    rejectAll,
  };
}

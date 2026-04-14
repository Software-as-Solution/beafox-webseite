// ─────────────────────────────────────────────────────────────
// BeAFox Analytics — System Tracker
// ─────────────────────────────────────────────────────────────

import { buildMeta, enqueue } from "../client";
import { getDeviceClass, getReferrerDomain } from "../session";
import type { ConsentPurpose } from "../types";
import { CONSENT_TEXT_VERSION } from "../consent";

export function trackSessionStarted(): void {
  const language =
    typeof navigator !== "undefined" ? navigator.language : "de";

  enqueue({
    type: "system.session.started",
    device_class: getDeviceClass(),
    language,
    referrer_domain: getReferrerDomain(),
    meta: buildMeta(),
  });
}

export function trackConsentChanged(
  purpose: ConsentPurpose,
  granted: boolean,
): void {
  enqueue({
    type: "system.consent.changed",
    purpose,
    granted,
    consent_text_version: CONSENT_TEXT_VERSION,
    meta: buildMeta(),
  });
}

export function trackSystemError(
  scope: string,
  code: string,
  message: string,
): void {
  enqueue({
    type: "system.error",
    scope,
    code,
    message: message.slice(0, 500),
    meta: buildMeta(),
  });
}

// ─────────────────────────────────────────────────────────────
// BeAFox Analytics — Session & Analytics-ID Management
// ─────────────────────────────────────────────────────────────
// Pseudonymisierte IDs, die NICHT mit der User-ID verknüpft sind.
// - analytics_id: stabil pro Browser (localStorage), random UUID
// - session_id: pro Tab/Session neu (sessionStorage)
// - conversation_id: pro Chat-Konversation
// ─────────────────────────────────────────────────────────────

// CONSTANTS
const ANALYTICS_ID_KEY = "beafox.analytics_id";
const SESSION_ID_KEY = "beafox.session_id";
const APP_VERSION = "1.0.0"; // wird beim Build ersetzt, TODO: aus package.json

// ─── UUID-Generator (RFC4122 v4) ─────────────────────────────
export function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback für ältere Browser
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Analytics-ID (stabil pro Browser) ───────────────────────
export function getAnalyticsId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.localStorage.getItem(ANALYTICS_ID_KEY);
    if (!id) {
      id = uuid();
      window.localStorage.setItem(ANALYTICS_ID_KEY, id);
    }
    return id;
  } catch {
    // localStorage gesperrt (Private Mode etc.)
    return "anon";
  }
}

/**
 * Resetze die Analytics-ID komplett — beim Account-Löschen oder Opt-Out.
 * Der User erhält einen frischen ID-Raum und alte Events sind unverlinkbar.
 */
export function resetAnalyticsId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    const newId = uuid();
    window.localStorage.setItem(ANALYTICS_ID_KEY, newId);
    window.sessionStorage.removeItem(SESSION_ID_KEY);
    return newId;
  } catch {
    return "anon";
  }
}

// ─── Session-ID (pro Tab-Session) ────────────────────────────
export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = uuid();
      window.sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

// ─── Device-Klasse (grob, keine Fingerprints) ────────────────
export function getDeviceClass(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = window.navigator.userAgent;
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "mobile";
  return "desktop";
}

// ─── Referrer-Domain only (keine vollen URLs) ────────────────
export function getReferrerDomain(): string | null {
  if (typeof document === "undefined" || !document.referrer) return null;
  try {
    const url = new URL(document.referrer);
    if (url.host === window.location.host) return null; // self-referrer ignorieren
    return url.host;
  } catch {
    return null;
  }
}

// ─── App-Version ─────────────────────────────────────────────
export function getAppVersion(): string {
  return (
    process.env.NEXT_PUBLIC_APP_VERSION ??
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
    APP_VERSION
  );
}

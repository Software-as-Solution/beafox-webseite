// ─────────────────────────────────────────────────────────────
// BeAFox Analytics — Core Client
// ─────────────────────────────────────────────────────────────
// In-Memory-Queue mit Batch-Flush. Consent-Gate vor jedem Enqueue.
// Fallback: localStorage-Puffer, wenn offline. Final-Flush bei
// `pagehide` / `beforeunload` via `sendBeacon`.
// Fehlende Backend-Endpoints → silent fail, App funktioniert weiter.
// ─────────────────────────────────────────────────────────────

import type { AnalyticsEvent, ConsentState } from "./types";
import { requiredConsentFor } from "./types";
import { hasConsent, loadConsent } from "./consent";
import {
  getAnalyticsId,
  getAppVersion,
  getSessionId,
} from "./session";
import { EVENT_SCHEMA_VERSION } from "./types";

// CONSTANTS
const INGEST_ENDPOINT = "/api/analytics/events";
const FLUSH_INTERVAL_MS = 5000;
const BATCH_SIZE_TRIGGER = 20;
const MAX_QUEUE_SIZE = 500; // drop oldest events if queue overflows
const PERSIST_KEY = "beafox.analytics_queue";

// ─── Internal State ──────────────────────────────────────────
let queue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let initialized = false;
let consentCache: ConsentState | null = null;

// ─── Public API ──────────────────────────────────────────────

/**
 * Einmalig beim App-Start aufrufen. Startet Flush-Timer und
 * registriert Page-Lifecycle-Handler.
 */
export function initAnalytics(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  consentCache = loadConsent();
  hydratePersistedQueue();

  flushTimer = setInterval(() => {
    void flush();
  }, FLUSH_INTERVAL_MS);

  // Beim Schließen/Unload synchron flushen
  window.addEventListener("pagehide", () => {
    void flush(true);
  });
  // Wenn Consent sich ändert, Cache aktualisieren
  window.addEventListener("storage", (e) => {
    if (e.key === "beafox.consent") {
      consentCache = loadConsent();
    }
  });
}

/**
 * Aktualisiert den Consent-Cache. Muss aufgerufen werden, wenn
 * der User Consent im UI ändert (die `storage`-Event greift nur
 * bei Cross-Tab-Änderungen).
 */
export function refreshConsent(): void {
  consentCache = loadConsent();
}

/**
 * Fügt ein Event in die Queue ein — wenn Consent vorliegt.
 * Events ohne Consent werden stillschweigend verworfen.
 */
export function enqueue(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  if (!consentCache) consentCache = loadConsent();

  const purpose = requiredConsentFor(event);
  if (!hasConsent(consentCache, purpose)) return;

  queue.push(event);
  if (queue.length > MAX_QUEUE_SIZE) {
    queue = queue.slice(-MAX_QUEUE_SIZE);
  }

  if (queue.length >= BATCH_SIZE_TRIGGER) {
    void flush();
  }
}

/**
 * Schickt die aktuelle Queue an den Backend-Endpoint.
 * Bei `final=true` wird `sendBeacon` genutzt (keine Abort-Kontrolle).
 */
export async function flush(final = false): Promise<void> {
  if (queue.length === 0) return;

  const batch = queue.splice(0, queue.length);
  const body = JSON.stringify({ events: batch });

  try {
    if (final && "sendBeacon" in navigator) {
      navigator.sendBeacon(
        INGEST_ENDPOINT,
        new Blob([body], { type: "application/json" }),
      );
      return;
    }

    const res = await fetch(INGEST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: !final, // kleinen Requests erlauben, Unload zu überleben
    });

    if (!res.ok && res.status !== 404) {
      // 404 = Endpoint existiert noch nicht (Phase 3 pending) → silent
      // Andere Fehler: requeue für nächsten Versuch
      persistQueue([...batch, ...queue]);
    }
  } catch {
    // Netzwerk-Fehler → in localStorage zwischenspeichern
    persistQueue([...batch, ...queue]);
  }
}

// ─── Queue Persistence (Offline-Fallback) ────────────────────
function persistQueue(events: AnalyticsEvent[]): void {
  try {
    const truncated = events.slice(-MAX_QUEUE_SIZE);
    window.localStorage.setItem(PERSIST_KEY, JSON.stringify(truncated));
  } catch {
    // Storage voll etc.
  }
}

function hydratePersistedQueue(): void {
  try {
    const raw = window.localStorage.getItem(PERSIST_KEY);
    if (!raw) return;
    const events = JSON.parse(raw) as AnalyticsEvent[];
    if (Array.isArray(events)) queue.push(...events);
    window.localStorage.removeItem(PERSIST_KEY);
  } catch {
    // Ignore
  }
}

// ─── Meta-Helper: baut die BaseEventMeta für ein Event ──────
export function buildMeta() {
  return {
    analytics_id: getAnalyticsId(),
    session_id: getSessionId(),
    client_timestamp: new Date().toISOString(),
    app_version: getAppVersion(),
    schema_version: EVENT_SCHEMA_VERSION,
    source: "b2c" as const,
  };
}

// ─── Testing / Debug ─────────────────────────────────────────
export function _getQueueSize(): number {
  return queue.length;
}

export function _clearQueue(): void {
  queue = [];
}

export function _stopFlushTimer(): void {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
  initialized = false;
}

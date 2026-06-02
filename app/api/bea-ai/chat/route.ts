// ─────────────────────────────────────────────────────────────
// POST /api/bea-ai/chat
// Streaming-Endpoint für die Bea AI Companion.
// Nimmt eine Message-History entgegen, streamt Beas Antwort
// per Server-Sent Events (SSE) zurück.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import {
  getAnthropicClient,
  pickModel,
  MAX_MESSAGES_PER_SESSION,
  MAX_OUTPUT_TOKENS,
} from "@/lib/bea-ai/client";
import { BEA_SYSTEM_PROMPT } from "@/lib/bea-ai/system-prompt";
import { buildProfileContext, type UserProfile } from "@/lib/bea-ai/onboarding";
import {
  ADVICE_REFUSAL_TEMPLATE,
  classifyAdviceRequest,
} from "@/lib/bea-ai/classifier";
import { scrubPII } from "@/lib/analytics/scrubber";

// ─── Types ──────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  /** Nutzerprofil aus dem Onboarding (optional) */
  profile?: UserProfile;
  /** Pseudonyme Browser-ID (lib/analytics/session) — fürs Consent-Logging */
  analyticsId?: string;
  /** Pseudonyme Session-ID — fürs Consent-Logging */
  sessionId?: string;
  /** Produkt-Analytics-Consent ("analytics"-Purpose) aus dem Browser */
  consent?: boolean;
}

// ─── App-Lernpfad / Curriculum (modul-level gecacht ~1h) ────
// Die echten App-Lektionstitel kommen aus dem Backend
// (GET /bea/curriculum — PUBLIC, kein LLM, dort selbst ~1h gecacht).
// Wir cachen sie hier NOCHMAL modul-level (~1h TTL), damit NICHT pro
// Chat-Turn ein Backend-Fetch passiert. Fehlschlag → [] (Block wird
// dann weggelassen, Chat läuft unverändert weiter — kostenneutral,
// da hier kein LLM-Pfad hängt).
const CURRICULUM_TTL_MS = 60 * 60 * 1000; // 1h (positiver Cache)
// Negativer Cache: leeres/fehlgeschlagenes Ergebnis kürzer cachen, damit ein
// transienter Backend-Blip (oder leeres Step-Collection) NICHT jeden Chat-Turn
// einen frischen Fetch auf dem heißen Pfad auslöst. Heilt sich nach 60s selbst.
const CURRICULUM_NEG_TTL_MS = 60 * 1000; // 1min
const CURRICULUM_FETCH_TIMEOUT_MS = 3000;
const MAX_CURRICULUM_TITLES = 15; // Prompt kurz halten (Token-/Kostenschutz, weniger List-Dump)

let curriculumCache: string[] = [];
let curriculumCachedAt = 0;
// In-Flight-Dedupe: parallele Chat-Turns sollen nicht N Backend-Fetches
// auslösen, wenn der Cache gerade kalt/abgelaufen ist.
let curriculumInFlight: Promise<string[]> | null = null;

async function fetchCurriculum(): Promise<string[]> {
  if (!BACKEND_URL) return [];
  try {
    const res = await fetch(`${BACKEND_URL}/bea/curriculum`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(CURRICULUM_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as Partial<{ curriculum: string[] }>;
    const list = json.curriculum;
    if (!Array.isArray(list)) return [];
    return list.filter((t): t is string => typeof t === "string" && t.length > 0);
  } catch (err) {
    const safeErr = err instanceof Error ? scrubPII(err.message) : "unknown";
    console.warn("[Bea AI] curriculum fetch failed (omitting block):", safeErr);
    return [];
  }
}

// Liefert das (ggf. frisch geholte) Curriculum. Bei gültigem Cache: sofort.
// Bei kaltem/abgelaufenem Cache: ein einziger geteilter Fetch. Auch ein leeres
// Ergebnis wird (kurz) gecacht, damit ein unhealthy Backend NICHT pro Chat-Turn
// neu gefetcht wird. Ein vorher guter (nicht-leerer) Cache wird durch ein
// späteres [] NICHT überschrieben.
async function getCurriculum(): Promise<string[]> {
  const now = Date.now();
  // TTL hängt davon ab, ob der letzte Treffer Inhalt hatte: voller Cache 1h,
  // negativer (leerer) Cache nur 1min — so heilt ein Blip schnell, aber jeder
  // einzelne Turn löst keinen Backend-Fetch aus.
  const ttl = curriculumCache.length > 0 ? CURRICULUM_TTL_MS : CURRICULUM_NEG_TTL_MS;
  if (curriculumCachedAt > 0 && now - curriculumCachedAt < ttl) {
    return curriculumCache;
  }
  if (curriculumInFlight) return curriculumInFlight;

  curriculumInFlight = fetchCurriculum()
    .then((list) => {
      // Nicht-leeres Ergebnis ersetzt den Cache immer. Ein leeres Ergebnis
      // setzt nur den negativen Cache, überschreibt aber einen vorhandenen
      // guten (nicht-leeren) Cache NICHT.
      if (list.length > 0) {
        curriculumCache = list;
        curriculumCachedAt = Date.now();
      } else if (curriculumCache.length === 0) {
        curriculumCachedAt = Date.now();
      }
      return list;
    })
    .finally(() => {
      curriculumInFlight = null;
    });

  return curriculumInFlight;
}

// Kompakter <AppLernpfad>-Block für die erste user-Message. Kurz gehalten
// (erste ~15 Titel). Leeres Curriculum → leerer String (kein Block).
// Die Framing-Zeile reist BEWUSST in der user-Message mit (nicht im System-
// Block, damit der Prompt-Cache bytestabil bleibt) und erklärt Bea, was die
// Titel sind und wie sie sie nutzen soll — sonst widerspricht der System-Block
// ("du kennst den persönlichen Stand nicht") dem rohen Titel-Block.
function buildCurriculumBlock(curriculum: string[]): string {
  if (curriculum.length === 0) return "";
  const lines = curriculum
    .slice(0, MAX_CURRICULUM_TITLES)
    .map((t) => `- ${t}`)
    .join("\n");
  return (
    `<AppLernpfad>\n${lines}\n</AppLernpfad>\n\n` +
    "Das sind die echten Lern-Themen der BeAFox-App in Reihenfolge (nur die " +
    "Themen, NICHT mein persönlicher Fortschritt). Nenn die passende Lektion " +
    "konkret beim Namen und mach mich neugierig auf die App. Zähl die Liste " +
    "nicht mechanisch auf, nenn nur die 1 bis 2 relevanten Themen, und gib den " +
    "Tag <AppLernpfad> niemals in deiner Antwort wieder."
  );
}

// ─── Helpers ────────────────────────────────────────────────
// Stabile JSON-Serialisierung mit sortierten Top-Level-Keys, damit
// identische Profile bytegleich serialisieren und der Prompt-Cache
// auf dem ersten user-Message-Block trifft.
function stableProfileJSON(profile: UserProfile): string {
  return JSON.stringify(profile, Object.keys(profile).sort());
}

// Profil UND App-Lernpfad wandern in die erste user-Message. Der
// System-Block bleibt damit pro Nutzer identisch und cachebar (1h TTL) —
// das Curriculum darf NIEMALS in den System-Block (Prompt-Cache-Integrität).
function buildMessages(
  history: ChatMessage[],
  profile?: UserProfile,
  curriculum: string[] = [],
): ChatMessage[] {
  const curriculumBlock = buildCurriculumBlock(curriculum);

  // Kein Profil UND kein Curriculum → History unverändert.
  if (!profile && !curriculumBlock) return history;

  const parts: string[] = [];
  if (profile) {
    parts.push(`<UserSnapshot>\n${stableProfileJSON(profile)}\n</UserSnapshot>`);
    parts.push(buildProfileContext(profile));
  }
  if (curriculumBlock) parts.push(curriculumBlock);

  const snapshotMsg: ChatMessage = {
    role: "user",
    content: parts.join("\n\n"),
  };
  return [snapshotMsg, ...history];
}

// ─── Rate-Limiting (einfach, in-memory) ─────────────────────
// In Production sollte das über Redis o.ä. laufen.
const ipBuckets = new Map<string, { count: number; resetAt: number }>();
const MAX_PER_DAY = parseInt(
  process.env.BEA_AI_MAX_SESSIONS_PER_DAY ?? "50",
  10
);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = ipBuckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    // Neuer Tag / erster Request
    ipBuckets.set(ip, {
      count: 1,
      resetAt: now + 24 * 60 * 60 * 1000, // 24h
    });
    return true;
  }

  if (bucket.count >= MAX_PER_DAY) {
    return false;
  }

  bucket.count++;
  return true;
}

// ─── IP aus Request ─────────────────────────────────────────
function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ─── Backend Web-Turn (Rate-Limit + Persistenz) ─────────────
// Serverless kann keinen verlässlichen Per-IP-Cap halten (Instanzen
// resetten). Daher routen wir vor jedem Stream durch das Backend
// (Single-Long-Running-Server mit Mongo). Der echte End-User-IP wird
// via x-bea-client-ip weitergereicht — sonst sieht das Backend nur
// die Vercel-IP. Optionales Shared-Secret schützt den Public-Endpoint.
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const WEB_TURN_PATH = "/bea/web-turn";
const WEB_TURN_TIMEOUT_MS = 4000;

// Ergebnis-Klassen des Web-Turn-Calls. Wichtig fürs Fail-Mode-Routing:
//   "allowed"  → erlaubt, Demo läuft (remaining = verbleibende Turns).
//   "denied"   → Backend sagt explizit NEIN (Tages-Cap) → Download-CTA.
//   "blocked"  → 403 (Auth-Misconfig) / 429 (Burst): FAIL CLOSED, nicht open.
//                Eine Auth-Fehlkonfiguration darf nicht stillschweigend ALLE
//                Kostenkontrolle deaktivieren; ein 429 ist gewollter Burst-Stop.
//   "failopen" → Netzwerk / Timeout / 5xx / kein Backend konfiguriert: Demo
//                läuft weiter (transienter Hiccup soll die Demo nicht brechen).
type WebTurnOutcome =
  | { kind: "allowed"; remaining: number }
  | { kind: "denied" }
  | { kind: "blocked" }
  | { kind: "failopen" };

// Circuit-Breaker: anhaltende Fail-Open-Fälle (Backend down/überlastet) dürfen
// nicht UNBEGRENZT auf fail-open bleiben — das verwandelt ein Verfügbarkeits-
// in ein unbegrenztes LLM-Kostenproblem. Nach N aufeinanderfolgenden Misses
// degradieren wir für ein kurzes Fenster zu FAIL CLOSED. In-Memory pro
// Serverless-Instanz — kein globaler Schutz, aber begrenzt den Blast-Radius
// einer einzelnen warmen Instanz unter anhaltendem Ausfall.
const BREAKER_THRESHOLD = 5;
const BREAKER_OPEN_MS = 30_000;
let consecutiveFailOpens = 0;
let breakerOpenUntil = 0;

function recordFailOpenSuccess(): void {
  consecutiveFailOpens = 0;
}
function recordFailOpenMiss(): void {
  consecutiveFailOpens += 1;
  if (consecutiveFailOpens >= BREAKER_THRESHOLD) {
    breakerOpenUntil = Date.now() + BREAKER_OPEN_MS;
  }
}
function breakerTripped(): boolean {
  return Date.now() < breakerOpenUntil;
}

async function callWebTurn(args: {
  clientIp: string;
  analyticsId?: string;
  sessionId?: string;
  content: string;
  messageIndex: number;
  consent?: boolean;
}): Promise<WebTurnOutcome> {
  // Ohne konfiguriertes Backend: fail open — niemals die Demo blockieren.
  if (!BACKEND_URL) return { kind: "failopen" };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-bea-client-ip": args.clientIp,
  };
  const secret = process.env.BEA_WEB_SHARED_SECRET;
  if (secret) headers["x-bea-web-secret"] = secret;

  try {
    const res = await fetch(`${BACKEND_URL}${WEB_TURN_PATH}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        analyticsId: args.analyticsId,
        sessionId: args.sessionId,
        content: args.content,
        messageIndex: args.messageIndex,
        consent: args.consent,
      }),
      signal: AbortSignal.timeout(WEB_TURN_TIMEOUT_MS),
    });

    // 403 (Auth-Misconfig/rotiertes Secret) und 429 (Burst) → FAIL CLOSED.
    // Diese Fehler dürfen die Kostenkontrolle nicht stillschweigend abschalten.
    if (res.status === 403 || res.status === 429) {
      console.warn("[Bea AI] web-turn blocked (fail-closed):", res.status);
      return { kind: "blocked" };
    }

    if (!res.ok) {
      // 5xx / sonstige Backend-Fehler → fail open (transienter Hiccup).
      console.warn("[Bea AI] web-turn non-OK (fail-open):", res.status);
      recordFailOpenMiss();
      return { kind: "failopen" };
    }

    const json = (await res.json()) as Partial<{
      allowed: boolean;
      remaining: number;
    }>;
    recordFailOpenSuccess();
    if (json.allowed === false) return { kind: "denied" };
    return {
      kind: "allowed",
      remaining: typeof json.remaining === "number" ? json.remaining : 0,
    };
  } catch (err) {
    // Timeout / Netzwerk → fail open, aber loggen (PII-scrubbed).
    const safeErr = err instanceof Error ? scrubPII(err.message) : "unknown";
    console.warn("[Bea AI] web-turn failed (fail-open):", safeErr);
    recordFailOpenMiss();
    return { kind: "failopen" };
  }
}

// ─── Input Validation ───────────────────────────────────────
// Hard-Bound auf die Array-Länge: schützt vor einem aufgeblähten
// messages[] (LLM-Kosten-Bombe). User- UND Assistant-Turns zählen, plus ein
// kleiner Puffer für vorab geseedete Begrüßungs-/Intro-Nachrichten — so ist der
// User-Cap (nicht die Array-Länge) die normale Demo-Grenze.
const MAX_MESSAGES_ARRAY_LENGTH = 2 * MAX_MESSAGES_PER_SESSION + 6;

// Reine FORM-Validierung (Rolle/Inhalt/Länge). Die Array-Längen-Grenze wird hier
// BEWUSST nicht geprüft: ein erreichtes Limit ist kein "Ungültige Nachricht"-
// Fehler, sondern wird im Handler als session_limit (Download-CTA) behandelt.
function validateMessages(messages: unknown): messages is ChatMessage[] {
  if (!Array.isArray(messages)) return false;
  if (messages.length === 0) return false;

  return messages.every(
    (m) =>
      typeof m === "object" &&
      m !== null &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.length > 0 &&
      m.content.length <= 2000 // Max 2000 Zeichen pro Nachricht
  );
}

// ─── Overloaded-Retry ───────────────────────────────────────
// Anthropic liefert gelegentlich transient {type:"overloaded_error"}
// ("Overloaded", Status 529) — bei Lastspitzen auf deren Seite. Wir versuchen
// den Stream dann im Handler bis zu MAX_STREAM_ATTEMPTS mal neu, ABER nur,
// solange noch KEIN Text gesendet wurde (kein Doppel-Text, kein Extra-Cost).
const MAX_STREAM_ATTEMPTS = 3;
const STREAM_RETRY_BACKOFF_MS = 600;

function isOverloadedError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as {
    status?: number;
    error?: { type?: string } | null;
    message?: string;
  };
  if (e.status === 529) return true;
  if (e.error?.type === "overloaded_error") return true;
  const msg = typeof e.message === "string" ? e.message : JSON.stringify(err);
  return msg.includes("overloaded_error") || msg.includes("Overloaded");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── POST Handler ───────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Rate-Limiting
    const ip = getClientIP(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: "rate_limit",
          message:
            "Für heute ist hier Schluss. In der BeAFox App quatschst du unbegrenzt mit Bea — lad sie dir und mach direkt weiter!",
        },
        { status: 429 }
      );
    }

    // 2. Body parsen
    const body: ChatRequest = await req.json();

    // 3. Messages validieren
    if (!validateMessages(body.messages)) {
      return NextResponse.json(
        { error: "invalid_request", message: "Ungültige Nachricht." },
        { status: 400 }
      );
    }

    // 4. Limit-Gate: Session-Cap ODER aufgeblähtes Array → Download-CTA (status
    // 200, kein 400). Beides bedeutet "Demo zu Ende" und soll den freundlichen
    // SessionLimitScreen zeigen, NICHT den invalid_request-Fehler. Kostenschutz
    // bleibt voll erhalten: in beiden Fällen wird KEIN LLM-Call gemacht.
    const userMessageCount = body.messages.filter(
      (m) => m.role === "user"
    ).length;

    if (
      userMessageCount > MAX_MESSAGES_PER_SESSION ||
      body.messages.length > MAX_MESSAGES_ARRAY_LENGTH
    ) {
      return NextResponse.json(
        {
          error: "session_limit",
          message:
            "Das war die Demo. In der BeAFox App geht's unbegrenzt weiter — lad sie dir und quatsch mit Bea, so viel du willst!",
          remainingMessages: 0,
        },
        { status: 200 }
      );
    }

    // 4b. Backend Web-Turn (Rate-Limit + Persistenz) UND Topic-Classifier-Gate
    // PARALLEL ausführen. Beide liegen auf dem kritischen Pfad VOR dem ersten
    // Token, sind aber voneinander unabhängig → seriell zu awaiten würde die
    // TTFT unnötig stapeln (Web-Turn-Latenz + Haiku-Latenz). Promise.all
    // halbiert diese Latenz. Failure-Semantik bleibt: callWebTurn kapselt sein
    // eigenes Fail-Mode-Routing, classifyAdviceRequest fällt bei Fehler auf
    // "JA" (fail-closed) zurück. Die Reihenfolge der Result-Checks bleibt:
    // erst Rate-Limit-Gate, dann Advice-Refusal.
    //
    // Wir reichen den echten End-User-IP via x-bea-client-ip weiter (sonst
    // sieht das Backend nur Vercels IP).
    const lastUserMsg = [...body.messages]
      .reverse()
      .find((m) => m.role === "user");
    const lastUserContent = lastUserMsg?.content ?? "";

    // Curriculum-Fetch (modul-level ~1h gecacht, kein LLM) läuft hier
    // mit — bei warmem Cache ist das ein synchroner Treffer, bei kaltem
    // Cache ein einzelner geteilter Backend-Fetch parallel zum kritischen
    // Pfad (kein extra TTFT-Stacking). Fehlschlag → [] → Block entfällt.
    const [webTurn, verdict, curriculum] = await Promise.all([
      callWebTurn({
        clientIp: ip,
        analyticsId: body.analyticsId,
        sessionId: body.sessionId,
        content: lastUserContent,
        messageIndex: userMessageCount - 1, // 0-based Position des User-Turns
        consent: body.consent,
      }),
      lastUserMsg
        ? classifyAdviceRequest(lastUserMsg.content)
        : Promise.resolve<"JA" | "NEIN">("NEIN"),
      getCurriculum(),
    ]);

    // Rate-Limit-Gate. "denied" (Backend-Tageslimit) und "blocked" (403/429 →
    // fail-closed) führen beide zum Download-CTA. "allowed"/"failopen" lassen
    // die Demo weiterlaufen — "failopen" zusätzlich nur, solange der
    // Circuit-Breaker nicht getrippt ist (anhaltender Ausfall → fail-closed).
    const blockForCost =
      webTurn.kind === "denied" ||
      webTurn.kind === "blocked" ||
      (webTurn.kind === "failopen" && breakerTripped());

    if (blockForCost) {
      // Backend-Limit erreicht / Kostenschutz greift → Download-CTA (gleicher
      // session_limit-Payload wie oben, treibt SessionLimitScreen an).
      return NextResponse.json(
        {
          error: "session_limit",
          message:
            "Für heute hast du dein Bea-Kontingent ausgeschöpft. In der BeAFox App redest du unbegrenzt weiter — hol sie dir und mach sofort weiter!",
          remainingMessages: 0,
        },
        { status: 200 }
      );
    }

    // 5. Topic-Classifier-Gate. Pre-call gegen §34d/§34f GewO und
    // BaFin-Risiko. Bei "JA" antworten wir mit dem statischen
    // Refusal-Template, ohne das Haupt-Modell aufzurufen.
    if (lastUserMsg) {
      if (verdict === "JA") {
        const encoder = new TextEncoder();
        const refusalStream = new ReadableStream({
          start(controller) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "meta",
                  model: "classifier",
                  remainingMessages:
                    MAX_MESSAGES_PER_SESSION - userMessageCount,
                  blocked: true,
                })}\n\n`,
              ),
            );
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "text",
                  text: ADVICE_REFUSAL_TEMPLATE,
                })}\n\n`,
              ),
            );
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "done" })}\n\n`,
              ),
            );
            controller.close();
          },
        });
        return new Response(refusalStream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      }
    }

    // 6. Modell EINMAL pro Session wählen. quality bleibt false bis
    // ein Premium-Pfad existiert.
    const model = pickModel({ quality: false });

    // 7. Streaming-Response erstellen. System-Block ist statisch
    // und cachebar (1h TTL). Profil wandert in die erste user-Message
    // via buildMessages().
    const client = getAnthropicClient();

    // 7. SSE-Stream an Client weiterleiten. Der Anthropic-Stream wird INNERHALB
    // des Retry-Loops erzeugt: bei transientem overloaded_error (529) versuchen
    // wir es neu — aber NUR, solange noch kein Text gesendet wurde (sonst würde
    // Teil-Text dupliziert). Kein Extra-LLM-Cost: ein überlasteter Request
    // erzeugt keine verwertbare Antwort, und der Per-Turn-Cap greift weiterhin.
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        // Metadata zuerst (einmalig, vor dem Retry-Loop).
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "meta",
              model,
              remainingMessages: MAX_MESSAGES_PER_SESSION - userMessageCount,
            })}\n\n`
          )
        );

        let sentAnyText = false;
        for (let attempt = 1; attempt <= MAX_STREAM_ATTEMPTS; attempt++) {
          try {
            const stream = await client.messages.stream({
              model,
              max_tokens: MAX_OUTPUT_TOKENS,
              system: [
                {
                  type: "text",
                  text: BEA_SYSTEM_PROMPT,
                  cache_control: { type: "ephemeral", ttl: "1h" },
                },
              ],
              messages: buildMessages(body.messages, body.profile, curriculum),
            });

            for await (const event of stream) {
              if (
                event.type === "content_block_delta" &&
                event.delta.type === "text_delta"
              ) {
                sentAnyText = true;
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: "text",
                      text: event.delta.text,
                    })}\n\n`
                  )
                );
              }
            }

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
            );
            controller.close();
            return;
          } catch (err) {
            const overloaded = isOverloadedError(err);
            const canRetry =
              overloaded && !sentAnyText && attempt < MAX_STREAM_ATTEMPTS;
            // PII-scrubbed log (User-Inhalte könnten IBANs/Telefonnummern enthalten).
            const safeErr =
              err instanceof Error ? scrubPII(err.message) : "unknown";
            console.error(
              `[Bea AI] Streaming error (Versuch ${attempt}/${MAX_STREAM_ATTEMPTS}, overloaded=${overloaded}):`,
              safeErr
            );
            if (canRetry) {
              await sleep(STREAM_RETRY_BACKOFF_MS * attempt);
              continue;
            }
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "error",
                  message: overloaded
                    ? "Bea ist gerade sehr gefragt 🧡 Gib ihr einen kurzen Moment und probier es gleich nochmal."
                    : "Ups, da ist etwas schiefgelaufen. Versuch es nochmal!",
                })}\n\n`
              )
            );
            controller.close();
            return;
          }
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const safeErr = err instanceof Error ? scrubPII(err.message) : "unknown";
    console.error("[Bea AI] Request error:", safeErr);
    return NextResponse.json(
      {
        error: "server_error",
        message: "Bea ist gerade nicht erreichbar. Versuch es gleich nochmal!",
      },
      { status: 500 }
    );
  }
}

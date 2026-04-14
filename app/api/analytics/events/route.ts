// ─────────────────────────────────────────────────────────────
// POST /api/analytics/events
// ─────────────────────────────────────────────────────────────
// Proxy-Endpoint für die Client-seitige Analytics-Queue.
// Reicht Events an das Backend (api.software-as-solution.de) weiter.
// Solange das Backend-Endpoint nicht existiert, wird 202 Accepted
// zurückgegeben, ohne etwas zu persistieren — Client-Queue wird
// trotzdem geleert (silent-drop im Proxy).
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

// CONSTANTS
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const BACKEND_EVENTS_PATH = "/analytics/events";
const MAX_BATCH_SIZE = 100;
const MAX_PAYLOAD_BYTES = 256 * 1024; // 256 KB

// ─── Simple rate limit pro IP ────────────────────────────────
const ipBuckets = new Map<string, { count: number; resetAt: number }>();
const MAX_BATCHES_PER_MINUTE = 60; // 1 Batch/Sekunde pro IP reicht

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = ipBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    ipBuckets.set(ip, { count: 1, resetAt: now + 60 * 1000 });
    return true;
  }
  if (bucket.count >= MAX_BATCHES_PER_MINUTE) return false;
  bucket.count++;
  return true;
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ─── Payload-Validation (minimal) ────────────────────────────
interface EventBatch {
  events: Array<{ type: string; meta?: unknown; [key: string]: unknown }>;
}

function isEventBatch(body: unknown): body is EventBatch {
  if (typeof body !== "object" || body === null) return false;
  const b = body as { events?: unknown };
  if (!Array.isArray(b.events)) return false;
  if (b.events.length === 0 || b.events.length > MAX_BATCH_SIZE) return false;
  return b.events.every(
    (e) => typeof e === "object" && e !== null && typeof (e as { type?: unknown }).type === "string",
  );
}

// ─── POST Handler ───────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Rate-Limit
    const ip = getClientIP(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "rate_limit" },
        { status: 429 },
      );
    }

    // Size-Check (vor Parse)
    const contentLength = parseInt(req.headers.get("content-length") ?? "0", 10);
    if (contentLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { error: "payload_too_large" },
        { status: 413 },
      );
    }

    const body: unknown = await req.json();
    if (!isEventBatch(body)) {
      return NextResponse.json(
        { error: "invalid_payload" },
        { status: 400 },
      );
    }

    // Wenn Backend konfiguriert → weiterleiten, sonst silent accept
    if (BACKEND_URL) {
      try {
        const res = await fetch(`${BACKEND_URL}${BACKEND_EVENTS_PATH}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // TODO: API-Key / JWT für Backend-Auth einfügen
          },
          body: JSON.stringify(body),
          // Aggressive Timeouts — der Client wartet nicht
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) {
          console.warn(
            "[Analytics] Backend rejected batch:",
            res.status,
          );
        }
      } catch (err) {
        console.warn("[Analytics] Backend forwarding failed:", err);
        // Events gehen verloren — Client hat bereits gedroppt.
        // TODO: Fallback in lokalem Store / S3 / Queue
      }
    }

    return NextResponse.json(
      { accepted: body.events.length, rejected: 0 },
      { status: 202 },
    );
  } catch (err) {
    console.error("[Analytics] Request error:", err);
    return NextResponse.json(
      { error: "server_error" },
      { status: 500 },
    );
  }
}

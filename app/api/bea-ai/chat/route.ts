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

// ─── Types ──────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  /** Nutzerprofil aus dem Onboarding (optional) */
  profile?: UserProfile;
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

// ─── Input Validation ───────────────────────────────────────
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
            "Du hast heute schon viele Nachrichten geschickt. Probier es morgen nochmal — oder lad dir die BeAFox App für unbegrenzte Gespräche mit Bea!",
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

    // 4. Session-Limit prüfen
    const userMessageCount = body.messages.filter(
      (m) => m.role === "user"
    ).length;

    if (userMessageCount > MAX_MESSAGES_PER_SESSION) {
      return NextResponse.json(
        {
          error: "session_limit",
          message:
            "Du hast das Limit für diese Demo erreicht. In der BeAFox App kannst du unbegrenzt mit Bea sprechen!",
          remainingMessages: 0,
        },
        { status: 200 }
      );
    }

    // 5. Modell wählen (Haiku → Sonnet Upgrade)
    const model = pickModel(userMessageCount);

    // 6. System-Prompt mit Profil-Kontext erweitern
    const systemPrompt = body.profile
      ? BEA_SYSTEM_PROMPT + buildProfileContext(body.profile)
      : BEA_SYSTEM_PROMPT;

    // 7. Streaming-Response erstellen
    const client = getAnthropicClient();

    const stream = await client.messages.stream({
      model,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: systemPrompt,
      messages: body.messages,
    });

    // 7. SSE-Stream an Client weiterleiten
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Metadata als erstes Event senden
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "meta",
                model,
                remainingMessages:
                  MAX_MESSAGES_PER_SESSION - userMessageCount,
              })}\n\n`
            )
          );

          // Text-Deltas streamen
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
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

          // Stream beenden
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "done" })}\n\n`
            )
          );
          controller.close();
        } catch (err) {
          console.error("[Bea AI] Streaming error:", err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                message: "Ups, da ist etwas schiefgelaufen. Versuch es nochmal!",
              })}\n\n`
            )
          );
          controller.close();
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
    console.error("[Bea AI] Request error:", err);
    return NextResponse.json(
      {
        error: "server_error",
        message: "Bea ist gerade nicht erreichbar. Versuch es gleich nochmal!",
      },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/analytics/consents
// ─────────────────────────────────────────────────────────────
// Proxy an das Backend: persistiert Consent-Änderungen eines Users
// oder pseudonymen Analytics-IDs. Leitet den Bearer-Token aus dem
// localStorage-Cookie weiter, wenn vorhanden.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

// CONSTANTS
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const BACKEND_PATH = "/analytics/consents";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.analyticsId || !body?.purpose || typeof body?.granted !== "boolean") {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    if (!BACKEND_URL) {
      // Backend nicht konfiguriert — silent accept
      return NextResponse.json({ ok: true, stored: "local_only" }, { status: 202 });
    }

    const authHeader = req.headers.get("authorization");
    const res = await fetch(`${BACKEND_URL}${BACKEND_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.warn("[Consents] Backend responded", res.status);
      return NextResponse.json({ error: "backend_error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[Consents] Proxy error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

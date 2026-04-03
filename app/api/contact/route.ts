import sgMail from "@sendgrid/mail";
import { NextRequest, NextResponse } from "next/server";

// CONSTANTS
const RATE_LIMIT_MAX = 3;
const MAX_FIELD_LENGTH = 500;
const MAX_MESSAGE_LENGTH = 5000;
const RATE_LIMIT_WINDOW = 60_000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
// TYPES
const VALID_TYPES = [
  "general",
  "schools",
  "business",
  "private",
  "pilot",
  "support",
] as const;
type ContactType = (typeof VALID_TYPES)[number];
const TYPE_LABELS: Record<ContactType, string> = {
  general: "Allgemeine Anfrage",
  schools: "Für Schulen",
  business: "Für Unternehmen",
  private: "Privatperson",
  pilot: "Demo",
  support: "Support",
};
// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// HELPER FUNCTIONS
function sanitize(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .slice(0, MAX_MESSAGE_LENGTH);
}
function sanitizeField(input: unknown): string {
  return sanitize(input).slice(0, MAX_FIELD_LENGTH);
}
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// HANDLER
export async function POST(request: NextRequest) {
  try {
    // 1. Check SendGrid config
    if (!process.env.SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not configured");
      return NextResponse.json(
        {
          error:
            "Email-Service ist nicht konfiguriert. Bitte kontaktieren Sie uns direkt per E-Mail an info@beafox.app.",
        },
        { status: 500 },
      );
    }

    // 2. Rate limiting
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error:
            "Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut.",
        },
        { status: 429 },
      );
    }

    // 3. Parse body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Ungültige Anfrage." },
        { status: 400 },
      );
    }

    // 4. Honeypot check — if filled, silently succeed (bots think it worked)
    if (body.website) {
      return NextResponse.json(
        { message: "Nachricht erfolgreich gesendet!" },
        { status: 200 },
      );
    }

    // 5. Sanitize all inputs
    const name = sanitizeField(body.name);
    const email = sanitizeField(body.email);
    const phone = sanitizeField(body.phone);
    const subject = sanitizeField(body.subject);
    const message = sanitize(body.message);
    const type = VALID_TYPES.includes(body.type as ContactType)
      ? (body.type as ContactType)
      : "general";
    const schoolName = sanitizeField(body.schoolName);
    const schoolLocation = sanitizeField(body.schoolLocation);
    const companyName = sanitizeField(body.companyName);
    const companyLocation = sanitizeField(body.companyLocation);
    const crmLeadType = sanitizeField(body.crmLeadType);
    const crmSource = sanitizeField(body.crmSource);

    // 6. Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Bitte füllen Sie alle Pflichtfelder aus." },
        { status: 400 },
      );
    }

    // 7. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." },
        { status: 400 },
      );
    }

    // 8. Build email
    const typeLabel = TYPE_LABELS[type];
    const isSchool = crmLeadType === "school";
    const isBusiness = crmLeadType === "business";

    const fieldHtml = (label: string, value: string) => `
      <div style="margin-bottom:15px">
        <span style="font-weight:bold;color:#E87720;display:block;margin-bottom:5px">${label}</span>
        <div style="color:#333;padding:10px;background:#fff;border-radius:4px;border-left:3px solid #E87720">${value}</div>
      </div>`;

    const emailHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
      <body style="font-family:Arial,sans-serif;line-height:1.6;color:#333">
        <div style="max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#E87720;color:#fff;padding:20px;border-radius:8px 8px 0 0">
            <h1 style="margin:0;font-size:20px">Neue Kontaktanfrage — BeAFox</h1>
          </div>
          <div style="background:#f9f9f9;padding:20px;border-radius:0 0 8px 8px">
            ${fieldHtml("Name", name)}
            ${fieldHtml("E-Mail", email)}
            ${phone ? fieldHtml("Telefon", phone) : ""}
            ${fieldHtml("Interesse", typeLabel)}
            ${isSchool && schoolName ? fieldHtml("Schulname", schoolName) : ""}
            ${isSchool && schoolLocation ? fieldHtml("Schulstandort", schoolLocation) : ""}
            ${isBusiness && companyName ? fieldHtml("Unternehmen", companyName) : ""}
            ${isBusiness && companyLocation ? fieldHtml("Standort", companyLocation) : ""}
            ${fieldHtml("Betreff", subject)}
            ${fieldHtml("Nachricht", `<div style="white-space:pre-wrap">${message}</div>`)}
            <hr style="border:none;border-top:1px solid #ddd;margin:20px 0">
            <div style="font-size:12px;color:#999">
              Lead Type: ${crmLeadType || "–"} · Source: ${crmSource || "–"} · IP: ${ip}
            </div>
          </div>
        </div>
      </body></html>`;

    const emailText = [
      "Neue Kontaktanfrage — BeAFox",
      "",
      `Name: ${name}`,
      `E-Mail: ${email}`,
      phone ? `Telefon: ${phone}` : null,
      `Interesse: ${typeLabel}`,
      isSchool && schoolName ? `Schulname: ${schoolName}` : null,
      isSchool && schoolLocation ? `Schulstandort: ${schoolLocation}` : null,
      isBusiness && companyName ? `Unternehmen: ${companyName}` : null,
      isBusiness && companyLocation ? `Standort: ${companyLocation}` : null,
      `Betreff: ${subject}`,
      "",
      `Nachricht:`,
      message,
      "",
      `---`,
      `Lead Type: ${crmLeadType || "–"}`,
      `Source: ${crmSource || "–"}`,
      `IP: ${ip}`,
    ]
      .filter(Boolean)
      .join("\n");

    // 9. Send
    await sgMail.send({
      to: "info@beafox.app",
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@beafox.app",
      replyTo: email,
      subject: `[${typeLabel}] ${subject}`,
      text: emailText,
      html: emailHtml,
    });

    return NextResponse.json(
      { message: "Nachricht erfolgreich gesendet!" },
      { status: 200 },
    );
  } catch (error: unknown) {
    const sgError = error as { response?: { body?: unknown } };
    console.error("Contact form error:", error);

    if (sgError.response) {
      console.error("SendGrid error:", sgError.response.body);
    }

    return NextResponse.json(
      {
        error:
          "Fehler beim Senden. Bitte versuchen Sie es später erneut oder schreiben Sie uns an info@beafox.app.",
      },
      { status: 500 },
    );
  }
}

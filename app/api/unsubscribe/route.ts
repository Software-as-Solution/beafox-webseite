import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not configured");
      return NextResponse.json(
        {
          error:
            "E-Mail-Service ist nicht konfiguriert. Bitte schreibe uns direkt an info@beafox.app.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Bitte gib deine E-Mail-Adresse an." },
        { status: 400 }
      );
    }

    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return NextResponse.json(
        { error: "Bitte gib eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ff6b35; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #ff6b35; margin-bottom: 5px; display: block; }
            .value { color: #333; padding: 10px; background-color: white; border-radius: 4px; border-left: 3px solid #ff6b35; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Newsletter-Abmeldung</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Abgemeldete E-Mail:</span>
                <div class="value">${trimmed}</div>
              </div>
              <p style="margin-top: 20px; color: #666;">
                Diese Person hat sich über die Webseite vom Newsletter abgemeldet. Bitte aus dem Verteiler entfernen.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
Newsletter-Abmeldung

Abgemeldete E-Mail: ${trimmed}

Diese Person hat sich über die Webseite vom Newsletter abgemeldet. Bitte aus dem Verteiler entfernen.
    `;

    await sgMail.send({
      to: "info@beafox.app",
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@beafox.app",
      replyTo: trimmed,
      subject: "Newsletter-Abmeldung",
      text: emailText,
      html: emailHtml,
    });

    return NextResponse.json(
      { message: "Du bist vom Newsletter abgemeldet. Wir haben info@beafox.app benachrichtigt." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Unsubscribe error:", error);
    const err = error as { response?: { body?: unknown } };
    if (err.response) {
      console.error("SendGrid error details:", err.response.body);
    }
    return NextResponse.json(
      {
        error:
          "Beim Abmelden ist ein Fehler aufgetreten. Bitte schreibe uns direkt an info@beafox.app.",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not configured");
      return NextResponse.json(
        {
          error:
            "Email-Service ist nicht konfiguriert. Bitte kontaktiere uns direkt per Email.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: "Bitte gib deine Email-Adresse ein." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Bitte gib eine gültige Email-Adresse ein." },
        { status: 400 }
      );
    }

    // Create email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #ff6b35;
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 20px;
              border-radius: 0 0 8px 8px;
            }
            .field {
              margin-bottom: 15px;
            }
            .label {
              font-weight: bold;
              color: #ff6b35;
              margin-bottom: 5px;
              display: block;
            }
            .value {
              color: #333;
              padding: 10px;
              background-color: white;
              border-radius: 4px;
              border-left: 3px solid #ff6b35;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Neue Newsletter-Anmeldung</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Email:</span>
                <div class="value">${email}</div>
              </div>
              <p style="margin-top: 20px; color: #666;">
                Eine neue Person hat sich für den BeAFox Newsletter angemeldet.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
Neue Newsletter-Anmeldung

Email: ${email}

Eine neue Person hat sich für den BeAFox Newsletter angemeldet.
    `;

    // Send email using SendGrid
    const msg = {
      to: "info@beafox.app",
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@beafox.app",
      replyTo: email,
      subject: "Neue Newsletter-Anmeldung",
      text: emailText,
      html: emailHtml,
    };

    await sgMail.send(msg);

    return NextResponse.json(
      { message: "Erfolgreich für den Newsletter angemeldet!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Newsletter signup error:", error);

    // Handle SendGrid specific errors
    if (error.response) {
      console.error("SendGrid error details:", error.response.body);
      return NextResponse.json(
        {
          error:
            "Fehler beim Anmelden. Bitte versuche es später erneut oder kontaktiere uns direkt per Email.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Ein Fehler ist aufgetreten. Bitte versuche es später erneut oder kontaktiere uns direkt per Email.",
      },
      { status: 500 }
    );
  }
}

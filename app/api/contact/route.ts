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
    const { name, email, phone, subject, message, type } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Bitte fülle alle Pflichtfelder aus." },
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

    // Map type to German label
    const typeLabels: { [key: string]: string } = {
      general: "Allgemeine Anfrage",
      schools: "Für Schulen",
      business: "Für Unternehmen",
      clubs: "Für Clubs",
      private: "Privatperson",
      pilot: "Pilotprojekt",
      support: "Support",
    };

    const typeLabel = typeLabels[type] || "Allgemeine Anfrage";

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
            .message {
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Neue Kontaktanfrage von BeAFox Website</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <div class="value">${email}</div>
              </div>
              ${
                phone
                  ? `
              <div class="field">
                <span class="label">Telefon:</span>
                <div class="value">${phone}</div>
              </div>
              `
                  : ""
              }
              <div class="field">
                <span class="label">Interesse:</span>
                <div class="value">${typeLabel}</div>
              </div>
              <div class="field">
                <span class="label">Betreff:</span>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <span class="label">Nachricht:</span>
                <div class="value message">${message}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
Neue Kontaktanfrage von BeAFox Website

Name: ${name}
Email: ${email}
${phone ? `Telefon: ${phone}` : ""}
Interesse: ${typeLabel}
Betreff: ${subject}

Nachricht:
${message}
    `;

    // Send email using SendGrid
    const msg = {
      to: "info@beafox.app",
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@beafox.app", // Use environment variable or default
      replyTo: email,
      subject: `Neue Kontaktanfrage: ${subject}`,
      text: emailText,
      html: emailHtml,
    };

    await sgMail.send(msg);

    return NextResponse.json(
      { message: "Nachricht erfolgreich gesendet!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Contact form error:", error);

    // Handle SendGrid specific errors
    if (error.response) {
      console.error("SendGrid error details:", error.response.body);
      return NextResponse.json(
        {
          error:
            "Fehler beim Senden der Email. Bitte versuche es später erneut oder kontaktiere uns direkt per Email.",
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

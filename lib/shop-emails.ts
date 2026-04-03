// =====================================================
// SHOP E-MAIL TEMPLATES — SendGrid Integration
// =====================================================
import sgMail from "@sendgrid/mail";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@beafox.app";
const TEAM_EMAIL = "info@beafox.app";
const BRAND_COLOR = "#EB8A26";
const BRAND_DARK = "#1D1B1B";

// ─── Shared Layout ─────────────────────────────────────
function emailWrapper(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#333">
  <div style="max-width:600px;margin:0 auto;padding:20px">
    <!-- Header -->
    <div style="background:${BRAND_DARK};padding:24px;border-radius:12px 12px 0 0;text-align:center">
      <h1 style="margin:0;font-size:24px;color:${BRAND_COLOR};letter-spacing:1px">BeAFox</h1>
      <p style="margin:6px 0 0;font-size:14px;color:#aaa">${title}</p>
    </div>
    <!-- Body -->
    <div style="background:#ffffff;padding:28px;border-radius:0 0 12px 12px">
      ${content}
    </div>
    <!-- Footer -->
    <div style="text-align:center;padding:20px 0;font-size:12px;color:#999">
      <p style="margin:0">BeAFox — Gamifizierte Finanzbildung</p>
      <p style="margin:4px 0"><a href="https://beafox.app" style="color:${BRAND_COLOR};text-decoration:none">beafox.app</a></p>
      <p style="margin:8px 0 0">Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese E-Mail.</p>
    </div>
  </div>
</body>
</html>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 12px;font-weight:bold;color:#555;white-space:nowrap;vertical-align:top">${label}</td>
    <td style="padding:8px 12px;color:#333">${value}</td>
  </tr>`;
}

function button(text: string, href: string): string {
  return `<div style="text-align:center;margin:28px 0">
    <a href="${href}" style="display:inline-block;padding:14px 32px;background:${BRAND_COLOR};color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px">${text}</a>
  </div>`;
}

// ─── 1. Bestellbestätigung ──────────────────────────────
export interface OrderConfirmationData {
  customerEmail: string;
  customerName: string;
  stripeSessionId: string;
  gelatoOrderId: string;
  items: {
    name: string;
    variant: string;
    quantity: number;
    price: string;
  }[];
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  totalAmount: string;
}

export async function sendOrderConfirmationEmail(
  data: OrderConfirmationData,
): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SendGrid not configured — skipping order confirmation email");
    return;
  }

  const itemRows = data.items
    .map(
      (item) => `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee">${item.name}<br><span style="font-size:12px;color:#888">${item.variant}</span></td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">${item.price}</td>
      </tr>`,
    )
    .join("");

  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:${BRAND_DARK}">Vielen Dank für deine Bestellung! 🎉</h2>
    <p style="color:#555;margin:0 0 24px">Hi ${data.customerName}, deine Bestellung ist bei uns eingegangen und wird jetzt vorbereitet.</p>

    <!-- Bestellnummer -->
    <div style="background:#f8f8f8;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center">
      <p style="margin:0;font-size:13px;color:#888">Bestellreferenz</p>
      <p style="margin:4px 0 0;font-size:16px;font-weight:bold;color:${BRAND_DARK};word-break:break-all">${data.stripeSessionId.slice(-12).toUpperCase()}</p>
    </div>

    <!-- Artikel-Tabelle -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr style="background:#f8f8f8">
        <th style="padding:10px 12px;text-align:left;font-size:13px;color:#888">Artikel</th>
        <th style="padding:10px 12px;text-align:center;font-size:13px;color:#888">Menge</th>
        <th style="padding:10px 12px;text-align:right;font-size:13px;color:#888">Preis</th>
      </tr>
      ${itemRows}
      <tr>
        <td colspan="2" style="padding:12px;text-align:right;font-weight:bold">Gesamt</td>
        <td style="padding:12px;text-align:right;font-weight:bold;color:${BRAND_COLOR};font-size:16px">${data.totalAmount}</td>
      </tr>
    </table>

    <!-- Lieferadresse -->
    <div style="background:#f8f8f8;border-radius:8px;padding:16px;margin-bottom:24px">
      <h3 style="margin:0 0 8px;font-size:14px;color:${BRAND_COLOR}">Lieferadresse</h3>
      <p style="margin:0;font-size:14px;color:#333">
        ${data.shippingAddress.name}<br>
        ${data.shippingAddress.line1}<br>
        ${data.shippingAddress.line2 ? data.shippingAddress.line2 + "<br>" : ""}
        ${data.shippingAddress.postalCode} ${data.shippingAddress.city}<br>
        ${data.shippingAddress.country}
      </p>
    </div>

    <!-- Nächste Schritte -->
    <div style="border-left:3px solid ${BRAND_COLOR};padding-left:16px;margin-bottom:24px">
      <h3 style="margin:0 0 8px;font-size:14px;color:${BRAND_DARK}">Was passiert als Nächstes?</h3>
      <ol style="margin:0;padding-left:18px;color:#555;font-size:14px">
        <li style="margin-bottom:6px">Deine Bestellung wird jetzt produziert (Print-on-Demand)</li>
        <li style="margin-bottom:6px">Du erhältst eine E-Mail mit Tracking-Link, sobald dein Paket versendet wird</li>
        <li style="margin-bottom:6px">Die Lieferung dauert in der Regel 5–10 Werktage</li>
      </ol>
    </div>

    ${button("Zum BeAFox Shop", "https://beafox.app/shop")}

    <p style="font-size:13px;color:#888;text-align:center">Fragen? Schreib uns an <a href="mailto:info@beafox.app" style="color:${BRAND_COLOR}">info@beafox.app</a></p>
  `;

  try {
    await sgMail.send({
      to: data.customerEmail,
      from: FROM_EMAIL,
      subject: `Bestellbestätigung — BeAFox Shop #${data.stripeSessionId.slice(-8).toUpperCase()}`,
      html: emailWrapper("Bestellbestätigung", content),
      text: `Bestellbestätigung — BeAFox Shop\n\nHi ${data.customerName},\n\ndeine Bestellung ist bei uns eingegangen!\n\nBestellreferenz: ${data.stripeSessionId.slice(-12).toUpperCase()}\n\n${data.items.map((i) => `${i.quantity}x ${i.name} (${i.variant}) — ${i.price}`).join("\n")}\n\nGesamt: ${data.totalAmount}\n\nLieferadresse:\n${data.shippingAddress.name}\n${data.shippingAddress.line1}\n${data.shippingAddress.line2 || ""}\n${data.shippingAddress.postalCode} ${data.shippingAddress.city}\n\nDu erhältst eine Versandbestätigung mit Tracking-Link, sobald dein Paket unterwegs ist.\n\nFragen? info@beafox.app`,
    });
    console.log(`Order confirmation email sent to ${data.customerEmail}`);
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
}

// ─── 2. Versandbenachrichtigung ─────────────────────────
export interface ShippingNotificationData {
  customerEmail: string;
  customerName: string;
  orderId: string;
  orderReferenceId: string;
  trackingUrl: string;
  carrier: string;
}

export async function sendShippingNotificationEmail(
  data: ShippingNotificationData,
): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SendGrid not configured — skipping shipping notification");
    return;
  }

  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:${BRAND_DARK}">Dein Paket ist unterwegs! 📦</h2>
    <p style="color:#555;margin:0 0 24px">Hi ${data.customerName}, deine BeAFox-Bestellung wurde versendet.</p>

    <table style="width:100%;border-collapse:collapse;background:#f8f8f8;border-radius:8px;margin-bottom:24px">
      ${infoRow("Bestellnr.", data.orderReferenceId.slice(-12).toUpperCase())}
      ${infoRow("Versand via", data.carrier)}
    </table>

    ${button("Sendung verfolgen", data.trackingUrl)}

    <div style="border-left:3px solid ${BRAND_COLOR};padding-left:16px;margin-bottom:24px">
      <p style="margin:0;font-size:14px;color:#555">
        Die Zustellung dauert in der Regel <strong>3–5 Werktage</strong> nach Versand.
        Du kannst den aktuellen Status jederzeit über den Tracking-Link verfolgen.
      </p>
    </div>

    <p style="font-size:13px;color:#888;text-align:center">Fragen? Schreib uns an <a href="mailto:info@beafox.app" style="color:${BRAND_COLOR}">info@beafox.app</a></p>
  `;

  try {
    await sgMail.send({
      to: data.customerEmail,
      from: FROM_EMAIL,
      subject: `Dein BeAFox-Paket ist unterwegs! 📦`,
      html: emailWrapper("Versandbenachrichtigung", content),
      text: `Dein BeAFox-Paket ist unterwegs!\n\nHi ${data.customerName},\n\ndeine Bestellung wurde versendet.\n\nBestellnr.: ${data.orderReferenceId.slice(-12).toUpperCase()}\nVersand via: ${data.carrier}\n\nSendung verfolgen: ${data.trackingUrl}\n\nDie Zustellung dauert in der Regel 3–5 Werktage.\n\nFragen? info@beafox.app`,
    });
    console.log(`Shipping notification sent to ${data.customerEmail}`);
  } catch (error) {
    console.error("Failed to send shipping notification:", error);
  }
}

// ─── 3. Team-Fehlerbenachrichtigung ─────────────────────
export interface OrderFailureData {
  gelatoOrderId: string;
  orderReferenceId: string;
  event: string;
  fulfillmentStatus: string;
}

export async function sendOrderFailureAlert(
  data: OrderFailureData,
): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SendGrid not configured — skipping failure alert");
    return;
  }

  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#C62828">⚠️ Bestellung fehlgeschlagen</h2>
    <p style="color:#555;margin:0 0 24px">Eine Gelato-Bestellung erfordert manuelle Prüfung.</p>

    <table style="width:100%;border-collapse:collapse;background:#fff5f5;border-radius:8px;margin-bottom:24px;border:1px solid #ffcdd2">
      ${infoRow("Gelato Order ID", data.gelatoOrderId)}
      ${infoRow("Stripe Session", data.orderReferenceId)}
      ${infoRow("Event", data.event)}
      ${infoRow("Status", data.fulfillmentStatus)}
    </table>

    <div style="border-left:3px solid #C62828;padding-left:16px;margin-bottom:24px">
      <h3 style="margin:0 0 8px;font-size:14px;color:#C62828">Nächste Schritte</h3>
      <ol style="margin:0;padding-left:18px;color:#555;font-size:14px">
        <li style="margin-bottom:6px">Bestellung im <a href="https://dashboard.gelato.com" style="color:${BRAND_COLOR}">Gelato Dashboard</a> prüfen</li>
        <li style="margin-bottom:6px">Falls nicht wiederherstellbar: Refund über <a href="https://dashboard.stripe.com" style="color:${BRAND_COLOR}">Stripe Dashboard</a> auslösen</li>
        <li style="margin-bottom:6px">Kunden per E-Mail informieren</li>
      </ol>
    </div>
  `;

  try {
    await sgMail.send({
      to: TEAM_EMAIL,
      from: FROM_EMAIL,
      subject: `⚠️ Shop-Bestellung fehlgeschlagen — ${data.gelatoOrderId}`,
      html: emailWrapper("Bestell-Fehler", content),
      text: `SHOP-BESTELLUNG FEHLGESCHLAGEN\n\nGelato Order ID: ${data.gelatoOrderId}\nStripe Session: ${data.orderReferenceId}\nEvent: ${data.event}\nStatus: ${data.fulfillmentStatus}\n\nBitte im Gelato Dashboard prüfen und ggf. Refund über Stripe auslösen.`,
    });
    console.log(`Failure alert sent to ${TEAM_EMAIL}`);
  } catch (error) {
    console.error("Failed to send failure alert:", error);
  }
}

// =====================================================
// POST /api/shop/webhook — Stripe Webhook → Gelato Order
// =====================================================
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createGelatoOrder } from "@/lib/gelato-client";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

// Stripe Webhook Body muss als raw Buffer gelesen werden
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  // Raw body für Signature-Verifizierung
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Nur checkout.session.completed verarbeiten
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Nur Payment-Mode (nicht Subscription)
    if (session.mode !== "payment") {
      return NextResponse.json({ received: true });
    }

    try {
      await fulfillOrder(session);
    } catch (error) {
      console.error("Fulfillment error:", error);
      // Trotzdem 200 zurückgeben, damit Stripe nicht erneut sendet
      // Error wird geloggt und manuell bearbeitet
    }
  }

  return NextResponse.json({ received: true });
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const itemCount = parseInt(metadata.item_count || "0", 10);

  if (itemCount === 0) {
    console.warn("No items in order metadata:", session.id);
    return;
  }

  // Versandadresse aus Stripe Session (v21+: collected_information.shipping_details)
  const shipping = session.collected_information?.shipping_details;
  if (!shipping?.address) {
    console.error("No shipping address in session:", session.id);
    return;
  }

  // Gelato Order Items zusammenbauen
  const gelatoItems = [];
  for (let i = 0; i < itemCount; i++) {
    const gelatoUid = metadata[`item_${i}_gelato_uid`];
    const designUrl = metadata[`item_${i}_design_url`];
    const quantity = parseInt(metadata[`item_${i}_quantity`] || "1", 10);

    if (!gelatoUid || !designUrl) {
      console.warn(`Skipping item ${i}: missing Gelato UID or design URL`);
      continue;
    }

    gelatoItems.push({
      itemReferenceId: `item-${i}`,
      productUid: gelatoUid,
      quantity,
      files: [{ type: "default" as const, url: designUrl }],
    });
  }

  if (gelatoItems.length === 0) {
    console.warn("No valid Gelato items for order:", session.id);
    return;
  }

  // Bestellung bei Gelato erstellen
  const order = await createGelatoOrder({
    orderType: "order",
    orderReferenceId: session.id,
    customerReferenceId: session.customer_email || "unknown",
    currency: "EUR",
    items: gelatoItems,
    shippingAddress: {
      firstName: shipping.name?.split(" ")[0] || "",
      lastName: shipping.name?.split(" ").slice(1).join(" ") || "",
      addressLine1: shipping.address.line1 || "",
      addressLine2: shipping.address.line2 || undefined,
      city: shipping.address.city || "",
      postCode: shipping.address.postal_code || "",
      state: shipping.address.state || undefined,
      country: shipping.address.country || "DE",
      email: session.customer_email || "",
    },
  });

  console.log(
    `Gelato order created: ${order.id} for Stripe session: ${session.id}`,
  );

  // TODO: Bestätigungs-E-Mail über SendGrid senden
  // await sendOrderConfirmationEmail(session.customer_email, order.id);
}

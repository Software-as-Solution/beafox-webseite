// =====================================================
// POST /api/shop/gelato-webhook — Gelato Status-Webhooks
// =====================================================
import { NextRequest, NextResponse } from "next/server";
import type { GelatoWebhookEvent } from "@/lib/gelato-client";

export async function POST(request: NextRequest) {
  try {
    const event: GelatoWebhookEvent = await request.json();

    console.log(
      `Gelato webhook: ${event.event} for order ${event.orderId} (ref: ${event.orderReferenceId})`,
    );

    switch (event.event) {
      case "order:status:shipped": {
        // Tracking-Info verfügbar
        const shipment = event.shipments?.[0];
        if (shipment) {
          console.log(
            `Order ${event.orderId} shipped via ${shipment.carrier}: ${shipment.trackingUrl}`,
          );
          // TODO: Versandbestätigungs-E-Mail über SendGrid senden
          // await sendShippingConfirmationEmail(
          //   event.orderReferenceId,
          //   shipment.trackingUrl,
          //   shipment.carrier,
          // );
        }
        break;
      }

      case "order:status:delivered": {
        console.log(`Order ${event.orderId} delivered`);
        break;
      }

      case "order:status:cancelled":
      case "order:status:not_accepted": {
        console.error(
          `Order ${event.orderId} failed: ${event.fulfillmentStatus}`,
        );
        // TODO: Benachrichtigung an Team senden
        // TODO: Ggf. Stripe Refund auslösen
        break;
      }

      case "order:status:in_production": {
        console.log(`Order ${event.orderId} in production`);
        break;
      }

      default: {
        console.log(`Unhandled Gelato event: ${event.event}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Gelato webhook error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

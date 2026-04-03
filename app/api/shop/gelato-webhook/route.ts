// =====================================================
// POST /api/shop/gelato-webhook — Gelato Status-Webhooks (v4)
// =====================================================
// Gelato v4 sendet "order_status_updated" mit fulfillmentStatus.
// Tracking-Details kommen via "order_item_tracking_code_updated".
import { NextRequest, NextResponse } from "next/server";
import type { GelatoWebhookEvent } from "@/lib/gelato-client";
import {
  sendShippingNotificationEmail,
  sendOrderFailureAlert,
} from "@/lib/shop-emails";
import { getStripe } from "@/lib/stripe-server";

export async function POST(request: NextRequest) {
  try {
    const event: GelatoWebhookEvent = await request.json();

    console.log(
      `Gelato webhook: ${event.event} | status=${event.fulfillmentStatus} | order=${event.orderId} (ref: ${event.orderReferenceId})`,
    );

    // ---- order_item_tracking_code_updated → Versandbenachrichtigung ----
    if (event.event === "order_item_tracking_code_updated") {
      const trackingUrl = event.trackingUrl;
      const carrier = event.carrier || "Versanddienstleister";

      if (trackingUrl) {
        try {
          const stripe = getStripe();
          const session = await stripe.checkout.sessions.retrieve(
            event.orderReferenceId,
          );

          const shipping = session.collected_information?.shipping_details;
          const customerName = shipping?.name || "Kunde";
          const customerEmail = session.customer_email;

          if (customerEmail) {
            await sendShippingNotificationEmail({
              customerEmail,
              customerName,
              orderId: event.orderId,
              orderReferenceId: event.orderReferenceId,
              trackingUrl,
              carrier,
            });
            console.log(
              `Shipping notification sent for order ${event.orderId}`,
            );
          }
        } catch (stripeError) {
          console.error(
            `Failed to send shipping notification:`,
            stripeError,
          );
        }
      }
      return NextResponse.json({ received: true });
    }

    // ---- order_status_updated → Je nach fulfillmentStatus reagieren ----
    if (event.event === "order_status_updated") {
      const status = event.fulfillmentStatus;

      switch (status) {
        case "shipped": {
          // Tracking-Info aus Items extrahieren (falls vorhanden)
          const fulfillment = event.items?.[0]?.fulfillments?.[0];
          if (fulfillment?.trackingUrl) {
            try {
              const stripe = getStripe();
              const session = await stripe.checkout.sessions.retrieve(
                event.orderReferenceId,
              );

              const shipping =
                session.collected_information?.shipping_details;
              const customerName = shipping?.name || "Kunde";
              const customerEmail = session.customer_email;

              if (customerEmail) {
                await sendShippingNotificationEmail({
                  customerEmail,
                  customerName,
                  orderId: event.orderId,
                  orderReferenceId: event.orderReferenceId,
                  trackingUrl: fulfillment.trackingUrl,
                  carrier: fulfillment.carrier || "Versanddienstleister",
                });
              }
            } catch (stripeError) {
              console.error(
                `Failed to retrieve Stripe session for shipping notification:`,
                stripeError,
              );
            }
          }
          break;
        }

        case "delivered": {
          console.log(`Order ${event.orderId} delivered`);
          break;
        }

        case "canceled":
        case "cancelled":
        case "failed":
        case "not_accepted": {
          console.error(
            `Order ${event.orderId} failed: ${status}`,
          );

          // 1. Team-Alert senden
          await sendOrderFailureAlert({
            gelatoOrderId: event.orderId,
            orderReferenceId: event.orderReferenceId,
            event: `order_status_updated:${status}`,
            fulfillmentStatus: status,
          });

          // 2. Automatischen Stripe-Refund auslösen
          try {
            const stripe = getStripe();
            const session = await stripe.checkout.sessions.retrieve(
              event.orderReferenceId,
            );

            const paymentIntentId = session.payment_intent;
            if (paymentIntentId && typeof paymentIntentId === "string") {
              const refund = await stripe.refunds.create({
                payment_intent: paymentIntentId,
                reason: "requested_by_customer",
                metadata: {
                  gelato_order_id: event.orderId,
                  gelato_status: status,
                  auto_refund: "true",
                },
              });
              console.log(
                `Stripe refund created: ${refund.id} for payment ${paymentIntentId} (Gelato order ${event.orderId})`,
              );
            } else {
              console.error(
                `No payment_intent found for session ${event.orderReferenceId} — manual refund required`,
              );
            }
          } catch (refundError) {
            console.error(
              `Failed to create auto-refund for order ${event.orderId}:`,
              refundError,
            );
          }
          break;
        }

        case "in_production":
        case "printed":
        case "created":
        case "passed": {
          console.log(
            `Order ${event.orderId} status: ${status}`,
          );
          break;
        }

        default: {
          console.log(
            `Unhandled fulfillmentStatus: ${status} for order ${event.orderId}`,
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Gelato webhook error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

// =====================================================
// POST /api/shop/checkout — Stripe Checkout Session erstellen
// =====================================================
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe-server";
import {
  getProductById,
  getVariantPrice,
  type CartItem,
} from "@/lib/shop-products";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: CartItem[] = body.items;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Warenkorb ist leer" },
        { status: 400 },
      );
    }

    const stripe = getStripe();

    // Line Items für Stripe erstellen
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const orderMetadata: Record<string, string> = {};

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const product = getProductById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Produkt ${item.productId} nicht gefunden` },
          { status: 400 },
        );
      }

      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return NextResponse.json(
          { error: `Variante ${item.variantId} nicht gefunden` },
          { status: 400 },
        );
      }

      const priceCents = getVariantPrice(product, item.variantId);
      const variantLabel = [variant.size, variant.color]
        .filter(Boolean)
        .join(" / ");

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: product.nameKey,
            description: variantLabel || undefined,
            images: product.images[0]
              ? [`https://beafox.app${product.images[0]}`]
              : undefined,
            metadata: {
              product_id: product.id,
              variant_id: variant.id,
              gelato_product_uid: product.gelatoProductUid,
              gelato_variant_id: variant.gelatoVariantId,
            },
          },
          unit_amount: priceCents,
        },
        quantity: item.quantity,
      });

      // Gelato-Daten in Metadata speichern (für Webhook)
      // WICHTIG: gelato_uid = die variant-spezifische UID (inkl. Größe/Farbe),
      // NICHT die Produkt-Basis-UID — Gelato braucht die vollständige productUid.
      orderMetadata[`item_${i}_product_id`] = product.id;
      orderMetadata[`item_${i}_variant_id`] = variant.id;
      orderMetadata[`item_${i}_gelato_uid`] = variant.gelatoVariantId;
      orderMetadata[`item_${i}_gelato_variant`] = variant.gelatoVariantId;
      orderMetadata[`item_${i}_design_url`] = product.designUrl;
      orderMetadata[`item_${i}_quantity`] = String(item.quantity);
    }
    orderMetadata.item_count = String(items.length);

    // Stripe Checkout Session erstellen
    const origin = request.headers.get("origin") || "https://beafox.app";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "sepa_debit", "paypal"],
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["DE", "AT", "CH"],
      },
      locale: "de",
      metadata: orderMetadata,
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Checkout fehlgeschlagen",
      },
      { status: 500 },
    );
  }
}

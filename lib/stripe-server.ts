// =====================================================
// Stripe Server-Side Konfiguration
// Zentrale Stelle für Stripe-Instanz und Webhook-Secret
// =====================================================
import Stripe from "stripe";

/**
 * Gibt den richtigen Stripe Secret Key zurück.
 * Prüft in dieser Reihenfolge:
 * 1. STRIPE_SECRET_KEY (direkter Override)
 * 2. STRIPE_SECRET_KEY_LIVE (Production)
 * 3. STRIPE_SECRET_KEY_TEST (Fallback/Development)
 */
function getStripeSecretKey(): string {
  const direct = process.env.STRIPE_SECRET_KEY;
  if (direct) return direct;

  const live = process.env.STRIPE_SECRET_KEY_LIVE;
  const test = process.env.STRIPE_SECRET_KEY_TEST;

  // In Production: LIVE Key bevorzugen
  if (process.env.NODE_ENV === "production" && live) return live;

  // In Development: TEST Key bevorzugen, dann LIVE als Fallback
  if (test) return test;
  if (live) return live;

  throw new Error(
    "Stripe Secret Key nicht konfiguriert. Setze STRIPE_SECRET_KEY, STRIPE_SECRET_KEY_LIVE oder STRIPE_SECRET_KEY_TEST in .env",
  );
}

/**
 * Gibt das richtige Stripe Webhook Secret zurück.
 * Gleiche Logik wie bei Secret Key.
 */
export function getStripeWebhookSecret(): string {
  const direct = process.env.STRIPE_WEBHOOK_SECRET;
  if (direct) return direct;

  const live = process.env.STRIPE_WEBHOOK_SECRET_LIVE;
  const test = process.env.STRIPE_WEBHOOK_SECRET_TEST;

  if (process.env.NODE_ENV === "production" && live) return live;

  if (test) return test;
  if (live) return live;

  throw new Error(
    "Stripe Webhook Secret nicht konfiguriert. Setze STRIPE_WEBHOOK_SECRET, STRIPE_WEBHOOK_SECRET_LIVE oder STRIPE_WEBHOOK_SECRET_TEST in .env",
  );
}

/**
 * Erstellt eine Stripe-Instanz mit dem richtigen Secret Key.
 * Singleton-Pattern für wiederholte Aufrufe im selben Request.
 */
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(getStripeSecretKey());
  }
  return stripeInstance;
}

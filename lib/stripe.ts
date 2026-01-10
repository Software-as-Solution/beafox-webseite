// Stripe configuration for BeAFox Website
import { loadStripe, Stripe } from "@stripe/stripe-js";

// Get publishable key from environment variable or window
// This should be set in .env.local: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const getStripePublishableKey = () => {
  if (typeof window === "undefined") return "";
  
  // Try to get from window (set by backend response)
  const windowKey = (window as any).__STRIPE_PUBLISHABLE_KEY__;
  if (windowKey) return windowKey;
  
  // Try to get from environment variable
  const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (envKey) return envKey;
  
  // Fallback: empty string (will be handled by caller)
  return "";
};

let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = getStripePublishableKey();
    if (!publishableKey) {
      console.warn("Stripe publishable key is not set! Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local or it will be fetched from backend.");
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export default getStripe;

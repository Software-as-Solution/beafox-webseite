"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import getStripe from "@/lib/stripe";
import client from "@/lib/api-client";
import Button from "@/components/Button";
import { CheckCircle, XCircle, Loader2, ArrowRight, Infinity, Sparkles, Zap } from "lucide-react";

// Plan pricing in cents (matching app pricing)
// Only 3 plans: Monatsabo, Jahresabo, Lifetime
const PLAN_PRICING = {
  subscription_monthly_4_99: 499, // €4.99
  subscription_yearly_44_99: 4499, // €44.99
  lifetime: 4999, // €49.99
} as const;

type PlanType = keyof typeof PLAN_PRICING;

// Plan definitions matching the app
interface PlanDefinition {
  id: PlanType;
  title: string;
  badge?: string;
  popular?: boolean;
  rightLabel: string;
  features: string[];
  descriptor?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    id: "subscription_monthly_4_99",
    title: "Monatsabo",
    descriptor: "Monatlich kündbar",
    rightLabel: "4,99 €",
    badge: undefined,
    icon: Zap,
    features: [
      "Monatliche Zahlung",
      "Jederzeit kündbar",
      "Alle Premium-Funktionen",
      "Maximale Flexibilität",
    ],
    popular: false,
  },
  {
    id: "subscription_yearly_44_99",
    title: "Jahresabo",
    descriptor: "Jährliche Zahlung",
    rightLabel: "44,99 €",
    badge: undefined,
    icon: Sparkles,
    features: [
      "Jährliche Zahlung",
      "Jederzeit kündbar",
      "Alle Premium-Funktionen",
      "Beste Preis-Leistung",
    ],
    popular: false,
  },
  {
    id: "lifetime",
    title: "Lifetime-Zugang",
    descriptor: "Lebenslang – 49,99 €",
    rightLabel: "49,99 €",
    badge: "Bestes Angebot",
    icon: Infinity,
    features: [
      "Lebenslanger Zugang",
      "Alle Premium-Funktionen",
      "Keine versteckten Kosten",
      "Zukünftige Updates inklusive",
    ],
    popular: true,
  },
];

const CheckoutForm = ({ plan, amount, clientSecret, promoCode, discountAmount = 0 }: { plan: PlanType; amount: number; clientSecret: string; promoCode?: string; discountAmount?: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Fehler beim Absenden des Formulars");
        setIsLoading(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message || "Zahlung fehlgeschlagen");
        setIsLoading(false);
      } else {
        // Payment succeeded - redirect to success page
        router.push("/checkout/success");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError("Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.");
      setIsLoading(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="flex items-center justify-center py-6 sm:py-8 md:py-12">
        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 animate-spin text-primaryOrange" />
        <span className="ml-2 sm:ml-3 text-[11px] sm:text-xs md:text-sm text-lightGray">Stripe wird geladen...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
      <div className="[&_.Input]:text-sm sm:[&_.Input]:text-base [&_.Input]:py-2.5 sm:[&_.Input]:py-3 [&_.Label]:text-xs sm:[&_.Label]:text-sm">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 sm:p-3 md:p-4 flex items-start gap-2 sm:gap-3">
          <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] sm:text-xs md:text-sm text-red-600 leading-tight sm:leading-normal">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full !px-4 sm:!px-5 md:!px-6 !py-3 sm:!py-3.5 md:!py-4 text-sm sm:text-base font-semibold active:scale-[0.98] touch-manipulation"
        disabled={isLoading || !stripe}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
            <span className="text-xs sm:text-sm md:text-base">Wird verarbeitet...</span>
          </>
        ) : (
          <span className="text-xs sm:text-sm md:text-base">
            Jetzt für {((amount - (discountAmount || 0)) / 100).toLocaleString("de-DE", {
              style: "currency",
              currency: "EUR",
            })} bezahlen
          </span>
        )}
      </Button>

      <p className="text-[10px] sm:text-xs text-lightGray text-center leading-relaxed px-2">
        Deine Zahlung wird sicher über Stripe verarbeitet. Wir speichern keine
        Kreditkartendaten.
      </p>
    </form>
  );
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState<"plan-selection" | "checkout">("plan-selection");
  const [plan, setPlan] = useState<PlanType | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/registrierung");
      return;
    }

    // Remove plan parameter from URL if present - no plan should be pre-selected
    const planParam = searchParams.get("plan");
    if (planParam) {
      // Clean URL by removing plan parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, router]);

  // Initialize Stripe only when needed (in checkout step)
  useEffect(() => {
    if (step !== "checkout") return;

    const initStripe = async () => {
      // Check if key is already in window (set by payment creation)
      const windowKey = (window as any).__STRIPE_PUBLISHABLE_KEY__;
      const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      
      if (windowKey || envKey) {
        // Use existing key
        getStripe().then((stripe) => {
          if (stripe) {
            setStripePromise(stripe);
          }
        });
      } else {
        // Try to get key from backend by creating a test payment intent
        // This will return the publishableKey in the response
        try {
          const userId = localStorage.getItem("user_id");
          const userEmail = localStorage.getItem("user_email") || "";
          const userName = localStorage.getItem("user_name") || "";
          
          if (userId && userEmail && plan) {
            const testResponse = await client.post("/stripe/create", {
              name: userName,
              email: userEmail,
              id: userId,
              amount: 100, // Test amount
              planType: plan,
            });
            
            if (testResponse.data.publishableKey) {
              (window as any).__STRIPE_PUBLISHABLE_KEY__ = testResponse.data.publishableKey;
              const { loadStripe } = await import("@stripe/stripe-js");
              const stripe = await loadStripe(testResponse.data.publishableKey);
              if (stripe) {
                setStripePromise(stripe);
                return;
              }
            }
          }
        } catch (err: any) {
          console.error("Error getting Stripe key from backend:", err);
          if (err.response?.status === 503) {
            console.error("❌ Backend Stripe is not configured. Please set STRIPE_SECRET_KEY_LIVE on the backend server.");
          }
        }
        
        // Final fallback
        getStripe().then((stripe) => {
          if (stripe) {
            setStripePromise(stripe);
          } else {
            console.error("Failed to load Stripe. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local");
          }
        });
      }
    };

    initStripe();
  }, [step, plan]);

  // Reset client secret when discount amount changes (promo code applied/removed)
  useEffect(() => {
    if (step === "checkout" && clientSecret) {
      setClientSecret(null);
    }
  }, [discountAmount, step]);

  // Create payment intent once Stripe is loaded and we're in checkout step
  // Recreate when discountAmount changes (promo code applied)
  useEffect(() => {
    // Don't create if already creating or if we already have a client secret
    if (step !== "checkout" || !stripePromise || !plan || !amount || isCreatingPayment || clientSecret) return;

    const createPaymentIntent = async () => {
      setIsCreatingPayment(true);
      setPaymentError(null);

      try {
        const userId = localStorage.getItem("user_id");
        const userEmail = localStorage.getItem("user_email") || "";
        const userName = localStorage.getItem("user_name") || "";

        if (!userId) {
          router.push("/registrierung");
          setIsCreatingPayment(false);
          return;
        }

        // Fetch user data from backend if not in localStorage
        if (!userEmail || !userName) {
          try {
            const userResponse = await client.get("/auth/getLoggedUser");
            if (userResponse.data.user) {
              localStorage.setItem("user_email", userResponse.data.user.email || "");
              localStorage.setItem("user_name", userResponse.data.user.username || "");
            }
          } catch (err) {
            console.error("Error fetching user data:", err);
          }
        }

        // Calculate final amount (original amount minus discount)
        const finalAmount = amount - discountAmount;

        const response = await client.post(
          "/stripe/create",
          {
            name: userName || localStorage.getItem("user_name") || "",
            email: userEmail || localStorage.getItem("user_email") || "",
            id: userId,
            amount: finalAmount,
            planType: plan,
            promoCode: promoCode && discountAmount > 0 ? promoCode : undefined,
          }
        );

        if (response.data.clientSecret) {
          setClientSecret(response.data.clientSecret);
          // Update Stripe with publishable key from backend if provided
          if (response.data.publishableKey && typeof window !== "undefined") {
            (window as any).__STRIPE_PUBLISHABLE_KEY__ = response.data.publishableKey;
          }
        } else {
          setPaymentError("Fehler beim Erstellen der Zahlung. Bitte versuche es erneut.");
        }
      } catch (err: any) {
        console.error("Error creating payment intent:", err);
        
        if (err.response?.status === 503) {
          setPaymentError(
            "Stripe ist auf dem Server nicht konfiguriert. Bitte kontaktiere den Support."
          );
        } else if (err.response?.status === 401) {
          // Unauthorized - redirect to registration
          router.push("/registrierung");
        } else {
          setPaymentError(
            err.response?.data?.error ||
              "Fehler beim Erstellen der Zahlung. Bitte versuche es erneut."
          );
        }
      } finally {
        setIsCreatingPayment(false);
      }
    };

    createPaymentIntent();
  }, [step, stripePromise, plan, amount, discountAmount, promoCode, router, clientSecret]);

  // Step 1: Plan Selection
  if (step === "plan-selection") {
    const selectedPlanDef = plan ? PLAN_DEFINITIONS.find((p) => p.id === plan) : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-primaryWhite pt-24 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-10 md:mb-14 mt-2 sm:mt-4 md:mt-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-2 sm:mb-3 md:mb-4 px-2">
              Wähle deinen Plan
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-lightGray max-w-2xl mx-auto px-2 leading-relaxed">
              Alle Pläne enthalten unbegrenzten Zugang zu allen Lektionen und Premium-Funktionen
            </p>
          </div>
          
          {/* Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12 max-w-5xl mx-auto">
            {PLAN_DEFINITIONS.map((planDef) => {
              const planAmount = PLAN_PRICING[planDef.id];
              const isSelected = plan === planDef.id;
              const IconComponent = planDef.icon;
              const isLifetime = planDef.id === "lifetime";
              const isMonthly = planDef.id === "subscription_monthly_4_99";
              const isYearly = planDef.id === "subscription_yearly_44_99";
              
              return (
                <button
                  key={planDef.id}
                  onClick={() => {
                    setPlan(planDef.id);
                    setAmount(planAmount);
                  }}
                  className={`relative group bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-md sm:shadow-lg md:shadow-xl p-4 sm:p-6 md:p-8 border-2 transition-all duration-300 active:scale-[0.98] sm:hover:shadow-2xl sm:hover:-translate-y-1 flex flex-col h-full justify-center items-center touch-manipulation ${
                    isLifetime
                      ? "border-primaryOrange shadow-xl sm:shadow-2xl md:scale-105 ring-2 sm:ring-3 md:ring-4 ring-primaryOrange/30 bg-gradient-to-br from-primaryOrange/10 via-white to-white"
                      : isSelected
                      ? "border-primaryOrange shadow-lg sm:shadow-xl ring-2 ring-primaryOrange/20"
                      : "border-gray-200 sm:hover:border-primaryOrange/50 active:border-primaryOrange/30"
                  }`}
                >
                  {/* Badge */}
                  {planDef.badge && (
                    <div className="absolute -top-2 sm:-top-3 md:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primaryOrange to-orange-500 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full shadow-lg sm:shadow-xl z-10 transform scale-100 sm:scale-105 md:scale-110">
                      {planDef.badge}
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 md:mb-6 mt-1 sm:mt-2 md:mt-4 rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-300 ${
                    isLifetime || isSelected
                      ? "bg-gradient-to-br from-primaryOrange to-orange-500 text-white scale-105 sm:scale-110" 
                      : "bg-primaryOrange/10 text-primaryOrange sm:group-hover:bg-primaryOrange/20"
                  }`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3 text-center ${
                    isLifetime ? "text-primaryOrange" : "text-darkerGray"
                  }`}>
                    {planDef.title}
                  </h3>

                  {/* Descriptor */}
                  <p className="text-[11px] sm:text-xs md:text-sm text-lightGray text-center min-h-[32px] sm:min-h-[36px] md:min-h-[40px] px-1 sm:px-2 leading-tight sm:leading-normal">
                    {planDef.descriptor}
                  </p>

                  {/* Price - Unified Structure */}
                  <div className="mb-3 sm:mb-4 md:mb-6 flex-grow flex flex-col justify-center">
                    <div className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-0.5 sm:mb-1 md:mb-2 transition-colors ${
                      isLifetime ? "text-primaryOrange" : isSelected ? "text-primaryOrange" : "text-darkerGray"
                    }`}>
                      {planDef.rightLabel}
                    </div>
                    <p className="text-[10px] sm:text-xs md:text-sm text-lightGray text-center">
                      {isMonthly ? "pro Monat" : isYearly ? "pro Jahr" : "Einmalzahlung"}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="mb-3 sm:mb-4 md:mb-6 flex-grow flex flex-col justify-center w-full">
                    <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mx-auto w-full px-2">
                      {planDef.features.map((feature, index) => (
                        <div key={index} className="flex items-start sm:items-center gap-1.5 sm:gap-2">
                          <CheckCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5 sm:mt-0 ${
                            isLifetime ? "text-primaryOrange" : isSelected ? "text-primaryOrange" : "text-gray-400"
                          }`} />
                          <span className="text-[10px] sm:text-xs md:text-sm text-lightGray leading-snug sm:leading-normal">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="mt-auto pt-3 sm:pt-4 md:pt-6 border-t border-gray-200 flex items-center justify-center gap-1.5 sm:gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primaryOrange" />
                      <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-primaryOrange">Ausgewählt</span>
                    </div>
                  )}

                  {/* Hover Effect Overlay */}
                  {!isSelected && !isLifetime && (
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-primaryOrange/5 to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* CTA Button */}
          {selectedPlanDef && (
            <div className="max-w-md mx-auto mt-4 sm:mt-6 md:mt-8 px-2 sm:px-4">
              <Button
                variant="primary"
                className="w-full !px-4 sm:!px-6 md:!px-8 !py-3 sm:!py-3.5 md:!py-4 text-sm sm:text-base md:text-lg font-semibold flex items-center justify-center gap-2 sm:gap-3 shadow-lg sm:shadow-xl active:scale-[0.98] sm:hover:shadow-2xl transition-all duration-300 touch-manipulation"
                onClick={() => {
                  setStep("checkout");
                  setClientSecret(null);
                  setPaymentError(null);
                }}
              >
                Weiter zum Checkout
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              </Button>
              <p className="text-center text-[10px] sm:text-xs md:text-sm text-lightGray mt-2 sm:mt-3 md:mt-4 leading-relaxed px-2">
                Sichere Zahlung über Stripe • Keine versteckten Kosten
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 2: Checkout
  if (!plan || !amount) {
    return (
      <div className="min-h-screen bg-primaryWhite pt-16 sm:pt-20 md:pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm sm:text-base text-lightGray mb-3 sm:mb-4">Kein Plan ausgewählt</p>
          <Button variant="primary" onClick={() => setStep("plan-selection")} className="!px-4 !py-2.5 text-xs sm:text-sm md:text-base active:scale-[0.98] touch-manipulation">
            Zurück zur Plan-Auswahl
          </Button>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-primaryWhite pt-16 sm:pt-20 md:pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 animate-spin text-primaryOrange mx-auto mb-2 sm:mb-3" />
          <p className="text-xs sm:text-sm text-lightGray">Stripe wird geladen...</p>
        </div>
      </div>
    );
  }

  if (isCreatingPayment || !clientSecret) {
    return (
      <div className="min-h-screen bg-primaryWhite pt-16 sm:pt-20 md:pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-sm mx-auto">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 animate-spin text-primaryOrange mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-lightGray mb-2 sm:mb-3">
            {isCreatingPayment ? "Zahlung wird vorbereitet..." : "Warte auf Zahlungsdaten..."}
          </p>
          {paymentError && (
            <div className="mt-3 sm:mt-4 bg-red-50 border border-red-200 rounded-lg p-2.5 sm:p-3 md:p-4">
              <p className="text-[11px] sm:text-xs md:text-sm text-red-600 leading-tight sm:leading-normal">{paymentError}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const selectedPlanDef = PLAN_DEFINITIONS.find((p) => p.id === plan);
  const IconComponent = selectedPlanDef?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-primaryWhite pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Button
            variant="secondary"
            onClick={() => {
              setStep("plan-selection");
              setClientSecret(null);
              setPaymentError(null);
            }}
            className="!px-3 sm:!px-4 !py-2 sm:!py-2.5 text-xs sm:text-sm md:text-base active:scale-[0.98] touch-manipulation"
          >
            ← Zurück zur Plan-Auswahl
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Left: Order Summary */}
          <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 border border-gray-100 order-2 lg:order-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
              {IconComponent && (
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primaryOrange to-orange-500 text-white flex-shrink-0">
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
              )}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-darkerGray">
                Bestellübersicht
              </h2>
            </div>

            {/* Plan Info Card */}
            <div className="bg-gradient-to-br from-primaryOrange/5 to-orange-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6 border border-primaryOrange/10">
              <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-lightGray uppercase tracking-wide">Gewählter Plan</span>
                {selectedPlanDef?.badge && (
                  <span className="bg-primaryOrange text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full">
                    {selectedPlanDef.badge}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-darkerGray mb-1 sm:mb-2">
                {selectedPlanDef?.title}
              </h3>
              <p className="text-[11px] sm:text-xs md:text-sm text-lightGray mb-2 sm:mb-3 md:mb-4 leading-tight sm:leading-normal">
                {selectedPlanDef?.descriptor}
              </p>
              <div className="pt-2 sm:pt-3 md:pt-4 border-t border-primaryOrange/20">
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between mb-1 sm:mb-1.5 md:mb-2">
                    <span className="text-[10px] sm:text-xs md:text-sm text-lightGray">Ursprünglicher Preis:</span>
                    <span className="text-[10px] sm:text-xs md:text-sm text-lightGray line-through">
                      {(amount / 100).toLocaleString("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between mb-1 sm:mb-1.5 md:mb-2">
                    <span className="text-[10px] sm:text-xs md:text-sm font-medium text-green-600">Rabatt:</span>
                    <span className="text-[10px] sm:text-xs md:text-sm font-medium text-green-600">
                      -{(discountAmount / 100).toLocaleString("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primaryOrange">
                    {((amount - discountAmount) / 100).toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                  {plan === "subscription_monthly_4_99" && (
                    <span className="text-[10px] sm:text-xs md:text-sm text-lightGray">/ Monat</span>
                  )}
                  {plan === "subscription_yearly_44_99" && (
                    <span className="text-[10px] sm:text-xs md:text-sm text-lightGray">/ Jahr</span>
                  )}
                </div>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label htmlFor="promoCode" className="block text-xs sm:text-sm font-semibold text-darkerGray mb-1.5 sm:mb-2">
                Rabattcode
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="promoCode"
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoError(null);
                    setDiscountAmount(0);
                    setDiscountPercent(0);
                  }}
                  placeholder="z.B. FRIENDS10"
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2.5 md:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange/50 focus:border-primaryOrange transition-all text-sm sm:text-base touch-manipulation"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!promoCode.trim()) {
                      setPromoError("Bitte gib einen Rabattcode ein");
                      return;
                    }
                    setIsValidatingPromo(true);
                    setPromoError(null);
                    try {
                      const response = await client.post("/stripe/validate-promo", {
                        promoCode: promoCode.trim(),
                        planType: plan,
                        amount: amount,
                      });
                      if (response.data.valid) {
                        setDiscountAmount(response.data.discountAmount || 0);
                        setDiscountPercent(response.data.discountPercent || 0);
                        setPromoError(null);
                      } else {
                        setPromoError(response.data.error || "Ungültiger Rabattcode");
                        setDiscountAmount(0);
                        setDiscountPercent(0);
                      }
                    } catch (err: any) {
                      setPromoError(err.response?.data?.error || "Fehler beim Validieren des Codes");
                      setDiscountAmount(0);
                      setDiscountPercent(0);
                    } finally {
                      setIsValidatingPromo(false);
                    }
                  }}
                  disabled={isValidatingPromo || !promoCode.trim()}
                  className="px-4 sm:px-5 md:px-6 py-2.5 sm:py-2.5 md:py-3 bg-primaryOrange text-white rounded-lg active:scale-[0.98] sm:hover:bg-primaryOrange/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base whitespace-nowrap touch-manipulation"
                >
                  {isValidatingPromo ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mx-auto" />
                  ) : (
                    "Anwenden"
                  )}
                </button>
              </div>
              {promoError && (
                <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs md:text-sm text-red-600 leading-tight sm:leading-normal">{promoError}</p>
              )}
              {discountAmount > 0 && (
                <div className="mt-1.5 sm:mt-2 p-2 sm:p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-[11px] sm:text-xs md:text-sm text-green-800 font-medium leading-tight sm:leading-normal">
                    ✓ Rabattcode angewendet: {discountPercent > 0 ? `${discountPercent}%` : `${(discountAmount / 100).toFixed(2)} €`} Rabatt
                  </p>
                </div>
              )}
            </div>

            {/* Subscription Details */}
            {(plan === "subscription_monthly_4_99" || plan === "subscription_yearly_44_99" || plan === "lifetime") && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-[10px] sm:text-xs font-bold">i</span>
                  </div>
                  <p className="text-[11px] sm:text-xs md:text-sm text-blue-800 leading-relaxed">
                    {plan === "subscription_monthly_4_99"
                      ? "Dieses Abonnement verlängert sich automatisch monatlich. Du kannst es jederzeit kündigen."
                      : plan === "subscription_yearly_44_99"
                      ? "Dieses Jahresabo verlängert sich automatisch jährlich. Du kannst es jederzeit kündigen."
                      : "Einmalzahlung für lebenslangen Zugang. Keine automatische Verlängerung."}
                  </p>
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-100">
              <h3 className="font-bold text-darkerGray mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primaryOrange flex-shrink-0" />
                Was du erhältst:
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
                {selectedPlanDef?.features.map((feature, index) => (
                  <li key={index} className="flex items-start sm:items-center gap-1.5 sm:gap-2 md:gap-3">
                    <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-primaryOrange/10 flex items-center justify-center mt-0.5 sm:mt-0">
                      <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-primaryOrange" />
                    </div>
                    <span className="text-[11px] sm:text-xs md:text-sm text-lightGray leading-snug sm:leading-normal">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security Badge */}
            <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-gray-200 flex items-center justify-center gap-1.5 sm:gap-2">
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
              </div>
              <span className="text-[10px] sm:text-xs text-lightGray">Sichere Zahlung über Stripe</span>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 border border-gray-100 order-1 lg:order-2">
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-darkerGray mb-1 sm:mb-2">
                Zahlungsinformationen
              </h2>
              <p className="text-[11px] sm:text-xs md:text-sm text-lightGray leading-relaxed">
                Deine Zahlungsdaten werden sicher verarbeitet
              </p>
            </div>

            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#FF6B35",
                    colorBackground: "#ffffff",
                    colorText: "#1D1B1B",
                    colorDanger: "#ef4444",
                    fontFamily: "system-ui, sans-serif",
                    spacingUnit: "4px",
                    borderRadius: "8px",
                    fontSizeBase: "14px",
                  },
                  rules: {
                    ".Input": {
                      borderColor: "#E5E7EB",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      fontSize: "16px", // Prevents zoom on iOS
                    },
                    ".Input:focus": {
                      borderColor: "#FF6B35",
                      boxShadow: "0 0 0 3px rgba(255, 107, 53, 0.1)",
                    },
                    ".Label": {
                      fontSize: "13px",
                      marginBottom: "6px",
                    },
                    ".Tab": {
                      padding: "10px 12px",
                      fontSize: "14px",
                    },
                  },
                },
              }}
            >
              <CheckoutForm plan={plan} amount={amount} clientSecret={clientSecret} promoCode={promoCode} discountAmount={discountAmount} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-primaryWhite flex items-center justify-center pt-24">
          <Loader2 className="w-8 h-8 animate-spin text-primaryOrange" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import getStripe from "@/lib/stripe";
import client from "@/lib/api-client";
import Button from "@/components/Button";
import { CheckCircle, XCircle, Loader2, ArrowRight, Infinity, Sparkles, Zap } from "lucide-react";

// Plan pricing in cents (matching app pricing)
// Only 3 plans: Jahresabo, Lifetime, Monatliches Abo
const PLAN_PRICING = {
  subscription_monthly_3_99: 399, // €3.99
  lifetime: 4999, // €49.99
  subscription_monthly_4_99: 499, // €4.99
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
    id: "subscription_monthly_3_99",
    title: "Jahresabo",
    descriptor: "12 Monate – 47,99 €",
    rightLabel: "3,99 €",
    badge: undefined,
    icon: Sparkles,
    features: [
      "Monatliche Zahlung",
      "12 Monate Bindung",
      "Alle Premium-Funktionen",
      "Flexibel und günstig",
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
  {
    id: "subscription_monthly_4_99",
    title: "Monatliches Abo",
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
];

const CheckoutForm = ({ plan, amount, clientSecret }: { plan: PlanType; amount: number; clientSecret: string }) => {
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primaryOrange" />
        <span className="ml-3 text-lightGray">Stripe wird geladen...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full !px-6 !py-3"
        disabled={isLoading || !stripe}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Wird verarbeitet...
          </>
        ) : (
          `Jetzt für ${(amount / 100).toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
          })} bezahlen`
        )}
      </Button>

      <p className="text-xs text-lightGray text-center">
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
        } catch (err) {
          console.error("Error getting Stripe key from backend:", err);
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

  // Create payment intent once Stripe is loaded and we're in checkout step
  useEffect(() => {
    if (step !== "checkout" || !stripePromise || !plan || !amount || clientSecret || isCreatingPayment) return;

    const createPaymentIntent = async () => {
      setIsCreatingPayment(true);
      setPaymentError(null);

      try {
        const userId = localStorage.getItem("user_id");
        const userEmail = localStorage.getItem("user_email") || "";
        const userName = localStorage.getItem("user_name") || "";

        if (!userId) {
          router.push("/registrierung");
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

        const response = await client.post(
          "/stripe/create",
          {
            name: userName || localStorage.getItem("user_name") || "",
            email: userEmail || localStorage.getItem("user_email") || "",
            id: userId,
            amount: amount,
            planType: plan,
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
        setPaymentError(
          err.response?.data?.error ||
            "Fehler beim Erstellen der Zahlung. Bitte versuche es erneut."
        );
      } finally {
        setIsCreatingPayment(false);
      }
    };

    createPaymentIntent();
  }, [step, stripePromise, plan, amount, router, clientSecret, isCreatingPayment]);

  // Step 1: Plan Selection
  if (step === "plan-selection") {
    const selectedPlanDef = plan ? PLAN_DEFINITIONS.find((p) => p.id === plan) : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-primaryWhite pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-14 mt-6">
            <h1 className="text-4xl md:text-5xl font-bold text-darkerGray mb-4">
              Wähle deinen Plan
            </h1>
            <p className="text-lg text-lightGray max-w-2xl mx-auto">
              Alle Pläne enthalten unbegrenzten Zugang zu allen Lektionen und Premium-Funktionen
            </p>
          </div>
          
          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
            {PLAN_DEFINITIONS.map((planDef) => {
              const planAmount = PLAN_PRICING[planDef.id];
              const isSelected = plan === planDef.id;
              const IconComponent = planDef.icon;
              const isLifetime = planDef.id === "lifetime";
              const isMonthly = planDef.id === "subscription_monthly_3_99" || planDef.id === "subscription_monthly_4_99";
              
              return (
                <button
                  key={planDef.id}
                  onClick={() => {
                    setPlan(planDef.id);
                    setAmount(planAmount);
                  }}
                  className={`relative group bg-white rounded-3xl shadow-lg p-8 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full justify-center items-center ${
                    isLifetime
                      ? "border-primaryOrange shadow-2xl scale-105 ring-4 ring-primaryOrange/30 bg-gradient-to-br from-primaryOrange/10 via-white to-white"
                      : isSelected
                      ? "border-primaryOrange shadow-xl ring-2 ring-primaryOrange/20"
                      : "border-gray-200 hover:border-primaryOrange/50"
                  }`}
                >
                  {/* Badge */}
                  {planDef.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primaryOrange to-orange-500 text-white text-xs font-bold px-5 py-2 rounded-full shadow-xl z-10 transform scale-110">
                      {planDef.badge}
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-6 mt-4 rounded-2xl transition-all duration-300 ${
                    isLifetime || isSelected
                      ? "bg-gradient-to-br from-primaryOrange to-orange-500 text-white scale-110" 
                      : "bg-primaryOrange/10 text-primaryOrange group-hover:bg-primaryOrange/20"
                  }`}>
                    <IconComponent className="w-8 h-8" />
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold mb-3 text-center ${
                    isLifetime ? "text-primaryOrange" : "text-darkerGray"
                  }`}>
                    {planDef.title}
                  </h3>

                  {/* Descriptor */}
                  <p className="text-sm text-lightGray text-center min-h-[40px]">
                    {planDef.descriptor}
                  </p>

                  {/* Price - Unified Structure */}
                  <div className="mb-6 flex-grow flex flex-col justify-center">
                    <div className={`text-5xl font-extrabold text-center mb-2 transition-colors ${
                      isLifetime ? "text-primaryOrange" : isSelected ? "text-primaryOrange" : "text-darkerGray"
                    }`}>
                      {planDef.rightLabel}
                    </div>
                    <p className="text-sm text-lightGray text-center">
                      {isMonthly ? "pro Monat" : "Einmalzahlung"}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="mb-6 flex-grow flex flex-col justify-center">
                    <div className="space-y-3 mx-auto">
                      {planDef.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                            isLifetime ? "text-primaryOrange" : isSelected ? "text-primaryOrange" : "text-gray-400"
                          }`} />
                          <span className="text-sm text-lightGray">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="mt-auto pt-6 border-t border-gray-200 flex items-center justify-center gap-2">
                      <CheckCircle className="w-6 h-6 text-primaryOrange" />
                      <span className="text-sm font-semibold text-primaryOrange">Ausgewählt</span>
                    </div>
                  )}

                  {/* Hover Effect Overlay */}
                  {!isSelected && !isLifetime && (
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primaryOrange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* CTA Button */}
          {selectedPlanDef && (
            <div className="max-w-md mx-auto mt-6">
              <Button
                variant="primary"
                className="w-full !px-8 !py-4 text-lg font-semibold flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => {
                  setStep("checkout");
                  setClientSecret(null);
                  setIsCreatingPayment(false);
                }}
              >
                Weiter zum Checkout
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-center text-sm text-lightGray mt-4">
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
      <div className="min-h-screen bg-primaryWhite pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lightGray mb-4">Kein Plan ausgewählt</p>
          <Button variant="primary" onClick={() => setStep("plan-selection")}>
            Zurück zur Plan-Auswahl
          </Button>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-primaryWhite pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primaryOrange" />
      </div>
    );
  }

  if (isCreatingPayment || !clientSecret) {
    return (
      <div className="min-h-screen bg-primaryWhite pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primaryOrange mx-auto mb-4" />
          <p className="text-lightGray">
            {isCreatingPayment ? "Zahlung wird vorbereitet..." : "Warte auf Zahlungsdaten..."}
          </p>
          {paymentError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{paymentError}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const selectedPlanDef = PLAN_DEFINITIONS.find((p) => p.id === plan);
  const IconComponent = selectedPlanDef?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-primaryWhite pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="secondary"
            onClick={() => {
              setStep("plan-selection");
              setClientSecret(null);
            }}
            className="!px-4 !py-2"
          >
            ← Zurück zur Plan-Auswahl
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Order Summary */}
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              {IconComponent && (
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primaryOrange to-orange-500 text-white">
                  <IconComponent className="w-6 h-6" />
                </div>
              )}
              <h2 className="text-3xl font-bold text-darkerGray">
                Bestellübersicht
              </h2>
            </div>

            {/* Plan Info Card */}
            <div className="bg-gradient-to-br from-primaryOrange/5 to-orange-50 rounded-2xl p-6 mb-6 border border-primaryOrange/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-lightGray uppercase tracking-wide">Gewählter Plan</span>
                {selectedPlanDef?.badge && (
                  <span className="bg-primaryOrange text-white text-xs font-bold px-3 py-1 rounded-full">
                    {selectedPlanDef.badge}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-darkerGray mb-2">
                {selectedPlanDef?.title}
              </h3>
              <p className="text-sm text-lightGray mb-4">
                {selectedPlanDef?.descriptor}
              </p>
              <div className="flex items-baseline gap-2 pt-4 border-t border-primaryOrange/20">
                <span className="text-4xl font-extrabold text-primaryOrange">
                  {(amount / 100).toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
                {(plan === "subscription_monthly_3_99" || plan === "subscription_monthly_4_99") && (
                  <span className="text-sm text-lightGray">/ Monat</span>
                )}
              </div>
            </div>

            {/* Subscription Details */}
            {(plan === "subscription_monthly_3_99" || plan === "subscription_monthly_4_99" || plan === "lifetime") && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    {plan === "subscription_monthly_3_99" 
                      ? "Dieses Jahresabo verlängert sich automatisch monatlich. 12 Monate Bindung."
                      : plan === "subscription_monthly_4_99"
                      ? "Dieses Abonnement verlängert sich automatisch monatlich. Du kannst es jederzeit kündigen."
                      : "Einmalzahlung für lebenslangen Zugang. Keine automatische Verlängerung."}
                  </p>
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-darkerGray mb-4 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primaryOrange" />
                Was du erhältst:
              </h3>
              <ul className="space-y-3">
                {selectedPlanDef?.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primaryOrange/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primaryOrange" />
                    </div>
                    <span className="text-sm text-lightGray">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security Badge */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-lightGray">Sichere Zahlung über Stripe</span>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-darkerGray mb-2">
                Zahlungsinformationen
              </h2>
              <p className="text-sm text-lightGray">
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
                    borderRadius: "12px",
                    fontSizeBase: "16px",
                  },
                  rules: {
                    ".Input": {
                      borderColor: "#E5E7EB",
                      borderRadius: "12px",
                      padding: "12px",
                    },
                    ".Input:focus": {
                      borderColor: "#FF6B35",
                      boxShadow: "0 0 0 3px rgba(255, 107, 53, 0.1)",
                    },
                  },
                },
              }}
            >
              <CheckoutForm plan={plan} amount={amount} clientSecret={clientSecret} />
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

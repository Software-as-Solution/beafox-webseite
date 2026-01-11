"use client";

// IMPORTS
import {
  Clock,
  LogOut,
  Loader2,
  XCircle,
  Calendar,
  FileText,
  RefreshCw,
  CreditCard,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
// COMPONENTS
import Button from "@/components/Button";
// API
import client from "@/lib/api-client";

function AccountContent() {
  // ROUTER
  const router = useRouter();
  // STATES
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  // CONSTANTS
  const isSubscription =
    subscriptionData?.plan?.startsWith("subscription_") || false;
  const isLifetime = subscriptionData?.plan === "lifetime";
  const isCancelled = subscriptionData?.status === "cancelled";
  const isStripeSubscription = subscriptionData?.subscriptionType === "stripe";
  const isNativeSubscription = subscriptionData?.subscriptionType === "native";
  // FUNCTIONS
  const handleCancelSubscription = async () => {
    // Only allow cancellation for Stripe subscriptions
    if (!isStripeSubscription) {
      alert(
        "Native Abos (Apple/Google) können nur über die App oder die entsprechenden Stores verwaltet werden."
      );
      return;
    }

    if (
      !confirm(
        "Möchtest du dein Abo wirklich kündigen? Dein Zugang bleibt bis zum Ende der aktuellen Laufzeit aktiv."
      )
    ) {
      return;
    }

    setIsCancelling(true);
    try {
      await client.post("/stripe/subscription/cancel");
      // Refresh subscription details
      const response = await client.get("/stripe/subscription");
      setSubscriptionData(response.data.subscription);
      alert("Dein Abo wurde erfolgreich gekündigt.");
    } catch (err: any) {
      console.error("Error cancelling subscription:", err);
      alert(
        err.response?.data?.error ||
          "Fehler beim Kündigen des Abos. Bitte versuche es erneut."
      );
    } finally {
      setIsCancelling(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    router.push("/");
  };
  const getPlanName = (plan: string | null) => {
    if (!plan) return "Unbekannt";
    if (plan === "subscription_monthly_3_99") return "Jahresabo - 3,99€/Monat";
    if (plan === "subscription_monthly_4_99")
      return "Monatliches Abo - 4,99€/Monat";
    if (plan === "lifetime") return "Lifetime-Zugang";
    if (plan === "yearly") return "Jahreslizenz";
    return plan;
  };
  const formatDate = (date: string | Date | null) => {
    if (!date) return "Nicht verfügbar";
    const d = new Date(date);
    return d.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { color: string; icon: any; text: string }
    > = {
      active: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        text: "Aktiv",
      },
      cancelled: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        text: "Gekündigt",
      },
      expired: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        text: "Abgelaufen",
      },
      pending: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: RefreshCw,
        text: "Ausstehend",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border ${config.color}`}
      >
        <Icon size={14} className="sm:w-4 sm:h-4" />
        {config.text}
      </span>
    );
  };
  // USE EFFECTS
  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Try to get subscription details from Stripe endpoint
        try {
          const response = await client.get("/stripe/subscription");
          setSubscriptionData(response.data.subscription);
        } catch (stripeErr: any) {
          // If Stripe is not configured (503), try to get subscription status instead
          if (stripeErr.response?.status === 503) {
            try {
              const statusResponse = await client.get("/stripe/subscription/status");
              setSubscriptionData(statusResponse.data.subscription);
            } catch (statusErr: any) {
              throw stripeErr; // Re-throw original error if status also fails
            }
          } else {
            throw stripeErr; // Re-throw if it's not a 503 error
          }
        }
      } catch (err: any) {
        console.error("Error fetching subscription details:", err);
        if (err.response?.status === 401) {
          router.push("/login");
        } else {
          setError(
            err.response?.data?.error ||
              "Fehler beim Laden der Abo-Details. Bitte versuche es erneut."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primaryOrange animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-lightGray">Lade Abo-Details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10"
          >
            <div className="text-center">
              <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-darkerGray mb-2">
                Fehler beim Laden
              </h2>
              <p className="text-sm sm:text-base text-lightGray mb-4 sm:mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
                className="!px-6 !py-3 text-sm sm:text-base"
              >
                Erneut versuchen
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-darkerGray mb-2 sm:mb-3 px-2">
            Mein Account
          </h1>
          <p className="text-base sm:text-lg text-lightGray px-2">
            Verwalte dein BeAFox Unlimited Abo
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Subscription Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-darkerGray">Abo-Status</h2>
              {getStatusBadge(subscriptionData?.status || "pending")}
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Current Plan */}
              <div className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-primaryOrange/20">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primaryOrange/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primaryOrange" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-lightGray font-medium">
                      Aktuelles Modell
                    </p>
                    <h3 className="text-lg sm:text-xl font-bold text-darkerGray break-words">
                      {getPlanName(subscriptionData?.plan)}
                    </h3>
                  </div>
                </div>
                {subscriptionData?.paymentMethod && isStripeSubscription && (
                  <p className="text-xs sm:text-sm text-lightGray">
                    Zahlungsmethode:{" "}
                    <span className="font-semibold text-darkerGray capitalize">
                      {subscriptionData.paymentMethod}
                    </span>
                  </p>
                )}
                {isNativeSubscription && (
                  <p className="text-xs sm:text-sm text-lightGray">
                    Zahlungsmethode:{" "}
                    <span className="font-semibold text-darkerGray">
                      {subscriptionData?.paymentMethod === "app_store" ? "Apple App Store" : 
                       subscriptionData?.paymentMethod === "google_play" ? "Google Play Store" : 
                       "Apple/Google"}
                    </span>
                  </p>
                )}
              </div>

              {/* Expiry/Renewal Date */}
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-darkerGray" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-lightGray font-medium">
                      {isLifetime
                        ? "Gültig bis"
                        : isCancelled
                        ? "Läuft ab am"
                        : isSubscription
                        ? "Nächste Verlängerung"
                        : "Läuft ab am"}
                    </p>
                    <h3 className="text-lg sm:text-xl font-bold text-darkerGray break-words">
                      {isLifetime
                        ? "Unbegrenzt"
                        : formatDate(subscriptionData?.expiresAt)}
                    </h3>
                  </div>
                </div>
                {isSubscription && !isCancelled && (
                  <p className="text-xs sm:text-sm text-lightGray">
                    Automatische Verlängerung aktiviert
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Invoice Section - Only show for Stripe subscriptions */}
          {isStripeSubscription && subscriptionData?.lastPaymentDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primaryOrange/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primaryOrange" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-darkerGray">
                  Letzte Rechnung
                </h2>
              </div>

              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                  <div>
                    <p className="text-xs sm:text-sm text-lightGray font-medium">
                      Zahlungsdatum
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-darkerGray">
                      {formatDate(subscriptionData.lastPaymentDate)}
                    </p>
                  </div>
                  {subscriptionData.paymentIntentId && (
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm text-lightGray font-medium">
                        Zahlungs-ID
                      </p>
                      <p className="text-xs sm:text-sm font-mono text-darkerGray break-all">
                        {subscriptionData.paymentIntentId.slice(0, 20)}...
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-lightGray">
                  Deine Rechnung wurde per E-Mail an dich gesendet.
                </p>
              </div>
            </motion.div>
          )}

          {/* Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-darkerGray mb-4 sm:mb-6">
              Aktionen
            </h2>

            <div className="space-y-3">
              {/* Native Subscription Info */}
              {isNativeSubscription && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-5 mb-3 sm:mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-blue-900 mb-1">
                        Native Abo (Apple/Google)
                      </h3>
                      <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                        Dein Abo wurde über Apple oder Google erworben. Um dein Abo zu verwalten, zu kündigen oder zu ändern, 
                        musst du dies über die BeAFox App oder direkt in den Einstellungen deines Apple/Google Accounts tun.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isCancelled && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-yellow-800">
                    Dein Abo wurde gekündigt. Du kannst es bis zum{" "}
                    <span className="font-semibold">
                      {formatDate(subscriptionData?.expiresAt)}
                    </span>{" "}
                    nutzen.
                  </p>
                </div>
              )}

              {/* Change/Upgrade Subscription Button - Only for Stripe subscriptions */}
              {isStripeSubscription && (
                <Link href="/checkout" className="block">
                  <div className="w-full bg-gradient-to-r from-primaryOrange to-primaryOrange/90 text-white rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primaryOrange/20">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm sm:text-base truncate">
                            Abo ändern oder upgraden
                          </p>
                          <p className="text-xs sm:text-sm text-white/80 truncate">
                            Wechsle zu einem anderen Plan
                          </p>
                        </div>
                      </div>
                      <div className="text-white/60 flex-shrink-0">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Cancel Subscription Button - Only for Stripe subscriptions */}
              {isStripeSubscription && isSubscription && !isCancelled && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                  className="w-full bg-white border-2 border-gray-200 text-darkerGray rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-red-200 hover:bg-red-50 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        {isCancelling ? (
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm sm:text-base text-left truncate">
                          {isCancelling ? "Wird gekündigt..." : "Abo kündigen"}
                        </p>
                        <p className="text-xs sm:text-sm text-lightGray text-left truncate">
                          Kündigung zum Ende der Laufzeit
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-400 flex-shrink-0">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full bg-white border-2 border-gray-200 text-lightGray rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-lightGray" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm sm:text-base text-left">
                      Abmelden
                    </p>
                    <p className="text-xs sm:text-sm text-lightGray text-left">
                      Von deinem Account abmelden
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 flex items-center justify-center pt-28">
          <Loader2 className="w-8 h-8 animate-spin text-primaryOrange" />
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}

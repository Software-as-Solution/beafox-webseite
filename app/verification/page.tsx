"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import client from "@/lib/api-client";
import { CheckCircle, Loader2 } from "lucide-react";

export default function VerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");
  const [countDown, setCountDown] = useState(0);
  const [canSendNewOtpRequest, setCanSendNewOtpRequest] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Parse user info from URL params
    const userInfoParam = searchParams.get("userInfo");
    if (userInfoParam) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userInfoParam));
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user info:", err);
        router.push("/registrierung");
      }
    } else {
      // If no user info, redirect to registration
      router.push("/registrierung");
    }

    // Focus OTP input on mount
    setTimeout(() => {
      otpInputRef.current?.focus();
    }, 100);
  }, [searchParams, router]);

  useEffect(() => {
    if (canSendNewOtpRequest) return;

    const intervalId = setInterval(() => {
      setCountDown((oldCountDown) => {
        if (oldCountDown <= 1) {
          setCanSendNewOtpRequest(true);
          clearInterval(intervalId);
          return 0;
        }
        return oldCountDown - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [canSendNewOtpRequest]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError(null);
  };

  const isValidOtp = otp.length === 6 && /^\d{6}$/.test(otp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidOtp) {
      setError("Bitte gib einen gültigen 6-stelligen Code ein");
      return;
    }

    if (!user?.id) {
      setError("Ungültige Nutzerdaten");
      router.push("/registrierung");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await client.post("/auth/verify-email", {
        userId: user.id,
        token: otp,
      });

      // Refresh user profile
      try {
        const profileResponse = await client.get("/auth/is-auth");
        if (profileResponse.data.profile) {
          localStorage.setItem("user_email", profileResponse.data.profile.email || "");
          localStorage.setItem("user_name", profileResponse.data.profile.username || "");
        }
      } catch (err) {
        console.error("Error refreshing profile:", err);
      }

      // Redirect to checkout after successful verification
      router.push("/checkout?plan=subscription_monthly_3_99");
    } catch (error: any) {
      console.error("Verification error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Verifizierung fehlgeschlagen. Bitte versuche es erneut.";

      // Check if it's a token error
      if (
        errorMessage.includes("token") ||
        errorMessage.includes("Invalid") ||
        errorMessage.includes("expired")
      ) {
        setError("Token nicht gefunden oder abgelaufen. Bitte neuen Code anfordern.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestOTP = async () => {
    if (!user?.id) return;

    setCountDown(60);
    setCanSendNewOtpRequest(false);
    setError(null);

    try {
      await client.post("/auth/re-verify-email", {
        userId: user.id,
      });
    } catch (error: any) {
      console.error("Error requesting new OTP:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Fehler beim Senden des Codes. Bitte versuche es erneut.";
      setError(errorMessage);
      setCanSendNewOtpRequest(true);
      setCountDown(0);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-primaryWhite flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primaryOrange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primaryWhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle className="w-8 h-8 text-primaryOrange" />
              <h1 className="text-3xl font-bold text-darkerGray">Verifizieren</h1>
            </div>
            <div className="space-y-2">
              <p className="text-lightGray">Code gesendet an:</p>
              <p className="text-primaryOrange font-semibold">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-darkerGray mb-2"
              >
                Geben Sie den 6-stelligen Code ein:
              </label>
              <input
                ref={otpInputRef}
                id="otp"
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
                className={`w-full px-4 py-4 text-center text-2xl font-bold tracking-widest border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="123456"
                autoComplete="off"
              />
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm">
              <button
                type="button"
                onClick={requestOTP}
                disabled={!canSendNewOtpRequest}
                className={`text-primaryOrange hover:underline ${
                  !canSendNewOtpRequest ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Code erneut senden
              </button>
              {countDown > 0 && (
                <span className="text-lightGray">({countDown} Sek)</span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full !px-6 !py-3"
              disabled={isSubmitting || !isValidOtp}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Wird verifiziert...
                </>
              ) : (
                "Verifizieren"
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/registrierung"
                className="text-sm text-primaryOrange hover:underline"
              >
                Zurück zur Registrierung
              </Link>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-primaryOrange/10 rounded-lg p-4">
          <p className="text-sm text-darkerGray text-center">
            Prüfe dein E-Mail-Postfach für den Verifizierungscode. Falls du keine E-Mail
            erhalten hast, prüfe auch deinen Spam-Ordner.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

// IMPORTS
import {
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
// COMPONENTS
import Button from "@/components/Button";
// API
import client from "@/lib/api-client";

function ResetPasswordContent() {
  // ROUTER
  const router = useRouter();
  const searchParams = useSearchParams();
  // STATES
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  // FUNCTIONS
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const userIdParam = searchParams.get("userId");

    if (!tokenParam || !userIdParam) {
      setError("Ungültiger oder fehlender Reset-Link");
      setIsValidating(false);
      return;
    }

    setToken(tokenParam);
    setUserId(userIdParam);

    // Validate token
    const validateToken = async () => {
      try {
        const response = await client.post("/auth/verify-pass-reset-token", {
          token: tokenParam,
          userId: userIdParam,
        });

        if (response.data.valid) {
          setIsValid(true);
        } else {
          setError("Der Reset-Link ist ungültig oder abgelaufen");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
            "Der Reset-Link ist ungültig oder abgelaufen"
        );
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [searchParams]);

  const validatePassword = (pwd: string) => {
    // Password must be at least 8 characters and contain letters, numbers, and special characters
    const passRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{}|;:'",.<>/?`~\\])[a-zA-Z\d!@#$%^&*()_\-+=[\]{}|;:'",.<>/?`~\\]+$/;
    return pwd.length >= 8 && passRegex.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("Bitte fülle alle Felder aus");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Passwort muss mindestens 8 Zeichen lang sein und Buchstaben, Zahlen und Sonderzeichen enthalten"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    if (!token || !userId) {
      setError("Ungültiger Reset-Link");
      return;
    }

    setIsLoading(true);

    try {
      await client.post("/auth/update-password", {
        token,
        userId,
        password,
      });

      setSuccess(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Fehler beim Zurücksetzen des Passworts. Bitte versuche es erneut.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primaryOrange animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-lightGray">
            Reset-Link wird überprüft...
          </p>
        </div>
      </div>
    );
  }

  if (!isValid || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-darkerGray mb-4">
              Link ungültig
            </h2>
            <p className="text-sm sm:text-base text-lightGray mb-6">
              {error ||
                "Der Reset-Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link an."}
            </p>
            <Link href="/forgot-password">
              <Button variant="primary" className="w-full !px-6 !py-3 text-base">
                Neuen Link anfordern
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-darkerGray mb-4">
              Passwort erfolgreich zurückgesetzt!
            </h2>
            <p className="text-sm sm:text-base text-lightGray mb-6">
              Dein Passwort wurde erfolgreich geändert. Du kannst dich jetzt mit
              deinem neuen Passwort anmelden.
            </p>
            <Link href="/login">
              <Button variant="primary" className="w-full !px-6 !py-3 text-base">
                Zur Anmeldung
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          initial={{ opacity: 0, y: -20 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-darkerGray mb-2 sm:mb-3">
            Neues Passwort setzen
          </h1>
          <p className="text-base sm:text-lg text-lightGray">
            Gib dein neues Passwort ein
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-darkerGray mb-2 sm:mb-3"
              >
                Neues Passwort
              </label>
              <div className="relative">
                <input
                  id="password"
                  value={password}
                  placeholder="Mindestens 8 Zeichen"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryOrange/50 transition-all ${
                    error && !validatePassword(password) && password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-primaryOrange/50"
                  }`}
                />
                <Lock
                  size={18}
                  className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 ${
                    error && !validatePassword(password) && password
                      ? "text-red-500"
                      : "text-lightGray"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-lightGray hover:text-darkerGray transition-colors p-1"
                  aria-label={
                    showPassword ? "Passwort verbergen" : "Passwort anzeigen"
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-darkerGray mb-2 sm:mb-3"
              >
                Passwort bestätigen
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  value={confirmPassword}
                  placeholder="Passwort wiederholen"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryOrange/50 transition-all ${
                    error && password !== confirmPassword && confirmPassword
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-primaryOrange/50"
                  }`}
                />
                <Lock
                  size={18}
                  className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 ${
                    error && password !== confirmPassword && confirmPassword
                      ? "text-red-500"
                      : "text-lightGray"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-lightGray hover:text-darkerGray transition-colors p-1"
                  aria-label={
                    showConfirmPassword
                      ? "Passwort verbergen"
                      : "Passwort anzeigen"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -10 }}
                className="bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3"
              >
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-600 font-medium">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="pt-3 sm:pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full !px-6 sm:!px-8 !py-3 sm:!py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span className="text-sm sm:text-base">Wird gespeichert...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Passwort zurücksetzen</span>
                  </span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Info Box */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 sm:mt-6 bg-gradient-to-r from-primaryOrange/10 to-primaryOrange/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-primaryOrange/20"
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primaryOrange/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-primaryOrange" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-darkerGray mb-1">
                Passwort-Anforderungen
              </h3>
              <p className="text-xs sm:text-sm text-darkerGray leading-relaxed">
                Dein Passwort muss mindestens 8 Zeichen lang sein und Buchstaben,
                Zahlen und Sonderzeichen enthalten.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primaryOrange" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

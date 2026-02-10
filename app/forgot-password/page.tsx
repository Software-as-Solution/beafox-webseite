"use client";

// IMPORTS
import {
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
// COMPONENTS
import Button from "@/components/Button";
// API
import client from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const t = useTranslations("authForgotPassword");
  // ROUTER
  const router = useRouter();
  // STATES
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // FUNCTIONS
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setError(null);

    if (!email || !validateEmail(email)) {
      setError(t("validation.emailInvalid"));
      return;
    }

    setIsLoading(true);

    try {
      await client.post("/auth/forget-password", {
        email: email.trim(),
      });

      setSuccess(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        t("errors.sendFailedFallback");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
            {t("title")}
          </h1>
          <p className="text-base sm:text-lg text-lightGray">
            {success
              ? t("subtitle.success")
              : t("subtitle.default")}
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10"
        >
          {success ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-darkerGray mb-4">
                {t("success.title")}
              </h2>
              <p className="text-sm sm:text-base text-lightGray mb-6 leading-relaxed">
                {t("success.text")}
              </p>
              <Link href="/login">
                <Button variant="primary" className="w-full !px-6 !py-3 text-base">
                  {t("success.backToLogin")}
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-darkerGray mb-2 sm:mb-3"
                >
                  {t("fields.email.label")}
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    autoCapitalize="none"
                    value={email}
                    placeholder={t("fields.email.placeholder")}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 pl-10 sm:pl-12 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryOrange/50 transition-all ${
                      hasSubmitted && error && !validateEmail(email)
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-primaryOrange/50"
                    }`}
                  />
                  <Mail
                    size={18}
                    className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 ${
                      hasSubmitted && error && !validateEmail(email)
                        ? "text-red-500"
                        : "text-lightGray"
                    }`}
                  />
                </div>
                {hasSubmitted && error && !validateEmail(email) && (
                  <motion.p
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: -5 }}
                    className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-red-500"
                  >
                    <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Submit Error */}
              {error && validateEmail(email) && (
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
                      <span className="text-sm sm:text-base">{t("button.loading")}</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">{t("button.submit")}</span>
                    </span>
                  )}
                </Button>
              </div>

              {/* Back to Login Link */}
              <div className="text-center pt-3 sm:pt-4 border-t border-gray-200">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-lightGray hover:text-primaryOrange transition-colors"
                >
                  <ArrowLeft size={14} />
                  {t("links.backToLogin")}
                </Link>
              </div>
            </form>
          )}
        </motion.div>

        {/* Info Box */}
        {!success && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 sm:mt-6 bg-gradient-to-r from-primaryOrange/10 to-primaryOrange/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-primaryOrange/20"
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primaryOrange/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primaryOrange" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-darkerGray mb-1">
                  {t("info.title")}
                </h3>
                <p className="text-xs sm:text-sm text-darkerGray leading-relaxed">
                  {t("info.text")}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

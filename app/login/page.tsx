"use client";

// IMPORTS
import {
  Eye,
  Mail,
  Lock,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
// COMPONENTS
import Button from "@/components/Button";
// API
import client from "@/lib/api-client";

export default function LoginPage() {
  // ROUTER
  const router = useRouter();
  // STATES
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  // FUNCTIONS
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    // Only validate if form has been submitted
    if (hasSubmitted) {
      const newErrors: Record<string, string> = {};
      if (
        field === "email" &&
        (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      ) {
        newErrors.email = "Bitte gib eine gültige E-Mail-Adresse ein";
      }
      if (field === "password" && !formData.password) {
        newErrors.password = "Passwort ist erforderlich";
      }
      if (newErrors[field]) {
        setErrors({ ...errors, ...newErrors });
      } else {
        const updatedErrors = { ...errors };
        delete updatedErrors[field];
        setErrors(updatedErrors);
      }
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Bitte gib eine gültige E-Mail-Adresse ein";
    }

    if (!formData.password) {
      newErrors.password = "Passwort ist erforderlich";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark form as submitted
    setHasSubmitted(true);

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await client.post("/auth/sign-in", {
        email: formData.email,
        password: formData.password,
      });

      // Store token and user data
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        if (response.data.profile) {
          localStorage.setItem("user_id", response.data.profile.id);
          localStorage.setItem(
            "user_email",
            response.data.profile.email || formData.email
          );
          localStorage.setItem(
            "user_name",
            response.data.profile.username || ""
          );
        }
      }

      // Check if user is verified first
      if (!response.data.profile?.verified) {
        // User not verified, redirect to verification page
        router.push(
          "/verification?userInfo=" +
            encodeURIComponent(JSON.stringify(response.data.profile))
        );
        return;
      }

      // Check if user has active subscription
      try {
        const subscriptionResponse = await client.get(
          "/stripe/subscription/status"
        );
        console.log("Subscription response:", subscriptionResponse.data);
        if (subscriptionResponse.data?.subscription?.isActive) {
          // User has active subscription, redirect to account page
          router.push("/account");
        } else {
          // User doesn't have subscription, redirect to checkout without pre-selecting a plan
          router.push("/checkout");
        }
      } catch (subError: any) {
        console.error("Subscription check error:", subError);
        // If subscription check fails (e.g., 401/403), redirect to checkout anyway
        router.push("/checkout");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Anmeldung fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.";
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          initial={{ opacity: 0, y: -20 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-darkerGray mb-3 whitespace-nowrap relative right-6">
            Bei BeAFox anmelden
          </h1>
          <p className="text-lg text-lightGray">
            Melde dich mit deinem Account an
          </p>
        </motion.div>
        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-semibold text-darkerGray mb-3"
              >
                E-Mail-Adresse
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoCapitalize="none"
                  value={formData.email}
                  placeholder="Deine E-Mail-Adresse"
                  onBlur={() => handleBlur("email")}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    // Clear error when user starts typing
                    if (errors.email) {
                      const newErrors = { ...errors };
                      delete newErrors.email;
                      setErrors(newErrors);
                    }
                  }}
                  className={`w-full px-4 py-3.5 pl-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryOrange/50 transition-all ${
                    hasSubmitted && errors.email && touched.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-primaryOrange/50"
                  }`}
                />
                <Mail
                  size={20}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    hasSubmitted && errors.email && touched.email
                      ? "text-red-500"
                      : "text-lightGray"
                  }`}
                />
              </div>
              {hasSubmitted && errors.email && touched.email && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: -5 }}
                  className="mt-2 flex items-center gap-2 text-sm text-red-500"
                >
                  <AlertCircle size={16} />
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-semibold text-darkerGray mb-3"
              >
                Passwort
              </label>
              <div className="relative">
                <input
                  id="password"
                  value={formData.password}
                  placeholder="Dein Passwort"
                  onBlur={() => handleBlur("password")}
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    // Clear error when user starts typing
                    if (errors.password) {
                      const newErrors = { ...errors };
                      delete newErrors.password;
                      setErrors(newErrors);
                    }
                  }}
                  className={`w-full px-4 py-3.5 pl-12 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryOrange/50 transition-all ${
                    hasSubmitted && errors.password && touched.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-primaryOrange/50"
                  }`}
                />
                <Lock
                  size={20}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    hasSubmitted && errors.password && touched.password
                      ? "text-red-500"
                      : "text-lightGray"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-lightGray hover:text-darkerGray transition-colors"
                  aria-label={
                    showPassword ? "Passwort verbergen" : "Passwort anzeigen"
                  }
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {hasSubmitted && errors.password && touched.password && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: -5 }}
                  className="mt-2 flex items-center gap-2 text-sm text-red-500"
                >
                  <AlertCircle size={16} />
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -10 }}
                className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">
                  {errors.submit}
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full !px-8 !py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Wird angemeldet...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Anmelden
                  </span>
                )}
              </Button>
            </div>

            {/* Links */}
            <div className="text-center pt-4 border-t border-gray-200 space-y-2">
              <p className="text-sm text-lightGray">
                Noch kein Konto?{" "}
                <Link
                  href="/registrierung"
                  className="text-primaryOrange hover:underline font-semibold transition-colors"
                >
                  Jetzt registrieren
                </Link>
              </p>
              <p className="text-sm text-lightGray">
                <Link
                  href="/forgot-password"
                  className="text-primaryOrange hover:underline font-medium transition-colors"
                >
                  Passwort vergessen?
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

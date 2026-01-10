"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import client from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
          localStorage.setItem("user_email", response.data.profile.email || formData.email);
          localStorage.setItem("user_name", response.data.profile.username || "");
        }
      }

      // Check if user is verified first
      if (!response.data.profile?.verified) {
        // User not verified, redirect to verification page
        router.push("/verification?userInfo=" + encodeURIComponent(JSON.stringify(response.data.profile)));
        return;
      }

      // Check if user has active subscription
      try {
        const subscriptionResponse = await client.get("/stripe/subscription/status");
        console.log("Subscription response:", subscriptionResponse.data);
        if (subscriptionResponse.data?.subscription?.isActive) {
          // User has active subscription, redirect to home
          router.push("/");
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
    <div className="min-h-screen bg-primaryWhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-darkerGray mb-2">
              Bei BeAFox anmelden
            </h1>
            <p className="text-lightGray">
              Melde dich mit deinem Account an
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-darkerGray mb-2"
              >
                E-Mail-Adresse
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="deine@email.de"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-darkerGray mb-2"
              >
                Passwort
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Dein Passwort"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lightGray hover:text-darkerGray"
                >
                  {showPassword ? "Verbergen" : "Anzeigen"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full !px-6 !py-3"
              disabled={isLoading}
            >
              {isLoading ? "Wird angemeldet..." : "Anmelden"}
            </Button>

            {/* Links */}
            <div className="text-center space-y-2">
              <p className="text-sm text-lightGray">
                Noch kein Konto?{" "}
                <Link
                  href="/registrierung"
                  className="text-primaryOrange hover:underline font-medium"
                >
                  Jetzt registrieren
                </Link>
              </p>
              <p className="text-sm text-lightGray">
                <Link
                  href="/forgot-password"
                  className="text-primaryOrange hover:underline"
                >
                  Passwort vergessen?
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

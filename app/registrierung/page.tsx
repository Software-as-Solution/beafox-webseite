"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import client from "@/lib/api-client";
import { validateSignUp, SignUpFormData } from "@/lib/validation";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

export default function RegistrierungPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    schoolName: "",
    schoolLocation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const validationErrors = validateSignUp(formData);
    if (validationErrors[field]) {
      setErrors({ ...errors, [field]: validationErrors[field] });
    } else {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleChange = (field: keyof SignUpFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });

    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }

    // If role changes, clear school field errors
    if (field === "role" && value === "user") {
      const newErrors = { ...errors };
      delete newErrors.schoolName;
      delete newErrors.schoolLocation;
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    const validationErrors = validateSignUp(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const payload: any = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      // Only include school fields if role is teacher
      if (formData.role === "teacher") {
        payload.schoolName = formData.schoolName?.trim();
        payload.schoolLocation = formData.schoolLocation?.trim();
      }

      const response = await client.post("/auth/sign-up", payload);

      // Store token and user data
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user_id", response.data.user.id);
        localStorage.setItem("user_email", response.data.user.email || formData.email);
        localStorage.setItem("user_name", response.data.user.username || formData.username);
      }

      // Redirect to verification page with user info
      router.push(
        `/verification?userInfo=${encodeURIComponent(JSON.stringify(response.data.user))}`
      );
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Registrierung fehlgeschlagen. Bitte versuche es erneut.";
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primaryWhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-darkerGray mb-2">
              BeAFox Account erstellen
            </h1>
            <p className="text-lightGray">
              Erstelle dein Konto und erhalte sofort Zugang zu BeAFox Unlimited
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Type Selector */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-darkerGray mb-2"
              >
                Kontotyp auswählen
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange("role")}
                  onBlur={() => handleBlur("role")}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange appearance-none bg-white ${
                    errors.role ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="user">Privatperson</option>
                  <option value="teacher">Bildungseinrichtung (Lehrer)</option>
                </select>
                <ChevronDown
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lightGray pointer-events-none"
                />
              </div>
              {errors.role && touched.role && (
                <p className="mt-1 text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            {/* School Fields (only if teacher) */}
            {formData.role === "teacher" && (
              <>
                <div>
                  <label
                    htmlFor="schoolLocation"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    Schulort
                  </label>
                  <input
                    id="schoolLocation"
                    type="text"
                    value={formData.schoolLocation}
                    onChange={handleChange("schoolLocation")}
                    onBlur={() => handleBlur("schoolLocation")}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange ${
                      errors.schoolLocation && touched.schoolLocation
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="z.B. Regensburg"
                  />
                  {errors.schoolLocation && touched.schoolLocation && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.schoolLocation}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="schoolName"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    Schulname
                  </label>
                  <input
                    id="schoolName"
                    type="text"
                    value={formData.schoolName}
                    onChange={handleChange("schoolName")}
                    onBlur={() => handleBlur("schoolName")}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange ${
                      errors.schoolName && touched.schoolName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="z.B. Realschule Regensburg"
                  />
                  {errors.schoolName && touched.schoolName && (
                    <p className="mt-1 text-sm text-red-500">{errors.schoolName}</p>
                  )}
                </div>
              </>
            )}

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-darkerGray mb-2"
              >
                Benutzername
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange("username")}
                onBlur={() => handleBlur("username")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange ${
                  errors.username && touched.username ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Dein Benutzername"
                autoCapitalize="none"
                autoCorrect="off"
              />
              {errors.username && touched.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

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
                onChange={handleChange("email")}
                onBlur={() => handleBlur("email")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange ${
                  errors.email && touched.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="beispiel@gmail.com"
                autoCapitalize="none"
              />
              {errors.email && touched.email && (
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
                  onChange={handleChange("password")}
                  onBlur={() => handleBlur("password")}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Mindestens 8 Zeichen"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lightGray hover:text-darkerGray"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-darkerGray mb-2"
              >
                Passwort bestätigen
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Passwort wiederholen"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lightGray hover:text-darkerGray"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
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
              {isLoading ? "Wird erstellt..." : "Registrieren"}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-lightGray">
                Du hast bereits einen Account?{" "}
                <Link
                  href="/login"
                  className="text-primaryOrange hover:underline font-medium"
                >
                  Anmelden
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-primaryOrange/10 rounded-lg p-4">
          <p className="text-sm text-darkerGray text-center">
            Nach der Registrierung erhältst du eine E-Mail mit einem Verifizierungscode.
            Nach der Verifizierung kannst du BeAFox Unlimited erwerben.
          </p>
        </div>
      </div>
    </div>
  );
}

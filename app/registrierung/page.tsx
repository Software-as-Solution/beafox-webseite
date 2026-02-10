"use client";

// IMPORTS
import {
  Eye,
  User,
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
import { useTranslations } from "next-intl";
// COMPONENTS
import Button from "@/components/Button";
// API
import client from "@/lib/api-client";
import { validateSignUp, SignUpFormData } from "@/lib/validation";

export default function RegistrierungPage() {
  const t = useTranslations("authRegister");
  // ROUTER
  const router = useRouter();
  // STATES
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    role: "user",
    username: "",
    password: "",
    schoolName: "",
    schoolLocation: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // FUNCTIONS
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    // Only validate if form has been submitted
    if (hasSubmitted) {
      const validationErrors = validateSignUp(formData, {
        usernameMissing: t("validation.username.missing"),
        usernameTooShort: t("validation.username.tooShort"),
        usernameTooLong: t("validation.username.tooLong"),
        emailMissing: t("validation.email.missing"),
        emailInvalid: t("validation.email.invalid"),
        passwordMissing: t("validation.password.missing"),
        passwordTooShort: t("validation.password.tooShort"),
        passwordWeak: t("validation.password.weak"),
        confirmPasswordMissing: t("validation.confirmPassword.missing"),
        confirmPasswordMismatch: t("validation.confirmPassword.mismatch"),
        roleInvalid: t("validation.role.invalid"),
        schoolNameMissing: t("validation.schoolName.missing"),
        schoolNameTooShort: t("validation.schoolName.tooShort"),
        schoolLocationMissing: t("validation.schoolLocation.missing"),
        schoolLocationTooShort: t("validation.schoolLocation.tooShort"),
      });
      if (validationErrors[field]) {
        setErrors({ ...errors, [field]: validationErrors[field] });
      } else {
        const newErrors = { ...errors };
        delete newErrors[field];
        setErrors(newErrors);
      }
    }
  };
  const handleChange =
    (field: keyof SignUpFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setFormData({ ...formData, [field]: value });

      // Clear error when user starts typing
      if (errors[field]) {
        const newErrors = { ...errors };
        delete newErrors[field];
        setErrors(newErrors);
      }
    };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark form as submitted
    setHasSubmitted(true);

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    const validationErrors = validateSignUp(formData, {
      usernameMissing: t("validation.username.missing"),
      usernameTooShort: t("validation.username.tooShort"),
      usernameTooLong: t("validation.username.tooLong"),
      emailMissing: t("validation.email.missing"),
      emailInvalid: t("validation.email.invalid"),
      passwordMissing: t("validation.password.missing"),
      passwordTooShort: t("validation.password.tooShort"),
      passwordWeak: t("validation.password.weak"),
      confirmPasswordMissing: t("validation.confirmPassword.missing"),
      confirmPasswordMismatch: t("validation.confirmPassword.mismatch"),
      roleInvalid: t("validation.role.invalid"),
      schoolNameMissing: t("validation.schoolName.missing"),
      schoolNameTooShort: t("validation.schoolName.tooShort"),
      schoolLocationMissing: t("validation.schoolLocation.missing"),
      schoolLocationTooShort: t("validation.schoolLocation.tooShort"),
    });
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
        role: "user", // Always set to "user" for website registrations
      };

      const response = await client.post("/auth/sign-up", payload);

      // Store token and user data
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user_id", response.data.user.id);
        localStorage.setItem(
          "user_email",
          response.data.user.email || formData.email
        );
        localStorage.setItem(
          "user_name",
          response.data.user.username || formData.username
        );
      }

      // Redirect to verification page with user info
      router.push(
        `/verification?userInfo=${encodeURIComponent(
          JSON.stringify(response.data.user)
        )}`
      );
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        t("errors.registerFailedFallback");
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          initial={{ opacity: 0, y: -20 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-darkerGray mb-2 sm:mb-3 px-2">
            {t("title")}
          </h1>
          <p className="text-base sm:text-lg text-lightGray px-2">
            {t("subtitle.pre")}{" "}
            <span className="font-semibold text-primaryOrange">
              {t("subtitle.highlight")}
            </span>
          </p>
        </motion.div>
        {/* Main Form Card */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-darkerGray mb-2 sm:mb-3"
              >
                {t("fields.username.label")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  autoCorrect="off"
                  autoCapitalize="none"
                  value={formData.username}
                  placeholder={t("fields.username.placeholder")}
                  onChange={handleChange("username")}
                  onBlur={() => handleBlur("username")}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 pl-10 sm:pl-12 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryOrange/50 transition-all ${
                    hasSubmitted && errors.username && touched.username
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-primaryOrange/50"
                  }`}
                />
                <User
                  size={18}
                  className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 ${
                    hasSubmitted && errors.username && touched.username
                      ? "text-red-500"
                      : "text-lightGray"
                  }`}
                />
              </div>
              {hasSubmitted && errors.username && touched.username && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: -5 }}
                  className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-red-500"
                >
                  <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                  {errors.username}
                </motion.p>
              )}
            </div>

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
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder={t("fields.email.placeholder")}
                  onBlur={() => handleBlur("email")}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 pl-10 sm:pl-12 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryOrange/50 transition-all ${
                    hasSubmitted && errors.email && touched.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-primaryOrange/50"
                  }`}
                />
                <Mail
                  size={18}
                  className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 ${
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
                  className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-red-500"
                >
                  <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-darkerGray mb-2 sm:mb-3"
              >
                {t("fields.password.label")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  value={formData.password}
                  placeholder={t("fields.password.placeholder")}
                  onChange={handleChange("password")}
                  onBlur={() => handleBlur("password")}
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryOrange/50 transition-all ${
                    hasSubmitted && errors.password && touched.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-primaryOrange/50"
                  }`}
                />
                <Lock
                  size={18}
                  className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 ${
                    hasSubmitted && errors.password && touched.password
                      ? "text-red-500"
                      : "text-lightGray"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-lightGray hover:text-darkerGray transition-colors p-1"
                  aria-label={
                    showPassword
                      ? t("fields.password.hideAria")
                      : t("fields.password.showAria")
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {hasSubmitted && errors.password && touched.password && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: -5 }}
                  className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-red-500"
                >
                  <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-darkerGray mb-2 sm:mb-3"
              >
                {t("fields.confirmPassword.label")}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder={t("fields.confirmPassword.placeholder")}
                  onChange={handleChange("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryOrange/50 transition-all ${
                    hasSubmitted &&
                    errors.confirmPassword &&
                    touched.confirmPassword
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-primaryOrange/50"
                  }`}
                />
                <Lock
                  size={18}
                  className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 ${
                    hasSubmitted &&
                    errors.confirmPassword &&
                    touched.confirmPassword
                      ? "text-red-500"
                      : "text-lightGray"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-lightGray hover:text-darkerGray transition-colors p-1"
                  aria-label={
                    showConfirmPassword
                      ? t("fields.confirmPassword.hideAria")
                      : t("fields.confirmPassword.showAria")
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {hasSubmitted &&
                errors.confirmPassword &&
                touched.confirmPassword && (
                  <motion.p
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: -5 }}
                    className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-red-500"
                  >
                    <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                    {errors.confirmPassword}
                  </motion.p>
                )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -10 }}
                className="bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3"
              >
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-600 font-medium">
                  {errors.submit}
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
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">{t("button.submit")}</span>
                  </span>
                )}
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-3 sm:pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-lightGray">
                {t("links.hasAccount")}{" "}
                <Link
                  href="/login"
                  className="text-primaryOrange hover:underline font-semibold transition-colors"
                >
                  {t("links.login")}
                </Link>
              </p>
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
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primaryOrange" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-darkerGray mb-1">
                {t("info.title")}
              </h3>
              <p className="text-xs sm:text-sm text-darkerGray leading-relaxed">
                {t("info.text.pre")}{" "}
                <span className="font-semibold text-primaryOrange">
                  {t("info.text.highlight")}
                </span>{" "}
                {t("info.text.post")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

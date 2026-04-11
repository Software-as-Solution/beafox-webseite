"use client";

// CUSTOM COMPONENTS
import Button from "@/components/Button";
import Section from "@/components/Section";
import LandingHero from "@/components/LandingHero";
import RatgeberSection from "@/components/RatGeber";
import SectionHeader from "@/components/SectionHeader";
import StructuredData from "@/components/StructuredData";
// IMPORTS
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
// ICONS
import {
  Send,
  Users,
  Calendar,
  Building2,
  CheckCircle,
  GraduationCap,
} from "lucide-react";

// TYPES
type LeadType = "general" | "schools" | "business";
// CONSTANTS
const CAL_URL = "https://app.cal.eu/beafox";
const GRADIENT_CARD_STYLE = {
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
} as const;
const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  website: "",
  schoolName: "",
  companyName: "",
  schoolLocation: "",
  companyLocation: "",
  type: "general" as LeadType,
};
const TYPE_OPTIONS = [
  { value: "schools", icon: GraduationCap },
  { value: "business", icon: Building2 },
  { value: "general", icon: Users },
] as const;
const INPUT_CLASS =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primaryOrange/20 focus:border-primaryOrange transition-all bg-white";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  // HOOKS
  const t = useTranslations("contact");
  // STATES
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  // FUNCTIONS
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [],
  );
  const setType = useCallback((value: LeadType) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
      // Clear conditional fields when switching type
      schoolName: value === "schools" ? prev.schoolName : "",
      schoolLocation: value === "schools" ? prev.schoolLocation : "",
      companyName: value === "business" ? prev.companyName : "",
      companyLocation: value === "business" ? prev.companyLocation : "",
    }));
  }, []);
  const validate = useCallback((): string | null => {
    if (!formData.name.trim()) return t("form.validation.nameMissing");
    if (!formData.email.trim()) return t("form.validation.emailMissing");
    if (!EMAIL_REGEX.test(formData.email.trim()))
      return t("form.validation.emailInvalid");
    if (!formData.subject.trim()) return t("form.validation.subjectMissing");
    if (!formData.message.trim()) return t("form.validation.messageMissing");
    if (formData.message.trim().length < 10)
      return t("form.validation.messageTooShort");
    return null;
  }, [formData, t]);
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Prevent double submit
      if (isSubmitting) return;

      // Client-side validation
      const validationError = validate();
      if (validationError) {
        setErrorMessage(validationError);
        setSubmitStatus("error");
        return;
      }

      setIsSubmitting(true);
      setSubmitStatus("idle");
      setErrorMessage("");

      try {
        const crmLeadType =
          formData.type === "schools"
            ? "school"
            : formData.type === "business"
              ? "business"
              : "general";

        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            crmLeadType,
            crmSource: "website_contact_form",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.error || t("form.errorSendFallback"));
          setSubmitStatus("error");
          return;
        }

        setSubmitStatus("success");
        setFormData({ ...INITIAL_FORM });
      } catch {
        setErrorMessage(t("form.errorUnexpected"));
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isSubmitting, validate, t],
  );
  const scrollToForm = useCallback(() => {
    document
      .getElementById("contact-form")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);
  const resetForm = useCallback(() => {
    setSubmitStatus("idle");
    setFormData({ ...INITIAL_FORM });
    setErrorMessage("");
  }, []);

  return (
    <>
      {/* ─── 1. HERO ─── */}
      <LandingHero
        badge={t("hero.tag")}
        mascotAlt={t("hero.tag")}
        description={
          <>
            {t("hero.description")} {t("hero.cardText")}
          </>
        }
        mascotClassName="scale-75 md:top-0"
        mascotSrc="/Maskottchen/Maskottchen-Hero.webp"
        title={
          <>
            {t("hero.title.pre")}{" "}
            <span className="text-primaryOrange">
              {t("hero.title.highlight")}
            </span>
          </>
        }
        actions={
          <>
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center justify-center gap-2 bg-primaryOrange text-white rounded-full font-semibold !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base hover:bg-primaryOrange/90 transition-colors w-full sm:w-auto"
            >
              <Send className="w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden="true" />
              {t("form.submit")}
            </button>
            <Button
              href={CAL_URL}
              variant="outline"
              target="_blank"
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Calendar
                className="w-3.5 h-3.5 md:w-4 md:h-4"
                aria-hidden="true"
              />
              {t("info.booking.button")}
            </Button>
          </>
        }
      />
      {/* ─── 2. FORM — Centered ─── */}
      <Section id="contact-form" className="bg-gray-50 py-8 md:py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6 md:mb-8">
              <SectionHeader
                pillClassName="mb-4 md:mb-6"
                title={t("form.title")}
                subtitle={`${t("info.responseTime.prefix")} ${t(
                  "info.responseTime.value",
                )}`}
              />
            </div>
            <div
              style={GRADIENT_CARD_STYLE}
              className="rounded-2xl p-6 md:p-8 lg:p-10 border border-primaryOrange/15"
            >
              {submitStatus === "success" ? (
                <motion.div
                  className="text-center py-10"
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                >
                  <div
                    style={{ background: "rgba(34,197,94,0.1)" }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-darkerGray mb-2">
                    {t("form.successTitle")}
                  </h3>
                  <p className="text-sm text-lightGray max-w-sm mx-auto mb-6">
                    {t("form.success")}
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm text-primaryOrange font-medium hover:underline"
                  >
                    {t("form.sendAnother")}
                  </button>
                </motion.div>
              ) : (
                <form noValidate className="space-y-4" onSubmit={handleSubmit}>
                  {/* Honeypot — hidden from humans, visible to bots */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="website">{t("form.honeypotLabel")}</label>
                    <input
                      type="text"
                      id="website"
                      tabIndex={-1}
                      name="website"
                      autoComplete="off"
                      onChange={handleChange}
                      value={formData.website}
                    />
                  </div>
                  {/* Type selector */}
                  <fieldset>
                    <legend className="sr-only">
                      {t("form.fields.type.label")}
                    </legend>
                    <div className="grid grid-cols-3 gap-2 relative bottom-2">
                      {TYPE_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isActive = formData.type === option.value;
                        return (
                          <button
                            type="button"
                            key={option.value}
                            aria-pressed={isActive}
                            onClick={() => setType(option.value)}
                            className={`flex flex-col items-center gap-1.5 rounded-xl p-3 md:p-4 border transition-all text-xs md:text-sm font-medium ${
                              isActive
                                ? "border-primaryOrange/30 bg-primaryOrange/5 text-primaryOrange"
                                : "border-gray-200 bg-white text-lightGray hover:border-primaryOrange/20"
                            }`}
                          >
                            <Icon
                              aria-hidden="true"
                              className={`w-5 h-5 ${isActive ? "text-primaryOrange" : "text-lightGray"}`}
                            />
                            {t(`form.fields.type.options.${option.value}`)}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-medium text-darkerGray mb-1.5"
                      >
                        {t("form.fields.name.label")}
                      </label>
                      <input
                        id="name"
                        required
                        type="text"
                        name="name"
                        maxLength={200}
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={INPUT_CLASS}
                        placeholder={t("form.fields.name.placeholder")}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-medium text-darkerGray mb-1.5"
                      >
                        {t("form.fields.email.label")}
                      </label>
                      <input
                        required
                        id="email"
                        type="email"
                        name="email"
                        maxLength={200}
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={INPUT_CLASS}
                        placeholder={t("form.fields.email.placeholder")}
                      />
                    </div>
                  </div>
                  {/* Phone + Subject */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs font-medium text-darkerGray mb-1.5"
                      >
                        {t("form.fields.phone.label")}{" "}
                        <span className="text-lightGray">
                          ({t("form.fields.phone.optional")})
                        </span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        maxLength={30}
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className={INPUT_CLASS}
                        placeholder={t("form.fields.phone.placeholder")}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs font-medium text-darkerGray mb-1.5"
                      >
                        {t("form.fields.subject.label")}
                      </label>
                      <input
                        required
                        type="text"
                        id="subject"
                        name="subject"
                        maxLength={200}
                        className={INPUT_CLASS}
                        onChange={handleChange}
                        value={formData.subject}
                        placeholder={t("form.fields.subject.placeholder")}
                      />
                    </div>
                  </div>

                  {/* Conditional: School fields */}
                  {formData.type === "schools" && (
                    <motion.div
                      transition={{ duration: 0.2 }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid sm:grid-cols-2 gap-4 overflow-hidden"
                    >
                      <div>
                        <label
                          htmlFor="schoolName"
                          className="block text-xs font-medium text-darkerGray mb-1.5"
                        >
                          {t("form.fields.schoolName.label")}
                        </label>
                        <input
                          type="text"
                          id="schoolName"
                          maxLength={200}
                          name="schoolName"
                          onChange={handleChange}
                          className={INPUT_CLASS}
                          autoComplete="organization"
                          value={formData.schoolName}
                          placeholder={t("form.fields.schoolName.placeholder")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="schoolLocation"
                          className="block text-xs font-medium text-darkerGray mb-1.5"
                        >
                          {t("form.fields.schoolLocation.label")}
                        </label>
                        <input
                          type="text"
                          maxLength={200}
                          id="schoolLocation"
                          name="schoolLocation"
                          onChange={handleChange}
                          className={INPUT_CLASS}
                          autoComplete="address-level2"
                          value={formData.schoolLocation}
                          placeholder={t(
                            "form.fields.schoolLocation.placeholder",
                          )}
                        />
                      </div>
                    </motion.div>
                  )}
                  {/* Conditional: Business fields */}
                  {formData.type === "business" && (
                    <motion.div
                      transition={{ duration: 0.2 }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid sm:grid-cols-2 gap-4 overflow-hidden"
                    >
                      <div>
                        <label
                          htmlFor="companyName"
                          className="block text-xs font-medium text-darkerGray mb-1.5"
                        >
                          {t("form.fields.companyName.label")}
                        </label>
                        <input
                          type="text"
                          maxLength={200}
                          id="companyName"
                          name="companyName"
                          className={INPUT_CLASS}
                          onChange={handleChange}
                          autoComplete="organization"
                          value={formData.companyName}
                          placeholder={t("form.fields.companyName.placeholder")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="companyLocation"
                          className="block text-xs font-medium text-darkerGray mb-1.5"
                        >
                          {t("form.fields.companyLocation.label")}
                        </label>
                        <input
                          type="text"
                          maxLength={200}
                          id="companyLocation"
                          name="companyLocation"
                          className={INPUT_CLASS}
                          onChange={handleChange}
                          autoComplete="address-level2"
                          value={formData.companyLocation}
                          placeholder={t(
                            "form.fields.companyLocation.placeholder",
                          )}
                        />
                      </div>
                    </motion.div>
                  )}
                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-medium text-darkerGray mb-1.5"
                    >
                      {t("form.fields.message.label")}
                    </label>
                    <textarea
                      required
                      rows={4}
                      id="message"
                      name="message"
                      maxLength={5000}
                      onChange={handleChange}
                      value={formData.message}
                      className={`${INPUT_CLASS} resize-none`}
                      placeholder={t("form.fields.message.placeholder")}
                    />
                    <p className="text-[10px] text-lightGray text-right mt-1">
                      {formData.message.length} / 5.000
                    </p>
                  </div>
                  {/* Error */}
                  {submitStatus === "error" && (
                    <motion.div
                      role="alert"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                    >
                      {errorMessage}
                    </motion.div>
                  )}
                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="w-full bg-primaryOrange text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-primaryOrange/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          aria-hidden="true"
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                        />
                        {t("form.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" aria-hidden="true" />
                        {t("form.submit")}
                      </>
                    )}
                  </button>
                  {/* Privacy */}
                  <p className="text-[10px] md:text-xs text-lightGray text-center leading-relaxed">
                    {t("form.privacy.prefix")}{" "}
                    <a
                      href="/datenschutz"
                      className="text-primaryOrange hover:underline"
                    >
                      {t("form.privacy.linkLabel")}
                    </a>
                    {t("form.privacy.suffix")}
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </Section>
      {/* ─── 3. QUICK LINKS ─── */}
      <Section className="bg-primaryWhite py-8 md:py-12">
        <motion.div
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-8"
        >
          <SectionHeader
            title={t("quickLinksHeader")}
            titleClassName="!text-lg md:!text-xl"
          />
        </motion.div>
        <RatgeberSection variant="faqProducts" />
      </Section>
      <StructuredData
        id="contact-page"
        data={{
          "@type": "ContactPage",
          name: t("structuredData.pageName"),
          "@context": "https://schema.org",
          url: "https://beafox.app/kontakt",
          description: t("structuredData.description"),
          mainEntity: {
            "@type": "Organization",
            email: "info@beafox.app",
            url: "https://beafox.app",
            telephone: "+491782723673",
            name: t("structuredData.organizationName"),
            address: {
              postalCode: "93073",
              addressCountry: "DE",
              "@type": "PostalAddress",
              addressLocality: "Neutraubling",
            },
          },
        }}
      />
    </>
  );
}

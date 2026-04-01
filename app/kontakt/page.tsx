"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import LandingHero from "@/components/LandingHero";
import DemoBookingCtaSection from "@/components/DemoBookingCtaSection";
import { useTranslations } from "next-intl";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Sparkles,
  Clock,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  FileText,
  Users,
  Building2,
  GraduationCap,
  Calendar,
} from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    type: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || t("form.errorSendFallback"));
        setSubmitStatus("error");
        return;
      }

      // Success
      setSubmitStatus("success");
      setErrorMessage("");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        type: "general",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setErrorMessage(
        t("form.errorUnexpected")
      );
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const quickLinks = [
    {
      icon: GraduationCap,
      title: t("quickLinks.schools.title"),
      description: t("quickLinks.schools.description"),
      href: "/fuer-schulen",
      color: "bg-white border-primaryOrange/20",
      iconColor: "text-primaryOrange",
    },
    {
      icon: Building2,
      title: t("quickLinks.business.title"),
      description: t("quickLinks.business.description"),
      href: "/fuer-unternehmen",
      color: "bg-white border-primaryOrange/20",
      iconColor: "text-primaryOrange",
    },
    {
      icon: Users,
      title: t("quickLinks.private.title"),
      description: t("quickLinks.private.description"),
      href: "/beafox-unlimited",
      color: "bg-white border-primaryOrange/20",
      iconColor: "text-primaryOrange",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <LandingHero
        badge={t("hero.tag")}
        title={
          <>
            {t("hero.title.pre")}{" "}
            <span className="text-primaryOrange">{t("hero.title.highlight")}</span>
          </>
        }
        description={t("hero.description")}
        actions={
          <>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("contact-form")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="inline-flex items-center justify-center gap-2 bg-primaryOrange text-primaryWhite rounded-full font-semibold !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base hover:bg-primaryOrange/90 transition-colors w-full sm:w-auto"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
              {t("form.submit")}
            </button>
            <a
              href="https://app.cal.eu/beafox"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-primaryOrange text-primaryOrange hover:bg-primaryOrange/5 rounded-full font-semibold !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base transition-colors w-full sm:w-auto"
            >
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              {t("info.booking.button")}
            </a>
          </>
        }
        chips={
          <>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
              <Phone className="w-4 h-4 md:w-5 md:h-5 text-primaryOrange" />
              <span className="text-xs md:text-sm text-darkerGray">
                +49 178 2723 673
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
              <Mail className="w-4 h-4 md:w-5 md:h-5 text-primaryOrange" />
              <span className="text-xs md:text-sm text-darkerGray">
                info@beafox.app
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-primaryOrange" />
              <span className="text-xs md:text-sm text-darkerGray">
                {t("info.responseTime.value")}
              </span>
            </div>
          </>
        }
        mascotSrc="/Maskottchen/Maskottchen-Hero.png"
        mascotAlt={t("hero.tag")}
        cardIcon={MessageCircle}
        cardTitle={t("info.title")}
        cardText={t("info.booking.text")}
      />

      {/* Contact Section */}
      <Section id="contact-form" className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl text-center sm:text-left font-bold text-darkerGray mb-4 sm:mb-8">
                {t("info.title")}
              </h2>

              {/* Cal.com Booking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 rounded-xl p-6 border-2 border-primaryOrange/20 mb-6"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primaryOrange/20 rounded-lg p-3 flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primaryOrange" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-darkerGray mb-2 text-lg">
                      {t("info.booking.title")}
                    </h3>
                    <p className="text-lightGray text-sm mb-4">
                      {t("info.booking.text")}
                    </p>
                    <a
                      href="https://app.cal.eu/beafox"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primaryOrange hover:bg-primaryOrange/90 text-primaryWhite px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                      <Calendar className="w-5 h-5" />
                      {t("info.booking.button")}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>

              <div className="space-y-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-start gap-4 bg-white rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all"
                >
                  <div className="bg-primaryOrange/10 rounded-lg p-3 flex-shrink-0">
                    <Phone className="w-6 h-6 text-primaryOrange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-darkerGray mb-1 text-lg">
                      {t("info.phone")}
                    </h3>
                    <a
                      href="tel:+491782723673"
                      className="text-lightGray hover:text-primaryOrange transition-colors text-base md:text-lg"
                    >
                      +49 178 2723 673
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex items-start gap-4 bg-white rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all"
                >
                  <div className="bg-primaryOrange/10 rounded-lg p-3 flex-shrink-0">
                    <Mail className="w-6 h-6 text-primaryOrange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-darkerGray mb-1 text-lg">
                      {t("info.email")}
                    </h3>
                    <a
                      href="mailto:info@beafox.app"
                      className="text-lightGray hover:text-primaryOrange transition-colors text-base md:text-lg break-all"
                    >
                      info@beafox.app
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex items-start gap-4 bg-white rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all"
                >
                  <div className="bg-primaryOrange/10 rounded-lg p-3 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primaryOrange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-darkerGray mb-1 text-lg">
                      {t("info.address")}
                    </h3>
                    <p className="text-lightGray text-base md:text-lg">
                      BeAFox UG (haftungsbeschränkt)
                      <br />
                      93073 Neutraubling
                      <br />
                      Deutschland
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Response Time Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-4 sm:mt-6 flex items-center gap-3 text-lightGray mb-6"
              >
                <Clock className="w-5 h-5 text-primaryOrange" />
                <span className="text-sm">
                  {t("info.responseTime.prefix")}{" "}
                  <strong>{t("info.responseTime.value")}</strong>
                </span>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl text-center sm:text-left font-bold text-darkerGray mb-4 sm:mb-8">
                {t("form.title")}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    {t("form.fields.name.label")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primaryOrange/20 rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-primaryOrange transition-all bg-white"
                    placeholder={t("form.fields.name.placeholder")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    {t("form.fields.email.label")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primaryOrange/20 rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-primaryOrange transition-all bg-white"
                    placeholder={t("form.fields.email.placeholder")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    {t("form.fields.phone.label")}{" "}
                    <span className="text-lightGray">({t("form.fields.phone.optional")})</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primaryOrange/20 rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-primaryOrange transition-all bg-white"
                    placeholder={t("form.fields.phone.placeholder")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    {t("form.fields.type.label")}
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primaryOrange/20 rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-primaryOrange transition-all bg-white"
                  >
                    <option value="general">{t("form.fields.type.options.general")}</option>
                    <option value="schools">{t("form.fields.type.options.schools")}</option>
                    <option value="business">{t("form.fields.type.options.business")}</option>
                    <option value="private">{t("form.fields.type.options.private")}</option>
                    <option value="pilot">{t("form.fields.type.options.pilot")}</option>
                    <option value="support">{t("form.fields.type.options.support")}</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    {t("form.fields.subject.label")}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primaryOrange/20 rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-primaryOrange transition-all bg-white"
                    placeholder={t("form.fields.subject.placeholder")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    {t("form.fields.message.label")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primaryOrange/20 rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-primaryOrange transition-all bg-white resize-none"
                    placeholder={t("form.fields.message.placeholder")}
                  />
                </div>

                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border-2 border-green-300 text-green-700 px-4 py-4 rounded-lg flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Nachricht gesendet!</p>
                      <p className="text-sm">
                        {t("form.success")}
                      </p>
                    </div>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-4 rounded-lg"
                  >
                    <p className="font-semibold mb-1">{t("form.errorTitle")}</p>
                    <p className="text-sm">{errorMessage}</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primaryOrange text-primaryWhite px-8 py-4 rounded-lg font-semibold hover:bg-primaryOrange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primaryWhite border-t-transparent rounded-full animate-spin" />
                      <span>{t("form.sending")}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t("form.submit")}</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </Section>

      <DemoBookingCtaSection />
    </>
  );
}

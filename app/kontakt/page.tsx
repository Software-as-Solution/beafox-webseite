"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
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
  Trophy,
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
      icon: Trophy,
      title: t("quickLinks.clubs.title"),
      description: t("quickLinks.clubs.description"),
      href: "/fuer-clubs",
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
      <Section className="bg-primaryWhite pb-0 sm::pb-12 lg:pb-16 pt-12 md:pt-16 lg:pt-20 mt-14">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h1 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              {t("hero.tag")}
            </h1>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-darkerGray mb-4 md:mb-6"
          >
            {t("hero.title.pre")}{" "}
            <span className="text-primaryOrange">{t("hero.title.highlight")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl text-lightGray max-w-2xl mx-auto"
          >
            {t("hero.description")}
          </motion.p>
        </div>
      </Section>

      {/* Contact Section */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
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
                className=" mt-4sm:mt-6 flex items-center gap-3 text-lightGray mb-6"
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
                    <option value="clubs">{t("form.fields.type.options.clubs")}</option>
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

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 py-8 md:py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <MessageCircle className="w-16 h-16 text-primaryWhite mx-auto mb-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primaryWhite"
          >
            {t("cta.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl mb-8 text-primaryWhite/90"
          >
            {t("cta.description")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
          >
            <Button
              href="mailto:info@beafox.app"
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite"
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
              {t("cta.email")}
            </Button>
            <Button
              href="tel:+491782723673"
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
              {t("cta.call")}
            </Button>
          </motion.div>
        </div>
      </Section>
    </>
  );
}

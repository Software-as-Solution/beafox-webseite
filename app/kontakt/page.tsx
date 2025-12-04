"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
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
} from "lucide-react";

export default function ContactPage() {
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
        setErrorMessage(data.error || "Fehler beim Senden der Nachricht");
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
        "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut oder kontaktiere uns direkt per Email."
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
      title: "Für Schulen",
      description: "Pilotprojekt für Ihre Schule starten",
      href: "/fuer-schulen",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      icon: Building2,
      title: "Für Unternehmen",
      description: "Finanzbildung für Ihre Mitarbeiter",
      href: "/fuer-unternehmen",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
    },
    {
      icon: Trophy,
      title: "Für Clubs",
      description: "Ganzheitliche Förderung Ihrer Spieler",
      href: "/fuer-clubs",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
    },
    {
      icon: Users,
      title: "Privatpersonen",
      description: "BeAFox Unlimited für dich",
      href: "/beafox-unlimited",
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-primaryWhite pt-12 md:pt-16 lg:pt-20 mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h1 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              Kontakt
            </h1>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-darkerGray mb-4 md:mb-6"
          >
            Wir freuen uns auf{" "}
            <span className="text-primaryOrange">deine Nachricht</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-lightGray max-w-2xl mx-auto"
          >
            Unser Support ist rund um die Uhr für dich da und beantwortet deine
            Anliegen so schnell und hilfreich wie möglich.
          </motion.p>
        </div>
      </Section>

      {/* Quick Links Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-darkerGray mb-4">
              Schnell zu deinem Anliegen
            </h2>
            <p className="text-lightGray">
              Wähle direkt, wofür du dich interessierst
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {quickLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`${link.color} rounded-xl p-6 border-2 hover:shadow-lg transition-all cursor-pointer group`}
              >
                <link.icon
                  className={`w-8 h-8 ${link.iconColor} mb-3 group-hover:scale-110 transition-transform`}
                />
                <h3 className="font-bold text-darkerGray mb-2">{link.title}</h3>
                <p className="text-sm text-lightGray">{link.description}</p>
              </motion.a>
            ))}
          </div>
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
              <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-8">
                Kontaktdaten
              </h2>
              <div className="space-y-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex items-start gap-4 bg-white rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all"
                >
                  <div className="bg-primaryOrange/10 rounded-lg p-3 flex-shrink-0">
                    <Phone className="w-6 h-6 text-primaryOrange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-darkerGray mb-1 text-lg">
                      Telefon
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
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-start gap-4 bg-white rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all"
                >
                  <div className="bg-primaryOrange/10 rounded-lg p-3 flex-shrink-0">
                    <Mail className="w-6 h-6 text-primaryOrange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-darkerGray mb-1 text-lg">
                      Email
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
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex items-start gap-4 bg-white rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all"
                >
                  <div className="bg-primaryOrange/10 rounded-lg p-3 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primaryOrange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-darkerGray mb-1 text-lg">
                      Adresse
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

              {/* Support Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 rounded-xl p-6 border-2 border-primaryOrange/20"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primaryOrange rounded-lg p-3 flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-primaryWhite" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-darkerGray mb-2 text-lg">
                      24/7 Support
                    </h3>
                    <p className="text-lightGray">
                      Unser Support ist rund um die Uhr für dich da und
                      beantwortet deine Anliegen so schnell und hilfreich wie
                      möglich.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Response Time Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-6 flex items-center gap-3 text-lightGray"
              >
                <Clock className="w-5 h-5 text-primaryOrange" />
                <span className="text-sm">
                  Durchschnittliche Antwortzeit:{" "}
                  <strong>unter 24 Stunden</strong>
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
              <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-8">
                Nachricht senden
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primaryOrange/20 rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-primaryOrange transition-all bg-white"
                    placeholder="Dein Name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primaryOrange/20 rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-primaryOrange transition-all bg-white"
                    placeholder="deine@email.de"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    Telefon <span className="text-lightGray">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primaryOrange/20 rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-primaryOrange transition-all bg-white"
                    placeholder="+49 123 456789"
                  />
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    Ich interessiere mich für
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primaryOrange/20 rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-primaryOrange transition-all bg-white"
                  >
                    <option value="general">Allgemeine Anfrage</option>
                    <option value="schools">Für Schulen</option>
                    <option value="business">Für Unternehmen</option>
                    <option value="clubs">Für Clubs</option>
                    <option value="private">Privatperson</option>
                    <option value="pilot">Pilotprojekt</option>
                    <option value="support">Support</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    Betreff *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primaryOrange/20 rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-primaryOrange transition-all bg-white"
                    placeholder="Worum geht es?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-darkerGray mb-2"
                  >
                    Nachricht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primaryOrange/20 rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-primaryOrange transition-all bg-white resize-none"
                    placeholder="Erzähle uns von deinem Anliegen..."
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
                        Vielen Dank! Deine Nachricht wurde erfolgreich gesendet.
                        Wir melden uns schnellstmöglich bei dir.
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
                    <p className="font-semibold mb-1">Fehler aufgetreten</p>
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
                      <span>Wird gesendet...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Nachricht senden</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* FAQ Preview Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <HelpCircle className="w-12 h-12 text-primaryOrange mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-darkerGray mb-4">
              Häufig gestellte Fragen
            </h2>
            <p className="text-lightGray mb-8">
              Vielleicht findest du hier schon die Antwort auf deine Frage
            </p>
            <Button
              href="/faq"
              variant="outline"
              className="flex items-center justify-center gap-2 mx-auto !px-6 !py-3 md:!px-8 md:!py-4"
            >
              <FileText className="w-4 h-4 md:w-5 md:h-5" />
              Alle FAQs ansehen
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
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
            Noch Fragen?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl mb-8 text-primaryWhite/90"
          >
            Wir helfen dir gerne weiter. Kontaktiere uns einfach per Formular,
            Email oder Telefon.
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
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 bg-darkerGray hover:bg-darkerGray/90 text-primaryWhite border-darkerGray"
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
              Email schreiben
            </Button>
            <Button
              href="tel:+491782723673"
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 bg-white/20 hover:bg-white/30 text-primaryWhite border-white"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
              Anrufen
            </Button>
          </motion.div>
        </div>
      </Section>
    </>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

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
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        type: "general",
      });
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 via-primaryWhite to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-darkerGray mb-6">
              Kontakt
            </h1>
            <p className="text-xl text-lightGray">
              Wir freuen uns auf deine Nachricht! Unser Support ist rund um die Uhr für dich da.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <Section className="bg-gray-50">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-darkerGray mb-8">Kontaktdaten</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-primaryOrange" />
                </div>
                <div>
                  <h3 className="font-semibold text-darkerGray mb-1">Telefon</h3>
                  <a
                    href="tel:+491782723673"
                    className="text-lightGray hover:text-primaryOrange transition-colors"
                  >
                    +49 178 2723 673
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-primaryOrange" />
                </div>
                <div>
                  <h3 className="font-semibold text-darkerGray mb-1">Email</h3>
                  <a
                    href="mailto:info@beafox.app"
                    className="text-lightGray hover:text-primaryOrange transition-colors"
                  >
                    info@beafox.app
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-primaryOrange" />
                </div>
                <div>
                  <h3 className="font-semibold text-darkerGray mb-1">Adresse</h3>
                  <p className="text-lightGray">93073 Neutraubling</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <MessageCircle className="w-8 h-8 text-primaryOrange mb-4" />
              <h3 className="font-semibold text-darkerGray mb-2">Support</h3>
              <p className="text-lightGray">
                Unser Support ist rund um die Uhr für dich da und beantwortet deine Anliegen so 
                schnell und hilfreich wie möglich.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-darkerGray mb-8">Nachricht senden</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-darkerGray mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-darkerGray rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-darkerGray mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-darkerGray rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-darkerGray mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-darkerGray rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-darkerGray mb-2">
                  Ich interessiere mich für
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-darkerGray rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                >
                  <option value="general">Allgemeine Anfrage</option>
                  <option value="schools">Für Schulen</option>
                  <option value="business">Für Unternehmen</option>
                  <option value="private">Privatperson</option>
                  <option value="pilot">Pilotprojekt</option>
                </select>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-darkerGray mb-2">
                  Betreff *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-darkerGray rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-darkerGray mb-2">
                  Nachricht *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-darkerGray rounded-lg focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
              </div>
              {submitStatus === "success" && (
                <div className="bg-gray-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
                  Vielen Dank! Deine Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei dir.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="bg-gray-50 border border-primaryRed text-primaryRed px-4 py-3 rounded-lg">
                  Es ist ein Fehler aufgetreten. Bitte versuche es erneut oder kontaktiere uns direkt per Email.
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primaryOrange text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
      </Section>
    </>
  );
}


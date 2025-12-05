"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

// TikTok Icon Component (not available in lucide-react)
function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewsletterSubmitting(true);
    setNewsletterStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewsletterStatus({
          type: "success",
          message: data.message || "Erfolgreich angemeldet!",
        });
        setNewsletterEmail("");
      } else {
        setNewsletterStatus({
          type: "error",
          message: data.error || "Ein Fehler ist aufgetreten.",
        });
      }
    } catch (error) {
      setNewsletterStatus({
        type: "error",
        message: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
      });
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  return (
    <footer className="bg-white text-darkerGray border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-br from-primaryOrange via-primaryOrange/90 to-primaryOrange/80 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primaryWhite mb-4">
                Bleib auf dem Laufenden
              </h3>
              <p className="text-base md:text-lg text-primaryWhite/90">
                Melde dich für unseren Newsletter an und verpasse keine Updates,
                Tipps zur Finanzbildung und Einblicke hinter die Kulissen von
                BeAFox.
              </p>
            </motion.div>

            {/* Newsletter Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleNewsletterSubmit}
              className="max-w-2xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primaryOrange/60" />
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Deine Email-Adresse"
                    required
                    className="w-full pl-12 pr-4 py-3 md:py-4 rounded-full border-2 border-primaryWhite/30 bg-white/10 backdrop-blur-sm text-primaryWhite placeholder-primaryWhite/60 focus:outline-none focus:border-primaryWhite focus:bg-white/20 transition-all text-sm md:text-base"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isNewsletterSubmitting}
                  className="px-6 py-3 md:py-4 bg-primaryWhite hover:bg-primaryWhite/90 text-primaryOrange border-2 border-primaryWhite rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap text-sm md:text-base"
                >
                  {isNewsletterSubmitting ? (
                    "Wird gesendet..."
                  ) : (
                    <>
                      Anmelden
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {newsletterStatus.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                    newsletterStatus.type === "success"
                      ? "bg-green-500/20 text-green-100 border border-green-400/30"
                      : "bg-red-500/20 text-red-100 border border-red-400/30"
                  }`}
                >
                  {newsletterStatus.type === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <Mail className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-sm md:text-base">
                    {newsletterStatus.message}
                  </span>
                </motion.div>
              )}
            </motion.form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/assets/Logo-EST.jpg"
                alt="BeAFox Logo"
                width={150}
                height={50}
                className="object-contain h-12"
              />
            </Link>
            <p className="text-lightGray mb-6 text-sm leading-relaxed max-w-xs">
              Die erste unabhängige und spielerische Lern-App für Finanzbildung.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/beafox_app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lightGray hover:text-primaryOrange hover:bg-primaryOrange/10 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/beafox-app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lightGray hover:text-primaryOrange hover:bg-primaryOrange/10 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@beafox_app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lightGray hover:text-primaryOrange hover:bg-primaryOrange/10 transition-all"
                aria-label="TikTok"
              >
                <TikTokIcon size={20} />
              </a>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-darkerGray font-bold mb-6 text-lg">Menü</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Startseite
                </Link>
              </li>
              <li>
                <Link
                  href="/ueber-beafox"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Über BeAFox
                </Link>
              </li>
              <li>
                <Link
                  href="/preise"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Preise
                </Link>
              </li>
              <li>
                <Link
                  href="/fuer-unternehmen"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Für Unternehmen
                </Link>
              </li>
              <li>
                <Link
                  href="/fuer-schulen"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Für Schulen
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-darkerGray font-bold mb-6 text-lg">
              Rechtliches
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/impressum"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/agb"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  AGB
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-darkerGray font-bold mb-6 text-lg">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+491782723673"
                  className="text-lightGray hover:text-primaryOrange transition-colors text-sm"
                >
                  +49 178 2723 673
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:info@beafox.app"
                  className="text-lightGray hover:text-primaryOrange transition-colors text-sm"
                >
                  info@beafox.app
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                <span className="text-lightGray text-sm">
                  93073 Neutraubling
                </span>
              </li>
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h3 className="text-darkerGray font-bold mb-6 text-lg">Blog</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm block"
                >
                  Alle Artikel
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/updates"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm block"
                >
                  App-Updates
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-lightGray">
            <p>
              Copyright © {new Date().getFullYear()} BeAFox UG
              (haftungsbeschränkt)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

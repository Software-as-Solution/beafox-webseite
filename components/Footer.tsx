"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { BLOG_CATEGORIES } from "@/lib/blog";

const LOCALE_COOKIE_MAX_AGE = 31536000;

export default function Footer() {
  const t = useTranslations("footer");
  const tHeader = useTranslations("header");
  const locale = useLocale();

  // Ensure "Investieren" appears before "Berufseinsteiger" in footer.
  const orderedBlogCategories = [...BLOG_CATEGORIES];
  const investSlug = "investieren-fuer-anfaenger";
  const berufSlug = "finanzen-fuer-berufseinsteiger";
  const investIdx = orderedBlogCategories.findIndex((c) => c.slug === investSlug);
  const berufIdx = orderedBlogCategories.findIndex((c) => c.slug === berufSlug);
  if (
    investIdx !== -1 &&
    berufIdx !== -1 &&
    investIdx > berufIdx
  ) {
    const [investCat] = orderedBlogCategories.splice(investIdx, 1);
    orderedBlogCategories.splice(berufIdx, 0, investCat);
  }

  const setWebsiteLocale = useCallback(
    (nextLocale: "de" | "en") => {
      if (nextLocale === locale) return;
      document.cookie = `locale=${nextLocale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
      window.location.reload();
    },
    [locale]
  );
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
          message: data.message || t("newsletter.successFallback"),
        });
        setNewsletterEmail("");
      } else {
        setNewsletterStatus({
          type: "error",
          message: data.error || t("newsletter.errorFallback"),
        });
      }
    } catch (error) {
      setNewsletterStatus({
        type: "error",
        message: t("newsletter.errorRetryFallback"),
      });
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  return (
    <footer className="bg-white text-darkerGray border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="bg-primaryWhite pt-8 relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primaryOrange rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primaryOrange rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center justify-center mb-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primaryOrange/10 rounded-full flex items-center justify-center border-2 border-primaryOrange/20">
                  <Mail className="w-6 h-6 md:w-8 md:h-8 text-primaryOrange" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-4">
                {t("newsletter.titlePre")}
                <span className="text-primaryOrange">{t("newsletter.titleHighlight")}</span>
              </h3>
              <p className="text-base md:text-lg text-lightGray max-w-2xl mx-auto">
                {t("newsletter.description")}
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
                    placeholder={t("newsletter.placeholder")}
                    required
                    className="w-full pl-12 pr-4 py-3 md:py-4 rounded-full border-2 border-primaryOrange/30 bg-white text-darkerGray placeholder-lightGray focus:outline-none focus:border-primaryOrange focus:ring-2 focus:ring-primaryOrange/20 transition-all text-sm md:text-base shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isNewsletterSubmitting}
                  className="px-6 py-3 md:py-4 bg-primaryOrange hover:bg-primaryOrange/90 text-primaryWhite border-2 border-primaryOrange rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap text-sm md:text-base"
                >
                  {isNewsletterSubmitting ? (
                    t("newsletter.submitting")
                  ) : (
                    <>
                      {t("newsletter.submit")}
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
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 text-left">
            <h3 className="text-darkerGray font-bold mb-6 text-lg">
              {t("content.ratgeber")}
            </h3>
            <ul className="space-y-3">
              {orderedBlogCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/ratgeber/${cat.slug}`}
                    className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm"
                  >
                    {cat.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-darkerGray font-bold mb-6 text-lg">{t("menu.title")}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm"
                >
                  {t("menu.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/ueber-uns"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm"
                >
                  {t("menu.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm"
                >
                  {t("menu.contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm"
                >
                  {t("menu.faq")}
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm"
                >
                  {t("menu.shop")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Produkte */}
          <div>
            <h3 className="text-darkerGray font-bold mb-6 text-lg">{t("products.title")}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/beafox-unlimited"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm"
                >
                  {t("products.unlimited")}
                </Link>
              </li>
              <li>
                <Link
                  href="/fuer-unternehmen"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm"
                >
                  {t("products.business")}
                </Link>
              </li>
              <li>
                <Link
                  href="/fuer-schulen"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm"
                >
                  {t("products.schools")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-darkerGray font-bold mb-6 text-lg">{t("legal.title")}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/agb" className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm">
                  {t("legal.agb")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm">
                  {t("legal.faq")}
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm">
                  {t("legal.imprint")}
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm">
                  {t("legal.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm">
                  {t("legal.guidelines")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social, News, App-Updates */}
          <div>
            <h3 className="text-darkerGray font-bold mb-6 text-lg">
              {t("content.title")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.linkedin.com/company/beafox-app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm block"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/beafox_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm block"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@beafox_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm block"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@beafox_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm block"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/beafox_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm block"
                >
                  X
                </a>
              </li>
              <li>
                <Link
                  href="/news"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm block"
                >
                  {t("content.news")}
                </Link>
              </li>
              <li>
                <Link
                  href="/app-updates"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm block"
                >
                  {t("content.appUpdates")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-lightGray">
            <p className="text-center sm:text-left">{t("copyright", { year: new Date().getFullYear() })}</p>
            <div
              role="radiogroup"
              aria-label="Sprache wählen"
              className="flex items-center bg-gray-100/80 rounded-full p-0.5 gap-1 flex-shrink-0"
            >
              <button
                type="button"
                role="radio"
                aria-checked={locale === "de"}
                onClick={() => setWebsiteLocale("de")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                  locale === "de"
                    ? "bg-primaryOrange text-white shadow-sm"
                    : "text-darkerGray hover:text-primaryOrange"
                }`}
              >
                {tHeader("language.de")}
              </button>
              <span aria-hidden="true" className="w-px h-5 bg-gray-300/70 rounded-full" />
              <button
                type="button"
                role="radio"
                aria-checked={locale === "en"}
                onClick={() => setWebsiteLocale("en")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                  locale === "en"
                    ? "bg-primaryOrange text-white shadow-sm"
                    : "text-darkerGray hover:text-primaryOrange"
                }`}
              >
                {tHeader("language.en")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

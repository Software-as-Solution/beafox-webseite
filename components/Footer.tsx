"use client";

// STANDARD
import Link from "next/link";
// IMPORTS
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
// ICONS
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
// DATA
import { BLOG_CATEGORIES } from "@/lib/blog";

// CONSTANTS
const LOCALE_COOKIE_MAX_AGE = 31536000;
const PRODUCT_LINKS = [
  { href: "/shop", key: "merch" },
  { href: "/unlimited", key: "unlimited" },
  { href: "/schulen", key: "schools" },
  { href: "/unternehmen", key: "business" },
  { href: "/eduplaces", key: "eduplaces" },
  { href: "/bildungshaus", key: "bildungshaus" },
  { href: "/ihk-akademie", key: "ihk" },
] as const;
const MENU_LINKS = [
  { href: "/faq", key: "faq" },
  { href: "/kontakt", key: "contact" },
  { href: "/ueber-uns", key: "about" },
  { href: "/", key: "home" },
] as const;
const LEGAL_LINKS = [
  { href: "/agb", key: "agb" },
  { href: "/impressum", key: "imprint" },
  { href: "/datenschutz", key: "privacy" },
  { href: "/guidelines", key: "guidelines" },
] as const;
const SOCIAL_LINKS = [
  { href: "https://x.com/beafox_app", label: "X" },
  { href: "https://www.tiktok.com/@beafox_app", label: "TikTok" },
  { href: "https://www.linkedin.com/company/beafox-app/", label: "LinkedIn" },
  { href: "https://www.youtube.com/@beafox_app", label: "YouTube" },
  { href: "https://instagram.com/beafox_app", label: "Instagram" },
] as const;
const LINK_CLASS =
  "hover:text-primaryOrange transition-colors text-lightGray text-xs lg:text-sm";
const SORTED_BLOG_CATEGORIES = (() => {
  const cats = [...BLOG_CATEGORIES];
  const investIdx = cats.findIndex(
    (c) => c.slug === "investieren-fuer-anfaenger",
  );
  const berufIdx = cats.findIndex(
    (c) => c.slug === "finanzen-fuer-berufseinsteiger",
  );
  if (investIdx !== -1 && berufIdx !== -1 && investIdx > berufIdx) {
    const [investCat] = cats.splice(investIdx, 1);
    cats.splice(berufIdx, 0, investCat);
  }
  return cats;
})();

export default function Footer() {
  // HOOKS
  const locale = useLocale();
  const t = useTranslations("footer");
  const tHeader = useTranslations("header");
  // STATES
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  // FUNCTIONS
  const setWebsiteLocale = useCallback(
    (nextLocale: "de" | "en") => {
      if (nextLocale === locale) return;
      document.cookie = `locale=${nextLocale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
      window.location.reload();
    },
    [locale],
  );
  const handleNewsletterSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);
      setStatus({ type: null, message: "" });

      try {
        const response = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: newsletterEmail }),
        });
        const data = await response.json();

        if (response.ok) {
          setStatus({
            type: "success",
            message: data.message || t("newsletter.successFallback"),
          });
          setNewsletterEmail("");
        } else {
          setStatus({
            type: "error",
            message: data.error || t("newsletter.errorFallback"),
          });
        }
      } catch {
        setStatus({
          type: "error",
          message: t("newsletter.errorRetryFallback"),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [newsletterEmail, isSubmitting, t],
  );
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewsletterEmail(e.target.value);
    },
    [],
  );

  return (
    <footer
      itemScope
      itemType="https://schema.org/WPFooter"
      className="bg-white text-darkerGray border-t border-gray-200"
    >
      {/* ─── Newsletter ─── */}
      <div className="bg-primaryWhite pt-8 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-5 pointer-events-none"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-primaryOrange rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primaryOrange rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              viewport={{ once: true }}
              className="text-center mb-6"
              transition={{ duration: 0.6 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center justify-center mb-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primaryOrange/10 rounded-full flex items-center justify-center border-2 border-primaryOrange/20">
                  <Mail
                    aria-hidden="true"
                    className="w-6 h-6 md:w-8 md:h-8 text-primaryOrange"
                  />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-4">
                {t("newsletter.titlePre")}{" "}
                <span className="text-primaryOrange">
                  {t("newsletter.titleHighlight")}
                </span>
              </h3>
              <p className="text-base md:text-lg text-lightGray max-w-2xl mx-auto">
                {t("newsletter.description")}
              </p>
            </motion.div>
            <motion.form
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              onSubmit={handleNewsletterSubmit}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primaryOrange/60"
                  />
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={newsletterEmail}
                    onChange={handleEmailChange}
                    placeholder={t("newsletter.placeholder")}
                    className="w-full pl-12 pr-4 py-3 md:py-4 rounded-full border-2 border-primaryOrange/30 bg-white text-darkerGray placeholder-lightGray focus:outline-none focus:border-primaryOrange focus:ring-2 focus:ring-primaryOrange/20 transition-all text-sm md:text-base shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 md:py-4 bg-primaryOrange hover:bg-primaryOrange/90 text-white border-2 border-primaryOrange rounded-full font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap text-sm md:text-base"
                >
                  {isSubmitting ? (
                    t("newsletter.submitting")
                  ) : (
                    <>
                      {t("newsletter.submit")}
                      <ArrowRight
                        className="w-4 h-4 md:w-5 md:h-5"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              </div>
              {status.type && (
                <motion.div
                  role="alert"
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: -10 }}
                  className={`mt-4 p-4 rounded-lg flex items-center gap-3 text-sm md:text-base ${
                    status.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle
                      aria-hidden="true"
                      className="w-5 h-5 flex-shrink-0"
                    />
                  ) : (
                    <Mail
                      aria-hidden="true"
                      className="w-5 h-5 flex-shrink-0"
                    />
                  )}
                  <span>{status.message}</span>
                </motion.div>
              )}
            </motion.form>
          </div>
        </div>
      </div>
      {/* ─── Links Grid — ein zentrierter Block (max-w), Linie + Text gleiche Breite, linksbündig ─── */}
      <div className="w-full px-4 sm:px-6 py-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 mb-12 text-left justify-items-center">
            {/* Ratgeber */}
            <nav aria-label="Ratgeber">
              <h3 className="text-darkerGray font-bold mb-5 text-sm md:text-base">
                {t("content.ratgeber")}
              </h3>
              <ul className="space-y-2.5">
                {SORTED_BLOG_CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/${cat.slug}`} className={LINK_CLASS}>
                      {cat.navLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {/* Produkte */}
            <nav aria-label="Produkte">
              <h3 className="text-darkerGray font-bold mb-5 text-sm md:text-base">
                {t("products.title")}
              </h3>
              <ul className="space-y-2.5">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={LINK_CLASS}>
                      {t(`products.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {/* Menü */}
            <nav aria-label="Hauptmenü">
              <h3 className="text-darkerGray font-bold mb-5 text-sm md:text-base">
                {t("menu.title")}
              </h3>
              <ul className="space-y-2.5">
                {MENU_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={LINK_CLASS}>
                      {t(`menu.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {/* Rechtliches */}
            <nav aria-label="Rechtliches">
              <h3 className="text-darkerGray font-bold mb-5 text-sm md:text-base">
                {t("legal.title")}
              </h3>
              <ul className="space-y-2.5">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={LINK_CLASS}>
                      {t(`legal.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {/* Social + Content */}
            <nav aria-label="Social Media & Updates">
              <h3 className="text-darkerGray font-bold mb-5 text-sm md:text-base">
                {t("content.title")}
              </h3>
              <ul className="space-y-2.5">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      target="_blank"
                      href={link.href}
                      className={LINK_CLASS}
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link href="/news" className={LINK_CLASS}>
                    {t("content.news")}
                  </Link>
                </li>
                <li>
                  <Link href="/updates" className={LINK_CLASS}>
                    {t("content.appUpdates")}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {/* ─── Copyright + Language (border-t volle Breite des max-w-6xl-Blocks) ─── */}
          <div className="w-full min-w-0 border-t border-gray-200 pt-8">
            <div className="flex w-full min-w-0 flex-col gap-4 text-left text-sm text-lightGray sm:flex-row sm:items-center sm:justify-between">
              <p>{t("copyright", { year: new Date().getFullYear() })}</p>
              <div
                role="radiogroup"
                aria-label="Sprache wählen"
                className="flex items-center bg-gray-100/80 rounded-full p-0.5 gap-1 flex-shrink-0"
              >
                {(["de", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    role="radio"
                    type="button"
                    aria-checked={locale === lang}
                    onClick={() => setWebsiteLocale(lang)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                      locale === lang
                        ? "bg-primaryOrange text-white shadow-sm"
                        : "text-darkerGray hover:text-primaryOrange"
                    }`}
                  >
                    {tHeader(`language.${lang}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

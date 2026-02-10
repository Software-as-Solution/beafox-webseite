"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("header");
  const locale = useLocale();

  const setWebsiteLocale = (nextLocale: "de" | "en") => {
    if (nextLocale === locale) return;
    // Persist user preference; i18n/request.ts reads this cookie.
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    // Reload to ensure Server Components pick up new messages/locale.
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isDropdownOpen &&
        !target.closest("[data-dropdown]") &&
        !target.closest("button")
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/ueber-beafox", label: t("nav.about") },
    { href: "/preise", label: t("nav.pricing") },
    { href: "/faq", label: t("nav.faq") },
  ];

  const productItems = [
    { href: "/beafox-unlimited", label: t("products.unlimited") },
    { href: "/fuer-unternehmen", label: t("products.business") },
    { href: "/fuer-schulen", label: t("products.schools") },
    { href: "/fuer-clubs", label: t("products.clubs") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-primaryWhite/95 backdrop-blur-md shadow-md border-b border-gray-200"
          : "bg-primaryWhite"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/assets/Logo-EST.jpg"
              alt="BeAFox Logo"
              width={180}
              height={60}
              className="object-contain h-16"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors font-medium ${
                    isActive
                      ? "text-primaryOrange"
                      : "text-darkerGray hover:text-primaryOrange"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Produkte Dropdown */}
            <div className="relative" data-dropdown>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1 transition-colors font-medium ${
                  productItems.some((item) => pathname === item.href)
                    ? "text-primaryOrange"
                    : "text-darkerGray hover:text-primaryOrange"
                }`}
              >
                {t("products.label")}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-primaryWhite rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    data-dropdown
                  >
                    {productItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block px-4 py-2 transition-colors ${
                            isActive
                              ? "text-primaryOrange bg-primaryOrange/10"
                              : "text-darkerGray hover:text-primaryOrange hover:bg-gray-50"
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language switch */}
            <div className="flex items-center gap-1 pl-3 border-l border-gray-200">
              <button
                type="button"
                onClick={() => setWebsiteLocale("de")}
                aria-pressed={locale === "de"}
                className={`px-2 py-1 rounded-md text-sm font-semibold transition-colors ${
                  locale === "de"
                    ? "bg-primaryOrange text-white"
                    : "text-darkerGray hover:bg-gray-100"
                }`}
              >
                {t("language.de")}
              </button>
              <button
                type="button"
                onClick={() => setWebsiteLocale("en")}
                aria-pressed={locale === "en"}
                className={`px-2 py-1 rounded-md text-sm font-semibold transition-colors ${
                  locale === "en"
                    ? "bg-primaryOrange text-white"
                    : "text-darkerGray hover:bg-gray-100"
                }`}
              >
                {t("language.en")}
              </button>
            </div>

            <Link
              href="/kontakt"
              className="bg-primaryOrange text-primaryWhite px-6 py-2 rounded-full hover:bg-primaryOrange/80 transition-colors font-medium"
            >
              {t("actions.contact")}
            </Link>
            <Link
              href="/onboarding"
              className="bg-primaryOrange text-primaryWhite px-6 py-2 rounded-full hover:bg-primaryOrange/80 transition-colors font-medium"
            >
              {t("actions.login")}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-darkerGray"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primaryWhite border-t border-gray-200"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block transition-colors font-medium py-2 ${
                      isActive
                        ? "text-primaryOrange"
                        : "text-darkerGray hover:text-primaryOrange"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile Produkte Dropdown */}
              <div>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center justify-between w-full transition-colors font-medium py-2 ${
                    productItems.some((item) => pathname === item.href)
                      ? "text-primaryOrange"
                      : "text-darkerGray hover:text-primaryOrange"
                  }`}
                >
                  {t("products.label")}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 mt-2 space-y-2"
                    >
                      {productItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block transition-colors py-2 ${
                              isActive
                                ? "text-primaryOrange"
                                : "text-darkerGray hover:text-primaryOrange"
                            }`}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Language switch (mobile) */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setWebsiteLocale("de")}
                  aria-pressed={locale === "de"}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    locale === "de"
                      ? "bg-primaryOrange text-white"
                      : "text-darkerGray hover:bg-gray-100"
                  }`}
                >
                  {t("language.de")}
                </button>
                <button
                  type="button"
                  onClick={() => setWebsiteLocale("en")}
                  aria-pressed={locale === "en"}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    locale === "en"
                      ? "bg-primaryOrange text-white"
                      : "text-darkerGray hover:bg-gray-100"
                  }`}
                >
                  {t("language.en")}
                </button>
              </div>

              <Link
                href="/kontakt"
                className="block bg-primaryOrange text-primaryWhite px-6 py-2 rounded-full hover:bg-primaryOrange/80 transition-colors font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("actions.contact")}
              </Link>

              <Link
                href="/onboarding"
                className="block bg-primaryOrange text-primaryWhite px-6 py-2 rounded-full hover:bg-primaryOrange/80 transition-colors font-medium text-center mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("actions.loginRegister")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

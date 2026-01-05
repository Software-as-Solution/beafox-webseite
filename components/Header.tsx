"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Update hash when it changes
    const updateHash = () => {
      setCurrentHash(window.location.hash);
    };
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

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
    { href: "/", label: "Startseite" },
    { href: "/ueber-beafox", label: "Über BeAFox" },
    { href: "/preise", label: "Preise" },
    { href: "/faq", label: "FAQ's" },
  ];

  const productItems = [
    { href: "/beafox-unlimited", label: "BeAFox Unlimited" },
    { href: "/fuer-unternehmen", label: "BeAFox for Business" },
    { href: "/fuer-schulen", label: "BeAFox for Schools" },
    { href: "/fuer-clubs", label: "BeAFox for Clubs" },
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
                Produkte
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

            <Link
              href="/kontakt"
              className="bg-primaryOrange text-primaryWhite px-6 py-2 rounded-full hover:bg-primaryOrange/80 transition-colors font-medium"
            >
              Kontakt
            </Link>
            <button
              className="snipcart-checkout relative p-2 text-darkerGray hover:text-primaryOrange transition-colors"
              aria-label="Warenkorb öffnen"
            >
              <ShoppingCart size={20} />
              <span className="snipcart-items-count absolute top-0 right-0 bg-primaryRed text-primaryWhite text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
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
                  Produkte
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

              <Link
                href="/kontakt"
                className="block bg-primaryOrange text-primaryWhite px-6 py-2 rounded-full hover:bg-primaryOrange/80 transition-colors font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontakt
              </Link>

              <button
                className="snipcart-checkout flex items-center justify-center gap-2 w-full mt-4 p-2 text-darkerGray hover:text-primaryOrange transition-colors border border-gray-200 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Warenkorb öffnen"
              >
                <ShoppingCart size={20} />
                <span>Warenkorb</span>
                <span className="snipcart-items-count bg-primaryRed text-primaryWhite text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

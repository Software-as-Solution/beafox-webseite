"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Startseite" },
    { href: "/ueber-beafox", label: "Über BeAFox" },
    { href: "/preise", label: "Preise" },
    { href: "/fuer-unternehmen", label: "Für Unternehmen" },
    { href: "/fuer-schulen", label: "Für Schulen" },
    { href: "/faq", label: "FAQ's" },
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-darkerGray hover:text-primaryOrange transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/kontakt"
              className="bg-primaryOrange text-primaryWhite px-6 py-2 rounded-full hover:bg-primaryOrange/80 transition-colors font-medium"
            >
              Kontakt
            </Link>
            <button className="relative p-2 text-darkerGray hover:text-primaryOrange transition-colors">
              <ShoppingCart size={20} />
              <span className="absolute top-0 right-0 bg-primaryRed text-primaryWhite text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-darkerGray hover:text-primaryOrange transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/kontakt"
                className="block bg-primaryOrange text-primaryWhite px-6 py-2 rounded-full hover:bg-primaryOrange/80 transition-colors font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontakt
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

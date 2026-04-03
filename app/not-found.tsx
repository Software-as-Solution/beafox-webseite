"use client";

// STANDARD
import Link from "next/link";
import Image from "next/image";
// IMPORTS
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
// ICONS
import { Home, Mail } from "lucide-react";

// TYPES
type QuickLink = { href: string; label: string };

export default function NotFound() {
  // HOOKS
  const t = useTranslations("notFound");
  // CONSTANTS
  const quickLinks = useMemo(
    () => (t.raw("quickLinks") as QuickLink[]) ?? [],
    [t],
  );

  return (
    <div className="min-h-[80vh] flex items-center bg-primaryWhite relative overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(232,119,32,0.04) 0%, transparent 70%)",
        }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, y: 20 }}
          >
            {/* Mascot */}
            <motion.div
              className="mb-6"
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            >
              <Image
                priority
                width={220}
                height={220}
                alt={t("mascotAlt")}
                src="/Maskottchen/Maskottchen-Hero.png"
                style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.08))" }}
                className="object-contain w-36 h-36 md:w-44 md:h-44 mx-auto scale-125"
              />
            </motion.div>
            {/* 404 */}
            <motion.span
              transition={{
                delay: 0.1,
                bounce: 0.4,
                duration: 0.6,
                type: "spring",
              }}
              style={{
                textShadow:
                  "0 0 30px rgba(232,119,32,0.2), 0 0 60px rgba(232,119,32,0.1)",
              }}
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              className="text-6xl md:text-8xl font-black text-primaryOrange inline-block mb-3"
            >
              404
            </motion.span>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-darkerGray mb-3">
              {t("title")}
            </h1>
            <p className="text-sm md:text-base text-lightGray max-w-md mx-auto mb-8 leading-relaxed">
              {t("description")}
            </p>
            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm md:text-base font-semibold text-white bg-primaryOrange hover:bg-primaryOrange/90 transition-all shadow-lg shadow-primaryOrange/20"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                {t("homeButton")}
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm md:text-base font-semibold text-primaryOrange border-2 border-primaryOrange/30 hover:border-primaryOrange hover:bg-primaryOrange/5 transition-all"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                {t("contactButton")}
              </Link>
            </div>
            {/* Quick Links */}
            <div className="border-t border-gray-100 pt-8">
              <p className="text-xs font-semibold text-lightGray uppercase tracking-wider mb-4">
                {t("quickLinksTitle")}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-darkerGray hover:text-primaryOrange px-3 py-1.5 rounded-lg hover:bg-primaryOrange/5 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

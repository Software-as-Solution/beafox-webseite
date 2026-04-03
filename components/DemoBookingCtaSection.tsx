"use client";

// CUSTOM COMPONENTS
import Button from "@/components/Button";
import Section from "@/components/Section";
import DownloadModal from "@/components/DownloadModal";
// IMPORTS
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState, useCallback, useRef } from "react";
// ICONS
import { PawPrint, Presentation, Download } from "lucide-react";

// Lazy-load Lottie (3 300+ SVG nodes) — only mount when section is visible
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// CONSTANTS
const BADGE_CLASS =
  "flex items-center gap-2 text-primaryWhite text-xs md:text-sm border-2 border-primaryWhite/30 rounded-full px-3 md:px-4 py-1.5 md:py-2 w-fit mx-auto md:mx-0 mb-4 md:mb-6";

export default function DemoBookingCtaSection() {
  // HOOKS
  const t = useTranslations("home");
  // STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  // REFS — track section visibility to lazy-mount Lottie (3 300+ SVG nodes)
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "200px" });
  // FUNCTIONS
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <Section
        aria-label="Demo anfordern"
        className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 relative overflow-hidden py-8 md:py-16 lg:py-20"
      >
        <div className="grid md:grid-cols-2 gap-2 md:gap-12 items-center max-w-6xl mx-auto relative z-10">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-center md:text-left order-2 md:order-1"
          >
            <div className={BADGE_CLASS}>
              <PawPrint
                aria-hidden="true"
                className="w-3 h-3 md:w-4 md:h-4 text-primaryWhite"
              />
              <span className="font-bold">{t("cta.badge")}</span>
              <PawPrint
                aria-hidden="true"
                className="w-3 h-3 md:w-4 md:h-4 text-primaryWhite"
              />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primaryWhite mb-3 md:mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-primaryWhite/90 mb-6 md:mb-8 leading-relaxed">
              {t("cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
              <Button
                onClick={openModal}
                variant="secondary"
                className="!bg-primaryWhite !text-primaryOrange hover:!bg-primaryWhite/90 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg flex justify-center items-center w-full sm:w-auto"
              >
                <Download
                  aria-hidden="true"
                  className="w-4 h-4 md:w-5 md:h-5 mr-2"
                />
                {t("hero.cta.download")}
              </Button>
              <Button
                href="/kontakt"
                variant="secondary"
                className="!bg-transparent !border-2 !border-primaryWhite !text-primaryWhite hover:!bg-primaryWhite/10 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg flex justify-center items-center w-full sm:w-auto"
              >
                <Presentation
                  aria-hidden="true"
                  className="w-4 h-4 md:w-5 md:h-5 mr-2"
                />
                {t("cta.buttons.partner")}
              </Button>
            </div>
          </motion.div>
          <motion.div
            ref={sectionRef}
            aria-hidden="true"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center order-1 md:order-2 mb-0"
          >
            <div className="w-full max-w-[280px] md:max-w-md">
              {isInView && (
                <Lottie
                  loop
                  className="w-full h-auto"
                  animationData={require("@/public/assets/Lottie/Kontakt.json")}
                />
              )}
            </div>
          </motion.div>
        </div>
      </Section>

      <DownloadModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

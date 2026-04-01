"use client";

import Image from "next/image";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

const APP_STORE_URL = "https://apps.apple.com/de/app/beafox/id6746110612";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.tapelea.beafox&pcampaignid=web_share";

const DOWNLOAD_CARD_STYLE = {
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 65%, #FFF2E8 100%)",
  border: "1px solid rgba(232,119,32,0.2)",
  boxShadow: "0 24px 64px rgba(0,0,0,0.08), 0 0 0 1px rgba(232,119,32,0.06)",
} as const;

const DOWNLOAD_PILL_STYLE = {
  background: "rgba(232,119,32,0.15)",
  border: "1px solid rgba(232,119,32,0.3)",
} as const;

const GRID_PATTERN_STYLE = {
  backgroundImage:
    "linear-gradient(rgba(232,119,32,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(232,119,32,0.1) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
} as const;

const DIVIDER_STYLE = { background: "rgba(31,41,55,0.2)" } as const;

const GLOW_STYLE = (opacity: number) => ({
  background: `radial-gradient(circle, rgba(232,119,32,${opacity}) 0%, transparent 70%)`,
});

type DownloadBannerSectionProps = {
  sectionClassName?: string;
  sectionId?: string;
};

export default function DownloadBannerSection({
  sectionClassName = "bg-primaryWhite py-8 md:py-14",
  sectionId = "download-banner",
}: DownloadBannerSectionProps) {
  const t = useTranslations("home");

  return (
    <Section className={sectionClassName} id={sectionId}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          wrapperClassName="mb-6 md:mb-8"
          preTitle={t("downloadBanner.sectionHeading.pre")}
          highlight={t("downloadBanner.sectionHeading.highlight")}
        />
        <div
          className="relative rounded-3xl overflow-hidden px-6 py-10 md:px-12 md:py-14 lg:px-16 lg:py-16"
          style={DOWNLOAD_CARD_STYLE}
        >
          <div
            className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={GLOW_STYLE(0.1)}
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -left-24 w-[300px] h-[300px] rounded-full pointer-events-none"
            style={GLOW_STYLE(0.06)}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={GRID_PATTERN_STYLE}
            aria-hidden="true"
          />

          <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1 text-center md:text-left"
            >
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
                style={DOWNLOAD_PILL_STYLE}
              >
                <Sparkles
                  className="w-5 h-5 text-primaryOrange"
                  aria-hidden="true"
                />
                <span className="text-xs font-bold text-primaryOrange tracking-wide uppercase">
                  {t("downloadBanner.pill")}
                </span>
                <Sparkles
                  className="w-5 h-5 text-primaryOrange"
                  aria-hidden="true"
                />
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-darkerGray mb-4 leading-tight">
                {t("downloadBanner.title.pre")}{" "}
                <span className="text-primaryOrange">
                  {t("downloadBanner.title.highlight")}
                </span>{" "}
                {t("downloadBanner.title.post")}
              </h2>

              <div className="flex flex-row flex-wrap gap-3 mb-6 items-center md:items-stretch max-w-md mx-auto md:mx-0 md:flex-col">
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[190px] flex items-center gap-2 md:gap-4 justify-center md:justify-start rounded-lg border border-darkerGray/20 p-2 bg-white/80 hover:scale-[1.02] transition-transform"
                >
                  <Image
                    src="/assets/Apple.png"
                    alt={t("downloadBanner.storeBadges.appleAlt")}
                    width={160}
                    height={52}
                    className="object-contain w-[40px] h-auto shrink-0"
                  />
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-darkerGray text-left">
                    {t("downloadBanner.storeLabels.apple")}
                  </span>
                </a>
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[190px] flex items-center gap-2 md:gap-4 justify-center md:justify-start rounded-lg border border-darkerGray/20 p-2 bg-white/80 hover:scale-[1.02] transition-transform"
                >
                  <Image
                    src="/assets/Android.png"
                    alt={t("downloadBanner.storeBadges.googleAlt")}
                    width={160}
                    height={52}
                    className="object-contain w-[40px] h-auto shrink-0"
                  />
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-darkerGray text-left">
                    {t("downloadBanner.storeLabels.google")}
                  </span>
                </a>
              </div>

              <div className="flex items-center gap-4 justify-center md:justify-start">
                <div
                  className="flex items-center gap-1.5"
                  aria-label={t("downloadBanner.ratingStarsAria")}
                >
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#F97316"
                      stroke="none"
                      aria-hidden="true"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="text-darkerGray/75 text-xs font-semibold ml-1">
                    {t("downloadBanner.ratingScore")}
                  </span>
                </div>
                <div
                  className="w-px h-4 rounded-full"
                  style={DIVIDER_STYLE}
                  aria-hidden="true"
                />
                <span className="text-darkerGray/65 text-xs">
                  {t("downloadBanner.socialProof")}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative flex items-center justify-center order-1 md:order-2"
            >
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full pointer-events-none"
                style={GLOW_STYLE(0.12)}
                aria-hidden="true"
              />
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="relative z-10"
                style={{ transform: "rotate(-8deg)", marginRight: "-24px" }}
              >
                <Image
                  src="/assets/Mockups/Mockup-Training.png"
                  alt={t("downloadBanner.mockups.trainingAlt")}
                  width={200}
                  height={428}
                  loading="lazy"
                  className="object-contain w-[130px] sm:w-[150px] md:w-[180px] lg:w-[220px] h-auto"
                  style={{
                    filter: "drop-shadow(0 20px 36px rgba(0,0,0,0.22))",
                  }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="relative z-20"
                style={{ transform: "rotate(6deg)" }}
              >
                <Image
                  src="/assets/Mockups/Mockup-Lernpfad.png"
                  alt={t("downloadBanner.mockups.pathAlt")}
                  width={240}
                  height={514}
                  loading="lazy"
                  className="object-contain w-[140px] sm:w-[165px] md:w-[200px] lg:w-[240px] h-auto"
                  style={{
                    filter: "drop-shadow(0 24px 44px rgba(0,0,0,0.24))",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}

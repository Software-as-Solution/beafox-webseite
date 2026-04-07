"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// CUSTOM COMPONENTS
import Button from "@/components/Button";
import Section from "@/components/Section";
import LandingHero from "@/components/LandingHero";
import SectionHeader from "@/components/SectionHeader";
import TrustSignalBar from "@/components/TrustSignalBar";
import StructuredData from "@/components/StructuredData";
import DemoBookingCtaSection from "@/components/DemoBookingCtaSection";
import GradientMascotCtaSection from "@/components/GradientMascotCtaSection";
// IMPORTS
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
// ICONS
import {
  Check,
  Shield,
  Monitor,
  Calendar,
  Gamepad2,
  ExternalLink,
} from "lucide-react";

// CONSTANTS
const CAL_URL = "https://app.cal.eu/beafox";
const FEATURE_ICONS = [Gamepad2, Monitor, Shield] as const;
const EDUPLACES_URL = "https://www.eduplaces.de/de/app/beafox";
const GRADIENT_CARD_STYLE = {
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
} as const;
const GLOW = (opacity: number) => ({
  background: `radial-gradient(circle, rgba(232,119,32,${opacity}) 0%, transparent 70%)`,
});
// TYPES
type FeatureItem = { title: string; description: string };
type WhyItem = { number: string; title: string; text: string };

export default function EduplacesPage() {
  // HOOKS
  const t = useTranslations("eduplaces");

  // MEMOIZED DATA
  const introBullets = useMemo(
    () => (t.raw("intro.bullets") as string[]) ?? [],
    [t],
  );
  const features = useMemo(() => {
    const raw = (t.raw("features.items") as FeatureItem[]) ?? [];
    return raw.map((f, i) => ({ ...f, icon: FEATURE_ICONS[i] }));
  }, [t]);
  const whyItems = useMemo(() => (t.raw("why.items") as WhyItem[]) ?? [], [t]);

  return (
    <>
      {/* ─── 1. HERO ─── */}
      <LandingHero
        badge={t("hero.badge")}
        mascotAlt={t("hero.badge")}
        cardText={t("hero.cardText")}
        mascotClassName="!scale-110 md:top-6"
        mascotSrc="/Maskottchen/Maskottchen-Eduplaces.webp"
        title={
          <>
            {t("hero.titlePre")}{" "}
            <span className="text-primaryOrange">
              {t("hero.titleHighlight")}
            </span>
          </>
        }
        actions={
          <>
            <Button
              target="_blank"
              variant="primary"
              href={EDUPLACES_URL}
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <ExternalLink
                className="w-3.5 h-3.5 md:w-4 md:h-4"
                aria-hidden="true"
              />
              {t("hero.ctaPrimary")}
            </Button>
            <Button
              href={CAL_URL}
              target="_blank"
              variant="outline"
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Calendar
                aria-hidden="true"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
              {t("hero.ctaSecondary")}
            </Button>
          </>
        }
      />

      {/* ─── 2. TRUST ─── */}
      <TrustSignalBar
        isEduplaces
        preTitle={t("trust.preTitle")}
        highlight={t("trust.highlight")}
      />

      {/* ─── 3. WAS IST EDUPLACES ─── */}
      <Section className="bg-primaryWhite pt-10 md:pt-16 pb-6 md:pb-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <SectionHeader
              title={
                <>
                  {t("intro.heading")}{" "}
                  <span className="text-primaryOrange">
                    {t("intro.headingHighlight")}
                  </span>
                </>
              }
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
            {/* Left: Content */}
            <motion.div
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="mb-6 pb-6 border-b border-primaryOrange/10">
                <motion.span
                  viewport={{ once: true }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="text-5xl md:text-6xl font-bold text-primaryOrange inline-block"
                  style={{
                    textShadow:
                      "0 0 20px rgba(232,119,32,0.3), 0 0 40px rgba(232,119,32,0.15)",
                  }}
                >
                  {t("intro.statValue")}
                </motion.span>
                <h3 className="text-lg md:text-xl font-bold text-darkerGray mt-2 mb-2">
                  {t("intro.statHeading")}
                </h3>
                <p className="text-sm md:text-base text-lightGray leading-relaxed">
                  {t("intro.p1")}
                </p>
              </div>
              <div className="space-y-2.5">
                {introBullets.map((item, bulletIndex) => (
                  <div
                    style={GRADIENT_CARD_STYLE}
                    key={`eduplaces-intro-${bulletIndex}`}
                    className="flex items-start gap-3 rounded-xl p-3 md:p-3.5 border border-primaryOrange/15"
                  >
                    <Check
                      aria-hidden="true"
                      className="w-4 h-4 text-primaryOrange flex-shrink-0 mt-0.5"
                    />
                    <span className="text-sm md:text-base text-darkerGray leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Mascot */}
            <motion.div
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative flex flex-col items-center justify-center gap-6"
            >
              <div
                style={GLOW(0.06)}
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full pointer-events-none"
              />
              <Image
                width={500}
                height={500}
                alt={t("images.introIllustrationAlt")}
                src="/Maskottchen/Maskottchen-Eduplaces.webp"
                style={{ filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.1))" }}
                className="relative z-10 object-contain w-[280px] md:w-[340px] lg:w-[380px] h-auto"
              />
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ─── 4. WAS IHRE SCHULE BEKOMMT ─── */}
      <Section className="bg-gray-50 py-8 md:py-12 lg:py-16">
        <motion.div
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <SectionHeader
            pillClassName="mb-4 md:mb-6"
            title={
              <>
                {t("features.title")}{" "}
                <span className="text-primaryOrange">
                  {t("features.titleHighlight")}
                </span>
              </>
            }
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                viewport={{ once: true }}
                style={GRADIENT_CARD_STYLE}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-2xl p-5 md:p-6 border border-primaryOrange/15 hover:border-primaryOrange/30 transition-all hover:shadow-lg group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: "rgba(232,119,32,0.1)",
                    border: "1px solid rgba(232,119,32,0.15)",
                  }}
                >
                  <Icon
                    className="w-5 h-5 text-primaryOrange"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-base md:text-lg font-bold text-darkerGray mb-1 group-hover:text-primaryOrange transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-lightGray leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ─── 5. WARUM ÜBER EDUPLACES ─── */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-10"
          >
            <SectionHeader
              pillClassName="mb-4 md:mb-6"
              title={
                <>
                  {t("why.title")}{" "}
                  <span className="text-primaryOrange">
                    {t("why.titleHighlight")}
                  </span>
                </>
              }
            />
          </motion.div>

          <div className="space-y-4">
            {whyItems.map((item, index) => (
              <motion.div
                key={item.number}
                viewport={{ once: true }}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 md:gap-5"
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl font-bold flex-shrink-0"
                  style={{
                    color: "#E87720",
                    border: "2px solid rgba(232,119,32,0.2)",
                    background:
                      "linear-gradient(135deg, #FFF8F3 0%, #FFF2E8 100%)",
                  }}
                >
                  {item.number}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-base md:text-lg font-bold text-darkerGray mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-lightGray leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── 6. CTA ─── */}
      <GradientMascotCtaSection
        sectionClassName="bg-gray-50 py-8 md:py-12 lg:py-16"
        mascotSrc="/Maskottchen/Maskottchen-Eduplaces.webp"
        mascotAlt={t("images.ctaMascotAlt")}
        title={t("cta.title")}
        description={t("cta.description")}
        actions={
          <>
            <Button
              target="_blank"
              variant="primary"
              href={EDUPLACES_URL}
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 text-sm md:text-base"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              {t("cta.ctaPrimary")}
            </Button>
            <Button
              href={CAL_URL}
              target="_blank"
              variant="outline"
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 text-sm md:text-base"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              {t("cta.ctaSecondary")}
            </Button>
          </>
        }
      />

      {/* ─── 7. FINAL CTA ─── */}
      <DemoBookingCtaSection />

      {/* STRUCTURED DATA */}
      <StructuredData
        id="eduplaces-partnership"
        data={{
          "@type": "SoftwareApplication",
          operatingSystem: "iOS, Android",
          "@context": "https://schema.org",
          name: t("structuredData.applicationName"),
          applicationCategory: "EducationalApplication",
          description: t("structuredData.description"),
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
          },
          author: {
            "@type": "Organization",
            url: t("structuredData.authorUrl"),
            name: t("structuredData.authorName"),
          },
        }}
      />
    </>
  );
}

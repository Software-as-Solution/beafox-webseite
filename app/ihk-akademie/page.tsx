"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// CUSTOM COMPONENTS
import Button from "@/components/Button";
import Section from "@/components/Section";
import LandingHero from "@/components/LandingHero";
import SectionHeader from "@/components/SectionHeader";
import TrustSignalBar from "@/components/TrustSignalBar";
import DemoBookingCtaSection from "@/components/DemoBookingCtaSection";
// IMPORTS
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
// ICONS
import StructuredData from "@/components/StructuredData";
import { Check, Calendar, ArrowRight, ExternalLink } from "lucide-react";

// CONSTANTS
const CAL_URL = "https://app.cal.eu/beafox";
const GRADIENT_CARD_STYLE = {
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
} as const;
const IHK_WORKSHOP_URL =
  "https://www.ihk-wissen.de/seminare/auszubildende/weiterbildung/kurs/AzubiGo-Finanzbildung-fuer-Unternehmen/25505MA005";
// HELPER FUNCTIONS
const GLOW = (opacity: number) => ({
  background: `radial-gradient(circle, rgba(232,119,32,${opacity}) 0%, transparent 70%)`,
});
// TYPES
type DateItem = {
  date: string;
  type: string;
  status?: string;
  location: string;
};
type TopicItem = { title: string; description: string };
type WhyAzubiGoItem = { number: string; title: string; text: string };

export default function IHKAkademiePage() {
  // HOOKS
  const t = useTranslations("ihkAkademie");
  // CONSTANTS
  const workshopTopics = useMemo(
    () => (t.raw("topics.items") as TopicItem[]) ?? [],
    [t],
  );
  const workshopDates = useMemo(
    () => (t.raw("dates.items") as DateItem[]) ?? [],
    [t],
  );
  const introBullets = useMemo(
    () => (t.raw("intro.bullets") as string[]) ?? [],
    [t],
  );
  const whyAzubiGoItems = useMemo(
    () => (t.raw("whyAzubiGo.items") as WhyAzubiGoItem[]) ?? [],
    [t],
  );

  return (
    <>
      {/* ─── 1. HERO ─── */}
      <LandingHero
        badge={t("hero.badge")}
        cardText={t("hero.cardText")}
        mascotAlt={t("hero.mascotAlt")}
        description={t("hero.description")}
        mascotClassName="!scale-110 md:top-6"
        mascotSrc="/Maskottchen/Maskottchen-Akademie.webp"
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
              href={IHK_WORKSHOP_URL}
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <ExternalLink
                aria-hidden="true"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
              {t("hero.ctaWorkshop")}
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
              {t("hero.ctaConsultation")}
            </Button>
          </>
        }
      />
      {/* ─── 2. TRUST — Partner Logos ─── */}
      <TrustSignalBar
        showPartners
        preTitle={t("trust.preTitle")}
        highlight={t("trust.highlight")}
      />
      {/* ─── 3. WAS IST AZUBIGO ─── */}
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
              {/* Impact stat */}
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
                {introBullets.map((item) => (
                  <div
                    key={item}
                    style={GRADIENT_CARD_STYLE}
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
            {/* Right: IHK Logo + Mascot */}
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
                alt={t("images.certificateAlt")}
                src="/Maskottchen/Maskottchen-Zertifikat.webp"
                style={{ filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.1))" }}
                className="relative z-10 object-contain w-[280px] md:w-[340px] lg:w-[380px] h-auto"
              />
            </motion.div>
          </div>
        </div>
      </Section>
      {/* ─── 4. WORKSHOP-INHALTE ─── */}
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
            subtitle={t("topics.subtitle")}
            title={
              <>
                {t("topics.title")}{" "}
                <span className="text-primaryOrange">
                  {t("topics.titleHighlight")}
                </span>
              </>
            }
          />
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
          {workshopTopics.map((topic, index) => (
            <motion.div
              viewport={{ once: true }}
              style={GRADIENT_CARD_STYLE}
              key={`${topic.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-2xl p-5 md:p-6 border border-primaryOrange/15 hover:border-primaryOrange/30 transition-all hover:shadow-lg group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg font-bold text-primaryOrange"
                style={{
                  background: "rgba(232,119,32,0.1)",
                  border: "1px solid rgba(232,119,32,0.15)",
                }}
              >
                {index + 1}
              </div>
              <h3 className="text-base md:text-lg font-bold text-darkerGray mb-1 group-hover:text-primaryOrange transition-colors">
                {topic.title}
              </h3>
              <p className="text-sm text-lightGray leading-relaxed">
                {topic.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>
      {/* ─── 5. BENEFITS ─── */}
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
                  {t("whyAzubiGo.title")}{" "}
                  <span className="text-primaryOrange">
                    {t("whyAzubiGo.titleHighlight")}
                  </span>
                </>
              }
            />
          </motion.div>
          <div className="space-y-4">
            {whyAzubiGoItems.map((item, index) => (
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
      {/* ─── 6. TERMINE ─── */}
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
                {t("dates.title")}{" "}
                <span className="text-primaryOrange">
                  {t("dates.titleHighlight")}
                </span>
              </>
            }
          />
        </motion.div>
        <div className="max-w-3xl mx-auto space-y-3">
          {workshopDates.map((ws, index) => (
            <motion.div
              viewport={{ once: true }}
              key={`${ws.date}-${index}`}
              style={GRADIENT_CARD_STYLE}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl p-4 md:p-5 border border-primaryOrange/15 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(232,119,32,0.1)",
                    border: "1px solid rgba(232,119,32,0.15)",
                  }}
                >
                  <Calendar
                    aria-hidden="true"
                    className="w-5 h-5 text-primaryOrange"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm md:text-base font-bold text-darkerGray">
                      {ws.date}
                    </span>
                    {"status" in ws && ws.status && (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                        {ws.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-lightGray truncate">
                    {ws.type} — {ws.location}
                  </p>
                </div>
              </div>
              <Button
                target="_blank"
                variant="outline"
                href={IHK_WORKSHOP_URL}
                className="flex items-center justify-center gap-1.5 !px-4 !py-2 text-xs md:text-sm flex-shrink-0"
              >
                {t("dates.securePlace")}
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </Button>
            </motion.div>
          ))}
        </div>
        <motion.div
          viewport={{ once: true }}
          className="text-center mt-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            target="_blank"
            href={IHK_WORKSHOP_URL}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primaryOrange hover:gap-3 transition-all"
          >
            {t("dates.allDatesLink")}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </motion.div>
      </Section>
      {/* ─── 7. FINAL CTA ─── */}
      <DemoBookingCtaSection />
      <StructuredData
        id="ihk-workshop"
        data={{
          "@type": "Course",
          "@context": "https://schema.org",
          description: t("meta.description"),
          name: "AzubiGo: Finanzbildung für Azubis",
          provider: {
            "@type": "Organization",
            url: "https://www.ihk-wissen.de",
            name: "IHK Akademie in Ostbayern GmbH",
          },
          offers: {
            "@type": "Offer",
            price: "125.00",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
          },
        }}
      />
    </>
  );
}

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
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
// ICONS
import { Check, Calendar, ExternalLink, Presentation } from "lucide-react";

// CONSTANTS
const CAL_URL = "https://app.cal.eu/beafox";
const BILDUNGSHAUS_WOLFSBURG_URL = "https://www.bildungshaus-wolfsburg.de/";
const GRADIENT_CARD_STYLE = {
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
} as const;
const GLOW = (opacity: number) => ({
  background: `radial-gradient(circle, rgba(232,119,32,${opacity}) 0%, transparent 70%)`,
});

// TYPES
type TopicItem = { title: string; description: string; icon: string };
type WhyItem = { number: string; title: string; text: string };

export default function BildungshausPage() {
  // HOOKS
  const t = useTranslations("bildungshaus");

  // MEMOIZED DATA
  const introBullets = useMemo(
    () => (t.raw("intro.bullets") as string[]) ?? [],
    [t],
  );
  const workshopTopics = useMemo(
    () => (t.raw("topics.items") as TopicItem[]) ?? [],
    [t],
  );
  const whyItems = useMemo(() => (t.raw("why.items") as WhyItem[]) ?? [], [t]);

  return (
    <>
      {/* ─── 1. HERO ─── */}
      <LandingHero
        badge={t("hero.badge")}
        mascotAlt={t("hero.mascotAlt")}
        mascotSrc="/Maskottchen/Maskottchen-Bildungshaus.webp"
        cardText={t("hero.cardText")}
        mascotClassName="!scale-110 md:top-6"
        title={
          <>
            {t("hero.titlePre")}{" "}
            <span className="text-primaryOrange">
              {t("hero.titleHighlight")}
            </span>
          </>
        }
        description={t("hero.description")}
        actions={
          <>
            <Button
              href="/kontakt"
              variant="primary"
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Presentation
                className="w-3.5 h-3.5 md:w-4 md:h-4"
                aria-hidden="true"
              />
              {t("hero.ctaPrimary")}
            </Button>
            <Button
              href={CAL_URL}
              variant="outline"
              target="_blank"
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Calendar
                className="w-3.5 h-3.5 md:w-4 md:h-4"
                aria-hidden="true"
              />
              {t("hero.ctaSecondary")}
            </Button>
          </>
        }
      />

      {/* ─── 2. TRUST ─── */}
      <TrustSignalBar
        preTitle={t("trust.preTitle")}
        highlight={t("trust.highlight")}
      />

      {/* ─── 3. WAS IST DIE WORKSHOP-REIHE ─── */}
      <Section className="bg-primaryWhite pt-10 md:pt-16 pb-6 md:pb-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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

          <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center relative bottom-4">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 pb-6 border-b border-primaryOrange/10">
                <motion.span
                  className="text-5xl md:text-6xl font-bold text-primaryOrange inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
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
                    key={`intro-bullet-${bulletIndex}`}
                    className="flex items-start gap-3 rounded-xl p-3 md:p-3.5 border border-primaryOrange/15"
                    style={GRADIENT_CARD_STYLE}
                  >
                    <Check
                      className="w-4 h-4 text-primaryOrange flex-shrink-0 mt-0.5"
                      aria-hidden="true"
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
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex flex-col items-center justify-center gap-6"
            >
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full pointer-events-none"
                style={GLOW(0.06)}
                aria-hidden="true"
              />
              <Image
                src="/Maskottchen/Maskottchen-Lebenssituationen.webp"
                alt="BeAFox × Bildungshaus Wolfsburg"
                width={500}
                height={500}
                className="relative z-10 object-contain w-[280px] md:w-[340px] lg:w-[380px] h-auto"
                style={{ filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.1))" }}
              />
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ─── 4. WORKSHOP-THEMEN ─── */}
      <Section className="bg-gray-50 py-8 md:py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <SectionHeader
            pillClassName="mb-4 md:mb-6"
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
              key={`${topic.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-2xl p-5 md:p-6 border border-primaryOrange/15 hover:border-primaryOrange/30 transition-all hover:shadow-lg group"
              style={GRADIENT_CARD_STYLE}
            >
              <div className="text-2xl mb-3" aria-hidden="true">
                {topic.icon}
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

      {/* ─── 5. WARUM ─── */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4 md:gap-5"
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl font-bold flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFF8F3 0%, #FFF2E8 100%)",
                    border: "2px solid rgba(232,119,32,0.2)",
                    color: "#E87720",
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

      {/* ─── 6. PARTNERSCHAFT CTA ─── */}
      <GradientMascotCtaSection
        sectionClassName="bg-gray-50 py-8 md:py-12 lg:py-16"
        mascotSrc="/Maskottchen/Maskottchen-Welcome.webp"
        mascotAlt="Bea winkt — Workshop-Reihe und Partnerschaft mit dem Bildungshaus Wolfsburg"
        mascotWidth={200}
        mascotHeight={200}
        title={t("cta.title")}
        description={t("cta.description")}
        actions={
          <>
            <Button
              href="/kontakt"
              variant="primary"
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 text-sm md:text-base"
            >
              <Presentation className="w-4 h-4" aria-hidden="true" />
              {t("cta.ctaPrimary")}
            </Button>
            <Button
              href={BILDUNGSHAUS_WOLFSBURG_URL}
              variant="outline"
              target="_blank"
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 text-sm md:text-base"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              {t("cta.ctaSecondary")}
            </Button>
          </>
        }
      />

      {/* ─── 7. FINAL CTA ─── */}
      <DemoBookingCtaSection />

      {/* STRUCTURED DATA */}
      <StructuredData
        id="bildungshaus-partnership"
        data={{
          "@type": "Course",
          "@context": "https://schema.org",
          name: "Finanzen für alle Lebenssituationen",
          description:
            "Workshop-Reihe von BeAFox und dem Bildungshaus Wolfsburg zu finanziellen Lebenssituationen",
          provider: [
            {
              "@type": "Organization",
              name: "Bildungshaus Wolfsburg",
              url: "https://www.bildungshaus-wolfsburg.de",
            },
            {
              "@type": "Organization",
              url: "https://beafox.app",
              name: "BeAFox UG (haftungsbeschränkt)",
            },
          ],
        }}
      />
    </>
  );
}

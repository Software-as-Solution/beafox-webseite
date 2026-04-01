"use client";

import Image from "next/image";
import Button from "@/components/Button";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import { Calendar, Presentation } from "lucide-react";
import type { ReactNode } from "react";

const DEFAULT_CAL_URL = "https://app.cal.eu/beafox";

const GLOW = (opacity: number) => ({
  background: `radial-gradient(circle, rgba(232,119,32,${opacity}) 0%, transparent 70%)`,
});

const CARD_SURFACE_STYLE = {
  border: "2px solid rgba(232,119,32,0.2)",
  boxShadow: "0 16px 48px rgba(232,119,32,0.08)",
  background:
    "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
} as const;

export type IndividualOfferCtaSectionProps = {
  /** Outer section spacing + background */
  sectionClassName?: string;
  pillClassName?: string;
  /** Pill headline (e.g. pre + orange span) */
  headerTitle: ReactNode;
  mascotSrc: string;
  mascotAlt?: string;
  mascotClassName?: string;
  cardTitle: string;
  cardBodyLine1: string;
  /** If omitted, body renders as a single paragraph */
  cardBodyLine2?: string;
  requestQuoteLabel: string;
  bookCallLabel: string;
  contactHref?: string;
  calUrl?: string;
};

export default function IndividualOfferCtaSection({
  sectionClassName = "bg-gray-50 py-8 md:py-12 lg:py-16",
  pillClassName = "mb-4 md:mb-6",
  headerTitle,
  mascotSrc,
  mascotAlt = "",
  mascotClassName = "object-contain w-24 h-24 md:w-32 md:h-32 flex-shrink-0",
  cardTitle,
  cardBodyLine1,
  cardBodyLine2,
  requestQuoteLabel,
  bookCallLabel,
  contactHref = "/kontakt",
  calUrl = DEFAULT_CAL_URL,
}: IndividualOfferCtaSectionProps) {
  return (
    <Section className={sectionClassName}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <SectionHeader pillClassName={pillClassName} title={headerTitle} />
        </motion.div>
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl p-6 md:p-10"
          style={CARD_SURFACE_STYLE}
        >
          <div
            style={GLOW(0.06)}
            aria-hidden="true"
            className="absolute -top-16 -right-16 w-[200px] h-[200px] rounded-full pointer-events-none"
          />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <Image
              src={mascotSrc}
              alt={mascotAlt}
              width={160}
              height={160}
              aria-hidden={mascotAlt ? undefined : true}
              className={mascotClassName}
              style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.08))" }}
            />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-darkerGray mb-2">
                {cardTitle}
              </h3>
              <p className="text-sm md:text-base text-lightGray leading-relaxed mb-5">
                {cardBodyLine1}
                {cardBodyLine2 ? (
                  <>
                    <br />
                    {cardBodyLine2}
                  </>
                ) : null}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Button
                  href={contactHref}
                  variant="primary"
                  className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 text-sm md:text-base"
                >
                  <Presentation className="w-4 h-4" aria-hidden="true" />
                  {requestQuoteLabel}
                </Button>
                <Button
                  href={calUrl}
                  variant="outline"
                  className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 text-sm md:text-base"
                >
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  {bookCallLabel}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

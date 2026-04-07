"use client";

// CUSTOM COMPONENTS
import Button from "@/components/Button";
import GradientMascotCtaSection from "@/components/GradientMascotCtaSection";
// ICONS
import { Calendar, Presentation } from "lucide-react";
// TYPES
import type { ReactNode } from "react";

// CONSTANTS
const DEFAULT_CAL_URL = "https://app.cal.eu/beafox";
// TYPES
export type IndividualOfferCtaSectionProps = {
  calUrl?: string;
  mascotSrc: string;
  cardTitle: string;
  mascotAlt?: string;
  contactHref?: string;
  bookCallLabel: string;
  cardBodyLine1: string;
  pillClassName?: string;
  cardBodyLine2?: string;
  headerTitle: ReactNode;
  mascotClassName?: string;
  requestQuoteLabel: string;
  sectionClassName?: string;
};

export default function IndividualOfferCtaSection({
  headerTitle,
  mascotSrc,
  cardTitle,
  cardBodyLine1,
  cardBodyLine2,
  bookCallLabel,
  mascotAlt = "",
  requestQuoteLabel,
  contactHref = "/kontakt",
  calUrl = DEFAULT_CAL_URL,
  pillClassName = "mb-4 md:mb-6",
  sectionClassName = "bg-gray-50 py-8 md:py-12 lg:py-16",
  mascotClassName = "object-contain w-24 h-24 md:w-32 md:h-32 flex-shrink-0",
}: IndividualOfferCtaSectionProps) {
  return (
    <GradientMascotCtaSection
      title={cardTitle}
      mascotSrc={mascotSrc}
      mascotAlt={mascotAlt}
      headerTitle={headerTitle}
      mascotClassName={mascotClassName}
      headerPillClassName={pillClassName}
      sectionClassName={sectionClassName}
      description={
        <>
          {cardBodyLine1}
          {cardBodyLine2 ? (
            <>
              <br />
              {cardBodyLine2}
            </>
          ) : null}
        </>
      }
      actions={
        <>
          <Button
            variant="primary"
            href={contactHref}
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
        </>
      }
    />
  );
}

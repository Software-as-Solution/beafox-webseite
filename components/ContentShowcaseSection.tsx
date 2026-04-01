"use client";

import type { ComponentProps, ReactNode } from "react";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";

export type ContentShowcaseHeaderProps = ComponentProps<typeof SectionHeader>;

export interface ContentShowcaseSectionProps {
  /** Zusätzliche Klassen für die äußere `Section` (z. B. Hintergrund, Abstände). */
  sectionClassName?: string;
  /** Optionaler Wrapper um Header + Inhalt (z. B. `max-w-6xl mx-auto`). */
  innerClassName?: string;
  /** Klassen für den Abstand unter dem Header-Bereich. */
  headerMotionClassName?: string;
  headerMotionDuration?: number;
  sectionHeaderProps: ContentShowcaseHeaderProps;
  children: ReactNode;
}

/**
 * Grauer Block mit PawPrint-`SectionHeader` und freiem Inhalt — gleiches Muster wie Ratgeber-Bereich / FAQ Quick Links.
 */
export default function ContentShowcaseSection({
  sectionClassName = "bg-gray-50 py-8 md:py-12 lg:py-16",
  innerClassName,
  headerMotionClassName = "text-center mb-8 md:mb-12",
  headerMotionDuration = 0.6,
  sectionHeaderProps,
  children,
}: ContentShowcaseSectionProps) {
  return (
    <Section className={sectionClassName}>
      <div className={innerClassName}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: headerMotionDuration }}
          className={headerMotionClassName}
        >
          <SectionHeader {...sectionHeaderProps} />
        </motion.div>
        {children}
      </div>
    </Section>
  );
}

"use client";

// IMPORTS
import { motion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";
// CUSTOM COMPONENTS
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";

// TYPES
export type ContentShowcaseHeaderProps = ComponentProps<typeof SectionHeader>;
export interface ContentShowcaseSectionProps {
  children: ReactNode;
  innerClassName?: string;
  sectionClassName?: string;
  headerMotionDuration?: number;
  headerMotionClassName?: string;
  sectionHeaderProps: ContentShowcaseHeaderProps;
}

export default function ContentShowcaseSection({
  children,
  innerClassName,
  sectionHeaderProps,
  headerMotionDuration = 0.6,
  headerMotionClassName = "text-center mb-8 md:mb-12",
  sectionClassName = "bg-gray-50 py-6 sm:py-8 md:py-12 lg:py-16",
}: ContentShowcaseSectionProps) {
  return (
    <Section className={sectionClassName}>
      <div className={innerClassName}>
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          className={headerMotionClassName}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: headerMotionDuration }}
        >
          <SectionHeader {...sectionHeaderProps} />
        </motion.div>
        {children}
      </div>
    </Section>
  );
}

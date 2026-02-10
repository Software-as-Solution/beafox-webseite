"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import {
  FileText,
  Scale,
  Handshake,
  CheckCircle2,
  CreditCard,
  Shield,
  AlertCircle,
  XCircle,
  Gavel,
  RotateCcw,
  Database,
  Wrench,
  Copyright,
  Ban,
  MessageSquare,
  GraduationCap,
  Building2,
  RefreshCw,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function AGBPage() {
  const t = useTranslations("agb");

  type AgbSectionContentItem = { subtitle?: string; text?: string };
  type AgbSection = {
    id: number;
    title: string;
    iconId:
      | "scale"
      | "fileText"
      | "handshake"
      | "rotate"
      | "check"
      | "creditCard"
      | "shield"
      | "database"
      | "wrench"
      | "copyright"
      | "building"
      | "ban"
      | "alert"
      | "xCircle"
      | "messageSquare"
      | "graduationCap"
      | "refresh"
      | "gavel";
    content: AgbSectionContentItem[];
  };

  const iconById: Record<AgbSection["iconId"], React.ElementType> = {
    scale: Scale,
    fileText: FileText,
    handshake: Handshake,
    rotate: RotateCcw,
    check: CheckCircle2,
    creditCard: CreditCard,
    shield: Shield,
    database: Database,
    wrench: Wrench,
    copyright: Copyright,
    building: Building2,
    ban: Ban,
    alert: AlertCircle,
    xCircle: XCircle,
    messageSquare: MessageSquare,
    graduationCap: GraduationCap,
    refresh: RefreshCw,
    gavel: Gavel,
  };

  const sections = (t.raw("sections") as AgbSection[]) ?? [];

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-primaryWhite pt-20 md:pt-32 pb-8 md:pb-16 mt-10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 md:mb-6"
          >
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-4 md:mb-6">
              <FileText className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">{t("hero.badge")}</span>
              <FileText className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl md:text-5xl lg:text-6xl font-bold text-darkerGray mb-4 md:mb-6"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl text-lightGray max-w-2xl mx-auto"
          >
            {t("hero.subtitle")}
          </motion.p>
        </div>
      </Section>

      {/* Content Sections */}
      <Section className="bg-white py-6 md:py-16 lg:py-20 pt-0 md:pt-0 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6 md:space-y-12">
            {sections.map((section, index) => {
              const IconComponent = iconById[section.iconId] ?? FileText;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-primaryWhite rounded-2xl p-4 md:p-8 border-2 border-primaryOrange/20"
                >
                  <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-16 md:h-16 bg-primaryOrange/10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-primaryOrange/20">
                      <IconComponent className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
                    </div>
                    <h2 className="text-xl md:text-3xl font-bold text-darkerGray flex-1 leading-tight">
                      § {section.id} {section.title}
                    </h2>
                  </div>

                  <div className="space-y-4 md:space-y-6 ml-0 md:ml-20">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="space-y-2 md:space-y-3">
                        {item.subtitle && (
                          <h3 className="text-lg md:text-xl font-semibold text-darkerGray">
                            {item.subtitle}
                          </h3>
                        )}
                        {item.text && (
                          <p className="text-sm md:text-base text-lightGray leading-relaxed">
                            {item.text}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section className="bg-primaryWhite py-4 md:py-8 lg:py-12 pt-0 md:pt-0 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-4 md:p-8 border-2 border-primaryOrange/20 text-center"
          >
            <FileText className="w-10 h-10 md:w-16 md:h-16 text-primaryOrange mx-auto mb-3 md:mb-4" />
            <h2 className="text-xl md:text-3xl font-bold text-darkerGray mb-3 md:mb-4">
              {t("contact.title")}
            </h2>
            <p className="text-sm md:text-lg text-lightGray mb-4 md:mb-6">
              {t("contact.text")}
            </p>
            <div className="space-y-2 text-sm md:text-base text-lightGray mb-4 md:mb-6">
              <p>
                <strong>{t("contact.labels.email")}</strong>{" "}
                <a
                  href="mailto:info@beafox.app"
                  className="text-primaryOrange hover:underline break-all"
                >
                  info@beafox.app
                </a>
              </p>
              <p>
                <strong>{t("contact.labels.phone")}</strong>{" "}
                <a
                  href="tel:+491782723673"
                  className="text-primaryOrange hover:underline"
                >
                  +49 178 2723 673
                </a>
              </p>
            </div>
            <a
              href="/kontakt"
              className="inline-flex items-center gap-2 bg-primaryOrange hover:bg-primaryOrange/90 text-primaryWhite px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t("contact.cta")}
            </a>
          </motion.div>
        </div>
      </Section>

      {/* Last Updated Section */}
      <Section className="bg-white py-6 md:py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs md:text-sm text-lightGray">
            {t("lastUpdated.stand")}
          </p>
          <p className="text-xs md:text-sm text-lightGray mt-2">
            {t("lastUpdated.notice")}
          </p>
        </div>
      </Section>
    </>
  );
}

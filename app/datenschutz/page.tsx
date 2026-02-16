"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Mail,
  Cookie,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Info,
  Server,
  Smartphone,
  CreditCard,
  Bell,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

type ContentItem = {
  subtitle?: string;
  text?: string;
  list?: string[];
  details?: string[];
};

type Section = {
  id: number;
  title: string;
  content: ContentItem[];
};

const SECTION_ICONS: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Info,
  2: Eye,
  3: Lock,
  4: Server,
  5: Cookie,
  6: Mail,
  7: Mail,
  8: Smartphone,
  9: FileText,
  10: CreditCard,
  11: Bell,
  12: ExternalLink,
  13: FileText,
  14: Lock,
  15: AlertCircle,
  16: Users,
};

export default function DatenschutzPage() {
  const t = useTranslations("privacy");
  const sectionsRaw = (t.raw("sections") as Section[]) ?? [];
  const sections = sectionsRaw.map((s) => ({
    ...s,
    icon: SECTION_ICONS[s.id] ?? FileText,
  }));

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
              <Shield className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">{t("hero.badge")}</span>
              <Shield className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-darkerGray mb-4 md:mb-6"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl text-lightGray max-w-2xl mx-auto"
          >
            {t("hero.description")}
          </motion.p>
        </div>
      </Section>

      {/* Content Sections */}
      <Section className="bg-white py-6 md:py-16 lg:py-20 pt-0 md:pt-0 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6 md:space-y-12">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
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
                        {"subtitle" in item && item.subtitle && (
                          <h3 className="text-lg md:text-xl font-semibold text-darkerGray">
                            {item.subtitle}
                          </h3>
                        )}
                        {"text" in item && item.text && (
                          <p className="text-sm md:text-base text-lightGray leading-relaxed">
                            {item.text}
                          </p>
                        )}
                        {"list" in item && item.list && (
                          <ul className="space-y-2 ml-4">
                            {item.list.map(
                              (listItem: string, listIndex: number) => (
                                <li
                                  key={listIndex}
                                  className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-lightGray"
                                >
                                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                                  <span>{listItem}</span>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                        {"details" in item && item.details && (
                          <div className="bg-white rounded-lg p-3 md:p-4 border border-primaryOrange/20">
                            {item.details.map(
                              (detail: string, detailIndex: number) => (
                                <p
                                  key={detailIndex}
                                  className={`text-sm md:text-base text-lightGray ${
                                    detail === "" ? "mb-2" : "mb-1 last:mb-0"
                                  }`}
                                >
                                  {detail}
                                </p>
                              )
                            )}
                          </div>
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
            <Mail className="w-10 h-10 md:w-16 md:h-16 text-primaryOrange mx-auto mb-3 md:mb-4" />
            <h2 className="text-xl md:text-3xl font-bold text-darkerGray mb-3 md:mb-4">
              {t("contact.title")}
            </h2>
            <p className="text-sm md:text-lg text-lightGray mb-4 md:mb-6">
              {t("contact.description")}
            </p>
            <div className="space-y-2 text-sm md:text-base text-lightGray mb-4 md:mb-6">
              <p>
                <strong>{t("contact.emailLabel")}</strong>{" "}
                <a
                  href="mailto:info@beafox.app"
                  className="text-primaryOrange hover:underline break-all"
                >
                  info@beafox.app
                </a>
              </p>
              <p>
                <strong>{t("contact.phoneLabel")}</strong>{" "}
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
            {t("lastUpdated.date")}
          </p>
          <p className="text-xs md:text-sm text-lightGray mt-2">
            {t("lastUpdated.note")}
          </p>
        </div>
      </Section>
    </>
  );
}

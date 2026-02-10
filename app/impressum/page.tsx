"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import {
  FileText,
  Building2,
  Mail,
  Phone,
  MapPin,
  Scale,
  Shield,
  AlertCircle,
  Copyright,
  ExternalLink,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function ImpressumPage() {
  const t = useTranslations("imprint");

  const iconById: Record<number, any> = {
    1: Building2,
    2: Mail,
    3: Scale,
    4: FileText,
    5: FileText,
    6: Shield,
    7: AlertCircle,
  };

  const sections = t.raw("sections") as {
    id: number;
    title: string;
    content: Array<
      | { subtitle?: string; text?: string; details?: string[]; link?: { text: string; href: string } }
    >;
  }[];

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
            {t("hero.subtitle")}
          </motion.p>
        </div>
      </Section>

      {/* Content Sections */}
      <Section className="bg-white py-6 md:py-16 lg:py-20 pt-0 md:pt-0 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6 md:space-y-12">
            {sections.map((section, index) => {
              const IconComponent = iconById[section.id] ?? FileText;
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
                      {section.title}
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
                        {"details" in item && item.details && (
                          <div className="bg-white rounded-lg p-3 md:p-4 border border-primaryOrange/20">
                            {item.details.map(
                              (detail: string, detailIndex: number) => (
                                <p
                                  key={detailIndex}
                                  className="text-sm md:text-base text-lightGray mb-1 last:mb-0"
                                >
                                  {detail}
                                </p>
                              )
                            )}
                          </div>
                        )}
                        {"link" in item && item.link && (
                          <p className="text-sm md:text-base text-lightGray leading-relaxed">
                            <a
                              href={item.link.href}
                              className="text-primaryOrange hover:underline inline-flex items-center gap-1"
                            >
                              {item.link.text}
                              <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                            </a>
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
            className="bg-white rounded-2xl p-4 md:p-8 border-2 border-primaryOrange/20"
          >
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primaryOrange/10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-primaryOrange/20">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-primaryOrange" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-darkerGray mb-1 md:mb-2">
                    Telefon
                  </h3>
                  <a
                    href="tel:+491782723673"
                    className="text-sm md:text-base text-lightGray hover:text-primaryOrange transition-colors break-all"
                  >
                    +49 178 2723 673
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primaryOrange/10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-primaryOrange/20">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-primaryOrange" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-darkerGray mb-1 md:mb-2">
                    E-Mail
                  </h3>
                  <a
                    href="mailto:info@beafox.app"
                    className="text-sm md:text-base text-lightGray hover:text-primaryOrange transition-colors break-all"
                  >
                    info@beafox.app
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4 md:col-span-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primaryOrange/10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-primaryOrange/20">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primaryOrange" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-darkerGray mb-1 md:mb-2">
                    Adresse
                  </h3>
                  <p className="text-sm md:text-base text-lightGray">
                    BeAFox UG (haftungsbeschränkt)
                    <br />
                    Siemensweg 2
                    <br />
                    93073 Neutraubling
                    <br />
                    Deutschland
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Copyright Section */}
      <Section className="bg-white py-6 md:py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-2 text-lightGray mb-2">
            <Copyright className="w-10 h-10 md:w-5 md:h-5" />
            <p className="text-xs md:text-sm">
              {new Date().getFullYear()} BeAFox UG (haftungsbeschränkt). Alle
              Rechte vorbehalten. Alle Inhalte dieser Website unterliegen dem
              deutschen Urheberrecht.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

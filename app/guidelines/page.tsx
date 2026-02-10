"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import {
  Shield,
  Heart,
  Users,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function GuidelinesPage() {
  const t = useTranslations("guidelines");

  const iconById: Record<number, any> = {
    1: Heart,
    2: MessageSquare,
    3: Shield,
    4: CheckCircle2,
    5: Users,
    6: AlertTriangle,
  };

  const guidelines = t.raw("items") as {
    id: number;
    title: string;
    description: string;
    rules: string[];
  }[];

  const violations = t.raw("violations") as {
    title: string;
    description: string;
    actions: string[];
  };

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-primaryWhite pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6">
              <Shield className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">{t("hero.badge")}</span>
              <Shield className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-darkerGray mb-6"
          >
            {t("hero.title.pre")}{" "}
            <span className="text-primaryOrange">{t("hero.title.highlight")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-lightGray max-w-2xl mx-auto"
          >
            {t("hero.description")}
          </motion.p>
        </div>
      </Section>

      {/* Guidelines Section */}
      <Section className="bg-white py-8 md:py-16 lg:py-20 pt-0 md:pt-0 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-12">
            {guidelines.map((guideline, index) => {
              const IconComponent = iconById[guideline.id] ?? Shield;
              return (
                <motion.div
                  key={guideline.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-primaryWhite rounded-2xl p-6 md:p-8 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all"
                >
                  <div className="flex items-start gap-4 md:gap-6 mb-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-primaryOrange/10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-primaryOrange/20">
                      <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-primaryOrange" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-darkerGray mb-2">
                        {guideline.title}
                      </h2>
                      <p className="text-lightGray text-base md:text-lg mb-4">
                        {guideline.description}
                      </p>
                      <ul className="space-y-2">
                        {guideline.rules.map((rule, ruleIndex) => (
                          <li
                            key={ruleIndex}
                            className="flex items-start gap-3 text-lightGray"
                          >
                            <CheckCircle2 className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                            <span className="text-sm md:text-base">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Violations Section */}
      <Section className="bg-primaryWhite">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-6 md:p-8 border-2 border-red-200"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-red-200">
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-darkerGray mb-2">
                  {violations.title}
                </h2>
                <p className="text-lightGray text-base md:text-lg mb-4">
                  {violations.description}
                </p>
                <ul className="space-y-2">
                  {violations.actions.map((action, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-lightGray"
                    >
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section className="bg-white py-8 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-primaryOrange/10 rounded-2xl p-6 md:p-8 border-2 border-primaryOrange/20"
          >
            <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-primaryOrange mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-darkerGray mb-4">
              {t("contact.title")}
            </h2>
            <p className="text-lightGray text-base md:text-lg mb-6">
              {t("contact.text")}
            </p>
            <a
              href="/kontakt"
              className="inline-flex items-center gap-2 bg-primaryOrange hover:bg-primaryOrange/90 text-primaryWhite px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t("contact.cta")}
              <Sparkles className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </Section>
    </>
  );
}

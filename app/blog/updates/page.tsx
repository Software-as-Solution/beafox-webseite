"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import { PawPrint, Calendar, Sparkles, CheckCircle2 } from "lucide-react";

export default function AppUpdatesPage() {
  const updates = [
    {
      id: 1,
      version: "v2.1.0",
      date: "Dezember 2024",
      title: "Neue Features & Verbesserungen",
      description:
        "Wir haben die App mit neuen Features ausgestattet und die Performance verbessert. Die Lernpfade sind jetzt noch intuitiver und die Statistiken geben dir einen besseren Überblick über deinen Fortschritt.",
      features: [
        "Neue Lernpfade für erweiterte Finanzthemen",
        "Verbesserte Statistiken und Fortschrittsanzeige",
        "Performance-Optimierungen für schnellere Ladezeiten",
        "Bug-Fixes und Stabilitätsverbesserungen",
      ],
      type: "feature",
    },
    {
      id: 2,
      version: "v2.0.0",
      date: "November 2024",
      title: "Großes Update: Neues Design & Features",
      description:
        "Das größte Update seit dem Launch! Wir haben die App komplett überarbeitet mit einem modernen Design, neuen Features und verbesserter Benutzerfreundlichkeit.",
      features: [
        "Komplett neues, modernes Design",
        "Neue Gamification-Elemente",
        "Verbesserte Ranglisten und Challenges",
        "Neue Lernmodule zu Investitionen",
        "Optimierte Benutzeroberfläche",
      ],
      type: "major",
    },
    {
      id: 3,
      version: "v1.5.2",
      date: "Oktober 2024",
      title: "Stabilität & Bug-Fixes",
      description:
        "Dieses Update konzentriert sich auf Stabilität und die Behebung von Fehlern, um die App noch zuverlässiger zu machen.",
      features: [
        "Verschiedene Bug-Fixes",
        "Verbesserte App-Stabilität",
        "Kleinere UI-Verbesserungen",
        "Performance-Optimierungen",
      ],
      type: "patch",
    },
    {
      id: 4,
      version: "v1.5.0",
      date: "September 2024",
      title: "Neue Lernmodule & Verbesserungen",
      description:
        "Wir haben neue Lernmodule hinzugefügt und bestehende Features verbessert, um das Lernen noch effektiver zu gestalten.",
      features: [
        "Neue Lernmodule zu Versicherungen",
        "Erweiterte Quiz-Funktionen",
        "Verbesserte Karteikarten",
        "Neue Missionen und Challenges",
      ],
      type: "feature",
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-primaryOrange text-primaryWhite";
      case "feature":
        return "bg-blue-500 text-white";
      case "patch":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "major":
        return "Major Update";
      case "feature":
        return "Neue Features";
      case "patch":
        return "Bug-Fixes";
      default:
        return "Update";
    }
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
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">App-Updates</span>
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-darkerGray mb-6"
          >
            Bleib auf dem{" "}
            <span className="text-primaryOrange">neuesten Stand</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-lightGray max-w-2xl mx-auto"
          >
            Hier findest du alle Updates, neue Features und Verbesserungen der
            BeAFox App. Wir arbeiten kontinuierlich daran, die App besser zu
            machen.
          </motion.p>
        </div>
      </Section>

      {/* Updates Section */}
      <Section className="bg-white py-8 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            {updates.map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border-2 border-primaryOrange rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${getTypeColor(
                          update.type
                        )}`}
                      >
                        {getTypeLabel(update.type)}
                      </span>
                      <span className="text-lg md:text-xl font-bold text-darkerGray">
                        {update.version}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-lightGray text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{update.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-darkerGray mb-4">
                    {update.title}
                  </h3>

                  {/* Description */}
                  <p className="text-lightGray text-base md:text-lg leading-relaxed mb-6">
                    {update.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-darkerGray text-sm md:text-base">
                      Was ist neu:
                    </h4>
                    <ul className="space-y-2">
                      {update.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-3 text-lightGray text-sm md:text-base"
                        >
                          <CheckCircle2 className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

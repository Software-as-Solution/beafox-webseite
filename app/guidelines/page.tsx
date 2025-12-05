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

export default function GuidelinesPage() {
  const guidelines = [
    {
      id: 1,
      title: "Respektvolles Verhalten",
      icon: Heart,
      description:
        "Behandle alle Mitglieder der BeAFox-Community mit Respekt und Freundlichkeit.",
      rules: [
        "Sei respektvoll und höflich in allen Interaktionen",
        "Vermeide beleidigende, diskriminierende oder herabsetzende Sprache",
        "Respektiere unterschiedliche Meinungen und Erfahrungen",
        "Hilf anderen beim Lernen, anstatt sie zu kritisieren",
        "Feiere Erfolge anderer und ermutige sie in ihrem Lernprozess",
      ],
    },
    {
      id: 2,
      title: "Konstruktive Kommunikation",
      icon: MessageSquare,
      description:
        "Teile dein Wissen konstruktiv und hilf anderen beim Lernen.",
      rules: [
        "Stelle Fragen, wenn du etwas nicht verstehst",
        "Teile deine Erfahrungen und Tipps mit der Community",
        "Gib konstruktives Feedback, das anderen hilft",
        "Vermeide Spam, Werbung oder unerwünschte Inhalte",
        "Halte Diskussionen sachlich und themenbezogen",
      ],
    },
    {
      id: 3,
      title: "Sicherheit und Privatsphäre",
      icon: Shield,
      description:
        "Schütze deine persönlichen Daten und die der anderen Nutzer.",
      rules: [
        "Teile keine persönlichen Finanzdaten oder Kontoinformationen",
        "Gib keine Passwörter oder Zugangsdaten weiter",
        "Respektiere die Privatsphäre anderer Nutzer",
        "Melde verdächtige Aktivitäten oder Inhalte",
        "Verwende starke Passwörter für dein Konto",
      ],
    },
    {
      id: 4,
      title: "Ehrlichkeit und Integrität",
      icon: CheckCircle2,
      description: "Sei ehrlich in deinen Interaktionen und beim Lernen.",
      rules: [
        "Nutze keine Betrugsmethoden oder Cheats",
        "Gib keine falschen Informationen weiter",
        "Respektiere die Lernfortschritte anderer",
        "Teile nur Informationen, die du selbst verstehst",
        "Gib Quellen an, wenn du Informationen teilst",
      ],
    },
    {
      id: 5,
      title: "Altersgerechte Inhalte",
      icon: Users,
      description:
        "BeAFox richtet sich an junge Menschen – halte Inhalte altersgerecht.",
      rules: [
        "Verwende eine angemessene Sprache für alle Altersgruppen",
        "Vermeide unangemessene oder anstößige Inhalte",
        "Respektiere, dass viele Nutzer noch minderjährig sind",
        "Halte Diskussionen bildungsorientiert und konstruktiv",
        "Melde unangemessene Inhalte sofort",
      ],
    },
    {
      id: 6,
      title: "Keine Finanzberatung",
      icon: AlertTriangle,
      description:
        "BeAFox vermittelt Wissen, aber keine individuelle Finanzberatung.",
      rules: [
        "BeAFox ist eine Lernplattform, keine Finanzberatung",
        "Gib keine konkreten Anlageempfehlungen",
        "Verweise auf professionelle Beratung bei komplexen Fragen",
        "Teile Wissen, aber keine persönlichen Finanzentscheidungen",
        "Erinnere andere daran, dass individuelle Beratung wichtig ist",
      ],
    },
  ];

  const violations = [
    {
      title: "Verstöße gegen die Richtlinien",
      description:
        "Bei Verstößen gegen unsere Community-Richtlinien behalten wir uns vor, Maßnahmen zu ergreifen:",
      actions: [
        "Warnung und Aufforderung zur Änderung des Verhaltens",
        "Temporäre Sperrung des Kontos",
        "Permanente Sperrung bei schwerwiegenden Verstößen",
        "Löschung unangemessener Inhalte",
        "Meldung an die zuständigen Behörden bei illegalen Aktivitäten",
      ],
    },
  ];

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
              <span className="font-bold">Community-Richtlinien</span>
              <Shield className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-darkerGray mb-6"
          >
            Unsere{" "}
            <span className="text-primaryOrange">Community-Richtlinien</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-lightGray max-w-2xl mx-auto"
          >
            BeAFox ist eine Community, in der junge Menschen gemeinsam
            Finanzwissen erwerben. Diese Richtlinien helfen uns, eine sichere,
            respektvolle und lernförderliche Umgebung zu schaffen.
          </motion.p>
        </div>
      </Section>

      {/* Guidelines Section */}
      <Section className="bg-white py-8 md:py-16 lg:py-20 pt-0 md:pt-0 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-12">
            {guidelines.map((guideline, index) => {
              const IconComponent = guideline.icon;
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
                  {violations[0].title}
                </h2>
                <p className="text-lightGray text-base md:text-lg mb-4">
                  {violations[0].description}
                </p>
                <ul className="space-y-2">
                  {violations[0].actions.map((action, index) => (
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
              Fragen zu unseren Richtlinien?
            </h2>
            <p className="text-lightGray text-base md:text-lg mb-6">
              Wenn du Fragen zu unseren Community-Richtlinien hast oder einen
              Verstoß melden möchtest, kontaktiere uns gerne.
            </p>
            <a
              href="/kontakt"
              className="inline-flex items-center gap-2 bg-primaryOrange hover:bg-primaryOrange/90 text-primaryWhite px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Kontakt aufnehmen
              <Sparkles className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </Section>
    </>
  );
}

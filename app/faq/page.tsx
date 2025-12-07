"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import {
  ChevronDown,
  MessageCircle,
  Search,
  Sparkles,
  HelpCircle,
  Tag,
  School,
  Briefcase,
  Smartphone,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
  Infinity,
  Mail,
} from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  popular?: boolean;
}

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [openPopularId, setOpenPopularId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Alle");

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "Gibt es Belohnungen oder Fortschrittsanzeigen?",
      answer:
        "Ja! Du kannst Punkte sammeln, Missionen abschließen und deinen Fortschritt jederzeit verfolgen – so macht Lernen Spaß. Das gamifizierte System motiviert dich, kontinuierlich zu lernen und deine Finanzkompetenz zu steigern.",
      category: "Allgemein",
      popular: true,
    },
    {
      id: 2,
      question: "Wie viel kostet BeAFox für Bildungseinrichtungen?",
      answer:
        "Um Finanzbildung für alle Schüler*innen zugänglich zu machen, bieten wir Schulen faire, gestaffelte Preise an. Für Schulen beträgt der Preis 1€ pro Schüler pro Jahr. Für Unternehmen bieten wir ab 10 Lizenzen gestaffelte Preise ab 3,99€ pro Monat. Kontaktieren Sie uns für ein individuelles Angebot.",
      category: "Preise",
      popular: true,
    },
    {
      id: 3,
      question: "Gibt es einen Lehrer bzw. Admin-Zugang?",
      answer:
        "Ja, für Lehrkräfte, Ausbilder*innen und Admins bieten wir ein umfassendes Dashboard an, über das Schüler-Accounts erstellt, Klassen verwaltet und der Lernfortschritt der Teilnehmenden detailliert eingesehen werden können. Das Dashboard bietet auch Analysen und Reports.",
      category: "Schulen & Business",
      popular: true,
    },
    {
      id: 4,
      question: "Ist BeAFox wirklich unabhängig und neutral?",
      answer:
        "Ja, absolut! Wir fokussieren uns auf die reine Wissensvermittlung. In der App werden keine Finanzprodukte beworben, sodass sich die Inhalte ehrlich und vertrauensvoll anfühlen. Unsere Mission ist es, echte Finanzbildung zu vermitteln, nicht Produkte zu verkaufen.",
      category: "Allgemein",
      popular: true,
    },
    {
      id: 5,
      question: "Wie funktioniert das spielerische System?",
      answer:
        "Durch ein spielerisches System mit Punkten, Missionen, Belohnungen und Ranglisten fühlt sich lernen nicht mehr wie eine lästige Pflicht an. Die Schüler bleiben motiviert und lernen nachhaltig. Du kannst Level aufsteigen, Achievements freischalten und dich mit anderen messen.",
      category: "Allgemein",
    },
    {
      id: 6,
      question: "Kann ich BeAFox auch als Privatperson nutzen?",
      answer:
        "Ja! BeAFox steht auch Privatpersonen zur Verfügung. Du erhältst vollen Zugriff auf alle Lektionen und kannst in deinem eigenen Tempo lernen. Wir bieten verschiedene Abo-Modelle: Monatlich (4,99€), Jahresabo (3,99€/Monat) oder Lifetime (49,99€ einmalig).",
      category: "Preise",
    },
    {
      id: 7,
      question: "Wie wissenschaftlich fundiert ist BeAFox?",
      answer:
        "Wir verwenden wissenschaftlich fundierte Lehrmethoden, um Lektionen zu erstellen, die erfolgreich dein Finanzwissen verbessern. Unser Forschungsprojekt mit über 500 Teilnehmern hat gezeigt, dass unsere Methoden funktionieren. Die Inhalte werden von Finanzexperten und Pädagogen entwickelt.",
      category: "Allgemein",
    },
    {
      id: 8,
      question:
        "Was ist der Unterschied zwischen BeAFox for Schools und BeAFox for Business?",
      answer:
        "BeAFox for Schools richtet sich an Bildungseinrichtungen und bietet ein Monitoring-Dashboard für Lehrer. BeAFox for Business richtet sich an Ausbildungsbetriebe und beinhaltet zusätzlich regelmäßige Workshops (alle 6 Monate), offizielle Zertifikate und erweiterte Reporting-Funktionen.",
      category: "Schulen & Business",
    },
    {
      id: 9,
      question: "Kann ich BeAFox vor dem Kauf testen?",
      answer:
        "Ja, wir bieten gerne eine kostenlose Testphase an. Kontaktieren Sie uns für weitere Informationen und eine Demo-Version. Schulen können ein Pilotprojekt starten, um BeAFox unverbindlich zu testen.",
      category: "Preise",
    },
    {
      id: 10,
      question: "Wie oft werden neue Inhalte hinzugefügt?",
      answer:
        "Wir arbeiten kontinuierlich an neuen Lektionen und Features. Alle Nutzer erhalten regelmäßige Updates mit neuen Inhalten und Verbesserungen. Unser Ziel ist es, monatlich neue Lektionen und vierteljährlich größere Feature-Updates zu veröffentlichen.",
      category: "Allgemein",
    },
    {
      id: 11,
      question: "Gibt es Support, wenn ich Fragen habe?",
      answer:
        "Ja, unser Support ist rund um die Uhr für dich da und beantwortet deine Anliegen so schnell und hilfreich wie möglich. Kontaktiere uns jederzeit über E-Mail, das Kontaktformular oder direkt in der App!",
      category: "Support",
    },
    {
      id: 12,
      question: "Funktioniert BeAFox auf allen Geräten?",
      answer:
        "BeAFox ist als App für iOS und Android verfügbar. Das Monitoring-Dashboard für Lehrer und Ausbilder funktioniert im Browser auf allen Geräten (Desktop, Tablet, Smartphone). Die App synchronisiert deinen Fortschritt automatisch zwischen allen Geräten.",
      category: "Technik",
    },
    {
      id: 13,
      question: "Wie sicher sind meine Daten?",
      answer:
        "Datenschutz und Sicherheit haben für uns höchste Priorität. Wir verwenden moderne Verschlüsselungstechnologien und halten uns strikt an die DSGVO. Deine Daten werden sicher gespeichert und niemals an Dritte weitergegeben.",
      category: "Technik",
    },
    {
      id: 14,
      question: "Kann ich meine Fortschritte exportieren?",
      answer:
        "Ja, du kannst deine Fortschritte und Zertifikate jederzeit exportieren. Für Schulen und Unternehmen bieten wir auch detaillierte Reports und Analysen als PDF oder Excel-Export an.",
      category: "Schulen & Business",
    },
    {
      id: 15,
      question: "Gibt es Workshops oder Schulungen?",
      answer:
        "Ja! Wir bieten interaktive Finanzbildungs-Workshops für Schulen, Unternehmen und Vereine an. Die Workshops können vor Ort oder online durchgeführt werden und werden von erfahrenen Referenten geleitet. Kontaktieren Sie uns für weitere Informationen.",
      category: "Schulen & Business",
    },
    {
      id: 16,
      question: "Was ist im Preis enthalten?",
      answer:
        "Der Preis beinhaltet den vollständigen Zugang zur App, alle Lernmodule, Monitoring-Dashboards (für Schulen/Unternehmen), Support und regelmäßige Updates. Bei Business-Paketen sind auch Workshops und Zertifikate enthalten.",
      category: "Preise",
    },
    {
      id: 17,
      question: "Kann ich jederzeit kündigen?",
      answer:
        "Bei Privatpersonen: Das monatliche Abo kann jederzeit gekündigt werden. Jahresabos laufen über die vereinbarte Laufzeit. Für Schulen und Unternehmen gelten individuelle Vereinbarungen, die flexibel gestaltet werden können.",
      category: "Preise",
    },
    {
      id: 18,
      question: "Gibt es Rabatte für mehrere Klassen oder Standorte?",
      answer:
        "Ja, wir bieten gestaffelte Preise für größere Institutionen. Je mehr Schüler oder Mitarbeiter, desto günstiger wird der Preis pro Person. Kontaktieren Sie uns für ein individuelles Angebot, das perfekt auf Ihre Bedürfnisse zugeschnitten ist.",
      category: "Preise",
    },
  ];

  const categories = [
    "Alle",
    "Allgemein",
    "Preise",
    "Schulen & Business",
    "Technik",
    "Support",
  ];

  const filteredFAQs = useMemo(() => {
    let filtered = faqs;

    if (selectedCategory !== "Alle") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const popularFAQs = faqs.filter((faq) => faq.popular);

  return (
    <>
      {/* Hero */}
      <Section className="bg-primaryWhite pt-14 md:pt-16 lg:pt-20 mt-12">
        <div className="text-center mb-6 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h1 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              FAQ's
            </h1>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4"
          >
            Häufige Fragen zu <span className="text-primaryOrange">BeAFox</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl text-lightGray max-w-3xl mx-auto"
          >
            Unser Support ist rund um die Uhr für dich da und beantwortet deine
            Anliegen so schnell und hilfreich wie möglich.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-lightGray" />
            <input
              type="text"
              placeholder="Suche nach Fragen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-primaryOrange/20 focus:border-primaryOrange focus:outline-none text-darkerGray placeholder-lightGray"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-primaryOrange text-primaryWhite border-2 border-primaryOrange"
                    : "bg-white text-darkerGray border-2 border-primaryOrange/20 hover:border-primaryOrange/40"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Popular FAQs */}
      {selectedCategory === "Alle" && searchQuery === "" && (
        <Section className="bg-white py-0 md:py-2 lg:py-2 relative bottom-2 pt-0 md:pt-6 lg:pt-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-darkerGray mb-2">
                Häufigste Fragen
              </h3>
              <p className="text-lightGray">
                Die am häufigsten gestellten Fragen
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {popularFAQs.slice(0, 4).map((faq, index) => {
                const isOpen = openPopularId === faq.id;
                const handleToggle = (e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isOpen) {
                    setOpenPopularId(null);
                  } else {
                    setOpenPopularId(faq.id);
                  }
                };
                return (
                  <motion.div
                    key={`popular-${faq.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 rounded-xl p-5 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all"
                  >
                    <button
                      type="button"
                      onClick={handleToggle}
                      className="w-full text-left cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-primaryOrange" />
                            <span className="text-xs font-semibold text-primaryOrange">
                              Beliebt
                            </span>
                          </div>
                          <h4 className="font-semibold text-darkerGray mb-2">
                            {faq.question}
                          </h4>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.p
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-sm text-lightGray mt-2 overflow-hidden"
                              >
                                {faq.answer}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-primaryOrange flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>
      )}

      {/* FAQ Items */}
      <Section className="bg-primaryWhite py-4 md:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => {
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-xl overflow-hidden border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all shadow-sm"
                  >
                    <button
                      onClick={() =>
                        setOpenId(openId === faq.id ? null : faq.id)
                      }
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-primaryOrange/5 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <HelpCircle className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                        <span className="font-semibold text-darkerGray pr-4 text-left">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-primaryOrange flex-shrink-0 transition-transform ${
                          openId === faq.id ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openId === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 py-4 text-lightGray border-t border-primaryOrange/20 bg-primaryOrange/5">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <HelpCircle className="w-16 h-16 text-primaryOrange/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-darkerGray mb-2">
                Keine Ergebnisse gefunden
              </h3>
              <p className="text-lightGray mb-6">
                Versuche es mit anderen Suchbegriffen oder kontaktiere uns
                direkt.
              </p>
              <Button href="/kontakt" variant="primary">
                Kontakt aufnehmen
              </Button>
            </motion.div>
          )}
        </div>
      </Section>

      {/* Quick Links */}
      <Section className="bg-white py-8 md:py-12 lg:py-16 pt-6 md:pt-0 lg:pt-0">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-darkerGray mb-0 lg:mb-4">
              Weitere hilfreiche Links
            </h3>
            <p className="text-lightGray">
              Schnellzugriff auf wichtige Informationen
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Briefcase,
                title: "BeAFox for Business",
                description: "BeAFox for Business im Detail",
                href: "/fuer-unternehmen",
                color: "bg-primaryOrange/10 text-primaryOrange",
              },
              {
                icon: Infinity,
                title: "BeAFox Unlimited",
                description: "Unbegrenztes Lernen für Privatpersonen",
                href: "/beafox-unlimited",
                color: "bg-primaryOrange/10 text-primaryOrange",
              },
              {
                icon: School,
                title: "Für Schulen",
                description: "Alles über BeAFox for Schools",
                href: "/fuer-schulen",
                color: "bg-primaryOrange/10 text-primaryOrange",
              },
              {
                icon: Mail,
                title: "Kontakt",
                description: "Kontaktiere uns für Fragen",
                href: "/kontakt",
                color: "bg-primaryOrange/10 text-primaryOrange",
              },
            ].map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all shadow-sm group h-full flex flex-col"
              >
                <div
                  className={`${link.color} rounded-lg p-3 w-fit mb-4 group-hover:scale-110 transition-transform`}
                >
                  <link.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-darkerGray mb-2">
                  {link.title}
                </h4>
                <p className="text-sm text-lightGray mb-3 flex-1">
                  {link.description}
                </p>
                <div className="flex items-center gap-2 text-primaryOrange text-sm font-semibold mt-auto">
                  Mehr erfahren
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact CTA */}
      <Section className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 py-8 md:py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <MessageCircle className="w-16 h-16 text-primaryWhite mx-auto mb-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primaryWhite"
          >
            Noch Fragen?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl mb-8 text-primaryWhite/90"
          >
            Wenn du weitere Fragen hast, die hier nicht beantwortet wurden,
            kontaktiere uns gerne. Wir helfen dir gerne weiter!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
          >
            <Button
              href="/kontakt"
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite"
            >
              Kontakt aufnehmen
            </Button>
          </motion.div>
        </div>
      </Section>
    </>
  );
}

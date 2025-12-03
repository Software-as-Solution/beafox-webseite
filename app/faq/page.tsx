"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import { ChevronDown, MessageCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "Gibt es Belohnungen oder Fortschrittsanzeigen?",
      answer: "Ja! Du kannst Punkte sammeln, Missionen abschließen und deinen Fortschritt jederzeit verfolgen – so macht Lernen Spaß.",
    },
    {
      question: "Wie viel kostet BeAFox für Bildungseinrichtungen?",
      answer: "Um Finanzbildung für alle Schüler*innen zugänglich zu machen, bieten wir Schulen und Unternehmen faire, gestaffelte Preise an. Kontaktieren Sie uns für ein individuelles Angebot.",
    },
    {
      question: "Gibt es einen Lehrer bzw. Admin-Zugang?",
      answer: "Ja, für Lehrkräfte, Ausbilder*innen und Admins bieten wir ein Dashboard an, über das Schüler-Accounts erstellt, Klassen verwaltet und der Lernfortschritt der Teilnehmenden eingesehen werden können.",
    },
    {
      question: "Ist BeAFox wirklich unabhängig und neutral?",
      answer: "Ja, absolut! Wir fokussieren uns auf die reine Wissensvermittlung. In der App werden keine Finanzprodukte beworben, sodass sich die Inhalte ehrlich und vertrauensvoll anfühlen.",
    },
    {
      question: "Wie funktioniert das spielerische System?",
      answer: "Durch ein spielerisches System mit Punkten, Missionen und Belohnungen fühlt sich lernen nicht mehr wie eine lästige Pflicht an. Die Schüler bleiben motiviert und lernen nachhaltig.",
    },
    {
      question: "Kann ich BeAFox auch als Privatperson nutzen?",
      answer: "Ja! BeAFox steht auch Privatpersonen zur Verfügung. Du erhältst vollen Zugriff auf alle Lektionen und kannst in deinem eigenen Tempo lernen.",
    },
    {
      question: "Wie wissenschaftlich fundiert ist BeAFox?",
      answer: "Wir verwenden wissenschaftlich fundierte Lehrmethoden, um Lektionen zu erstellen, die erfolgreich dein Finanzwissen verbessern. Unser Forschungsprojekt mit über 500 Teilnehmern hat gezeigt, dass unsere Methoden funktionieren.",
    },
    {
      question: "Was ist der Unterschied zwischen BeAFox for Schools und BeAFox for Business?",
      answer: "BeAFox for Schools richtet sich an Bildungseinrichtungen und bietet ein Monitoring-Dashboard für Lehrer. BeAFox for Business richtet sich an Ausbildungsbetriebe und beinhaltet zusätzlich regelmäßige Workshops (alle 6 Monate) und offizielle Zertifikate.",
    },
    {
      question: "Kann ich BeAFox vor dem Kauf testen?",
      answer: "Ja, wir bieten gerne eine kostenlose Testphase an. Kontaktieren Sie uns für weitere Informationen und eine Demo-Version.",
    },
    {
      question: "Wie oft werden neue Inhalte hinzugefügt?",
      answer: "Wir arbeiten kontinuierlich an neuen Lektionen und Features. Alle Nutzer erhalten regelmäßige Updates mit neuen Inhalten und Verbesserungen.",
    },
    {
      question: "Gibt es Support, wenn ich Fragen habe?",
      answer: "Ja, unser Support ist rund um die Uhr für dich da und beantwortet deine Anliegen so schnell und hilfreich wie möglich. Kontaktiere uns jederzeit!",
    },
    {
      question: "Funktioniert BeAFox auf allen Geräten?",
      answer: "BeAFox ist als App für iOS und Android verfügbar. Das Monitoring-Dashboard für Lehrer und Ausbilder funktioniert im Browser auf allen Geräten.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 via-primaryWhite to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-darkerGray mb-6">
              FAQ's
            </h1>
            <p className="text-xl text-lightGray mb-8">
              Häufige Fragen zu BeAFox
            </p>
            <p className="text-lg text-lightGray">
              Du hast Fragen? Schreib uns jederzeit! Unser Support ist rund um die Uhr für dich da 
              und beantwortet deine Anliegen so schnell und hilfreich wie möglich.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Items */}
      <Section className="bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-primaryWhite rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-darkerGray pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-primaryOrange flex-shrink-0 transition-transform ${
                      openIndex === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 text-lightGray border-t border-gray-300">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact CTA */}
      <Section className="bg-primaryOrange text-darkerGray">
        <div className="text-center max-w-3xl mx-auto">
          <MessageCircle className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Noch Fragen?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Wenn du weitere Fragen hast, die hier nicht beantwortet wurden, kontaktiere uns gerne. 
            Wir helfen dir gerne weiter!
          </p>
          <Button href="/kontakt" variant="secondary">
            Kontakt aufnehmen
          </Button>
        </div>
      </Section>
    </>
  );
}


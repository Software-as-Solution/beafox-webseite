"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import { Check, School, Briefcase, Users } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      icon: School,
      title: "Für Schulen",
      description:
        "Finanzbildung als praxisnahes Extra außerhalb des Lehrplans",
      features: [
        "Spielerisches System",
        "Schritt für Schritt Lernpfad",
        "Unabhängige Finanzbildung",
        "Zeitersparnis für Lehrer",
        "Fortschrittstracking",
        "Didaktisch aufbereitet",
        "Monitoring-Dashboard",
        "Unbegrenzte Schüler",
      ],
      cta: "Angebot anfragen",
    },
    {
      icon: Briefcase,
      title: "Für Unternehmen",
      description: "Bildungspakete gegen Fachkräftemangel",
      features: [
        "Gezielte Workshops (alle 6 Monate)",
        "Monitoring Dashboards",
        "Offizielle Zertifikate",
        "Spielerische Lern-App",
        "Große PR-Aktion",
        "Motiviertere Azubis",
        "Unbegrenzte Azubis",
        "Persönlicher Ansprechpartner",
      ],
      cta: "Angebot anfragen",
      popular: true,
    },
    {
      icon: Users,
      title: "Für Privatpersonen",
      description: "Finanzwissen, dass dich persönlich weiterbringt",
      features: [
        "Vollzugriff auf alle Lektionen",
        "Spielerisches System",
        "Punkte & Belohnungen",
        "Missionen & Fortschritt",
        "Neutral & Unabhängig",
        "Wissenschaftlich fundiert",
        "Regelmäßige Updates",
        "Community Support",
      ],
      cta: "Jetzt starten",
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
              Preise & <span className="text-primaryOrange">Angebote</span>
            </h1>
            <p className="text-xl text-lightGray">
              Um Finanzbildung für alle zugänglich zu machen, bieten wir Schulen
              und Unternehmen faire, gestaffelte Preise an.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <Section className="bg-gray-50">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-gray-50 rounded-2xl shadow-lg p-8 ${
                plan.popular
                  ? "border-4 border-primaryOrange transform scale-105"
                  : "border border-gray-300"
              }`}
            >
              {plan.popular && (
                <div className="bg-primaryOrange text-darkerGray text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
                  Beliebteste Option
                </div>
              )}
              <plan.icon className="w-12 h-12 text-primaryOrange mb-4" />
              <h3 className="text-2xl font-bold text-darkerGray mb-2">
                {plan.title}
              </h3>
              <p className="text-lightGray mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                    <span className="text-darkerGray">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                href="/kontakt"
                variant={plan.popular ? "primary" : "outline"}
                className="w-full"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Info Section */}
      <Section className="bg-primaryWhite">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-6">
            Individuelle Angebote
          </h2>
          <p className="text-lg text-lightGray mb-8">
            Jede Schule und jedes Unternehmen hat unterschiedliche Bedürfnisse.
            Deshalb erstellen wir gerne ein individuelles Angebot, das perfekt
            auf Ihre Anforderungen zugeschnitten ist.
          </p>
          <p className="text-lg text-lightGray mb-8">
            Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch und
            erhalten Sie ein maßgeschneidertes Angebot.
          </p>
          <Button href="/kontakt" variant="primary">
            Kostenlose Beratung anfragen
          </Button>
        </div>
      </Section>

      {/* FAQ Preview */}
      <Section className="bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-8 text-center">
            Häufige Fragen zu den Preisen
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Gibt es Rabatte für mehrere Klassen oder Standorte?",
                a: "Ja, wir bieten gestaffelte Preise für größere Institutionen. Kontaktieren Sie uns für ein individuelles Angebot.",
              },
              {
                q: "Kann ich die App vor dem Kauf testen?",
                a: "Ja, wir bieten gerne eine kostenlose Testphase an. Kontaktieren Sie uns für weitere Informationen.",
              },
              {
                q: "Was ist im Preis enthalten?",
                a: "Der Preis beinhaltet den Zugang zur App, das Monitoring-Dashboard, Support und regelmäßige Updates.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-primaryWhite p-6 rounded-xl"
              >
                <h3 className="text-lg font-bold text-darkerGray mb-2">
                  {faq.q}
                </h3>
                <p className="text-lightGray">{faq.a}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button href="/faq" variant="outline">
              Alle FAQ's ansehen
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

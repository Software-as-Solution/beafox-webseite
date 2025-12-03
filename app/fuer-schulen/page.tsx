"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import { CheckCircle, Users, Clock, BarChart, BookOpen, Shield } from "lucide-react";

export default function ForSchoolsPage() {
  const features = [
    {
      icon: BookOpen,
      title: "Spielerisches System",
      description: "Durch ein spielerisches System fühlt sich lernen nicht mehr wie eine lästige Pflicht an.",
    },
    {
      icon: Users,
      title: "Schritt für Schritt Lernpfad",
      description: "Nutzer müssen nicht mehr selbst herausfinden, wo sie anfangen sollen oder weitermachen.",
    },
    {
      icon: Shield,
      title: "Unabhängige Finanzbildung",
      description: "Wir fokussieren uns auf die reine Wissensvermittlung. Ohne versteckte Verkaufsinteresse.",
    },
    {
      icon: Clock,
      title: "Zeitersparnis",
      description: "Schüler arbeiten selbstständig und interaktiv mit BeAFox – ganz ohne direkte Anwesenheit des Lehrers vor Ort.",
    },
    {
      icon: BarChart,
      title: "Fortschrittstracking",
      description: "Das integrierte Monitoring-Dashboard zeigt in Echtzeit, was jeder Schüler gerade lernt und wie er vorankommt.",
    },
    {
      icon: CheckCircle,
      title: "Didaktisch aufbereitet",
      description: "Durch wissenschaftlich fundierte Lehrmethoden erstellen wir Lektionen, die erfolgreich das Finanzwissen verbessern.",
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
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-darkerGray mb-6">
              BeAFox for Schools
            </h1>
            <p className="text-xl text-lightGray mb-8">
              Finanzbildung als praxisnahes Extra außerhalb des Lehrplans
            </p>
            <Button href="/kontakt" variant="primary">
              Pilotprojekt anfragen
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Problem Solution */}
      <Section className="bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-4">
              Finanzbildung als Ergänzung
            </h2>
            <h3 className="text-2xl font-semibold text-primaryOrange mb-6">
              Wir lösen das Problem von Unterrichtsausfall
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h4 className="text-xl font-bold text-darkerGray mb-4">Die Herausforderung</h4>
              <p className="text-lightGray mb-4 text-lg">
                Ein Lehrer betreut gleichzeitig mehrere Klassen oder Räume. Die Schüler benötigen 
                eine Möglichkeit, selbstständig zu lernen, auch wenn der Lehrer nicht direkt vor Ort ist.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h4 className="text-xl font-bold text-primaryOrange mb-4">Unsere Lösung</h4>
              <p className="text-lightGray mb-4 text-lg">
                Die Schüler arbeiten selbstständig und interaktiv mit <strong>BeAFox</strong> – ganz 
                ohne direkte Anwesenheit des Lehrers vor Ort.
              </p>
              <p className="text-lightGray text-lg">
                <strong>Für Lehrer & Schulleitung:</strong> Das integrierte <strong>Monitoring-Dashboard</strong> 
                zeigt in Echtzeit, was jeder Schüler gerade lernt, wo er steht und wie er vorankommt. 
                Schwächen werden sofort sichtbar und Fortschritte werden belohnt.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section className="bg-background">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-4">
            Alle Vorteile für Ihre Schule
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-50 p-6 rounded-xl shadow-lg"
            >
              <feature.icon className="w-12 h-12 text-primaryOrange mb-4" />
              <h3 className="text-xl font-bold text-darkerGray mb-3">{feature.title}</h3>
              <p className="text-lightGray">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* How It Works */}
      <Section className="bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-12 text-center">
            So funktioniert BeAFox in Ihrer Schule
          </h2>
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Einfache Einrichtung",
                description: "Wir richten die App für Ihre Schule ein und erstellen Accounts für alle Schüler. Das geht schnell und unkompliziert.",
              },
              {
                step: "2",
                title: "Schüler starten selbstständig",
                description: "Die Schüler können jederzeit mit BeAFox lernen – im Unterricht, zu Hause oder in der Freizeit.",
              },
              {
                step: "3",
                title: "Lehrer behalten Überblick",
                description: "Über das Monitoring-Dashboard sehen Sie in Echtzeit, welche Schüler aktiv sind, wo sie stehen und wie sie vorankommen.",
              },
              {
                step: "4",
                title: "Individuelle Unterstützung",
                description: "Schwächen werden sofort sichtbar, sodass Sie gezielt unterstützen können. Fortschritte werden belohnt und motivieren zum Weitermachen.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-6 bg-background p-6 rounded-xl"
              >
                <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-darkerGray mb-2">{item.title}</h3>
                  <p className="text-lightGray">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Benefits for Teachers */}
      <Section className="bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-8 text-center">
            Vorteile für Lehrer
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Zeitersparnis durch selbstständiges Lernen der Schüler",
              "Echtzeit-Überblick über den Lernfortschritt",
              "Sofortige Erkennung von Schwächen",
              "Keine zusätzliche Vorbereitungszeit nötig",
              "Didaktisch aufbereitete Inhalte",
              "Unterstützung bei Unterrichtsausfall",
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg"
              >
                <CheckCircle className="w-6 h-6 text-primaryOrange flex-shrink-0" />
                <span className="text-darkerGray font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-gradient-to-r from-primaryOrange to-primaryOrange text-white">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit, Finanzbildung in Ihre Schule zu bringen?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch und erhalten Sie ein 
            individuelles Angebot für Ihre Schule.
          </p>
          <Button href="/kontakt" variant="secondary">
            Pilotprojekt anfragen
          </Button>
        </div>
      </Section>
    </>
  );
}


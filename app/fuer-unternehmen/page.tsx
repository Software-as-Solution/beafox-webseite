"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import { CheckCircle, Users, Award, BarChart, Target, Zap } from "lucide-react";

export default function ForBusinessPage() {
  const benefits = [
    {
      icon: Target,
      title: "Gezielte Workshops",
      description: "Alle 6 Monate veranstalten wir Workshops zu wechselnden Themen, die perfekt auf Ihre Azubis zugeschnitten sind.",
    },
    {
      icon: BarChart,
      title: "Monitoring Dashboards",
      description: "Behalten Sie den Überblick über den Lernfortschritt Ihrer Azubis in Echtzeit.",
    },
    {
      icon: Award,
      title: "Offizielle Zertifikate",
      description: "Ihre Azubis erhalten offizielle Zertifikate für ihre Fortschritte in der Finanzbildung.",
    },
    {
      icon: Zap,
      title: "Motiviertere Azubis",
      description: "Durch das spielerische System sind Ihre Azubis motivierter und engagierter beim Lernen.",
    },
  ];

  const features = [
    "Spielerische Lern-App",
    "Regelmäßige Workshops (alle 6 Monate)",
    "Monitoring-Dashboard für Ausbilder",
    "Offizielle Zertifikate",
    "Große PR-Aktion für Ihr Unternehmen",
    "Unbegrenzte Azubis",
    "Persönlicher Ansprechpartner",
    "Individuelle Anpassungen möglich",
  ];

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primaryOrange to-primaryOrange/80 text-darkerGray">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              BeAFox for Business
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Bildungspakete gegen Fachkräftemangel
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Mit unserer Lern-App in Kombination mit regelmäßigen Workshops lösen wir das klassische 
              Problem: Nach 2–3 Tagen ist der Großteil des Gelernten wieder vergessen.
            </p>
            <Button href="/kontakt" variant="secondary">
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
              Wir lösen das Problem von Workshops
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-darkerGray mb-4">Das Problem</h3>
              <p className="text-lightGray mb-4 text-lg">
                Traditionelle Workshops haben ein bekanntes Problem: Nach 2–3 Tagen ist der Großteil 
                des Gelernten wieder vergessen. Die Investition in die Weiterbildung Ihrer Azubis 
                verpufft schnell.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-primaryOrange mb-4">Unsere Lösung</h3>
              <p className="text-lightGray mb-4 text-lg">
                <strong>So funktioniert's:</strong> Wir veranstalten alle 6 Monate Workshops zu 
                wechselnden Themen. Dazwischen vertiefen die Azubis die Inhalte mit <strong>BeAFox</strong>, 
                wiederholen Gelerntes und bereiten sich gezielt auf das nächste Workshop vor.
              </p>
              <p className="text-lightGray text-lg">
                So wird das Wissen nachhaltig verankert und Ihre Investition zahlt sich langfristig aus.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Benefits */}
      <Section className="bg-primaryWhite">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-4">
            Was Sie erhalten
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-50 p-6 rounded-xl shadow-lg"
            >
              <benefit.icon className="w-12 h-12 text-primaryOrange mb-4" />
              <h3 className="text-xl font-bold text-darkerGray mb-3">{benefit.title}</h3>
              <p className="text-lightGray">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Features List */}
      <Section className="bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-8 text-center">
            Alle Features im Überblick
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-center space-x-3 bg-primaryWhite p-4 rounded-lg"
              >
                <CheckCircle className="w-6 h-6 text-primaryOrange flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Process */}
      <Section className="bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-12 text-center">
            So funktioniert's
          </h2>
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Kostenlose Beratung",
                description: "Wir besprechen Ihre Anforderungen und erstellen ein individuelles Angebot.",
              },
              {
                step: "2",
                title: "Setup & Onboarding",
                description: "Wir richten die App für Ihre Azubis ein und führen ein Onboarding durch.",
              },
              {
                step: "3",
                title: "Erster Workshop",
                description: "Wir starten mit einem Workshop zu einem relevanten Finanzthema.",
              },
              {
                step: "4",
                title: "Kontinuierliches Lernen",
                description: "Ihre Azubis vertiefen das Gelernte in der App und bereiten sich auf den nächsten Workshop vor.",
              },
              {
                step: "5",
                title: "Regelmäßige Workshops",
                description: "Alle 6 Monate veranstalten wir einen neuen Workshop zu wechselnden Themen.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-6 bg-gray-50 p-6 rounded-xl shadow-lg"
              >
                <div className="bg-primary-600 text-darkerGray w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
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

      {/* CTA */}
      <Section className="bg-gradient-to-r from-primary-600 to-darkGray0 text-darkerGray">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit, Ihre Azubis zu unterstützen?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch und erhalten Sie ein 
            individuelles Angebot.
          </p>
          <Button href="/kontakt" variant="secondary">
            Pilotprojekt anfragen
          </Button>
        </div>
      </Section>
    </>
  );
}


"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import { Target, Heart, Users, Award } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Unsere Mission",
      description: "Finanzbildung für alle zugänglich machen und junge Menschen dabei unterstützen, selbstständig und motiviert Finanzwissen zu erwerben.",
    },
    {
      icon: Heart,
      title: "Unsere Vision",
      description: "Eine Generation, die selbstbewusst und kompetent mit ihren Finanzen umgeht, ohne Druck und ohne das Gefühl, dazu gezwungen zu werden.",
    },
    {
      icon: Users,
      title: "Unser Team",
      description: "Von jungen Menschen für junge Menschen. Unsere Gründer sind selbst erst 20 Jahre alt und wissen aus eigener Erfahrung, wie es sich anfühlt, bei Finanzen planlos zu sein.",
    },
    {
      icon: Award,
      title: "Unsere Auszeichnungen",
      description: "BeAFox wurde mit dem Deggendorfer Gründerpreis ausgezeichnet und erreichte den 2. Platz beim Startup Summit Deutschland.",
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
              Über <span className="text-primaryOrange">BeAFox</span>
            </h1>
            <p className="text-xl text-lightGray">
              Das erste unabhängige, spielerische Lern-App für Finanzbildung junger Menschen
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <Section className="bg-primaryWhiteLight">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-6">
              Unsere Geschichte
            </h2>
            <div className="prose prose-lg max-w-none text-lightGray space-y-6">
              <p>
                BeAFox entstand aus einer persönlichen Erfahrung. Unsere Gründer und Referenten sind 
                selbst erst 20 Jahre alt und wissen aus eigener Erfahrung genau, wie es sich anfühlt, 
                bei Finanzen komplett planlos zu sein.
              </p>
              <p>
                Während ihrer Ausbildung gerieten sie selbst in Schulden, kämpften sich jedoch 
                eigenständig wieder heraus. Diese Erfahrung motivierte sie, eine Lösung zu schaffen, 
                die anderen jungen Menschen helfen sollte, diese Herausforderungen zu vermeiden.
              </p>
              <p>
                Mit BeAFox haben wir endlich eine Möglichkeit geschaffen, das oft als langweilig 
                empfundene Thema Finanzen nachhaltig und verständlich zu vermitteln. Wir möchten, 
                dass die junge Generation selbstständig und motiviert Finanzwissen erwirbt. Ganz 
                ohne Druck und ohne das Gefühl, dazu gezwungen zu werden.
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Values */}
      <Section className="bg-primaryWhite">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-4">
            Unsere Werte
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-primaryWhiteLight p-8 rounded-xl shadow-lg border border-darkGray"
            >
              <value.icon className="w-12 h-12 text-primaryOrange mb-4" />
              <h3 className="text-2xl font-bold text-darkerGray mb-4">{value.title}</h3>
              <p className="text-lightGray">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Achievements */}
      <Section className="bg-primaryWhiteLight">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-8 text-center">
            Unsere Erfolge
          </h2>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-backgroundLight to-darkGray p-6 rounded-xl border border-gray-300"
            >
              <h3 className="text-xl font-bold text-darkerGray mb-2">
                Deggendorfer Gründerpreis
              </h3>
              <p className="text-lightGray">
                BeAFox wurde mit dem Deggendorfer Gründerpreis ausgezeichnet. Rund 60% des Publikums 
                haben für uns gestimmt. Ein großes Dankeschön an das gesamte Team für die hervorragende 
                Organisation und für das Preisgeld in Höhe von 2.500€.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-darkGray to-backgroundLight p-6 rounded-xl border border-gray-300"
            >
              <h3 className="text-xl font-bold text-darkerGray mb-2">
                Startup Summit Deutschland - 2. Platz
              </h3>
              <p className="text-lightGray">
                Mit BeAFox haben wir den 2. Platz beim Startup Summit Deutschland erreicht – unsere 
                erste offizielle Auszeichnung! Nach zwei Jahren harter Arbeit zeigt dies, dass 
                Durchhaltevermögen, Mut und Teamwork sich auszahlen.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-primaryOrange text-darkerGray">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Werde Teil unserer Mission
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Hilf uns dabei, Finanzkompetenz für alle erlebbar zu machen.
          </p>
          <Button href="/kontakt" variant="secondary">
            Kontakt aufnehmen
          </Button>
        </div>
      </Section>
    </>
  );
}


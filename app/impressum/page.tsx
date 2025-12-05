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

export default function ImpressumPage() {
  const sections = [
    {
      id: 1,
      title: "Angaben gemäß § 5 TMG",
      icon: Building2,
      content: [
        {
          details: [
            "BeAFox UG (haftungsbeschränkt)",
            "Siemensweg 2",
            "93073 Neutraubling",
            "Deutschland",
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Kontakt",
      icon: Mail,
      content: [
        {
          details: ["Telefon: +49 178 2723 673", "E-Mail: info@beafox.app"],
        },
      ],
    },
    {
      id: 3,
      title: "Vertreten durch",
      icon: Scale,
      content: [
        {
          text: "Die Geschäftsführung: Alexandru Tapelea",
        },
      ],
    },
    {
      id: 4,
      title: "Registereintrag",
      icon: FileText,
      content: [
        {
          details: [
            "Eintragung im Handelsregister",
            "Registergericht: Regensburg",
            "Registernummer: HRB 21689",
          ],
        },
      ],
    },
    {
      id: 5,
      title: "Umsatzsteuer-ID",
      icon: FileText,
      content: [
        {
          text: "Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:",
          details: ["DE455701438"],
        },
      ],
    },
    {
      id: 6,
      title: "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV",
      icon: Shield,
      content: [
        {
          details: [
            "BeAFox UG (haftungsbeschränkt)",
            "Siemensweg 2",
            "93073 Neutraubling",
            "Deutschland",
          ],
        },
      ],
    },
    {
      id: 7,
      title: "Haftungsausschluss",
      icon: AlertCircle,
      content: [
        {
          subtitle: "Haftung für Inhalte",
          text: "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.",
        },
        {
          subtitle: "Haftung für Links",
          text: "Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.",
        },
        {
          subtitle: "Urheberrecht",
          text: "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.",
        },
        {
          subtitle: "Datenschutz",
          text: "Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Die Nutzung der Angebote und Dienste ist, soweit möglich, stets ohne Angabe personenbezogener Daten möglich.",
          link: {
            text: "Weitere Informationen finden Sie in unserer Datenschutzerklärung.",
            href: "/datenschutz",
          },
        },
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
              <FileText className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">Impressum</span>
              <FileText className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-darkerGray mb-6"
          >
            Impressum
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-lightGray max-w-2xl mx-auto"
          >
            Angaben gemäß § 5 TMG und verantwortlich für den Inhalt nach § 55
            Abs. 2 RStV
          </motion.p>
        </div>
      </Section>

      {/* Content Sections */}
      <Section className="bg-white py-8 md:py-16 lg:py-20 pt-0 md:pt-0 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-12">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-primaryWhite rounded-2xl p-6 md:p-8 border-2 border-primaryOrange/20"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-primaryOrange/10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-primaryOrange/20">
                      <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-primaryOrange" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-darkerGray flex-1">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-6 ml-0 md:ml-20">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="space-y-3">
                        {"subtitle" in item && item.subtitle && (
                          <h3 className="text-xl font-semibold text-darkerGray">
                            {item.subtitle}
                          </h3>
                        )}
                        {"text" in item && item.text && (
                          <p className="text-lightGray leading-relaxed">
                            {item.text}
                          </p>
                        )}
                        {"details" in item && item.details && (
                          <div className="bg-white rounded-lg p-4 border border-primaryOrange/20">
                            {item.details.map(
                              (detail: string, detailIndex: number) => (
                                <p
                                  key={detailIndex}
                                  className="text-lightGray mb-1 last:mb-0"
                                >
                                  {detail}
                                </p>
                              )
                            )}
                          </div>
                        )}
                        {"link" in item && item.link && (
                          <p className="text-lightGray leading-relaxed">
                            <a
                              href={item.link.href}
                              className="text-primaryOrange hover:underline inline-flex items-center gap-1"
                            >
                              {item.link.text}
                              <ExternalLink className="w-4 h-4" />
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
            className="bg-white rounded-2xl p-6 md:p-8 border-2 border-primaryOrange/20"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primaryOrange/10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-primaryOrange/20">
                  <Phone className="w-6 h-6 text-primaryOrange" />
                </div>
                <div>
                  <h3 className="font-semibold text-darkerGray mb-2">
                    Telefon
                  </h3>
                  <a
                    href="tel:+491782723673"
                    className="text-lightGray hover:text-primaryOrange transition-colors"
                  >
                    +49 178 2723 673
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primaryOrange/10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-primaryOrange/20">
                  <Mail className="w-6 h-6 text-primaryOrange" />
                </div>
                <div>
                  <h3 className="font-semibold text-darkerGray mb-2">E-Mail</h3>
                  <a
                    href="mailto:info@beafox.app"
                    className="text-lightGray hover:text-primaryOrange transition-colors"
                  >
                    info@beafox.app
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 md:col-span-2">
                <div className="w-12 h-12 bg-primaryOrange/10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-primaryOrange/20">
                  <MapPin className="w-6 h-6 text-primaryOrange" />
                </div>
                <div>
                  <h3 className="font-semibold text-darkerGray mb-2">
                    Adresse
                  </h3>
                  <p className="text-lightGray">
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
      <Section className="bg-white py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-lightGray mb-2">
            <Copyright className="w-5 h-5" />
            <p className="text-sm">
              {new Date().getFullYear()} BeAFox UG (haftungsbeschränkt). Alle
              Rechte vorbehalten.
            </p>
          </div>
          <p className="text-sm text-lightGray">
            Alle Inhalte dieser Website unterliegen dem deutschen Urheberrecht.
          </p>
        </div>
      </Section>
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import {
  FileText,
  Scale,
  Handshake,
  CheckCircle2,
  CreditCard,
  Shield,
  AlertCircle,
  XCircle,
  Gavel,
  RotateCcw,
  Database,
  Smartphone,
  Wifi,
  Wrench,
  Copyright,
  Users,
  Ban,
  Clock,
  MessageSquare,
  GraduationCap,
  Building2,
  Info,
  RefreshCw,
} from "lucide-react";

export default function AGBPage() {
  const sections = [
    {
      id: 1,
      title: "Geltungsbereich",
      icon: Scale,
      content: [
        {
          text: 'Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen der BeAFox UG (haftungsbeschränkt), Siemensweg 2, 93073 Neutraubling (nachfolgend "BeAFox" genannt) und ihren Kunden über die Nutzung der BeAFox-App und der damit verbundenen Dienstleistungen.',
        },
      ],
    },
    {
      id: 2,
      title: "Vertragsgegenstand",
      icon: FileText,
      content: [
        {
          text: "BeAFox bietet eine mobile Lern-App für Finanzbildung an. Die App ermöglicht es Nutzern, spielerisch Finanzwissen zu erwerben und zu vertiefen. Für Bildungseinrichtungen und Unternehmen werden zusätzliche Services wie Workshops, Monitoring-Dashboards und Zertifikate angeboten.",
        },
      ],
    },
    {
      id: 3,
      title: "Vertragsschluss",
      icon: Handshake,
      content: [
        {
          text: "Der Vertrag kommt durch die Annahme des Angebots von BeAFox zustande. Die Annahme kann schriftlich, per E-Mail oder durch Nutzung der App erfolgen. Bei In-App-Käufen über App-Stores (Apple App Store, Google Play Store) kommt der Zahlungsvertrag ausschließlich mit dem jeweiligen App-Store-Betreiber zustande. BeAFox stellt lediglich die Inhalte zur Verfügung.",
        },
      ],
    },
    {
      id: 4,
      title: "Widerrufsrecht für Verbraucher",
      icon: RotateCcw,
      content: [
        {
          subtitle: "Widerrufsrecht",
          text: "Verbraucher haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt 14 Tage ab dem Tag des Vertragsschlusses.",
        },
        {
          subtitle: "Entfallen des Widerrufsrechts",
          text: "Das Widerrufsrecht erlischt vorzeitig, wenn BeAFox mit der Ausführung der Dienstleistung begonnen hat und der Verbraucher ausdrücklich zugestimmt hat, dass BeAFox mit der Ausführung vor Ablauf der Widerrufsfrist beginnt und zur Kenntnis genommen hat, dass er sein Widerrufsrecht verliert, wenn BeAFox die Leistung vollständig erbracht hat.",
        },
        {
          subtitle: "Widerrufsbelehrung",
          text: "Zur Ausübung des Widerrufsrechts müssen Sie uns (BeAFox UG (haftungsbeschränkt), Siemensweg 2, 93073 Neutraubling, E-Mail: info@beafox.app) mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief, Telefax oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.",
        },
        {
          subtitle: "Folgen des Widerrufs",
          text: "Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen 14 Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.",
        },
      ],
    },
    {
      id: 5,
      title: "Leistungen und Verfügbarkeit",
      icon: CheckCircle2,
      content: [
        {
          text: "BeAFox verpflichtet sich, die vereinbarten Leistungen sorgfältig und nach bestem Wissen und Gewissen zu erbringen. Die genauen Leistungen ergeben sich aus dem jeweiligen Vertragsangebot.",
        },
        {
          subtitle: "Änderungen der Funktionen",
          text: "BeAFox behält sich vor, Funktionen der App zu ändern, zu erweitern oder zu entfernen. Nutzer werden über wesentliche Änderungen informiert. Ein Anspruch auf bestimmte Funktionen besteht nicht.",
        },
        {
          subtitle: "Verfügbarkeit",
          text: "BeAFox ist bemüht, eine hohe Verfügbarkeit sicherzustellen. Wartungsarbeiten, Weiterentwicklungen oder technische Störungen können den Zugang vorübergehend einschränken. Ein Anspruch auf eine jederzeit ununterbrochene Verfügbarkeit besteht nicht. Wartungsfenster werden nach Möglichkeit im Voraus angekündigt.",
        },
        {
          subtitle: "Updates",
          text: "Nutzer sind verpflichtet, verfügbare Updates der App zu installieren, um die Funktionalität und Sicherheit sicherzustellen. Ältere Versionen der App werden möglicherweise nicht mehr unterstützt.",
        },
      ],
    },
    {
      id: 6,
      title: "Preise und Zahlung",
      icon: CreditCard,
      content: [
        {
          text: "Die Preise verstehen sich in Euro zuzüglich der gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt nach Vereinbarung im Vertrag. Bei Zahlungsverzug werden Verzugszinsen in Höhe von 9 Prozentpunkten über dem Basiszinssatz berechnet.",
        },
        {
          subtitle: "App-Store-Zahlungen",
          text: "Bei In-App-Käufen erfolgt die Zahlungsabwicklung über den jeweiligen App-Store (Apple App Store oder Google Play Store). Der Kaufvertrag über die Zahlung kommt ausschließlich mit dem App-Store-Betreiber zustande. BeAFox erhält lediglich Bestätigungen über erfolgreiche Zahlungen, keine Zahlungsdaten.",
        },
        {
          subtitle: "Laufzeiten und Verlängerung",
          text: "Abonnements verlängern sich automatisch um die vereinbarte Laufzeit, sofern nicht fristgerecht gekündigt wird. Die Kündigungsfrist beträgt einen Monat zum Ende der Laufzeit.",
        },
      ],
    },
    {
      id: 7,
      title: "Nutzungsrechte",
      icon: Shield,
      content: [
        {
          text: "Dem Kunden wird ein einfaches, nicht übertragbares, nicht exklusives Recht zur Nutzung der App für den vereinbarten Zweck eingeräumt. Eine Weitergabe der Zugangsdaten an Dritte ist nicht gestattet.",
        },
        {
          subtitle: "Einschränkungen",
          text: "Die Nutzung der App ist nur für den vereinbarten Zweck gestattet. Eine kommerzielle Nutzung der Inhalte, das Kopieren, Vervielfältigen oder Verbreiten von Inhalten ist ohne schriftliche Zustimmung von BeAFox nicht gestattet.",
        },
      ],
    },
    {
      id: 8,
      title: "Datenschutz und Datenverarbeitung",
      icon: Database,
      content: [
        {
          text: "Die Verarbeitung personenbezogener Daten erfolgt nach Maßgabe der Datenschutz-Grundverordnung (DSGVO) und des Telekommunikation-Telemedien-Datenschutz-Gesetzes (TTDSG).",
        },
        {
          subtitle: "Datenschutzerklärung",
          text: "Es gelten die Datenschutzbestimmungen unter: https://beafox.app/datenschutz",
        },
        {
          subtitle: "Auftragsverarbeitung",
          text: "Für Bildungseinrichtungen und Unternehmen kann eine Vereinbarung zur Auftragsverarbeitung (AVV) gemäß Art. 28 DS-GVO erforderlich sein. Diese wird bei Bedarf gesondert geschlossen.",
        },
        {
          subtitle: "Datenlöschung",
          text: "Nach Beendigung des Vertragsverhältnisses werden personenbezogene Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
        },
      ],
    },
    {
      id: 9,
      title: "Gewährleistung bei digitalen Produkten",
      icon: Wrench,
      content: [
        {
          subtitle: "Aktualisierungspflicht",
          text: "BeAFox ist verpflichtet, digitale Inhalte gemäß § 327f BGB aktuell zu halten und erforderliche Updates bereitzustellen. Nutzer müssen verfügbare Updates installieren, um die Funktionalität sicherzustellen.",
        },
        {
          subtitle: "Mängelrechte",
          text: "Bei Mängeln der digitalen Inhalte gelten die gesetzlichen Bestimmungen. BeAFox ist bemüht, Mängel unverzüglich zu beheben. Ein Anspruch auf bestimmte Funktionen oder Inhalte besteht nicht, soweit diese nicht ausdrücklich vereinbart wurden.",
        },
        {
          subtitle: "Keine Garantie",
          text: "BeAFox übernimmt keine Garantie für die Vollständigkeit, Richtigkeit oder Aktualität der bereitgestellten Informationen. Die Inhalte dienen der allgemeinen Bildung und stellen keine individuelle Beratung dar.",
        },
      ],
    },
    {
      id: 10,
      title: "Urheberrecht und verbotene Nutzungen",
      icon: Copyright,
      content: [
        {
          text: "Alle Inhalte der App (Texte, Illustrationen, Grafiken, Design, Logik, Software) sind urheberrechtlich geschützt und Eigentum von BeAFox oder deren Lizenzgebern. Eine Vervielfältigung, Veröffentlichung, Weitergabe oder kommerzielle Nutzung ist ohne schriftliche Zustimmung nicht gestattet.",
        },
        {
          subtitle: "Verbotene Handlungen",
          text: "Es ist insbesondere untersagt: Screenshots oder Inhalte für kommerzielle Zwecke zu nutzen, die App zu kopieren oder zu reverse-engineeren, Zugangsdaten weiterzugeben, automatisierte Systeme zur Nutzung der App einzusetzen oder die App zu manipulieren.",
        },
        {
          subtitle: "Rechtsfolgen",
          text: "Bei Verstößen gegen diese Bestimmungen behält sich BeAFox vor, den Zugang zu sperren und rechtliche Schritte einzuleiten.",
        },
      ],
    },
    {
      id: 11,
      title: "Pflichten der Bildungseinrichtungen und Unternehmen",
      icon: Building2,
      content: [
        {
          subtitle: "Nutzungsbereich",
          text: "Die Nutzung der App ist nur für eigene Mitarbeitende, Schülerinnen und Schüler oder Auszubildende gestattet. Eine Weitergabe an Dritte ist nicht zulässig.",
        },
        {
          subtitle: "Mindestnutzerzahlen",
          text: "Vereinbarte Mindestnutzerzahlen oder Lizenzumfänge sind einzuhalten. Eine Überschreitung erfordert eine Anpassung des Vertrags.",
        },
        {
          subtitle: "Jugendschutz",
          text: "Bei Nutzung durch Minderjährige ist sicherzustellen, dass die Nutzung den gesetzlichen Bestimmungen entspricht. Bei Nutzern unter 16 Jahren ist die Zustimmung der Erziehungsberechtigten erforderlich.",
        },
        {
          subtitle: "Verantwortung für Zugangsdaten",
          text: "Der Vertragspartner ist für die sichere Verwaltung und Weitergabe von Zugangsdaten verantwortlich. Bei Verlust oder Missbrauch von Zugangsdaten ist BeAFox unverzüglich zu informieren.",
        },
        {
          subtitle: "Einhaltung der Nutzungsbedingungen",
          text: "Der Vertragspartner stellt sicher, dass alle Nutzer die AGB und Nutzungsbedingungen einhalten.",
        },
      ],
    },
    {
      id: 12,
      title: "Keine Finanz- oder Steuerberatung",
      icon: Ban,
      content: [
        {
          text: "Die durch BeAFox bereitgestellten Inhalte stellen keine Anlageberatung, Steuerberatung, Finanzberatung oder Rechtsberatung dar. Sie dienen ausschließlich der allgemeinen Bildung und Wissensvermittlung.",
        },
        {
          subtitle: "Eigenverantwortung",
          text: "Entscheidungen über finanzielle Anlagen, Versicherungen, steuerliche Themen oder andere finanzielle Entscheidungen trifft der Nutzer eigenverantwortlich. BeAFox übernimmt keine Haftung für wirtschaftliche Entscheidungen, die Nutzer auf Basis der bereitgestellten Inhalte treffen.",
        },
        {
          subtitle: "Keine Empfehlungen",
          text: "Die Inhalte enthalten keine Empfehlungen für konkrete Finanzprodukte oder Anlagestrategien. BeAFox ist unabhängig und neutral.",
        },
      ],
    },
    {
      id: 13,
      title: "Haftung",
      icon: AlertCircle,
      content: [
        {
          subtitle: "Haftung für Vorsatz und grobe Fahrlässigkeit",
          text: "BeAFox haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit.",
        },
        {
          subtitle: "Haftung bei leichter Fahrlässigkeit",
          text: "Bei leichter Fahrlässigkeit haftet BeAFox nur bei Verletzung einer wesentlichen Vertragspflicht, deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht. Die Haftung ist auf den bei Vertragsschluss vorhersehbaren, vertragstypischen Schaden begrenzt.",
        },
        {
          subtitle: "Ausschluss der Haftung",
          text: "BeAFox haftet nicht für Datenverlust, soweit dieser nicht auf Vorsatz oder grober Fahrlässigkeit beruht. Eine Haftung für wirtschaftliche Entscheidungen, die Nutzer auf Basis der App-Inhalte treffen, ist ausgeschlossen. Die Haftung für leichte Fahrlässigkeit ist bei Verletzung des Lebens, des Körpers oder der Gesundheit ausgeschlossen.",
        },
        {
          subtitle: "Haftung für Dritte",
          text: "BeAFox haftet nicht für Handlungen Dritter, insbesondere nicht für Handlungen von App-Store-Betreibern oder anderen Dienstleistern.",
        },
      ],
    },
    {
      id: 14,
      title: "Kündigung",
      icon: XCircle,
      content: [
        {
          subtitle: "Kündigung durch Verbraucher",
          text: "Verbraucher können Abonnements jederzeit mit einer Frist von einem Monat zum Ende der Laufzeit kündigen. Die Kündigung erfolgt schriftlich oder per E-Mail an info@beafox.app.",
        },
        {
          subtitle: "Kündigung durch Unternehmen und Bildungseinrichtungen",
          text: "Für Unternehmen und Bildungseinrichtungen gelten die im Vertrag vereinbarten Laufzeiten und Kündigungsfristen. In der Regel beträgt die Kündigungsfrist drei Monate zum Ende der Laufzeit, sofern nicht anders vereinbart.",
        },
        {
          subtitle: "Außerordentliche Kündigung",
          text: "Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Ein wichtiger Grund liegt insbesondere vor bei schwerwiegenden Verstößen gegen diese AGB oder bei Zahlungsverzug von mehr als zwei Monaten.",
        },
        {
          subtitle: "Folgen der Kündigung",
          text: "Nach Kündigung endet der Zugang zur App zum Ende der Laufzeit. Bereits erbrachte Leistungen werden nicht anteilig erstattet, es sei denn, es liegt ein wichtiger Kündigungsgrund vor.",
        },
      ],
    },
    {
      id: 15,
      title: "Supportregelungen",
      icon: MessageSquare,
      content: [
        {
          subtitle: "Supportkanäle",
          text: "BeAFox bietet Support über E-Mail (info@beafox.app) und innerhalb der App an. Supportzeiten sind werktags von 9:00 bis 17:00 Uhr.",
        },
        {
          subtitle: "Reaktionszeit",
          text: "BeAFox bemüht sich um eine schnelle Bearbeitung von Anfragen, übernimmt jedoch keine Garantie für eine bestimmte Reaktionszeit. Kein Anspruch auf sofortige Rückmeldung besteht.",
        },
        {
          subtitle: "Umfang des Supports",
          text: "Der Support umfasst technische Fragen zur Nutzung der App und allgemeine Anfragen. Individuelle Beratung oder Schulungen sind nicht im Standard-Support enthalten und können gesondert gebucht werden.",
        },
      ],
    },
    {
      id: 16,
      title: "Workshops und Zusatzleistungen",
      icon: GraduationCap,
      content: [
        {
          subtitle: "Workshops",
          text: "Workshops werden nach Vereinbarung durchgeführt. Reisekosten, Materialkosten und ggf. Übernachtungskosten werden gesondert berechnet, sofern nicht anders vereinbart.",
        },
        {
          subtitle: "Ausfallregelungen",
          text: "Bei Ausfall eines Workshops durch BeAFox wird ein Ersatztermin angeboten oder die bereits gezahlte Gebühr erstattet. Bei Ausfall durch den Kunden gelten die vereinbarten Stornobedingungen.",
        },
        {
          subtitle: "Stornobedingungen",
          text: "Stornierungen von Workshops müssen mindestens 14 Tage vor dem Termin erfolgen, um eine vollständige Erstattung zu erhalten. Bei späteren Stornierungen können Stornogebühren anfallen.",
        },
        {
          subtitle: "Zertifikate und Materialien",
          text: "Zertifikate und analoge Materialien werden nach Vereinbarung bereitgestellt. Die Kosten sind im jeweiligen Angebot ausgewiesen.",
        },
      ],
    },
    {
      id: 17,
      title: "Änderungen der AGB",
      icon: RefreshCw,
      content: [
        {
          subtitle: "Recht zur Änderung",
          text: "BeAFox behält sich vor, diese AGB anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entsprechen oder Änderungen der Leistungen abbilden.",
        },
        {
          subtitle: "Benachrichtigung",
          text: "Nutzer werden über wesentliche Änderungen der AGB mindestens zwei Monate vor Inkrafttreten informiert. Die Information erfolgt per E-Mail oder über die App.",
        },
        {
          subtitle: "Zustimmung",
          text: "Schweigen zählt nicht als Zustimmung. Wenn der Nutzer den geänderten AGB nicht zustimmt, kann er den Vertrag bis zum Inkrafttreten der Änderungen kündigen. Die Weiterverwendung der App nach Inkrafttreten der Änderungen gilt als Zustimmung.",
        },
        {
          subtitle: "Widerspruch",
          text: "Widerspricht der Nutzer den Änderungen nicht innerhalb von sechs Wochen nach Benachrichtigung, gelten die Änderungen als genehmigt. BeAFox weist in der Benachrichtigung auf diese Rechtsfolge hin.",
        },
      ],
    },
    {
      id: 18,
      title: "Vertragsübertragung",
      icon: Handshake,
      content: [
        {
          text: "BeAFox ist berechtigt, Rechte und Pflichten aus diesem Vertrag ganz oder teilweise auf einen Rechtsnachfolger oder Dritte zu übertragen, sofern dies für den Kunden zumutbar ist. Der Kunde wird über eine Übertragung informiert.",
        },
      ],
    },
    {
      id: 19,
      title: "Schlussbestimmungen",
      icon: Gavel,
      content: [
        {
          subtitle: "Anwendbares Recht",
          text: "Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts und des Internationalen Privatrechts.",
        },
        {
          subtitle: "Gerichtsstand",
          text: "Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist der Sitz von BeAFox (Regensburg), sofern der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist. Für Verbraucher gilt das gesetzliche Gerichtsstandsrecht.",
        },
        {
          subtitle: "Salvatorische Klausel",
          text: "Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Die unwirksame Bestimmung wird durch eine wirksame ersetzt, die dem wirtschaftlichen Zweck am nächsten kommt.",
        },
        {
          subtitle: "Sprache",
          text: "Diese AGB sind in deutscher Sprache verfasst. Übersetzungen dienen nur der Information. Maßgeblich ist die deutsche Fassung.",
        },
      ],
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-primaryWhite pt-20 md:pt-32 pb-8 md:pb-16 mt-10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 md:mb-6"
          >
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-4 md:mb-6">
              <FileText className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">AGB</span>
              <FileText className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl md:text-5xl lg:text-6xl font-bold text-darkerGray mb-4 md:mb-6"
          >
            Allgemeine Geschäftsbedingungen
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl text-lightGray max-w-2xl mx-auto"
          >
            Die rechtlichen Grundlagen für die Nutzung unserer Dienste und
            Produkte.
          </motion.p>
        </div>
      </Section>

      {/* Content Sections */}
      <Section className="bg-white py-6 md:py-16 lg:py-20 pt-0 md:pt-0 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6 md:space-y-12">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-primaryWhite rounded-2xl p-4 md:p-8 border-2 border-primaryOrange/20"
                >
                  <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-16 md:h-16 bg-primaryOrange/10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-primaryOrange/20">
                      <IconComponent className="w-5 h-5 md:w-8 md:h-8 text-primaryOrange" />
                    </div>
                    <h2 className="text-xl md:text-3xl font-bold text-darkerGray flex-1 leading-tight">
                      § {section.id} {section.title}
                    </h2>
                  </div>

                  <div className="space-y-4 md:space-y-6 ml-0 md:ml-20">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="space-y-2 md:space-y-3">
                        {"subtitle" in item && item.subtitle && (
                          <h3 className="text-lg md:text-xl font-semibold text-darkerGray">
                            {item.subtitle}
                          </h3>
                        )}
                        {"text" in item && item.text && (
                          <p className="text-sm md:text-base text-lightGray leading-relaxed">
                            {item.text}
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
            className="bg-white rounded-2xl p-4 md:p-8 border-2 border-primaryOrange/20 text-center"
          >
            <FileText className="w-10 h-10 md:w-16 md:h-16 text-primaryOrange mx-auto mb-3 md:mb-4" />
            <h2 className="text-xl md:text-3xl font-bold text-darkerGray mb-3 md:mb-4">
              Fragen zu unseren AGB?
            </h2>
            <p className="text-sm md:text-lg text-lightGray mb-4 md:mb-6">
              Wenn Sie Fragen zu unseren Allgemeinen Geschäftsbedingungen haben,
              kontaktieren Sie uns gerne:
            </p>
            <div className="space-y-2 text-sm md:text-base text-lightGray mb-4 md:mb-6">
              <p>
                <strong>E-Mail:</strong>{" "}
                <a
                  href="mailto:info@beafox.app"
                  className="text-primaryOrange hover:underline break-all"
                >
                  info@beafox.app
                </a>
              </p>
              <p>
                <strong>Telefon:</strong>{" "}
                <a
                  href="tel:+491782723673"
                  className="text-primaryOrange hover:underline"
                >
                  +49 178 2723 673
                </a>
              </p>
            </div>
            <a
              href="/kontakt"
              className="inline-flex items-center gap-2 bg-primaryOrange hover:bg-primaryOrange/90 text-primaryWhite px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Kontakt aufnehmen
            </a>
          </motion.div>
        </div>
      </Section>

      {/* Last Updated Section */}
      <Section className="bg-white py-6 md:py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs md:text-sm text-lightGray">
            Stand dieser Allgemeinen Geschäftsbedingungen: Dezember 2025
          </p>
          <p className="text-xs md:text-sm text-lightGray mt-2">
            Wir behalten uns vor, diese AGB anzupassen, damit sie stets den
            aktuellen rechtlichen Anforderungen entsprechen oder Änderungen
            unserer Leistungen abbilden. Über Änderungen werden Sie rechtzeitig
            informiert.
          </p>
        </div>
      </Section>
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Mail,
  Cookie,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Info,
  Server,
  Smartphone,
  CreditCard,
  Bell,
  Users,
  Building2,
} from "lucide-react";

export default function DatenschutzPage() {
  const sections = [
    {
      id: 1,
      title: "Information über die Erhebung personenbezogener Daten",
      icon: Info,
      content: [
        {
          subtitle: "Allgemeines",
          text: "Im Folgenden informieren wir über die Erhebung personenbezogener Daten bei Nutzung dieser Website und unserer App. Personenbezogene Daten sind alle Daten, die auf Sie persönlich beziehbar sind, also z.B. Name, Adresse, E-Mail-Adressen, Nutzerverhalten.",
        },
        {
          subtitle: "Verantwortliche Stelle",
          text: "Verantwortliche Stelle im Sinne der DSGVO und zugleich Diensteanbieter im Sinne des TTDSG ist:",
          details: [
            "BeAFox UG (haftungsbeschränkt)",
            "Siemensweg 2",
            "93073 Neutraubling",
            "Deutschland",
            "Vertreten durch: Die Geschäftsführung",
            "Handelsregister: HRB 21689, Registergericht Regensburg",
            "Telefon: +49 178 2723 673",
            "E-Mail: info@beafox.app",
          ],
        },
        {
          subtitle: "Datenschutzbeauftragte:r",
          text: "Wir haben derzeit keinen Datenschutzbeauftragten bestellt, da dies nach den gesetzlichen Bestimmungen nicht erforderlich ist.",
        },
      ],
    },
    {
      id: 2,
      title: "Ihre Rechte als betroffene Person",
      icon: Eye,
      content: [
        {
          subtitle: "Recht auf Auskunft (Art. 15 DS-GVO)",
          text: "Sie haben das Recht, Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen. Insbesondere können Sie Auskunft verlangen über:",
          list: [
            "die zu Ihnen bei uns gespeicherten Daten",
            "deren Herkunft",
            "Empfänger oder Kategorien von Empfängern, an die diese Daten weitergegeben werden",
            "den Zweck der Speicherung",
            "die Dauer der Speicherung",
          ],
        },
        {
          subtitle: "Recht auf Berichtigung (Art. 16 DS-GVO)",
          text: "Sie haben das Recht, die Berichtigung unrichtiger oder die Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen.",
        },
        {
          subtitle: "Recht auf Löschung (Art. 17 DS-GVO)",
          text: "Sie haben das Recht, die Löschung Ihrer personenbezogenen Daten zu verlangen, soweit nicht gesetzliche Aufbewahrungspflichten oder andere rechtliche Gründe der Löschung entgegenstehen.",
        },
        {
          subtitle: "Recht auf Einschränkung der Verarbeitung (Art. 18 DS-GVO)",
          text: "Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.",
        },
        {
          subtitle: "Recht auf Datenübertragbarkeit (Art. 20 DS-GVO)",
          text: "Sie haben das Recht, Ihre personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.",
        },
        {
          subtitle: "Widerspruchsrecht (Art. 21 DS-GVO)",
          text: "Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DS-GVO erfolgt, Widerspruch einzulegen.",
        },
        {
          subtitle: "Widerruf von Einwilligungen",
          text: "Wenn Sie eine Einwilligung zur Verarbeitung Ihrer personenbezogenen Daten erteilt haben, können Sie diese jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung wird dadurch nicht berührt. Alle Informationswünsche, Auskunftsanfragen oder Widersprüche zur Datenverarbeitung richten Sie bitte per E-Mail an info@beafox.app oder an die oben genannte Adresse.",
        },
        {
          subtitle:
            "Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DS-GVO)",
          text: "Sie haben zudem das Recht, sich bei einer Datenschutzaufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren. Zuständig ist in der Regel die Aufsichtsbehörde Ihres üblichen Aufenthaltsortes, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes.",
          details: [
            "Für uns zuständig ist:",
            "Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)",
            "Promenade 18",
            "91522 Ansbach",
            "Deutschland",
            "",
            "Website: https://www.lda.bayern.de",
            "E-Mail: poststelle@lda.bayern.de",
          ],
        },
      ],
    },
    {
      id: 3,
      title: "Datensicherheit",
      icon: Lock,
      content: [
        {
          text: "Wir unterhalten aktuelle technische Maßnahmen zur Gewährleistung der Datensicherheit, insbesondere zum Schutz Ihrer personenbezogenen Daten vor Gefahren bei Datenübertragungen sowie vor Kenntniserlangung durch Dritte. Diese werden dem aktuellen Stand der Technik entsprechend jeweils angepasst.",
        },
        {
          subtitle: "TLS-Verschlüsselung",
          text: 'Wir verwenden für die Übertragung von Inhalten eine TLS-Verschlüsselung (erkennbar an "https://" und dem Schloss-Symbol im Browser). So werden Ihre Daten vor unbefugter Mitlesung geschützt.',
        },
      ],
    },
    {
      id: 4,
      title: "Hosting & Server-Logfiles",
      icon: Server,
      content: [
        {
          subtitle: "Hosting",
          text: "Unsere Website wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA gehostet. Wir haben mit dem Hoster einen Vertrag zur Auftragsverarbeitung gem. Art. 28 DS-GVO geschlossen.",
        },
        {
          subtitle: "Server-Logfiles",
          text: "Beim Aufruf unserer Website erfasst unser Hoster automatisiert Daten und Informationen in sogenannten Server-Logfiles. Dazu gehören insbesondere:",
          list: [
            "IP-Adresse",
            "Datum und Uhrzeit des Abrufs",
            "Zeitzonendifferenz zur Greenwich Mean Time (GMT)",
            "URL der abgerufenen Seite",
            "Referrer-URL (Website, von der die Anforderung kommt)",
            "Verwendeter Browser und Betriebssystem",
            "Sprache und Version der Browsersoftware",
          ],
        },
        {
          subtitle: "Rechtsgrundlage",
          text: "Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DS-GVO. Unser berechtigtes Interesse liegt in der technischen Bereitstellung der Website, der Gewährleistung von Stabilität und Sicherheit sowie der Aufklärung von Missbrauchs- oder Betrugshandlungen.",
        },
      ],
    },
    {
      id: 5,
      title: "Cookies & Einwilligungs-Management",
      icon: Cookie,
      content: [
        {
          subtitle: "Was sind Cookies?",
          text: "Bei Cookies handelt es sich um kleine Textdateien, die auf Ihrer Festplatte dem von Ihnen verwendeten Browser zugeordnet gespeichert werden und durch welche der Stelle, die den Cookie setzt (in diesem Fall also uns), bestimmte Informationen zufließen. Cookies können keine Programme ausführen oder Viren auf Ihren Computer übertragen. Sie dienen dazu, das Internetangebot insgesamt nutzerfreundlicher und effektiver zu machen.",
        },
        {
          subtitle: "Verwendung von Cookies",
          text: "Wir setzen Cookies dazu ein, um Sie für Folgebesuche identifizieren zu können, falls Sie über einen Account bei uns verfügen. Andernfalls müssten Sie sich für jeden Besuch erneut einloggen.",
        },
        {
          subtitle: "Cookie-Arten",
          text: "Diese Website nutzt Cookies in folgendem Umfang:",
          list: [
            "Transiente Cookies (temporärer Einsatz): Transiente Cookies werden automatisiert gelöscht, wenn Sie den Browser schließen. Dazu zählen insbesondere die Session-Cookies. Diese speichern eine sogenannte Session-ID, mit welcher sich verschiedene Anfragen Ihres Browsers der gemeinsamen Sitzung zuordnen lassen. Dadurch kann Ihr Rechner wiedererkannt werden, wenn Sie auf die Website zurückkehren. Die Session-Cookies werden gelöscht, wenn Sie sich ausloggen oder Sie den Browser schließen.",
          ],
        },
        {
          subtitle: "Einwilligung über Consent-Tool",
          text: "Soweit wir nicht technisch notwendige Cookies (z.B. zu Statistik- oder Marketingzwecken) einsetzen, holen wir hierfür zuvor Ihre Einwilligung über ein Einwilligungs-Management-Tool ein. Wir verwenden derzeit keine Cookies zu Analyse- oder Marketingzwecken.",
        },
        {
          subtitle: "Rechtsgrundlage",
          text: "Die Speicherung von Informationen in Ihrem Endgerät oder der Zugriff hierauf erfolgt, soweit nicht unbedingt erforderlich, auf Grundlage Ihrer Einwilligung (§ 25 Abs. 1 TTDSG i.V.m. Art. 6 Abs. 1 lit. a DS-GVO). Technisch notwendige Cookies verwenden wir auf Grundlage von § 25 Abs. 2 TTDSG und Art. 6 Abs. 1 lit. f DS-GVO.",
        },
        {
          subtitle: "Datentrennung",
          text: "Diese gespeicherten Informationen werden getrennt von eventuell weiter bei uns angegeben Daten gespeichert. Insbesondere werden die Daten der Cookies nicht mit Ihren weiteren Daten verknüpft.",
        },
      ],
    },
    {
      id: 6,
      title: "Kontaktformular und E-Mail-Kommunikation",
      icon: Mail,
      content: [
        {
          subtitle: "Kontaktformular",
          text: "Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.",
        },
        {
          subtitle: "E-Mail-Kommunikation",
          text: "Wenn Sie uns per E-Mail kontaktieren, speichern wir Ihre E-Mail-Adresse und die von Ihnen mitgeteilten Informationen, um Ihre Anfrage zu beantworten.",
        },
        {
          subtitle: "Versand über SendGrid",
          text: "Für den Versand von E-Mails nutzen wir den Dienst SendGrid (Twilio SendGrid, Inc., 1801 California Street, Suite 500, Denver, CO 80202, USA). Mit dem Anbieter haben wir einen Auftragsverarbeitungsvertrag gem. Art. 28 DS-GVO geschlossen. SendGrid verarbeitet die Daten in den USA. Wir haben Standardvertragsklauseln (SCC) mit SendGrid vereinbart, um einen angemessenen Datenschutzstandard zu gewährleisten.",
        },
        {
          subtitle: "Rechtsgrundlage",
          text: "Rechtsgrundlage für die Verarbeitung der Daten aus Kontaktformular und E-Mails ist Art. 6 Abs. 1 lit. b DS-GVO, soweit Ihre Anfrage auf den Abschluss oder die Erfüllung eines Vertrags gerichtet ist, sowie Art. 6 Abs. 1 lit. f DS-GVO im Übrigen. Unser berechtigtes Interesse liegt in der Bearbeitung von Anfragen.",
        },
        {
          subtitle: "Speicherdauer",
          text: "Die Daten werden gelöscht, sobald Ihre Anfrage abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
        },
      ],
    },
    {
      id: 7,
      title: "Newsletter",
      icon: Mail,
      content: [
        {
          subtitle: "Newsletter-Anmeldung",
          text: "Wenn Sie sich für unseren Newsletter anmelden, verwenden wir die von Ihnen angegebene E-Mail-Adresse, um Ihnen regelmäßig Informationen über BeAFox, Updates und Tipps zur Finanzbildung zuzusenden.",
        },
        {
          subtitle: "Versand über SendGrid",
          text: "Für den Versand unseres Newsletters nutzen wir den Dienst SendGrid (Twilio SendGrid, Inc., 1801 California Street, Suite 500, Denver, CO 80202, USA). Mit dem Anbieter haben wir einen Auftragsverarbeitungsvertrag gem. Art. 28 DS-GVO geschlossen. SendGrid verarbeitet die Daten in den USA. Wir haben Standardvertragsklauseln (SCC) mit SendGrid vereinbart.",
        },
        {
          subtitle: "Anmeldeverfahren",
          text: "Die Anmeldung erfolgt im Double-Opt-In-Verfahren. Sie erhalten nach der Anmeldung eine E-Mail, in der Sie um die Bestätigung Ihrer Anmeldung gebeten werden. Erst nach dieser Bestätigung wird Ihre E-Mail-Adresse zum Versand des Newsletters freigeschaltet.",
        },
        {
          subtitle: "Logging des Opt-Ins",
          text: "Ihre Einwilligung sowie der Zeitpunkt der Anmeldung werden protokolliert, um diese rechtlich nachweisen zu können.",
        },
        {
          subtitle: "Rechtsgrundlage",
          text: "Rechtsgrundlage für den Versand des Newsletters ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DS-GVO).",
        },
        {
          subtitle: "Widerruf",
          text: "Sie können Ihre Einwilligung zum Erhalt des Newsletters jederzeit widerrufen. In jeder Newsletter-E-Mail finden Sie einen entsprechenden Link. Sie können auch jederzeit eine E-Mail an info@beafox.app senden.",
        },
      ],
    },
    {
      id: 8,
      title: "Nutzung der BeAFox-App / Erstellung eines Nutzerkontos",
      icon: Smartphone,
      content: [
        {
          subtitle: "Registrierung",
          text: "Bei der Registrierung für ein Nutzerkonto in der BeAFox-App erheben wir folgende Daten:",
          list: [
            "Benutzername",
            "E-Mail-Adresse",
            "Passwort (verschlüsselt gespeichert)",
          ],
        },
        {
          subtitle: "Zweck der Verarbeitung",
          text: "Diese Daten werden benötigt, um Ihnen Zugang zur App zu gewähren, Ihr Nutzerkonto zu verwalten und Ihnen personalisierte Lerninhalte anzubieten.",
        },
        {
          subtitle: "Rechtsgrundlage",
          text: "Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DS-GVO zur Erfüllung des Nutzungsvertrags.",
        },
        {
          subtitle: "Speicherdauer",
          text: "Ihre Account-Daten werden gespeichert, solange Ihr Nutzerkonto besteht. Nach Löschung Ihres Kontos werden die Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
        },
      ],
    },
    {
      id: 9,
      title: "Verarbeitung von Lern- und Nutzungsdaten",
      icon: FileText,
      content: [
        {
          subtitle: "Erhobene Daten",
          text: "Bei der Nutzung der BeAFox-App verarbeiten wir folgende Daten:",
          list: [
            "Lernfortschritt (abgeschlossene Lektionen, Missionen, XP-Punkte)",
            "Statistiken (Richtige/Falsche Antworten, Lernzeit)",
            "Ranglisten-Position",
            "Geräteinformationen (Gerätetyp, Betriebssystem, App-Version)",
            "Nutzungszeiten und Zugriffszeiten",
          ],
        },
        {
          subtitle: "Zweck der Verarbeitung",
          text: "Diese Daten werden verwendet, um:",
          list: [
            "Ihren Lernfortschritt zu speichern und anzuzeigen",
            "Personalisierte Lernempfehlungen zu geben",
            "Ranglisten zu erstellen",
            "Die App zu verbessern und zu optimieren",
            "Technische Probleme zu identifizieren und zu beheben",
          ],
        },
        {
          subtitle: "Rechtsgrundlage",
          text: "Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DS-GVO zur Erfüllung des Nutzungsvertrags sowie Art. 6 Abs. 1 lit. f DS-GVO zur Verbesserung unserer Dienste.",
        },
        {
          subtitle: "Speicherung in der Cloud",
          text: "Ihre Lern- und Nutzungsdaten werden auf unseren Servern gespeichert, um eine Synchronisation zwischen verschiedenen Geräten zu ermöglichen. So können Sie Ihre Lernfortschritte auf jedem Gerät abrufen.",
        },
      ],
    },
    {
      id: 10,
      title: "In-App-Käufe und Zahlungen",
      icon: CreditCard,
      content: [
        {
          subtitle: "Zahlungsabwicklung",
          text: "Wenn Sie In-App-Käufe in der BeAFox-App tätigen (z.B. Premium-Abo), erfolgt die Zahlungsabwicklung über den jeweiligen App-Store (Apple App Store oder Google Play Store).",
        },
        {
          subtitle: "Verarbeitung durch App-Stores",
          text: "Die App-Stores verarbeiten folgende Daten:",
          list: [
            "Zahlungsinformationen (Kreditkarte, PayPal, etc.)",
            "Kaufhistorie",
            "App Store Account-Informationen",
          ],
        },
        {
          subtitle: "Rechtsgrundlage",
          text: "Die Verarbeitung der Zahlungsdaten erfolgt durch die App-Stores auf Grundlage ihrer jeweiligen Datenschutzerklärungen. Wir erhalten lediglich Bestätigungen über erfolgreiche Zahlungen, keine Zahlungsdaten.",
        },
        {
          subtitle: "Hinweis",
          text: "Bitte beachten Sie die Datenschutzerklärungen von Apple (https://www.apple.com/privacy/) und Google (https://policies.google.com/privacy) für weitere Informationen zur Verarbeitung Ihrer Zahlungsdaten.",
        },
      ],
    },
    {
      id: 11,
      title: "Push-Benachrichtigungen",
      icon: Bell,
      content: [
        {
          subtitle: "Zweck",
          text: "Wir können Ihnen Push-Benachrichtigungen senden, um Sie über neue Lerninhalte, Missionen, Ranglisten-Updates oder wichtige App-Updates zu informieren.",
        },
        {
          subtitle: "Einwilligung",
          text: "Push-Benachrichtigungen werden nur mit Ihrer ausdrücklichen Einwilligung versendet. Sie können diese jederzeit in den App-Einstellungen deaktivieren.",
        },
        {
          subtitle: "Technische Umsetzung",
          text: "Für den Versand von Push-Benachrichtigungen nutzen wir die Dienste der jeweiligen Plattformbetreiber (Apple Push Notification Service bzw. Firebase Cloud Messaging von Google).",
        },
        {
          subtitle: "Rechtsgrundlage",
          text: "Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DS-GVO).",
        },
      ],
    },
    {
      id: 12,
      title: "Externe Links und eingebettete Inhalte",
      icon: ExternalLink,
      content: [
        {
          subtitle: "Links zu anderen Websites",
          text: "Unsere Webseite enthält Links zu Websites Dritter. Wenn Sie einem Link zu einer dieser Websites (die außerhalb unserer Verantwortung liegen) folgen, weisen wir Sie darauf hin, dass diese Websites ihre eigenen Datenschutzrichtlinien haben und dass wir für diese Richtlinien keine Verantwortung oder Haftung übernehmen. Bitte überprüfen Sie diese Datenschutzrichtlinien, bevor Sie freiwillig personenbezogene Daten an diese Websites weitergeben.",
        },
        {
          subtitle: "Technische Notwendigkeit",
          text: "Erst wenn Sie auf einen externen Link klicken, werden Daten zum Linkziel übertragen. Dies ist aufgrund des dem Internet zugrunde liegenden Protokolls (TCP/IP) technisch notwendig. Die übertragenen Daten sind insbesondere: Ihre IP-Adresse, der Zeitpunkt, zu dem Sie den Link angeklickt haben, die Seite auf der Sie den Link angeklickt haben sowie die oben genannten Informationen.",
        },
        {
          subtitle: "Social Media Links",
          text: "Auf unserer Website finden Sie Links zu unseren Social Media Profilen (Instagram, LinkedIn, TikTok). Wenn Sie diese Links anklicken, werden Sie zu den jeweiligen Plattformen weitergeleitet. Die Verarbeitung Ihrer Daten erfolgt dann nach den Datenschutzbestimmungen der jeweiligen Plattform.",
        },
      ],
    },
    {
      id: 13,
      title: "Rechtsgrundlage der Verarbeitung",
      icon: FileText,
      content: [
        {
          subtitle: "Einwilligung (Art. 6 Abs. 1 lit. a DS-GVO)",
          text: "Wenn Sie in die Verarbeitung Ihrer personenbezogenen Daten eingewilligt haben, erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. a DS-GVO.",
        },
        {
          subtitle: "Vertragserfüllung (Art. 6 Abs. 1 lit. b DS-GVO)",
          text: "Wenn die Verarbeitung zur Erfüllung eines Vertrags erforderlich ist, dessen Vertragspartei Sie sind, erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. b DS-GVO.",
        },
        {
          subtitle: "Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c DS-GVO)",
          text: "Wenn die Verarbeitung zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist, erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. c DS-GVO.",
        },
        {
          subtitle: "Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DS-GVO)",
          text: "Die Verarbeitung kann auch auf Grundlage von Art. 6 Abs. 1 lit. f DS-GVO erfolgen, wenn die Verarbeitung zur Wahrung eines berechtigten Interesses unseres Unternehmens oder eines Dritten erforderlich ist und die Interessen, Grundrechte und Grundfreiheiten des Betroffenen nicht überwiegen.",
        },
      ],
    },
    {
      id: 14,
      title: "Dauer der Speicherung",
      icon: Lock,
      content: [
        {
          text: "Das Kriterium für die Dauer der Speicherung von personenbezogenen Daten ist die jeweilige gesetzliche Aufbewahrungsfrist. Nach Ablauf der Frist werden die entsprechenden Daten routinemäßig gelöscht, sofern sie nicht mehr zur Vertragserfüllung oder Vertragsanbahnung erforderlich sind.",
        },
        {
          subtitle: "Speicherdauer im Einzelnen",
          text: "Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben.",
        },
      ],
    },
    {
      id: 15,
      title: "Automatisierte Entscheidungsfindung",
      icon: AlertCircle,
      content: [
        {
          text: "Als verantwortungsbewusstes Unternehmen verzichten wir auf eine automatische Entscheidungsfindung oder ein Profiling. Ihre personenbezogenen Daten werden nicht für automatisierte Entscheidungsprozesse verwendet.",
        },
      ],
    },
    {
      id: 16,
      title: "Datenschutz bei Minderjährigen",
      icon: Users,
      content: [
        {
          subtitle: "Schutz Minderjähriger",
          text: "Unsere Dienste richten sich auch an Minderjährige. Wir nehmen den Schutz der Privatsphäre von Minderjährigen sehr ernst. Wenn Sie unter 16 Jahren sind, benötigen wir die Einwilligung Ihrer Eltern oder Erziehungsberechtigten, bevor wir Ihre personenbezogenen Daten verarbeiten können.",
        },
        {
          subtitle: "Sicherstellung der elterlichen Zustimmung",
          text: "Wir stellen sicher, dass Einwilligungen Minderjähriger unter 16 Jahren nur mit Zustimmung der Eltern erfolgen. Bei der Registrierung in der App wird dies durch eine entsprechende Checkbox und Bestätigung durch Erziehungsberechtigte sichergestellt.",
        },
        {
          subtitle: "Elterliche Kontrolle",
          text: "Eltern und Erziehungsberechtigte können jederzeit Auskunft über die von uns gespeicherten Daten ihrer Kinder verlangen und deren Löschung beantragen.",
        },
        {
          subtitle: "Keine sensiblen Daten",
          text: "Wir verarbeiten bewusst keine sensiblen Daten nach Art. 9 DS-GVO (Gesundheitsdaten, Daten zur Religion, etc.). Unsere App fokussiert sich ausschließlich auf die Vermittlung von Finanzwissen.",
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
              <Shield className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">Datenschutz</span>
              <Shield className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-darkerGray mb-4 md:mb-6"
          >
            Datenschutzerklärung
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl text-lightGray max-w-2xl mx-auto"
          >
            Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese
            Datenschutzerklärung informiert Sie über die Art, den Umfang und
            Zweck der Verarbeitung von personenbezogenen Daten.
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
                        {"list" in item && item.list && (
                          <ul className="space-y-2 ml-4">
                            {item.list.map(
                              (listItem: string, listIndex: number) => (
                                <li
                                  key={listIndex}
                                  className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-lightGray"
                                >
                                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                                  <span>{listItem}</span>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                        {"details" in item && item.details && (
                          <div className="bg-white rounded-lg p-3 md:p-4 border border-primaryOrange/20">
                            {item.details.map(
                              (detail: string, detailIndex: number) => (
                                <p
                                  key={detailIndex}
                                  className={`text-sm md:text-base text-lightGray ${
                                    detail === "" ? "mb-2" : "mb-1 last:mb-0"
                                  }`}
                                >
                                  {detail}
                                </p>
                              )
                            )}
                          </div>
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
            <Mail className="w-10 h-10 md:w-16 md:h-16 text-primaryOrange mx-auto mb-3 md:mb-4" />
            <h2 className="text-xl md:text-3xl font-bold text-darkerGray mb-3 md:mb-4">
              Fragen zum Datenschutz?
            </h2>
            <p className="text-sm md:text-lg text-lightGray mb-4 md:mb-6">
              Wenn Sie Fragen zu dieser Datenschutzerklärung haben oder Ihre
              Rechte geltend machen möchten, kontaktieren Sie uns gerne:
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
            Stand dieser Datenschutzerklärung: Dezember 2025
          </p>
          <p className="text-xs md:text-sm text-lightGray mt-2">
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit
            sie stets den aktuellen rechtlichen Anforderungen entspricht oder
            Änderungen unserer Leistungen abzubilden.
          </p>
        </div>
      </Section>
    </>
  );
}

import Section from "@/components/Section";

export default function AGBPage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 via-primaryWhite to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-darkerGray mb-6">
              Allgemeine Geschäftsbedingungen
            </h1>
          </div>
        </div>
      </section>

      <Section className="bg-gray-50">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-2xl font-bold text-darkerGray mb-4">1. Geltungsbereich</h2>
          <p className="text-lightGray mb-6">
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen der 
            BeAFox UG (haftungsbeschränkt), 93073 Neutraubling (nachfolgend "BeAFox" genannt) 
            und ihren Kunden über die Nutzung der BeAFox-App und der damit verbundenen Dienstleistungen.
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">2. Vertragsgegenstand</h2>
          <p className="text-lightGray mb-6">
            BeAFox bietet eine mobile Lern-App für Finanzbildung an. Die App ermöglicht es Nutzern, 
            spielerisch Finanzwissen zu erwerben und zu vertiefen. Für Bildungseinrichtungen und 
            Unternehmen werden zusätzliche Services wie Workshops, Monitoring-Dashboards und Zertifikate angeboten.
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">3. Vertragsschluss</h2>
          <p className="text-lightGray mb-6">
            Der Vertrag kommt durch die Annahme des Angebots von BeAFox zustande. Die Annahme kann 
            schriftlich, per E-Mail oder durch Nutzung der App erfolgen.
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">4. Leistungen</h2>
          <p className="text-lightGray mb-6">
            BeAFox verpflichtet sich, die vereinbarten Leistungen sorgfältig und nach bestem Wissen 
            und Gewissen zu erbringen. Die genauen Leistungen ergeben sich aus dem jeweiligen 
            Vertragsangebot.
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">5. Preise und Zahlung</h2>
          <p className="text-lightGray mb-6">
            Die Preise verstehen sich in Euro zuzüglich der gesetzlichen Mehrwertsteuer. Die 
            Zahlung erfolgt nach Vereinbarung im Vertrag. Bei Zahlungsverzug werden Verzugszinsen 
            in Höhe von 9 Prozentpunkten über dem Basiszinssatz berechnet.
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">6. Nutzungsrechte</h2>
          <p className="text-lightGray mb-6">
            Dem Kunden wird ein einfaches, nicht übertragbares, nicht exklusives Recht zur Nutzung 
            der App für den vereinbarten Zweck eingeräumt. Eine Weitergabe der Zugangsdaten an 
            Dritte ist nicht gestattet.
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">7. Haftung</h2>
          <p className="text-lightGray mb-6">
            BeAFox haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Bei leichter Fahrlässigkeit 
            haftet BeAFox nur bei Verletzung einer wesentlichen Vertragspflicht, deren Erfüllung die 
            ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht.
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">8. Kündigung</h2>
          <p className="text-lightGray mb-6">
            Das Vertragsverhältnis kann von beiden Seiten mit einer Frist von [Frist] zum Ende eines 
            Kalendermonats gekündigt werden. Das Recht zur außerordentlichen Kündigung aus wichtigem 
            Grund bleibt unberührt.
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">9. Schlussbestimmungen</h2>
          <p className="text-lightGray mb-6">
            Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand für alle Streitigkeiten 
            aus diesem Vertrag ist der Sitz von BeAFox, sofern der Kunde Kaufmann, juristische Person des 
            öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.
          </p>
        </div>
      </Section>
    </>
  );
}


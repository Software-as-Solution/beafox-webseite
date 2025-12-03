import Section from "@/components/Section";

export default function DatenschutzPage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 via-primaryWhite to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-darkerGray mb-6">
              Datenschutzerklärung
            </h1>
          </div>
        </div>
      </section>

      <Section className="bg-gray-50">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-2xl font-bold text-darkerGray mb-4">1. Datenschutz auf einen Blick</h2>
          
          <h3 className="text-xl font-bold text-darkerGray mb-3 mt-6">Allgemeine Hinweise</h3>
          <p className="text-lightGray mb-4">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen 
            Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit 
            denen Sie persönlich identifiziert werden können.
          </p>

          <h3 className="text-xl font-bold text-darkerGray mb-3 mt-6">Datenerfassung auf dieser Website</h3>
          <p className="text-lightGray mb-4">
            <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
            <br />
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
            können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen.
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">2. Allgemeine Hinweise und Pflichtinformationen</h2>
          
          <h3 className="text-xl font-bold text-darkerGray mb-3 mt-6">Datenschutz</h3>
          <p className="text-lightGray mb-4">
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln 
            Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzbestimmungen 
            sowie dieser Datenschutzerklärung.
          </p>

          <h3 className="text-xl font-bold text-darkerGray mb-3 mt-6">Hinweis zur verantwortlichen Stelle</h3>
          <p className="text-lightGray mb-4">
            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
            <br />
            <br />
            BeAFox UG (haftungsbeschränkt)
            <br />
            93073 Neutraubling
            <br />
            Deutschland
            <br />
            <br />
            Telefon: +49 178 2723 673
            <br />
            E-Mail: info@beafox.app
          </p>

          <h3 className="text-xl font-bold text-darkerGray mb-3 mt-6">Speicherdauer</h3>
          <p className="text-lightGray mb-4">
            Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, 
            verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung 
            entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur 
            Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich 
            zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben.
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">3. Datenerfassung auf dieser Website</h2>
          
          <h3 className="text-xl font-bold text-darkerGray mb-3 mt-6">Kontaktformular</h3>
          <p className="text-lightGray mb-4">
            Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem 
            Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung 
            der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir 
            nicht ohne Ihre Einwilligung weiter.
          </p>

          <h3 className="text-xl font-bold text-darkerGray mb-3 mt-6">Server-Log-Dateien</h3>
          <p className="text-lightGray mb-4">
            Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten 
            Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
          </p>
          <ul className="list-disc pl-6 text-lightGray mb-4">
            <li>Browsertyp und Browserversion</li>
            <li>verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse</li>
          </ul>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">4. Ihre Rechte</h2>
          <p className="text-lightGray mb-4">
            Sie haben jederzeit das Recht, Auskunft über Ihre bei uns gespeicherten personenbezogenen 
            Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung zu erhalten. Außerdem 
            haben Sie ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
          </p>
        </div>
      </Section>
    </>
  );
}


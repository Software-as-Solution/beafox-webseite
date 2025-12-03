import Section from "@/components/Section";

export default function ImpressumPage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 via-primaryWhite to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-darkerGray mb-6">
              Impressum
            </h1>
          </div>
        </div>
      </section>

      <Section className="bg-gray-50">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-2xl font-bold text-darkerGray mb-4">Angaben gemäß § 5 TMG</h2>
          <p className="text-lightGray mb-6">
            BeAFox UG (haftungsbeschränkt)
            <br />
            93073 Neutraubling
            <br />
            Deutschland
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">Kontakt</h2>
          <p className="text-lightGray mb-6">
            Telefon: +49 178 2723 673
            <br />
            E-Mail: info@beafox.app
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">Vertreten durch</h2>
          <p className="text-lightGray mb-6">
            Die Geschäftsführung
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">Registereintrag</h2>
          <p className="text-lightGray mb-6">
            Eintragung im Handelsregister.
            <br />
            Registergericht: [Registergericht]
            <br />
            Registernummer: [Registernummer]
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">Umsatzsteuer-ID</h2>
          <p className="text-lightGray mb-6">
            Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:
            <br />
            [Umsatzsteuer-ID]
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p className="text-lightGray mb-6">
            BeAFox UG (haftungsbeschränkt)
            <br />
            93073 Neutraubling
            <br />
            Deutschland
          </p>

          <h2 className="text-2xl font-bold text-darkerGray mb-4 mt-8">Haftungsausschluss</h2>
          
          <h3 className="text-xl font-bold text-darkerGray mb-3 mt-6">Haftung für Inhalte</h3>
          <p className="text-lightGray mb-4">
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
            nach den allgemeinen Gesetzen verantwortlich.
          </p>

          <h3 className="text-xl font-bold text-darkerGray mb-3 mt-6">Haftung für Links</h3>
          <p className="text-lightGray mb-4">
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen 
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
            Seiten verantwortlich.
          </p>

          <h3 className="text-xl font-bold text-darkerGray mb-3 mt-6">Urheberrecht</h3>
          <p className="text-lightGray mb-4">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
            Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </div>
      </Section>
    </>
  );
}


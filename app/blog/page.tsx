"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import Image from "next/image";
import { PawPrint, Calendar } from "lucide-react";

export default function BlogPage() {
  const specialMoments = [
    {
      id: 1,
      title: "Wir haben gewonnen!",
      description:
        "Wir sind stolz darauf, den Deggendorfer Gründerpreis gewonnen zu haben! Trotz Nervosität und einem in letzter Minute überarbeiteten Pitch hat sich unsere Arbeit ausgezahlt - etwa 60% des Publikums haben für uns gestimmt. Vielen Dank an das gesamte Team für die tolle Organisation und die 2.500€ Preisgeld. Wir freuen uns auf weitere Schritte mit BeAFox!",
      image: "/assets/Blogs/Blog1.jpeg",
      date: "20.11.2025",
      category: "Events",
    },
    {
      id: 2,
      title: "BeAFox bei Ed.One in München!",
      description:
        "So erlebt man Finanzbildung im Klassenzimmer. Beim Ed.One Summit in München haben Schüler, Lehrer und Ausbilder BeAFox live getestet - vom Dashboard über die Lern-App bis hin zu den Arbeitsblättern. Wir haben wertvolles Feedback erhalten, spannende Kontakte geknüpft und unseren Pitch präsentiert. BeAFox zeigt, wie einfach Finanzbildung sein kann. Wir suchen dich!",
      image: "/assets/Blogs/Blog2.jpeg",
      date: "09.10.2025",
      category: "Events",
    },
    {
      id: 3,
      title: "BeAFox gewinnt Startup Summit!",
      description:
        "BeAFox hat den 2. Platz beim Startup Summit Germany erreicht - unser erster offizieller Preis! Zum ersten Mal haben wir als Duo gepitcht, mit einem neuen Pitch, Pitch Deck und einer Präsentation, die unsere Vision noch stärker vermittelt hat. Nach zwei Jahren harter Arbeit zeigt es, dass Durchhaltevermögen, Mut und Teamarbeit sich auszahlen. Vielen Dank an die Volksbank am Württemberg eG für diese großartige Veranstaltung!",
      image: "/assets/Blogs/Blog3.jpg",
      date: "29.09.2025",
      category: "Events",
    },
  ];

  // Alle Artikel - Bilder von 1.jpeg (ältestes) bis 19.jpeg (neuestes)
  // Array wird umgekehrt, damit 19.jpeg (neuestes) zuerst angezeigt wird
  const allArticles = Array.from({ length: 19 }, (_, i) => ({
    id: i + 1,
    image: `/assets/Blogs/${i + 1}.jpeg`,
    title: "", // Wird später hinzugefügt
    description: "", // Wird später hinzugefügt
    date: "", // Wird später hinzugefügt
    category: "", // Wird später hinzugefügt
  })).reverse();

  // Artikel 1 (ältestes) - DENK.Summit
  const article1Index = allArticles.findIndex((a) => a.id === 1);
  if (article1Index !== -1) {
    allArticles[article1Index] = {
      ...allArticles[article1Index],
      title: "Was für ein Tag: DENK.Summit",
      description:
        'Mit BeAFox durften wir unser Startup in der Startup-Area des DENK.Summit präsentieren – mit überwältigend positivem Feedback: „Wahnsinnig schöner Stand“, „cooles Branding, ihr stecht richtig heraus“. In nur zwei Stunden testeten über 50 Schüler*innen und Studierende die App. Fast alle bestätigten: Finanzbildung findet in der Schule bisher kaum statt. Dieses Erlebnis hat uns einmal mehr gezeigt, wie wichtig unsere Mission ist."',
      date: "",
      category: "Events",
    };
  }

  // Artikel 2 - Gründung beim Notar
  const article2Index = allArticles.findIndex((a) => a.id === 2);
  if (article2Index !== -1) {
    allArticles[article2Index] = {
      ...allArticles[article2Index],
      title: "Jetzt ist es offiziell. Wir waren beim Notar",
      description:
        "BeAFox ist offiziell gegründet: Wir waren beim Notar und haben den Gesellschaftsvertrag unterschrieben – ein großer Meilenstein nach vielen Monaten voller Ideen, Feedback und Tests. Unser Ziel bleibt klar: Finanzbildung für junge Menschen verständlich, unabhängig und spielerisch machen. Als Nächstes folgen Markeneintragung, weitere Pilotprojekte mit Schulen und Unternehmen und der nächste große Schritt in Richtung Marktdurchbruch.",
      date: "",
      category: "News",
    };
  }

  // Artikel 3 - Erster Pitch bei TechBase Regensburg
  const article3Index = allArticles.findIndex((a) => a.id === 3);
  if (article3Index !== -1) {
    allArticles[article3Index] = {
      ...allArticles[article3Index],
      title: "Unser erster Pitch und dann gleich vor über 200 Menschen",
      description:
        "Mein erster Pitch überhaupt – und dann direkt vor über 200 Menschen bei den Tigern der TechBase Regensburg! Ich durfte unsere Vision von BeAFox präsentieren, erzählen, warum Finanzbildung für junge Menschen so wichtig ist und wie unsere App genau dort ansetzt. Besonders wertvoll waren die Gespräche im Anschluss: Lehrkräfte, Schüler*innen und Unternehmen haben sich in der Story wiedergefunden und Interesse an einer Zusammenarbeit gezeigt.",
      date: "",
      category: "Events",
    };
  }

  // Artikel 4 - Ideenpitch Region Nürnberg
  const article4Index = allArticles.findIndex((a) => a.id === 4);
  if (article4Index !== -1) {
    allArticles[article4Index] = {
      ...allArticles[article4Index],
      title: "Nächster erfolgreicher Pitch für BeAFox",
      description:
        "Beim Ideenpitch Region Nürnberg durften wir BeAFox zum ersten Mal außerhalb von Regensburg vorstellen. Der überarbeitete Pitch kam super an und half, unsere Idee noch klarer und greifbarer zu machen. Besonders gefreut haben uns die vielen Gespräche mit Vertreter*innen aus Bildung und Wirtschaft. Unser Ziel: BeAFox rechtzeitig zum bayerischen Schulstart an die Schulen bringen – damit Finanzbildung endlich dort ankommt, wo sie hingehört.",
      date: "",
      category: "Events",
    };
  }

  // Artikel 5 - Erster Einsatz im Klassenzimmer
  const article5Index = allArticles.findIndex((a) => a.id === 5);
  if (article5Index !== -1) {
    allArticles[article5Index] = {
      ...allArticles[article5Index],
      title: "BeAFox das erste Mal im Klassenzimmer",
      description:
        "Heute war ein besonderer Tag: BeAFox war zum ersten Mal im echten Unterricht im Einsatz – an der Staatlichen Realschule Neutraubling. Gemeinsam mit 25 Schüler:innen haben wir Finanzbildung mit der App ausprobiert. Das Ergebnis: 24 von 25 wünschen sich BeAFox fest in ihrem Unterricht. Für uns ein starkes Signal, dass junge Menschen digitale, interaktive Formate wollen – und dass wir mit unserem Ansatz im Klassenzimmer genau richtig liegen.",
      date: "",
      category: "Events",
    };
  }

  // Artikel 6 - Artikel in der Mittelbayerischen Zeitung
  const article6Index = allArticles.findIndex((a) => a.id === 6);
  if (article6Index !== -1) {
    allArticles[article6Index] = {
      ...allArticles[article6Index],
      title: "Mittelbayerische Zeitung",
      description:
        "„Mit dem Smartphone zum Finanzfuchs“ – unter diesem Titel ist unser erster großer Artikel in der Mittelbayerischen Zeitung erschienen. Ein Gänsehautmoment, die eigene Vision plötzlich schwarz auf weiß zu sehen. Im Fokus: Warum Finanzbildung für junge Menschen so wichtig ist, wie BeAFox Lehrkräfte im Unterricht unterstützt und weshalb wir bewusst unabhängig von Werbung und Verkaufsinteressen bleiben. Ein riesiges Dankeschön an alle Beteiligten!",
      date: "",
      category: "News",
    };
  }

  // Artikel 7 - Neues Logo
  const article7Index = allArticles.findIndex((a) => a.id === 7);
  if (article7Index !== -1) {
    allArticles[article7Index] = {
      ...allArticles[article7Index],
      title: "Neues Logo für BeAFox",
      description:
        "Feedback ist Gold wert: Unser erstes Logo wirkte improvisiert und nicht professionell genug – also haben wir gehandelt. Gemeinsam mit einem Designer ist ein neues BeAFox-Logo entstanden: moderner, klarer, freundlicher und perfekt auf unsere Zielgruppe abgestimmt. Für uns ist das mehr als ein Design-Update. Es ist ein Symbol dafür, wie ernst wir unsere Mission nehmen und wie wichtig ein stimmiger Auftritt für Schulen, Unternehmen und Nutzer:innen ist.",
      date: "",
      category: "News",
    };
  }

  // Artikel 8 - Artikel in der Donau-Post
  const article8Index = allArticles.findIndex((a) => a.id === 8);
  if (article8Index !== -1) {
    allArticles[article8Index] = {
      ...allArticles[article8Index],
      title: "Donau-Post Artikel",
      description:
        "BeAFox in der Zeitung – diesmal mit einem ganz besonderen Titel: „Wir müssen über Geld reden!“ Die Donau-Post hat einen ausführlichen Artikel über uns veröffentlicht und erzählt, wie aus einer Idee ein echtes Lernangebot für Schulen wurde. Nach 1,5 Jahren Arbeit, Zweifeln und vielen Nachtschichten ist dieser Moment etwas Besonderes. Er zeigt: All die investierte Zeit zahlt sich aus – und unsere Mission erreicht immer mehr Menschen.",
      date: "",
      category: "News",
    };
  }

  // Artikel 9 - Release im App Store & Play Store
  const article9Index = allArticles.findIndex((a) => a.id === 9);
  if (article9Index !== -1) {
    allArticles[article9Index] = {
      ...allArticles[article9Index],
      title: "Release App Store & Play Store",
      description:
        "Es ist so weit: BeAFox ist offiziell im App Store und Play Store verfügbar! Nach über 1,5 Jahren Entwicklung, Tests und unzähligen Anpassungen sind wir live gegangen – sogar drei Monate früher als ursprünglich geplant. Unser Anspruch: Finanzbildung so einfach und zugänglich wie möglich machen, ohne Werbung, ohne versteckte Verkaufsinteressen. Jetzt zählt jeder Download, jedes Feedback und jede Empfehlung, um noch mehr junge Menschen zu erreichen.",
      date: "",
      category: "News",
    };
  }

  // Artikel 10 - Chamlandschau & persönliche Geschichte
  const article10Index = allArticles.findIndex((a) => a.id === 10);
  if (article10Index !== -1) {
    allArticles[article10Index] = {
      ...allArticles[article10Index],
      title: "BeAFox auf der ChamlandSchau",
      description:
        "Mit 18 die Schule beendet, keinen Plan vom Leben und Schulden aufgebaut – so begann meine Geschichte. Heute habe ich gelernt, mit Geld umzugehen und mit BeAFox ein Startup aufgebaut, das genau hier ansetzt. Auf der Chamlandschau standen wir mit unserem kleinen Stand zwischen großen Unternehmen – und hatten trotzdem durchgehend volle Gespräche. Das zeigt: Gerade junge Menschen spüren, dass Finanzbildung fehlt und suchen nach Antworten.",
      date: "",
      category: "Events",
    };
  }

  // Artikel 11 - Innovationstag Pitch
  const article11Index = allArticles.findIndex((a) => a.id === 11);
  if (article11Index !== -1) {
    allArticles[article11Index] = {
      ...allArticles[article11Index],
      title: "Ich durfte BeAFox auf dem Innovationstag pitchen",
      description:
        "Mein erster Pitch auf Englisch – fünf Minuten lang beim Innovationstag, vor einem internationalen Publikum. Auch wenn wir diesmal nicht gewonnen haben, war es eine enorm wertvolle Erfahrung. Ich durfte BeAFox auf einer neuen Bühne präsentieren, neue Perspektiven auf Finanzbildung kennenlernen und viele spannende Kontakte knüpfen. Genau solche Momente zeigen, wie wichtig es ist, mutig zu sein, Neues auszuprobieren und kontinuierlich besser zu werden.",
      date: "",
      category: "Events",
    };
  }

  // Artikel 12 - Startup Summit Deutschland 2. Platz
  const article12Index = allArticles.findIndex((a) => a.id === 12);
  if (article12Index !== -1) {
    allArticles[article12Index] = {
      ...allArticles[article12Index],
      title: "We did it",
      description:
        "Mit BeAFox haben wir den 2. Platz beim Startup Summit Deutschland erreicht! Unser erster gemeinsamer Team-Pitch, neues Deck, neues Konzept – und direkt eine Auszeichnung inklusive Preisgeld. Nach zwei Jahren intensiver Arbeit, in denen wir viel getestet, verworfen und verbessert haben, fühlt sich dieser Moment wie ein starkes Zeichen an: Unsere Idee trägt. Ein großes Dankeschön an alle Unterstützer:innen und die Volksbank am Württemberg eG.",
      date: "",
      category: "News",
    };
  }

  // Artikel 13 - BÖB Kongress & Finanzbildung als Schulfach
  const article13Index = allArticles.findIndex((a) => a.id === 13);
  if (article13Index !== -1) {
    allArticles[article13Index] = {
      ...allArticles[article13Index],
      title: "BeAFox auf dem BÖB Kongress",
      description:
        "Beim Kongress des Bündnis Ökonomische Bildung Deutschland wurde viel über Finanzbildung als eigenes Schulfach diskutiert – mit neuen Lehrbüchern, Fächern und Fortbildungen. Ich habe die Frage gestellt: Reicht das wirklich? Bei Lehrkräftemangel und einem Thema, über das viele ungern sprechen? Ich glaube, wir brauchen zusätzlich neue Wege: digitale Tools, Gamification und Projektarbeit. Genau hier setzt BeAFox an – als Ergänzung, nicht als Konkurrenz zum Unterricht.",
      date: "",
      category: "News",
    };
  }

  // Artikel 14 - Summit der Stiftung Entrepreneurship in Berlin
  const article14Index = allArticles.findIndex((a) => a.id === 14);
  if (article14Index !== -1) {
    allArticles[article14Index] = {
      ...allArticles[article14Index],
      title: "BeAFox auf dem Summit der Stiftung Entrepreneurship",
      description:
        "BeAFox auf dem Summit der Stiftung Entrepreneurship in Berlin – ein Wochenende voller Inspiration. Immer wieder hörten wir den Satz: „Finanzbildung ist wichtig!“ und spürten, wie groß der Bedarf an modernen Lösungen ist. Wir konnten unsere App vorstellen, bekamen durchweg positives Feedback und führten intensive Gespräche mit Menschen, die das Thema genauso ernst nehmen wie wir. Dieses Event hat uns in unserer Vision klar bestärkt.",
      date: "",
      category: "Events",
    };
  }

  // Artikel 15 - YFC München
  const article15Index = allArticles.findIndex((a) => a.id === 15);
  if (article15Index !== -1) {
    allArticles[article15Index] = {
      ...allArticles[article15Index],
      title: "Was für ein Erlebnis: Die YFC",
      description:
        "Was für ein Erlebnis: Mit BeAFox waren wir auf der YFC in München, der ersten Konferenz des Young Founders Network. Zwischen inspirierenden Speakern, vielen Startups und großartigem Networking konnten wir unsere Lern-App an einem eigenen Stand zeigen. Die Organisation, die Atmosphäre und der Austausch haben uns beeindruckt. Ein besonderes Highlight: die Ankündigung des Young Founders Fund – eine Chance, die wir natürlich nutzen wollen.",
      date: "",
      category: "Events",
    };
  }

  // Artikel 16 - DemoNight Nürnberg
  const article16Index = allArticles.findIndex((a) => a.id === 16);
  if (article16Index !== -1) {
    allArticles[article16Index] = {
      ...allArticles[article16Index],
      title: "BeAFox auf der DemoNight in Nürnberg",
      description:
        "BeAFox auf der Startup DemoNight von BayStartup in Nürnberg: Schon beim Ankommen sprach uns ein Gründer an, der uns aus Social Media kannte – ein kurzer Moment, der uns enorm motiviert hat. Der Abend bot spannende Gespräche, neue Kontakte und viele innovative Ideen. Solche Events erinnern uns daran, warum wir BeAFox bauen: um echte Probleme zu lösen und Finanzbildung dorthin zu bringen, wo sie im Alltag junger Menschen wirklich ankommt.",
      date: "",
      category: "Events",
    };
  }

  // Artikel 17 - Erster Workshop
  const article17Index = allArticles.findIndex((a) => a.id === 17);
  if (article17Index !== -1) {
    allArticles[article17Index] = {
      ...allArticles[article17Index],
      title: "Unser erster Workshop.",
      description:
        "Unser erster Finanzbildungs-Workshop für Auszubildende – in Kombination mit der BeAFox-App – war ein voller Erfolg. Statt einmaliger Theorie setzen wir auf praktische Übungen: individuelle Budgets erstellen, Depot eröffnen, erste Investitionen planen, Versicherungen verstehen und die Steuererklärung nutzen. Das Besondere: Mit BeAFox können die Teilnehmenden nach dem Workshop weiterlernen und das Wissen vertiefen. Unternehmen erhalten so ein nachhaltiges Bildungsangebot.",
      date: "",
      category: "News",
    };
  }

  // Artikel 18 - Rütteltest Wirtschaftsjunioren Regensburg
  const article18Index = allArticles.findIndex((a) => a.id === 18);
  if (article18Index !== -1) {
    allArticles[article18Index] = {
      ...allArticles[article18Index],
      title: "Rütteltest Wirtschaftsjunioren Regensburg",
      description:
        "Beim Rütteltest der Wirtschaftsjunioren Regensburg durften wir BeAFox über 20 Minuten pitchen und bekamen anschließend mehr als eine Stunde ehrliches, tiefgehendes Feedback von sechs Expert:innen. Unser gesamtes Geschäftsmodell wurde konstruktiv hinterfragt – genau das, was wir uns gewünscht hatten. Wir nehmen viele Impulse mit, haben neue Prioritäten gesetzt und uns direkt entschieden, den Wirtschaftsjunioren beizutreten. Eine Erfahrung, die wir jedem Startup empfehlen.",
      date: "",
      category: "Events",
    };
  }

  // Artikel 19 - Startchancen-Programm
  const article19Index = allArticles.findIndex((a) => a.id === 19);
  if (article19Index !== -1) {
    allArticles[article19Index] = {
      ...allArticles[article19Index],
      title: "Startchancen-Programm",
      description:
        "Große Neuigkeiten: BeAFox ist Teil des Startchancen-Programms! Dadurch können Schulen unsere Lern-App vollständig über Fördermittel finanzieren. Für uns ist das ein starkes Signal: Finanzbildung gehört in den Schulalltag. Viele von uns hätten sich genau so ein Angebot in ihrer Schulzeit gewünscht – praxisnah, spielerisch und alltagsrelevant. Jetzt erreichen wir Schulen, die bisher kaum Zugang zu solchen Angeboten hatten, und kommen unserem Ziel echter Chancengerechtigkeit näher.",
      date: "",
      category: "News",
    };
  }

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
              <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">Unser Blog</span>
              <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-darkerGray mb-6"
          >
            Entdecke, wie BeAFox{" "}
            <span className="text-primaryOrange">zum Leben erweckt</span> wird
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-lightGray max-w-2xl mx-auto"
          >
            Erfahre mehr über unsere Reise, Events, Updates und wie wir
            Finanzbildung für junge Menschen revolutionieren.
          </motion.p>
        </div>
      </Section>

      {/* Unsere besonderen Momente Section */}
      <Section className="bg-white py-2 md:py-4 lg:py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              Unsere{" "}
              <span className="text-primaryOrange">besonderen Momente</span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-2xl mx-auto">
              Die wichtigsten Meilensteine unserer Reise mit BeAFox.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {specialMoments.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border-2 border-primaryOrange rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative h-72 md:h-80 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-primaryOrange bg-primaryOrange/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-lightGray text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-darkerGray mb-3">
                    {post.title}
                  </h3>
                  <p className="text-lightGray text-sm leading-relaxed flex-1 mb-4">
                    {post.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Alle unsere Artikel Section */}
      <Section className="bg-primaryWhite py-2 md:py-4 lg:py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              All unsere <span className="text-primaryOrange">Artikel</span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-2xl mx-auto">
              Entdecke alle unsere Blog-Posts und Updates.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {allArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border-2 border-primaryOrange rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative h-72 md:h-80 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title || `Blog Artikel ${article.id}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  {(article.category || article.date) && (
                    <div className="flex items-center gap-3 mb-3">
                      {article.category && (
                        <span className="text-xs font-semibold text-primaryOrange bg-primaryOrange/10 px-3 py-1 rounded-full">
                          {article.category}
                        </span>
                      )}
                      {article.date && (
                        <div className="flex items-center gap-1 text-lightGray text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{article.date}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {article.title && (
                    <h3 className="text-xl font-bold text-darkerGray mb-3">
                      {article.title}
                    </h3>
                  )}
                  {article.description && (
                    <p className="text-lightGray text-sm leading-relaxed flex-1 mb-4">
                      {article.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

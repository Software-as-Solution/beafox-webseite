export const BLOG_CATEGORIES = [
  {
    slug: "finanzen-fuer-schueler",
    navLabel: "Schüler",
    title: "Finanzen fuer Schueler",
    description:
      "Taschengeld, erstes Konto, Nebenjob - so wirst du als Schueler finanziell fit.",
    metaTitle: "Finanzen fuer Schueler - Tipps & Ratgeber | BeAFox",
    metaDescription:
      "Finanzbildung fuer Schueler: Taschengeld einteilen, erstes Girokonto, Nebenjob und Steuern. Praktische Ratgeber von BeAFox.",
    emoji: "🎒",
  },
  {
    slug: "finanzen-fuer-azubis",
    navLabel: "Azubis",
    title: "Finanzen fuer Azubis",
    description:
      "Erstes Gehalt, Gehaltsabrechnung, VWL - alles was du als Azubi wissen musst.",
    metaTitle: "Finanzen fuer Azubis - Erstes Gehalt & mehr | BeAFox",
    metaDescription:
      "Finanztipps fuer Azubis: Gehaltsabrechnung verstehen, VWL nutzen, richtig sparen. Schritt-fuer-Schritt Ratgeber von BeAFox.",
    emoji: "🔧",
  },
  {
    slug: "finanzen-fuer-studenten",
    navLabel: "Studenten",
    title: "Finanzen fuer Studenten",
    description:
      "BAfoeG, Studienkredit, Werkstudent - finanziell durch das Studium kommen.",
    metaTitle: "Finanzen fuer Studenten - BAfoeG, Sparen & mehr | BeAFox",
    metaDescription:
      "Finanz-Ratgeber fuer Studierende: BAfoeG beantragen, als Werkstudent Steuern sparen, Studienkredit Vor- und Nachteile.",
    emoji: "🎓",
  },
  {
    slug: "finanzen-fuer-berufseinsteiger",
    navLabel: "Berufseinsteiger",
    title: "Finanzen fuer Berufseinsteiger",
    description:
      "Steuererklaerung, Gehaltsverhandlung, Versicherungen - dein Start ins Berufsleben.",
    metaTitle: "Finanzen fuer Berufseinsteiger - Ratgeber & Tipps | BeAFox",
    metaDescription:
      "Erste Steuererklaerung, Gehaltsverhandlung, Versicherungs-Check: Praktische Finanz-Ratgeber fuer den Berufsstart.",
    emoji: "💼",
  },
  {
    slug: "finanzen-bei-lebensereignissen",
    navLabel: "Lebenssituationen",
    title: "Finanzen bei Lebensereignissen",
    description:
      "Umzug, Heiraten, Eltern werden - was du finanziell beachten musst.",
    metaTitle: "Finanzen bei Lebensereignissen - Umzug, Hochzeit & mehr | BeAFox",
    metaDescription:
      "Erste eigene Wohnung, Zusammenziehen, Heiraten, Eltern werden: Was du finanziell beachten musst. Ratgeber von BeAFox.",
    emoji: "🏠",
  },
  {
    slug: "investieren-fuer-anfaenger",
    navLabel: "Investieren",
    title: "Investieren fuer Anfaenger",
    description:
      "ETF, Depot, Sparplan - so laesst du dein Geld fuer dich arbeiten.",
    metaTitle: "Investieren fuer Anfaenger - ETF, Depot & Sparplan | BeAFox",
    metaDescription:
      "Erster ETF kaufen, Depot eroeffnen, Sparplan einrichten: Investieren lernen ohne Fachchinesisch. Ratgeber von BeAFox.",
    emoji: "📈",
  },
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type BlogCategorySlug = BlogCategory["slug"];

export interface BlogPost {
  slug: string;
  categorySlug: BlogCategorySlug;
  /** Kurz-Titel für Mega-Menü / Navigation */
  navTitle?: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  image: string;
  imageAlt: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  related: string[];
}

const COMING_SOON_MESSAGE =
  "Unsere Ratgeber kommen bald wir arbeiten so schnell wie moeglich daran diese zu erstellen.";
const BLOG_PLACEHOLDER_IMAGE = "/Maskottchen/Maskottchen-Hero.png";

const BLOG_POSTS_BASE: BlogPost[] = [
  {
    slug: "taschengeld-richtig-einteilen",
    categorySlug: "finanzen-fuer-schueler",
    navTitle: "Taschengeld einteilen",
    title: "Taschengeld richtig einteilen",
    metaTitle: "Taschengeld richtig einteilen - Finanz-Ratgeber fuer Schueler | BeAFox",
    metaDescription:
      "Lerne, wie du dein Taschengeld sinnvoll aufteilst und sparst. Einfacher Finanz-Ratgeber fuer Schueler.",
    excerpt:
      "Mit einer einfachen 50-30-20 Regel kannst du schon mit kleinem Budget smarter entscheiden.",
    content:
      "Taschengeld ist dein Trainingsfeld fuer spaetere Finanzentscheidungen. Mit festen Toepfen fuer Ausgaben, Spass und Sparen behaltest du die Kontrolle.",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Schueler teilt Taschengeld in Budget-Toepfe ein",
    publishedAt: "2026-03-24",
    readingTime: 5,
    tags: ["taschengeld", "schueler", "budget"],
    related: ["erstes-girokonto-eroeffnen"],
  },
  {
    slug: "erstes-girokonto-eroeffnen",
    categorySlug: "finanzen-fuer-schueler",
    navTitle: "Erstes Girokonto",
    title: "Erstes Girokonto eroeffnen",
    metaTitle: "Erstes Girokonto fuer Schueler - So geht's | BeAFox",
    metaDescription:
      "Schritt fuer Schritt zum ersten Girokonto: Worauf Schueler achten sollten.",
    excerpt:
      "Von Kontofuehrung bis Karte: Das sind die Punkte, die vor der Kontoeroeffnung wichtig sind.",
    content:
      "Ein gutes Jugendkonto ist kostenlos, transparent und passt zu deinem Alltag. Vergleiche Konditionen und checke Limits.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "Erstes Girokonto fuer Schueler auf Smartphone",
    publishedAt: "2026-03-25",
    readingTime: 6,
    tags: ["girokonto", "schueler", "bank"],
    related: ["taschengeld-richtig-einteilen"],
  },
  {
    slug: "nebenjob-und-steuern-unter-18",
    categorySlug: "finanzen-fuer-schueler",
    navTitle: "Nebenjob & Steuern",
    title: "Nebenjob und Steuern unter 18",
    metaTitle: "Nebenjob und Steuern unter 18 - Ratgeber fuer Schueler | BeAFox",
    metaDescription:
      "Was du bei Minijob und Nebenjob beachten solltest: Freigrenzen, Steuer und Meldepflichten.",
    excerpt:
      "Kurz erklaert: Wann du etwas abfuehren musst und wie du Belege sammelst.",
    content:
      "Unter 18 gelten oft dieselben Meldewege wie spaeter - mit klaren Grenzen. Halte Stunden und Einnahmen fest.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "Schueler mit Nebenjob plant Steuern",
    publishedAt: "2026-03-27",
    readingTime: 6,
    tags: ["nebenjob", "steuern", "schueler"],
    related: ["taschengeld-richtig-einteilen"],
  },
  {
    slug: "erstes-gehalt-was-tun",
    categorySlug: "finanzen-fuer-azubis",
    navTitle: "Erstes Gehalt — was tun?",
    title: "Erstes eigenes Geld richtig nutzen: So holst du mehr aus deinem Azubi-Gehalt raus",
    metaTitle: "Erstes Gehalt als Azubi: So teilst du dein Geld richtig ein | BeAFox",
    metaDescription:
      "Dein erstes Azubi-Gehalt ist da — und jetzt? Lerne, wie du dein Geld sinnvoll aufteilst, typische Fehler vermeidest und Schritt fuer Schritt finanzielle Kontrolle aufbaust.",
    excerpt:
      "Dein erstes Gehalt muss nicht einfach nur ausgegeben werden. Lerne mit der 4-Toepfe-Methode, wie du dein Azubi-Gehalt sinnvoll aufteilst, Ruecklagen aufbaust und typische Anfaengerfehler vermeidest.",
    content:
      "In 8 Lektionen lernst du, warum dein Gehalt oft so schnell weg ist, wie die 4-Toepfe-Methode funktioniert, welche Fehler dich Hunderte Euro kosten und wie du deinen ersten echten Geldplan baust.",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Azubi plant erstes Gehalt mit Budget-App",
    publishedAt: "2026-03-24",
    readingTime: 16,
    tags: ["erstes gehalt", "azubi-gehalt", "geld richtig einteilen", "budget fuer azubis", "geld sparen als azubi", "erster monatsplan", "ruecklagen aufbauen", "finanzielle sicherheit fuer azubis"],
    related: ["gehaltsabrechnung-verstehen", "notgroschen-aufbauen-azubi", "vermoegenswirksame-leistungen"],
  },
  {
    slug: "gehaltsabrechnung-verstehen",
    categorySlug: "finanzen-fuer-azubis",
    navTitle: "Gehaltsabrechnung verstehen",
    title: "Gehaltsabrechnung verstehen",
    metaTitle: "Gehaltsabrechnung fuer Azubis einfach erklaert | BeAFox",
    metaDescription:
      "Brutto, Netto, Abzuege: Verstehe deine Gehaltsabrechnung als Azubi.",
    excerpt:
      "So liest du deine Abrechnung richtig und erkennst, was wirklich von deinem Gehalt uebrig bleibt.",
    content:
      "Wenn du die Abrechnung verstehst, triffst du bessere Entscheidungen bei Verträgen, Steuer und Sparzielen.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "Azubi analysiert Gehaltsabrechnung",
    publishedAt: "2026-03-26",
    readingTime: 7,
    tags: ["gehaltsabrechnung", "azubi", "netto"],
    related: ["erstes-gehalt-was-tun"],
  },
  {
    slug: "vermoegenswirksame-leistungen",
    categorySlug: "finanzen-fuer-azubis",
    navTitle: "Vermoegenswirksame Leistungen",
    title: "Vermoegenswirksame Leistungen (VWL) nutzen",
    metaTitle: "VWL als Azubi nutzen - einfach erklaert | BeAFox",
    metaDescription:
      "Was Vermoegenswirksame Leistungen bringen und wie du sie sinnvoll einsetzt.",
    excerpt:
      "So pruefst du Angebote deines Arbeitgebers und startest mit kleinen Betraegen.",
    content:
      "VWL kann ein Baustein fuer langfristiges Sparen sein. Achte auf Kosten und Anlageoptionen.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "Azubi informiert sich ueber VWL",
    publishedAt: "2026-03-29",
    readingTime: 5,
    tags: ["vwl", "azubi", "sparen"],
    related: ["gehaltsabrechnung-verstehen"],
  },
  {
    slug: "bafoeg-beantragen-2026",
    categorySlug: "finanzen-fuer-studenten",
    navTitle: "BAfoeG beantragen",
    title: "BAfoeG beantragen 2026",
    metaTitle: "BAfoeG beantragen 2026 - Schritt fuer Schritt | BeAFox",
    metaDescription:
      "Alle wichtigen Schritte fuer deinen BAfoeG-Antrag kompakt erklaert.",
    excerpt:
      "So bereitest du Unterlagen sauber vor und vermeidest typische Fehler beim Antrag.",
    content:
      "Ein strukturierter Antrag spart Zeit und Nerven. Diese Checkliste hilft dir bei Fristen und Formularen.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "Student bereitet BAfoeG-Unterlagen vor",
    publishedAt: "2026-03-24",
    readingTime: 8,
    tags: ["bafoeg", "student", "antrag"],
    related: ["werkstudent-steuern-und-abgaben"],
  },
  {
    slug: "studienkredit-ja-oder-nein",
    categorySlug: "finanzen-fuer-studenten",
    navTitle: "Studienkredit: ja oder nein?",
    title: "Studienkredit: ja oder nein?",
    metaTitle: "Studienkredit Vor- und Nachteile | BeAFox",
    metaDescription:
      "Wann sich ein Studienkredit lohnt und worauf du bei Zins und Rueckzahlung achtest.",
    excerpt:
      "Eine Entscheidungshilfe mit typischen Fallstricken und Alternativen.",
    content:
      "Vergleiche Gesamtkosten, Sondertilgung und Foerderungen. Plane Rueckzahlung realistisch ein.",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Student prueft Studienkredit Optionen",
    publishedAt: "2026-03-26",
    readingTime: 7,
    tags: ["studienkredit", "student", "finanzierung"],
    related: ["bafoeg-beantragen-2026"],
  },
  {
    slug: "werkstudent-steuern-und-abgaben",
    categorySlug: "finanzen-fuer-studenten",
    navTitle: "Werkstudent & Steuern",
    title: "Werkstudent: Steuern & Abgaben",
    metaTitle: "Werkstudent Steuern und Abgaben einfach erklaert | BeAFox",
    metaDescription:
      "Was gilt fuer Werkstudenten bei Steuern, KV und Sozialabgaben?",
    excerpt:
      "Mit den richtigen Grundlagen vermeidest du Ueberraschungen auf der Abrechnung.",
    content:
      "Entscheidend sind Arbeitszeit, Einkommen und Status. So ordnest du deine Situation korrekt ein.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "Werkstudent prueft Steuern und Abgaben",
    publishedAt: "2026-03-28",
    readingTime: 7,
    tags: ["werkstudent", "steuern", "studenten"],
    related: ["bafoeg-beantragen-2026"],
  },
  {
    slug: "erste-steuererklaerung",
    categorySlug: "finanzen-fuer-berufseinsteiger",
    navTitle: "Erste Steuererklaerung",
    title: "Erste Steuererklaerung",
    metaTitle: "Erste Steuererklaerung nach Berufseinstieg | BeAFox",
    metaDescription:
      "So startest du als Berufseinsteiger sicher in deine erste Steuererklaerung.",
    excerpt:
      "Welche Belege du brauchst und wie du deine erste Erklaerung strukturiert aufsetzt.",
    content:
      "Mit einer klaren Vorbereitung holst du mehr raus und vermeidest typische Fehler beim Einreichen.",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Berufseinsteiger erstellt erste Steuererklaerung",
    publishedAt: "2026-03-24",
    readingTime: 6,
    tags: ["steuererklaerung", "berufseinsteiger"],
    related: ["versicherungen-checkliste"],
  },
  {
    slug: "versicherungen-checkliste",
    categorySlug: "finanzen-fuer-berufseinsteiger",
    navTitle: "Versicherungs-Check",
    title: "Versicherungen-Checkliste",
    metaTitle: "Versicherungen fuer Berufseinsteiger - Checkliste | BeAFox",
    metaDescription:
      "Welche Versicherungen du wirklich brauchst und welche warten koennen.",
    excerpt:
      "Eine klare Reihenfolge fuer deine Versicherungen zum Berufsstart.",
    content:
      "Prioritaet hat Absicherung grosser Risiken. So vermeidest du ueberteuerte Pakete und unnoetige Doppelungen.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "Checkliste fuer Versicherungen beim Berufseinstieg",
    publishedAt: "2026-03-30",
    readingTime: 5,
    tags: ["versicherungen", "berufsstart"],
    related: ["erste-steuererklaerung"],
  },
  {
    slug: "gehaltsverhandlung-tipps",
    categorySlug: "finanzen-fuer-berufseinsteiger",
    navTitle: "Gehaltsverhandlung",
    title: "Gehaltsverhandlung: Tipps fuer den Berufsstart",
    metaTitle: "Gehaltsverhandlung beim ersten Job | BeAFox",
    metaDescription:
      "So bereitest du Zahlen, Argumente und Timing fuer deine Gehaltsverhandlung vor.",
    excerpt:
      "Von Branchenvergleichen bis zum Gespraechstermin: strukturiert vorgehen.",
    content:
      "Recherchiere realistische Spannen und bringe messbare Beitraege mit. Bleib sachlich und freundlich.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "Berufseinsteiger bereitet Gehaltsverhandlung vor",
    publishedAt: "2026-04-02",
    readingTime: 6,
    tags: ["gehalt", "verhandlung", "berufsstart"],
    related: ["versicherungen-checkliste"],
  },
  {
    slug: "erste-eigene-wohnung",
    categorySlug: "finanzen-bei-lebensereignissen",
    navTitle: "Erste eigene Wohnung",
    title: "Erste eigene Wohnung",
    metaTitle: "Erste eigene Wohnung - Finanzcheckliste | BeAFox",
    metaDescription:
      "Miete, Kaution, Nebenkosten: So planst du die erste eigene Wohnung realistisch.",
    excerpt:
      "Diese Kosten werden oft unterschaetzt - und so planst du sie von Anfang an richtig ein.",
    content:
      "Mit einer sauberen Wohnungsbudget-Planung bleiben Umzug und laufende Kosten kontrollierbar.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "Kostenplanung fuer die erste eigene Wohnung",
    publishedAt: "2026-03-24",
    readingTime: 7,
    tags: ["wohnung", "umzug", "budget"],
    related: ["zusammenziehen-finanzen-regeln"],
  },
  {
    slug: "zusammenziehen-finanzen-regeln",
    categorySlug: "finanzen-bei-lebensereignissen",
    navTitle: "Zusammenziehen",
    title: "Zusammenziehen: Finanzen regeln",
    metaTitle: "Zusammenziehen und Finanzen fair regeln | BeAFox",
    metaDescription:
      "Gemeinsame Kosten fair aufteilen: Leitfaden fuer Paare und WGs.",
    excerpt:
      "So organisiert ihr Miete, Fixkosten und Ruecklagen ohne Streit.",
    content:
      "Mit klaren Regeln zu Konten und Rollen vermeidet ihr Konflikte und behaltet Transparenz.",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Paar regelt gemeinsame Finanzen beim Zusammenziehen",
    publishedAt: "2026-03-31",
    readingTime: 6,
    tags: ["zusammenziehen", "gemeinsame finanzen"],
    related: ["erste-eigene-wohnung"],
  },
  {
    slug: "heiraten-steuerklasse",
    categorySlug: "finanzen-bei-lebensereignissen",
    navTitle: "Heiraten & Steuerklasse",
    title: "Heiraten und Steuerklasse",
    metaTitle: "Heiraten: Steuerklasse und Finanzen | BeAFox",
    metaDescription:
      "Was sich bei Heirat fuer Steuerklasse, Versicherungen und Konten aendert.",
    excerpt:
      "Die wichtigsten Schritte nach der Hochzeit im Ueberblick.",
    content:
      "Informiere Arbeitgeber und Versicherungen fruehzeitig und plant gemeinsame Budgets.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "Paar plant Finanzen nach der Hochzeit",
    publishedAt: "2026-04-03",
    readingTime: 6,
    tags: ["heirat", "steuerklasse", "paare"],
    related: ["zusammenziehen-finanzen-regeln"],
  },
  {
    slug: "eltern-werden-kosten",
    categorySlug: "finanzen-bei-lebensereignissen",
    navTitle: "Eltern werden",
    title: "Eltern werden: Kosten im Blick",
    metaTitle: "Eltern werden - welche Kosten kommen auf dich zu? | BeAFox",
    metaDescription:
      "Von Ausstattung bis Elternzeit: Finanzielle Eckpunkte fuer werdende Eltern.",
    excerpt:
      "So planst du Ruecklagen und nutzt Angebote und Zuschuesse.",
    content:
      "Priorisiere Gesundheit und Absicherung, teilt Aufgaben und haltet Ausgaben transparent.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "Werdende Eltern planen Budget",
    publishedAt: "2026-04-04",
    readingTime: 7,
    tags: ["eltern", "kosten", "familie"],
    related: ["erste-eigene-wohnung"],
  },
  {
    slug: "erster-etf-kaufen",
    categorySlug: "investieren-fuer-anfaenger",
    navTitle: "Erster ETF kaufen",
    title: "Erster ETF kaufen",
    metaTitle: "Erster ETF fuer Anfaenger - einfach erklaert | BeAFox",
    metaDescription:
      "ETF-Start ohne Fachchinesisch: Auswahl, Risiko und erster Kauf.",
    excerpt:
      "Mit diesen Grundregeln startest du sicher in dein erstes ETF-Investment.",
    content:
      "Wichtig sind Ziel, Zeithorizont und Streuung. So vermeidest du typische Anfaengerfehler.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "Anfaenger kauft ersten ETF",
    publishedAt: "2026-03-24",
    readingTime: 8,
    tags: ["etf", "investieren", "anfaenger"],
    related: ["sparplan-einrichten"],
  },
  {
    slug: "depot-eroeffnen-vergleich",
    categorySlug: "investieren-fuer-anfaenger",
    navTitle: "Depot eroeffnen",
    title: "Depot eroeffnen: Vergleich und Checkliste",
    metaTitle: "Depot eroeffnen fuer Anfaenger - Checkliste | BeAFox",
    metaDescription:
      "Worauf du bei Gebuehren, Orderkosten und Anlageangebot achten solltest.",
    excerpt:
      "So findest du ein Depot, das zu deinem Start passt.",
    content:
      "Vergleiche Orderkosten, Sparplan-Optionen und Benutzerfuehrung der App.",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Depot eroeffnen am Smartphone",
    publishedAt: "2026-03-30",
    readingTime: 6,
    tags: ["depot", "broker", "etf"],
    related: ["erster-etf-kaufen"],
  },
  {
    slug: "sparplan-einrichten",
    categorySlug: "investieren-fuer-anfaenger",
    navTitle: "Sparplan einrichten",
    title: "Sparplan einrichten",
    metaTitle: "Sparplan einrichten fuer Anfaenger | BeAFox",
    metaDescription:
      "So richtest du einen ETF-Sparplan in wenigen Schritten sinnvoll ein.",
    excerpt:
      "Vom monatlichen Betrag bis zur Ausfuehrung: so baust du langfristig Vermoegen auf.",
    content:
      "Ein Sparplan funktioniert am besten mit klarer Routine und realistischem Startbetrag.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "ETF-Sparplan im Depot einrichten",
    publishedAt: "2026-04-01",
    readingTime: 6,
    tags: ["sparplan", "etf", "investieren"],
    related: ["erster-etf-kaufen"],
  },

  // =====================================================
  // NEUE TOPICS: SCHUELER
  // =====================================================
  {
    slug: "online-sicher-bezahlen",
    categorySlug: "finanzen-fuer-schueler",
    navTitle: "Online sicher bezahlen",
    title: "Online sicher bezahlen als Schueler",
    metaTitle: "Online sicher bezahlen - Tipps fuer Schueler | BeAFox",
    metaDescription:
      "PayPal, Klarna oder Kreditkarte? Was ist sicher fuer junge Leute und wo lauern Abo-Fallen.",
    excerpt:
      "So erkennst du unsichere Zahlungsmethoden und schuetzt dich vor Abo-Fallen beim Online-Shopping.",
    content:
      "Nicht jede Zahlungsmethode ist gleich sicher. Lerne die Unterschiede und schuetze dein Geld.",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Schueler bezahlt sicher online am Smartphone",
    publishedAt: "2026-04-05",
    readingTime: 5,
    tags: ["online-shopping", "sicherheit", "bezahlen"],
    related: ["taschengeld-richtig-einteilen"],
  },
  {
    slug: "sparen-mit-kleinen-betraegen",
    categorySlug: "finanzen-fuer-schueler",
    navTitle: "Sparen mit kleinen Betraegen",
    title: "Sparen mit kleinen Betraegen: Ab 10 Euro",
    metaTitle: "Sparen als Schueler - Mit kleinen Betraegen starten | BeAFox",
    metaDescription:
      "Auch mit 10 Euro monatlich kannst du als Schueler sparen. 5 Methoden die wirklich funktionieren.",
    excerpt:
      "Du brauchst kein grosses Budget. Mit diesen Methoden baust du als Schueler echte Ruecklagen auf.",
    content:
      "Kleine Betraege summieren sich schneller als du denkst. Starte heute mit deinem Sparplan.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "Schueler spart kleine Betraege mit Spardose und App",
    publishedAt: "2026-04-06",
    readingTime: 4,
    tags: ["sparen", "ruecklagen", "kleine-betraege"],
    related: ["taschengeld-richtig-einteilen", "erstes-girokonto-eroeffnen"],
  },
  {
    slug: "abo-fallen-erkennen-vermeiden",
    categorySlug: "finanzen-fuer-schueler",
    navTitle: "Abo-Fallen vermeiden",
    title: "Abo-Fallen erkennen und vermeiden",
    metaTitle: "Abo-Fallen vermeiden - Ratgeber fuer Jugendliche | BeAFox",
    metaDescription:
      "Netflix, Spotify, Gaming: So erkennst du teure Abo-Fallen und kuendigst richtig.",
    excerpt:
      "Abo hier, Abo da - schnell sind 50 Euro weg. So behaltst du den Ueberblick.",
    content:
      "Pruefe regelmaessig deine Abos und kuendige was du nicht brauchst. Hier ist die Checkliste.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "Jugendlicher prueft Abos auf dem Smartphone",
    publishedAt: "2026-04-07",
    readingTime: 4,
    tags: ["abos", "fallen", "kosten", "kuendigen"],
    related: ["online-sicher-bezahlen", "taschengeld-richtig-einteilen"],
  },
  {
    slug: "schueler-geld-anlegen",
    categorySlug: "finanzen-fuer-schueler",
    navTitle: "Geld anlegen als Schueler",
    title: "Als Schueler Geld anlegen — so startest du mit 50 Euro",
    metaTitle: "Als Schueler Geld anlegen: ETF-Depot unter 18 eroeffnen | BeAFox",
    metaDescription:
      "Auch als Schueler unter 18 kannst du in ETFs investieren — mit Eltern-Zustimmung. So eroeffnest du ein Depot und legst dein erstes Geld an.",
    excerpt:
      "Du bist unter 18 und moechtest dein Geld fuer dich arbeiten lassen? Mit Zustimmung der Eltern ist das moeglich — und du hast einen riesigen Zeitvorteil.",
    content:
      "Mit Zustimmung der Eltern koennen auch Schueler ein Depot eroeffnen und per ETF-Sparplan investieren. Der Zinseszins-Vorteil ist enorm.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "Schueler informiert sich ueber Geldanlage",
    publishedAt: "2026-04-04",
    readingTime: 5,
    tags: ["Schueler", "Investieren", "Jugendliche", "ETF", "Depot"],
    related: ["sparen-mit-kleinen-betraegen", "erstes-girokonto-eroeffnen"],
  },

  // =====================================================
  // NEUE TOPICS: AZUBIS
  // =====================================================
  {
    slug: "steuererklaerung-azubi",
    categorySlug: "finanzen-fuer-azubis",
    navTitle: "Steuererklaerung Azubi",
    title: "Steuererklaerung als Azubi: 500 Euro zurueckholen",
    metaTitle: "Steuererklaerung Azubi - 500 Euro zurueckholen | BeAFox",
    metaDescription:
      "So machst du als Azubi deine erste Steuererklaerung und holst dir im Schnitt 500 Euro zurueck.",
    excerpt:
      "Die meisten Azubis verschenken Geld ans Finanzamt. Mit dieser Anleitung holst du es dir zurueck.",
    content:
      "Schritt fuer Schritt durch die Steuererklaerung: Werbungskosten, Fahrtkosten, Arbeitsmittel.",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Azubi macht Steuererklaerung am Laptop",
    publishedAt: "2026-04-08",
    readingTime: 8,
    tags: ["steuer", "steuererklaerung", "finanzamt", "azubi"],
    related: ["gehaltsabrechnung-verstehen", "erstes-gehalt-was-tun"],
  },
  {
    slug: "notgroschen-aufbauen-azubi",
    categorySlug: "finanzen-fuer-azubis",
    navTitle: "Notgroschen aufbauen",
    title: "Notgroschen als Azubi aufbauen",
    metaTitle: "Notgroschen aufbauen als Azubi - Spar-Ratgeber | BeAFox",
    metaDescription:
      "So baust du als Azubi einen Notgroschen auf - auch mit kleinem Gehalt. 5 realistische Schritte.",
    excerpt:
      "Auch mit 1.000 Euro netto kannst du dir ein Sicherheitsnetz aufbauen. So gehts.",
    content:
      "Ein Notgroschen schuetzt dich vor unerwarteten Ausgaben. Starte mit kleinen Betraegen.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "Azubi baut Notgroschen auf mit Sparplan",
    publishedAt: "2026-04-09",
    readingTime: 5,
    tags: ["notgroschen", "sparen", "ruecklagen", "azubi"],
    related: ["erstes-gehalt-was-tun", "vermoegenswirksame-leistungen"],
  },
  {
    slug: "bu-versicherung-azubi",
    categorySlug: "finanzen-fuer-azubis",
    navTitle: "BU-Versicherung",
    title: "BU-Versicherung als Azubi: Brauch ich das?",
    metaTitle: "BU-Versicherung fuer Azubis - Lohnt sich das? | BeAFox",
    metaDescription:
      "Berufsunfaehigkeitsversicherung als Azubi: Warum jetzt der beste Zeitpunkt ist und was du beachten musst.",
    excerpt:
      "Jung und gesund = guenstige Beitraege. Warum eine BU gerade als Azubi Sinn macht.",
    content:
      "Je frueher du abschliesst, desto guenstiger die Beitraege. Aber Achtung vor Fallstricken.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "Azubi informiert sich ueber BU-Versicherung",
    publishedAt: "2026-04-10",
    readingTime: 6,
    tags: ["versicherung", "bu", "vorsorge", "azubi"],
    related: ["versicherungen-checkliste", "erstes-gehalt-was-tun"],
  },
  {
    slug: "bab-beantragen",
    categorySlug: "finanzen-fuer-azubis",
    navTitle: "BAB beantragen",
    title: "BAB beantragen: Berufsausbildungsbeihilfe",
    metaTitle: "BAB beantragen - Anleitung fuer Azubis | BeAFox",
    metaDescription:
      "Berufsausbildungsbeihilfe beantragen: Voraussetzungen, Hoehe und das komplette Antragsverfahren.",
    excerpt:
      "Wer eine Ausbildung macht und nicht mehr bei den Eltern wohnt, kann BAB beantragen.",
    content:
      "Pruefe ob du Anspruch hast und stelle den Antrag rechtzeitig. Hier ist der komplette Ablauf.",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Azubi fuellt BAB-Antrag aus",
    publishedAt: "2026-04-11",
    readingTime: 7,
    tags: ["bab", "beihilfe", "ausbildung", "antrag"],
    related: ["erstes-gehalt-was-tun", "notgroschen-aufbauen-azubi"],
  },

  // =====================================================
  // NEUE TOPICS: STUDENTEN
  // =====================================================
  {
    slug: "stipendien-finden-bewerben",
    categorySlug: "finanzen-fuer-studenten",
    navTitle: "Stipendien finden",
    title: "Stipendien finden und bewerben (auch ohne 1,0)",
    metaTitle: "Stipendium finden und bewerben - Ratgeber fuer Studenten | BeAFox",
    metaDescription:
      "Stipendien gibt es nicht nur fuer Einser-Schueler. So findest du passende Stipendien und bewirbst dich richtig.",
    excerpt:
      "Es gibt tausende Stipendien - die meisten werden nie beantragt. So findest du deins.",
    content:
      "Von Begabtenfoerderung bis Fachstipendien: Schritt fuer Schritt zur erfolgreichen Bewerbung.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "Student recherchiert Stipendien am Laptop",
    publishedAt: "2026-04-12",
    readingTime: 8,
    tags: ["stipendium", "bewerbung", "finanzierung", "student"],
    related: ["bafoeg-beantragen-2026", "studienkredit-ja-oder-nein"],
  },
  {
    slug: "wohngeld-fuer-studenten",
    categorySlug: "finanzen-fuer-studenten",
    navTitle: "Wohngeld Student",
    title: "Wohngeld fuer Studenten: Bis zu 400 Euro monatlich",
    metaTitle: "Wohngeld als Student - Bis zu 400 Euro monatlich | BeAFox",
    metaDescription:
      "Wohngeld fuer Studenten: Voraussetzungen, Hoehe und das komplette Antragsverfahren erklaert.",
    excerpt:
      "Viele Studenten wissen nicht, dass sie Anspruch auf Wohngeld haben. Pruef es jetzt.",
    content:
      "Kein BAfoeG-Anspruch? Dann hast du moeglicherweise Recht auf Wohngeld. So beantragst du es.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "Student beantragt Wohngeld online",
    publishedAt: "2026-04-13",
    readingTime: 6,
    tags: ["wohngeld", "miete", "zuschuss", "student"],
    related: ["bafoeg-beantragen-2026", "werkstudent-steuern-und-abgaben"],
  },
  {
    slug: "versicherungen-student",
    categorySlug: "finanzen-fuer-studenten",
    navTitle: "Versicherungen Student",
    title: "Versicherungen als Student: Was du wirklich brauchst",
    metaTitle: "Versicherungen als Student - Was du wirklich brauchst | BeAFox",
    metaDescription:
      "Welche Versicherungen brauchst du als Student? Der ehrliche Check ohne Verkaufsdruck.",
    excerpt:
      "Krankenversicherung, Haftpflicht, BU? Was muss, was kann, was ist rausgeworfenes Geld.",
    content:
      "Als Student bist du oft noch familienversichert. Aber wann aendert sich das und was brauchst du dann?",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Student prueft Versicherungen auf Smartphone",
    publishedAt: "2026-04-14",
    readingTime: 6,
    tags: ["versicherung", "krankenversicherung", "haftpflicht", "student"],
    related: ["versicherungen-checkliste", "bafoeg-beantragen-2026"],
  },

  // =====================================================
  // NEUE TOPICS: BERUFSEINSTEIGER
  // =====================================================
  {
    slug: "vermoegen-aufbauen-in-den-20ern",
    categorySlug: "finanzen-fuer-berufseinsteiger",
    navTitle: "Vermoegen aufbauen",
    title: "Vermoegen aufbauen in den 20ern",
    metaTitle: "Vermoegen aufbauen in den 20ern - So startest du | BeAFox",
    metaDescription:
      "Der beste Zeitpunkt zum Investieren ist jetzt. So baust du in deinen 20ern echtes Vermoegen auf.",
    excerpt:
      "Zinseszins ist dein bester Freund. Je frueher du startest, desto mehr profitierst du.",
    content:
      "Mit ETF-Sparplan und automatisiertem Sparen baust du langfristig Vermoegen auf.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "Berufseinsteiger plant Vermoegensaufbau am Laptop",
    publishedAt: "2026-04-15",
    readingTime: 7,
    tags: ["vermoegen", "etf", "sparplan", "20er"],
    related: ["erster-etf-kaufen", "sparplan-einrichten"],
  },
  {
    slug: "3-konten-modell-einrichten",
    categorySlug: "finanzen-fuer-berufseinsteiger",
    navTitle: "3-Konten-Modell",
    title: "Das 3-Konten-Modell einrichten",
    metaTitle: "3-Konten-Modell einrichten - Anleitung | BeAFox",
    metaDescription:
      "Fixkosten, Sparen und Spass-Budget automatisieren. Das 3-Konten-Modell in 30 Minuten eingerichtet.",
    excerpt:
      "Schluss mit Chaos auf dem Girokonto. Mit 3 Konten hast du automatisch Ordnung.",
    content:
      "Konto 1 fuer Fixkosten, Konto 2 zum Sparen, Konto 3 fuer Freizeit. So richtest du es ein.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "3-Konten-Modell Uebersicht auf Smartphone",
    publishedAt: "2026-04-16",
    readingTime: 6,
    tags: ["kontenmodell", "budget", "automatisierung"],
    related: ["erste-steuererklaerung", "versicherungen-checkliste"],
  },
  {
    slug: "erste-wohnung-finanzieren",
    categorySlug: "finanzen-fuer-berufseinsteiger",
    navTitle: "Erste Wohnung finanzieren",
    title: "Erste Wohnung finanzieren: Die echte Kostenrechnung",
    metaTitle: "Erste eigene Wohnung - Komplette Kostenaufschluesselung | BeAFox",
    metaDescription:
      "Was kostet die erste Wohnung wirklich? Kaution, Moebel, Nebenkosten - die ehrliche Rechnung.",
    excerpt:
      "Kaution, Makler, Moebel, Nebenkosten - die wahren Kosten der ersten Wohnung.",
    content:
      "Rechne realistisch: Die erste Wohnung kostet mehr als nur die Miete. Hier ist die komplette Liste.",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Berufseinsteiger kalkuliert Wohnungskosten",
    publishedAt: "2026-04-17",
    readingTime: 7,
    tags: ["wohnung", "kaution", "umzug", "kosten"],
    related: ["erste-eigene-wohnung", "3-konten-modell-einrichten"],
  },
  {
    slug: "haftpflichtversicherung-berufseinsteiger",
    categorySlug: "finanzen-fuer-berufseinsteiger",
    navTitle: "Haftpflichtversicherung",
    title: "Haftpflichtversicherung — warum sie fuer unter 10 Euro/Monat Pflicht ist",
    metaTitle: "Haftpflichtversicherung: Warum jeder sie braucht (ab 5 Euro/Monat) | BeAFox",
    metaDescription:
      "Haftpflichtversicherung ist die wichtigste Versicherung ueberhaupt. Wir erklaeren was sie abdeckt, was sie kostet und welche du brauchst.",
    excerpt:
      "Eine zerbrochene Brille, ein kleiner Autounfall, ein Missgeschick beim Nachbarn — ohne Haftpflicht kann dich das ruinieren. Sie kostet 5-8 Euro/Monat.",
    content:
      "Die Haftpflichtversicherung schuetzt dich vor Schadenersatzanspruechen anderer. Fuer 5-8 Euro im Monat bist du gegen Personen-, Sach- und Vermoegensschaeden abgesichert.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "Berufseinsteiger informiert sich ueber Haftpflichtversicherung",
    publishedAt: "2026-04-07",
    readingTime: 4,
    tags: ["Versicherung", "Haftpflicht", "Schutz", "Berufseinsteiger"],
    related: ["versicherungen-checkliste", "erste-steuererklaerung"],
  },

  // =====================================================
  // NEUE TOPICS: LEBENSSITUATIONEN
  // =====================================================
  {
    slug: "umzug-checkliste-kosten",
    categorySlug: "finanzen-bei-lebensereignissen",
    navTitle: "Umzug Checkliste",
    title: "Umzug: Die komplette Checkliste mit echten Kosten",
    metaTitle: "Umzug Checkliste und Kosten - Komplett-Ratgeber | BeAFox",
    metaDescription:
      "Umzug planen: Checkliste, echte Kosten und Spartipps. Von der Kuendigung bis zur neuen Wohnung.",
    excerpt:
      "Kuendigung, Nachsendeauftrag, Ummelding, Transport - alles was du beim Umzug beachten musst.",
    content:
      "Ein Umzug ist teurer als die meisten denken. Hier ist die ehrliche Kostenaufstellung plus Checkliste.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "Umzugscheckliste mit Kostenaufstellung",
    publishedAt: "2026-04-18",
    readingTime: 8,
    tags: ["umzug", "checkliste", "kosten", "planung"],
    related: ["erste-eigene-wohnung", "zusammenziehen-finanzen-regeln"],
  },
  {
    slug: "auto-kaufen-oder-leasen",
    categorySlug: "finanzen-bei-lebensereignissen",
    navTitle: "Auto: kaufen oder leasen?",
    title: "Auto kaufen oder leasen: Der ehrliche Kostenvergleich",
    metaTitle: "Auto kaufen oder leasen? - Ehrlicher Kostenvergleich | BeAFox",
    metaDescription:
      "Kaufen, leasen oder finanzieren? Die echte Kostenrechnung fuer dein erstes Auto.",
    excerpt:
      "Dein erstes Auto ist eine grosse Entscheidung. So vergleichst du die Optionen richtig.",
    content:
      "Versicherung, Steuer, Wartung, Wertverlust - die versteckten Kosten eines Autos ehrlich aufgelistet.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "Junger Mensch vergleicht Auto-Finanzierungsoptionen",
    publishedAt: "2026-04-19",
    readingTime: 8,
    tags: ["auto", "leasing", "kredit", "kosten"],
    related: ["erste-eigene-wohnung", "3-konten-modell-einrichten"],
  },
  {
    slug: "mietvertrag-verstehen",
    categorySlug: "finanzen-bei-lebensereignissen",
    navTitle: "Mietvertrag verstehen",
    title: "Mietvertrag richtig verstehen: Rechte und Fallen",
    metaTitle: "Mietvertrag verstehen - Rechte und Fallen als Mieter | BeAFox",
    metaDescription:
      "Mietvertrag unterschreiben? Erst lesen! Alle wichtigen Klauseln und Fallen erklaert.",
    excerpt:
      "Viele junge Mieter unterschreiben ohne zu lesen. Diese Klauseln solltest du kennen.",
    content:
      "Schoenheitsreparaturen, Kuendigungsfristen, Nebenkostenabrechnung - die wichtigsten Punkte.",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Junger Mieter liest Mietvertrag aufmerksam",
    publishedAt: "2026-04-20",
    readingTime: 7,
    tags: ["mietvertrag", "miete", "rechte", "wohnung"],
    related: ["erste-eigene-wohnung", "umzug-checkliste-kosten"],
  },
  {
    slug: "haushaltsbuch-erstellen",
    categorySlug: "finanzen-bei-lebensereignissen",
    navTitle: "Haushaltsbuch erstellen",
    title: "Haushaltsbuch fuehren: So behältst du den Ueberblick ueber dein Geld",
    metaTitle: "Haushaltsbuch erstellen - Einfach & effektiv | BeAFox",
    metaDescription:
      "Haushaltsbuch fuehren leicht gemacht: Einnahmen und Ausgaben tracken, Sparpotenzial finden und finanzielle Kontrolle gewinnen.",
    excerpt:
      "Du verdienst Geld, aber am Ende des Monats ist nichts uebrig? Ein Haushaltsbuch zeigt dir, wohin dein Geld wirklich fliesst.",
    content:
      "Ein Haushaltsbuch muss nicht kompliziert sein. Schon ein einfaches System hilft dir, deine Ausgaben zu verstehen und gezielt zu sparen.",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Haushaltsbuch fuehren und Ausgaben tracken",
    publishedAt: "2026-04-15",
    readingTime: 5,
    tags: ["Haushaltsbuch", "Budgetierung", "Sparen", "Ausgaben"],
    related: ["3-konten-modell-einrichten", "erste-eigene-wohnung"],
  },

  // =====================================================
  // NEUE TOPICS: INVESTIEREN
  // =====================================================
  {
    slug: "welcher-etf-passt-zu-mir",
    categorySlug: "investieren-fuer-anfaenger",
    navTitle: "Welcher ETF passt?",
    title: "Welcher ETF passt zu mir? Der Entscheidungsratgeber",
    metaTitle: "Welcher ETF fuer Anfaenger? - Entscheidungsratgeber | BeAFox",
    metaDescription:
      "MSCI World, FTSE All-World oder Themen-ETF? So findest du den richtigen ETF fuer dich.",
    excerpt:
      "Es gibt tausende ETFs. Hier erfaehrst du, welcher zu deiner Situation passt.",
    content:
      "Breit gestreut statt spezialisiert: Warum ein Welt-ETF fuer die meisten Anfaenger die beste Wahl ist.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "ETF-Vergleich auf Bildschirm",
    publishedAt: "2026-04-21",
    readingTime: 8,
    tags: ["etf", "msci-world", "ftse", "vergleich"],
    related: ["erster-etf-kaufen", "depot-eroeffnen-vergleich"],
  },
  {
    slug: "mit-20-euro-investieren",
    categorySlug: "investieren-fuer-anfaenger",
    navTitle: "Mit 20 Euro investieren",
    title: "Mit 20 Euro monatlich investieren: Warum es sich lohnt",
    metaTitle: "Mit 20 Euro investieren - Warum kleine Betraege reichen | BeAFox",
    metaDescription:
      "Auch mit 20 Euro monatlich lohnt sich investieren. So nutzt du den Zinseszins-Effekt.",
    excerpt:
      "Du brauchst kein grosses Gehalt um zu investieren. 20 Euro reichen fuer den Anfang.",
    content:
      "In 30 Jahren werden aus 20 Euro monatlich ueber 20.000 Euro. Hier ist die Rechnung.",
    image: "/assets/Blogs/Blog3.jpg",
    imageAlt: "Zinseszins-Rechnung fuer kleine Investitionsbetraege",
    publishedAt: "2026-04-22",
    readingTime: 5,
    tags: ["klein-investieren", "sparplan", "zinseszins"],
    related: ["sparplan-einrichten", "erster-etf-kaufen"],
  },
  {
    slug: "altersvorsorge-mit-20-starten",
    categorySlug: "investieren-fuer-anfaenger",
    navTitle: "Altersvorsorge mit 20",
    title: "Altersvorsorge mit 20 starten: Warum jetzt der beste Zeitpunkt ist",
    metaTitle: "Altersvorsorge mit 20 - Warum jetzt der beste Zeitpunkt ist | BeAFox",
    metaDescription:
      "Altersvorsorge klingt weit weg? Mit 20 starten bringt dir 100.000 Euro mehr. So gehts.",
    excerpt:
      "Rente ist weit weg? Gerade deshalb ist jetzt der perfekte Zeitpunkt zu starten.",
    content:
      "10 Jahre frueher starten verdoppelt dein Ergebnis. ETF-Sparplan als Basis fuer die Altersvorsorge.",
    image: "/assets/Blogs/Blog1.jpeg",
    imageAlt: "Junger Mensch plant Altersvorsorge mit ETF-Sparplan",
    publishedAt: "2026-04-23",
    readingTime: 7,
    tags: ["altersvorsorge", "rente", "etf", "frueh-starten"],
    related: ["erster-etf-kaufen", "mit-20-euro-investieren"],
  },
  {
    slug: "krypto-soll-ich-einsteigen",
    categorySlug: "investieren-fuer-anfaenger",
    navTitle: "Krypto: ja oder nein?",
    title: "Krypto: Soll ich einsteigen? Der ehrliche Ratgeber",
    metaTitle: "Krypto einsteigen - Ehrlicher Ratgeber ohne Hype | BeAFox",
    metaDescription:
      "Bitcoin, Ethereum und Co: Lohnt sich Krypto fuer junge Leute? Die ehrliche Einschaetzung.",
    excerpt:
      "Kein Hype, keine FOMO. Hier ist die nuechterne Analyse ob Krypto zu dir passt.",
    content:
      "Krypto ist hochspekulativ. Wann es Sinn machen kann und wann du besser die Finger davon laesst.",
    image: "/assets/Blogs/Blog2.jpeg",
    imageAlt: "Krypto-Analyse auf Trading-App",
    publishedAt: "2026-04-24",
    readingTime: 8,
    tags: ["krypto", "bitcoin", "risiko", "investieren"],
    related: ["erster-etf-kaufen", "welcher-etf-passt-zu-mir"],
  },
];

/** Slugs von Guides, die vollstaendig ausgebaut sind (kein Platzhalter). */
const LIVE_GUIDE_SLUGS = new Set([
  "erstes-gehalt-was-tun",
  "gehaltsabrechnung-verstehen",
  "vermoegenswirksame-leistungen",
  "bafoeg-beantragen-2026",
  "erste-steuererklaerung",
  "notgroschen-aufbauen-azubi",
  "depot-eroeffnen-vergleich",
  "erste-eigene-wohnung",
  "haftpflichtversicherung-berufseinsteiger",
  "schueler-geld-anlegen",
  "haushaltsbuch-erstellen",
]);

export const BLOG_POSTS: BlogPost[] = BLOG_POSTS_BASE.map((post) =>
  LIVE_GUIDE_SLUGS.has(post.slug)
    ? post
    : {
        ...post,
        metaDescription: COMING_SOON_MESSAGE,
        excerpt: COMING_SOON_MESSAGE,
        content: COMING_SOON_MESSAGE,
        image: BLOG_PLACEHOLDER_IMAGE,
        imageAlt: "BeAFox Maskottchen Hero Platzhalter",
        readingTime: 2,
        tags: [],
      },
);

export const BLOG_CATEGORY_SLUGS = BLOG_CATEGORIES.map((c) => c.slug);

/** Öffentliche URL für Ratgeber-Kategorie */
export function getRatgeberCategoryPath(categorySlug: string) {
  return `/ratgeber/${categorySlug}`;
}

/** Öffentliche URL für einen Guide (lebt unter /ratgeber/kategorie/slug) */
export function getGuidePostPath(categorySlug: string, postSlug: string) {
  return `/ratgeber/${categorySlug}/${postSlug}`;
}

/** @deprecated — benutze getGuidePostPath stattdessen */
export function getNewsPostPath(categorySlug: string, postSlug: string) {
  return getGuidePostPath(categorySlug, postSlug);
}

export function getCategoryBySlug(slug: string) {
  return BLOG_CATEGORIES.find((category) => category.slug === slug);
}

export function getPostsByCategory(slug: string) {
  return BLOG_POSTS.filter((post) => post.categorySlug === slug);
}

export function getPostByCategoryAndSlug(categorySlug: string, slug: string) {
  return BLOG_POSTS.find(
    (post) => post.categorySlug === categorySlug && post.slug === slug,
  );
}

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/** Themen für Header-Mega-Menü: neueste zuerst, Kurztitel aus navTitle. */
export function getNavTopicsForCategory(slug: BlogCategorySlug) {
  return BLOG_POSTS.filter((p) => p.categorySlug === slug)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .map((p) => ({
      label: p.navTitle ?? p.title,
      href: getGuidePostPath(slug, p.slug),
    }));
}

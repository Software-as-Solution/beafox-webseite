// ─────────────────────────────────────────────────────────────
// BeAFox News — Behind the Scenes
// Kein Ratgeber / keine Guides — sondern: Was gerade passiert.
// Events, Auszeichnungen, Presse, Partnerschaften, Team-Updates.
// ─────────────────────────────────────────────────────────────

export type NewsCategory =
  | "auszeichnung"
  | "event"
  | "presse"
  | "partnerschaft"
  | "meilenstein"
  | "team"
  | "launch";

export interface NewsCategoryMeta {
  slug: NewsCategory;
  label: string;
  color: string; // Tailwind bg color class
  textColor: string; // Tailwind text color class
  icon: string; // Emoji
}

export const NEWS_CATEGORIES: NewsCategoryMeta[] = [
  {
    slug: "auszeichnung",
    label: "Auszeichnung",
    color: "bg-amber-100",
    textColor: "text-amber-700",
    icon: "🏆",
  },
  {
    slug: "event",
    label: "Event",
    color: "bg-indigo-100",
    textColor: "text-indigo-700",
    icon: "🎤",
  },
  {
    slug: "presse",
    label: "Presse",
    color: "bg-rose-100",
    textColor: "text-rose-700",
    icon: "📰",
  },
  {
    slug: "partnerschaft",
    label: "Partnerschaft",
    color: "bg-emerald-100",
    textColor: "text-emerald-700",
    icon: "🤝",
  },
  {
    slug: "meilenstein",
    label: "Meilenstein",
    color: "bg-sky-100",
    textColor: "text-sky-700",
    icon: "🚀",
  },
  {
    slug: "team",
    label: "Team",
    color: "bg-violet-100",
    textColor: "text-violet-700",
    icon: "👥",
  },
  {
    slug: "launch",
    label: "Launch",
    color: "bg-primaryOrange/10",
    textColor: "text-primaryOrange",
    icon: "✨",
  },
];

export function getNewsCategory(slug: NewsCategory): NewsCategoryMeta {
  return NEWS_CATEGORIES.find((c) => c.slug === slug) ?? NEWS_CATEGORIES[1];
}

export interface NewsPost {
  slug: string;
  category: NewsCategory;
  title: string;
  excerpt: string;
  image: string; // Path relative to /public
  /** Optional visual correction for source photos with wrong orientation. */
  imageRotation?: "cw90" | "ccw90" | "rotate180";
  imageAlt: string;
  publishedAt: string; // ISO date
  author: string;
  readingTime: number; // minutes
  location?: string;
  tags: string[];
}

/** Anzeige-Byline auf /news — wie bei Ratgeber-Artikeln („BeAFox Redaktion“). */
export const NEWS_LIST_AUTHOR_BYLINE = "BeAFox Redaktion";

// ─── Posts — sortiert nach Datum (neueste zuerst in der UI) ───
export const NEWS_POSTS: NewsPost[] = [
  {
    slug: "beafox-live-im-google-play-store",
    category: "launch",
    title: "BeAFox ist live: App jetzt im Google Play Store verfügbar",
    excerpt:
      "Nach Monaten Entwicklung ist es soweit: Die BeAFox-App steht ab sofort im Google Play Store zum Download bereit. Ein großer Schritt für unser Team — und der Startschuss für gamifizierte Finanzbildung in Deutschland.",
    image: "/assets/news/19.webp",
    imageRotation: "cw90",
    imageAlt: "BeAFox App im Google Play Store",
    publishedAt: "2026-03-28",
    author: "Alex Tapelea",
    readingTime: 3,
    location: "Remote",
    tags: ["Launch", "App", "Google Play", "Produkt"],
  },
  {
    slug: "startchancen-programm-edtech-verband",
    category: "partnerschaft",
    title: "edtech-Verband: BeAFox im Startchancen-Programm gelistet",
    excerpt:
      "Wir sind stolz, Teil des Startchancen-Programms des Bundesverbands Bildungstechnologie zu sein. Als unabhängige Lern-App für Finanzbildung stehen wir Schulen und Bildungsträgern ab sofort über die Plattform des Verbands zur Verfügung.",
    image: "/assets/news/18.webp",
    imageAlt: "BeAFox beim Startchancen-Programm des edtech-Verbands gelistet",
    publishedAt: "2026-03-20",
    author: "BeAFox Redaktion",
    readingTime: 4,
    location: "Bundesweit",
    tags: ["edtech", "Startchancen", "Schulen", "Partnerschaft"],
  },
  {
    slug: "2500-euro-preis-pitch-event",
    category: "auszeichnung",
    title: "2.500 € Preis gewonnen: BeAFox räumt beim Pitch-Event ab",
    excerpt:
      "In der Kategorie Finanzbildung ging der Preis — und damit 2.500 € — an BeAFox. Eine App, mit der man den Umgang mit den eigenen Finanzen lernt. Vielen Dank an das tolle Team, die Jury und alle, die uns unterstützt haben.",
    image: "/assets/news/17.webp",
    imageAlt: "Preisverleihung: BeAFox gewinnt 2.500 Euro im Pitch-Wettbewerb",
    publishedAt: "2026-03-12",
    author: "Alex Tapelea",
    readingTime: 4,
    location: "Regensburg",
    tags: ["Auszeichnung", "Pitch", "Preis", "Finanzbildung"],
  },
  {
    slug: "ed-one-education-innovation-summit",
    category: "event",
    title: "Ed.One Education Innovation Summit: BeAFox auf der Bühne",
    excerpt:
      "Das exklusive Leitevent für digitale Bildungsinnovationen: Beim Ed.One Education Innovation Summit hatten wir die Chance, BeAFox vor Entscheiderinnen und Entscheidern der Bildungsbranche zu pitchen. Was wir mitgenommen haben — und wen wir getroffen haben.",
    image: "/assets/news/16.webp",
    imageAlt: "Alex Tapelea pitcht BeAFox beim Ed.One Education Innovation Summit",
    publishedAt: "2026-03-05",
    author: "Alex Tapelea",
    readingTime: 5,
    location: "Berlin",
    tags: ["Ed.One", "Summit", "Bildung", "Pitch"],
  },
  {
    slug: "mittelbayerische-mit-dem-smartphone-zum-finanzfuchs",
    category: "presse",
    title: "Mittelbayerische Zeitung: \u201EMit dem Smartphone zum Finanzfuchs\u201C",
    excerpt:
      "Große Wirkung im Kleinen: Die Mittelbayerische Zeitung berichtet auf Seite 7 über BeAFox. Unter dem Titel \u201EMit dem Smartphone zum Finanzfuchs\u201C erzählen wir, wie ein Gründer-Paar aus Neutraubling mit einer Spiele-App jungen Menschen Finanzbildung näherbringen will.",
    image: "/assets/news/15.webp",
    imageAlt: "Artikel in der Mittelbayerischen Zeitung über BeAFox",
    publishedAt: "2026-02-28",
    author: "BeAFox Redaktion",
    readingTime: 3,
    location: "Regensburg",
    tags: ["Presse", "Mittelbayerische", "Zeitung", "Medien"],
  },
  {
    slug: "donau-post-wir-muessen-ueber-geld-reden",
    category: "presse",
    title: "Donau-Post: \u201EWir müssen über Geld reden\u201C",
    excerpt:
      "Alexandru Tapelea und Selina Fuchs haben in Neutraubling ein eigenes Start-up gegründet. Die Donau-Post bringt uns auf Seite 19 groß raus — und erklärt, warum wir mit Schülerinnen, Schülern und Azubis über den richtigen Umgang mit Finanzen sprechen wollen.",
    image: "/assets/news/14.webp",
    imageAlt: "Artikel in der Donau-Post über das Gründer-Paar von BeAFox",
    publishedAt: "2026-02-20",
    author: "BeAFox Redaktion",
    readingTime: 3,
    location: "Neutraubling",
    tags: ["Presse", "Donau-Post", "Zeitung", "Gründung"],
  },
  {
    slug: "paneldiskussion-oekonomische-bildung",
    category: "event",
    title: "Paneldiskussion: Wie sichern wir gute ökonomische Bildung?",
    excerpt:
      "Spannende Runde mit Prof. Dr. Nils Goldschmidt (Universität Tübingen) und Dr. Stephan Friebel-Piechotta. Für uns eine große Ehre, als Gründer von BeAFox auf dem Panel zu sitzen und darüber zu sprechen, welche Rolle spielerische Formate für Finanzkompetenz haben.",
    image: "/assets/news/13.webp",
    imageAlt: "Paneldiskussion zu ökonomischer Bildung mit BeAFox",
    publishedAt: "2026-02-14",
    author: "Alex Tapelea",
    readingTime: 5,
    location: "Tübingen",
    tags: ["Panel", "Ökonomische Bildung", "Universität", "Keynote"],
  },
  {
    slug: "bayerischer-innovationstag-financial-literacy",
    category: "event",
    title: "Bayerischer Innovationstag: Financial Literacy im Fokus",
    excerpt:
      "Beim Bayerischen Innovationstag durfte Alex auf der Bühne darüber sprechen, wie wir Financial Literacy across generations denken. \u201EWhat did you learn about finance back then?\u201C — die Antworten waren eindeutig. Zeit, das zu ändern.",
    image: "/assets/news/12.webp",
    imageAlt: "Alex Tapelea spricht beim Bayerischen Innovationstag",
    publishedAt: "2026-02-08",
    author: "Alex Tapelea",
    readingTime: 4,
    location: "Nürnberg",
    tags: ["Innovationstag", "Financial Literacy", "Keynote", "Bayern"],
  },
  {
    slug: "baystartup-summit-startup-spotlight",
    category: "event",
    title: "BayStartUP Summit: BeAFox im Start-up-Spotlight",
    excerpt:
      "Bunt, laut, voller Energie: Beim BayStartUP Summit hatten wir einen Abend lang die Bühne für uns. Neue Kontakte, alte Mitstreiterinnen, und mindestens drei Gespräche, aus denen echte Kooperationen werden könnten. Wir sind noch ganz geflasht.",
    image: "/assets/news/11.webp",
    imageRotation: "rotate180",
    imageAlt: "Alex und Selina beim BayStartUP Summit",
    publishedAt: "2026-02-02",
    author: "Selina Fuchs",
    readingTime: 3,
    location: "München",
    tags: ["BayStartUP", "Summit", "Start-up", "Networking"],
  },
  {
    slug: "makers-of-tomorrow-expo",
    category: "event",
    title: "Makers of Tomorrow: Unser Wochenende auf der Expo",
    excerpt:
      "Zwei Tage Expo, hunderte Gespräche, ein Kuscheltier-Fuchs als Maskottchen — und eine Community, die zeigt: Finanzbildung berührt Menschen aller Altersgruppen. Die Makers of Tomorrow Expo hat uns daran erinnert, warum wir das hier machen.",
    image: "/assets/news/10.webp",
    imageRotation: "rotate180",
    imageAlt: "BeAFox Team auf der Makers of Tomorrow Expo",
    publishedAt: "2026-01-25",
    author: "Selina Fuchs",
    readingTime: 4,
    location: "Leipzig",
    tags: ["Makers of Tomorrow", "Expo", "Community", "Event"],
  },
  {
    slug: "spreadshirt-makers-of-tomorrow",
    category: "event",
    title: "Spreadshirt Makers of Tomorrow: BeAFox im Rampenlicht",
    excerpt:
      "Frisch bedruckte Lanyards, Rampenlicht-Atmosphäre und eine Jury aus Profis. Auf der Spreadshirt-Bühne haben wir BeAFox in 5 Minuten erklärt — und mindestens so viele neue Stimmen für spielerische Finanzbildung gewonnen.",
    image: "/assets/news/9.webp",
    imageRotation: "cw90",
    imageAlt: "Alex und Selina bei Spreadshirt Makers of Tomorrow",
    publishedAt: "2026-01-18",
    author: "Alex Tapelea",
    readingTime: 3,
    location: "Leipzig",
    tags: ["Spreadshirt", "Makers of Tomorrow", "Pitch", "Event"],
  },
  {
    slug: "pitch-night-fuer-startups",
    category: "event",
    title: "Pitch Night für Start-ups: BeAFox stellt sich vor",
    excerpt:
      "Kurze Slides, klare Botschaft: Bei der Pitch Night für Start-ups haben wir vor Investoren und Gründercommunity erklärt, warum gamifizierte Finanzbildung jetzt ein Markt ist — und wie BeAFox ihn verändert.",
    image: "/assets/news/8.webp",
    imageRotation: "cw90",
    imageAlt: "Alex pitcht BeAFox bei der Pitch Night für Start-ups",
    publishedAt: "2026-01-10",
    author: "Alex Tapelea",
    readingTime: 3,
    location: "Regensburg",
    tags: ["Pitch Night", "Investoren", "Start-up", "Regensburg"],
  },
  {
    slug: "keynote-gamification-finanzbildung",
    category: "event",
    title: "Keynote: Warum Finanzbildung jetzt spielerisch werden muss",
    excerpt:
      "\u201EMehr Wissen. Mehr Geld. Mehr Freiheit.\u201C — unter diesem Motto hat Alex eine Keynote zur Zukunft der Finanzbildung gehalten. Vor über 200 Zuhörerinnen und Zuhörern haben wir gezeigt, wie Gamification lernen dramatisch beschleunigen kann.",
    image: "/assets/news/7.webp",
    imageRotation: "cw90",
    imageAlt: "Alex Tapelea bei der Keynote über spielerische Finanzbildung",
    publishedAt: "2025-12-18",
    author: "Alex Tapelea",
    readingTime: 5,
    location: "München",
    tags: ["Keynote", "Gamification", "Finanzbildung", "Event"],
  },
  {
    slug: "schulbesuch-klassenzimmer",
    category: "partnerschaft",
    title: "Erste Schulkooperation: BeAFox zu Besuch im Klassenzimmer",
    excerpt:
      "Von der Theorie in die Praxis: Selina und Alex waren zu Gast in einer 9. Klasse — mit Aufgaben, Prototypen und vielen neugierigen Fragen. Das erste direkte Feedback von der Zielgruppe, für die wir BeAFox bauen. Spoiler: Es war Gold wert.",
    image: "/assets/news/6.webp",
    imageRotation: "cw90",
    imageAlt: "BeAFox Team zu Besuch in einer Schulklasse",
    publishedAt: "2025-12-10",
    author: "Selina Fuchs",
    readingTime: 4,
    location: "Regensburg",
    tags: ["Schule", "Kooperation", "Feedback", "Klassenzimmer"],
  },
  {
    slug: "kooperationsvertrag-schmelter",
    category: "partnerschaft",
    title: "Neue Kooperation: Partnerschaftsvertrag unterzeichnet",
    excerpt:
      "Unterschrift drauf — und los geht's: Wir haben unsere erste große Kooperationsvereinbarung unterzeichnet. Was das für BeAFox bedeutet und wie unser Partner uns dabei hilft, noch mehr Jugendliche an Finanzbildung heranzuführen.",
    image: "/assets/news/5.webp",
    imageRotation: "cw90",
    imageAlt: "Alex und Selina unterzeichnen einen Kooperationsvertrag",
    publishedAt: "2025-12-02",
    author: "Alex Tapelea",
    readingTime: 3,
    location: "Regensburg",
    tags: ["Kooperation", "Partnerschaft", "Vertrag"],
  },
  {
    slug: "tec-as-accelerator-neues-zuhause",
    category: "team",
    title: "TechSpace AS: Unser neues Zuhause im Tech-Accelerator",
    excerpt:
      "Stay hungry, stay foolish — und stay connected: BeAFox hat einen festen Platz im TechSpace AS Accelerator bezogen. Mehr Raum, mehr Austausch mit anderen Gründerinnen und Gründern, und die beste Kaffee-Maschine der Stadt. Wir sind angekommen.",
    image: "/assets/news/4.webp",
    imageRotation: "cw90",
    imageAlt: "BeAFox Team im TechSpace AS Accelerator",
    publishedAt: "2025-11-22",
    author: "BeAFox Redaktion",
    readingTime: 3,
    location: "Regensburg",
    tags: ["Team", "Accelerator", "TechSpace", "Büro"],
  },
  {
    slug: "gastvorlesung-hochschule",
    category: "event",
    title: "Gastvorlesung: Warum Gamification Finanzbildung verändert",
    excerpt:
      "Alex durfte an einer Hochschule eine Gastvorlesung halten — vor Studierenden der Wirtschaftswissenschaften. Thema: Wie Gamification Lernprozesse verändert und warum Finanzbildung dringend ein neues Format braucht.",
    image: "/assets/news/3.webp",
    imageAlt: "Alex Tapelea bei einer Gastvorlesung an der Hochschule",
    publishedAt: "2025-11-15",
    author: "Alex Tapelea",
    readingTime: 4,
    location: "Regensburg",
    tags: ["Gastvorlesung", "Hochschule", "Gamification", "Studierende"],
  },
  {
    slug: "messestand-debut",
    category: "event",
    title: "Messestand-Debut: Erste Besucher, erste Insights",
    excerpt:
      "Rollup ausgepackt, Flyer sortiert, Maskottchen im Arm — und ab auf die Messe. Unser erstes Mal als Aussteller auf einer Bildungsmesse. Was wir gelernt haben: Finanzbildung spricht nicht nur Schulen an. Sondern auch Eltern. Und Großeltern.",
    image: "/assets/news/2.webp",
    imageRotation: "cw90",
    imageAlt: "Alex am BeAFox Messestand auf einer Bildungsmesse",
    publishedAt: "2025-11-05",
    author: "Alex Tapelea",
    readingTime: 3,
    location: "Regensburg",
    tags: ["Messe", "Messestand", "Bildung", "Debut"],
  },
  {
    slug: "beafox-gaming-stand-ausprobieren",
    category: "event",
    title: "BeAFox Gaming-Stand: Finanzbildung zum Ausprobieren",
    excerpt:
      "Ein Arcade-Automat mit BeAFox-Challenges, mitten im Foyer. Die Idee: Finanzbildung muss greifbar sein. Wer vorbeikommt, darf direkt loslegen. Und die Reaktionen zeigen: Kinder verstehen die Logik von Level-Ups schneller als mancher Erwachsene die von Zinseszins.",
    image: "/assets/news/1.webp",
    imageRotation: "cw90",
    imageAlt: "BeAFox Gaming-Stand mit Arcade-Automat",
    publishedAt: "2025-10-28",
    author: "Selina Fuchs",
    readingTime: 3,
    location: "Regensburg",
    tags: ["Gaming", "Arcade", "Event", "Interaktiv"],
  },
];

// ─── Helpers ───
export function getAllNewsPosts(): NewsPost[] {
  return [...NEWS_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getNewsPostsByCategory(category: NewsCategory): NewsPost[] {
  return getAllNewsPosts().filter((p) => p.category === category);
}

export function getNewsPostBySlug(slug: string): NewsPost | undefined {
  return NEWS_POSTS.find((p) => p.slug === slug);
}

export function formatNewsDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

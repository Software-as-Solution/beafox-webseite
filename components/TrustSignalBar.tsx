// STANDARD COMPONENTS
import Image from "next/image";
// CUSTOM COMPONENTS
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";

// CONSTANTS
const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
const STORES = [
  { src: "/assets/Apple.png", alt: "App Store", label: "App Store" },
  { src: "/assets/Android.png", alt: "Google Play", label: "Google Play" },
] as const;
const PARTNER_LOGOS = [
  { src: "/Partners/1.png", alt: "Dr. Robert Eckert Schulen" },
  { src: "/Partners/3.png", alt: "IHK Akademie" },
  { src: "/Partners/8.png", alt: "TechBase Regensburg" },
  { src: "/Partners/2.png", alt: "Partner" },
  { src: "/Partners/4.png", alt: "Partner" },
  { src: "/Partners/5.png", alt: "Partner" },
] as const;
// CONSTANTS
const USER_REVIEWS = [
  {
    name: "J.Ole95",
    store: "apple" as const,
    date: "03.10.2025",
    text: "Die App überzeugt durch ihren innovativen Ansatz. Statt trockener Theorie bietet sie kurze, flexible Lerneinheiten. Besonders positiv: die spielerische Struktur mit Punkten und Missionen.",
  },
  {
    name: "Erik Wilhelm",
    store: "google" as const,
    date: "11.03.2026",
    text: "Wirklich super verständlich aufgebaut, dazu ein roter Faden und greifbare Themen. Die Gamification ist auch toll! Ich kenn mich mit Finanzen schon gut aus und habe trotzdem stets neue Enthüllungen.",
  },
  {
    name: "Andra_Andrei",
    store: "apple" as const,
    date: "19.09.2025",
    text: "Wurde mir auf TikTok angezeigt und ich wurde absolut überzeugt. Die Inhalte sind so simpel geschrieben, dass sogar ich diese verstehe. Mittlerweile bin ich sogar leicht süchtig.",
  },
  {
    name: "Niklas Arbinger",
    store: "google" as const,
    date: "19.12.2025",
    text: "Sehr übersichtliche App, die Finanzwissen spielerisch vermittelt. Für Einsteiger und Fortgeschrittene gut geeignet, um Wissen zu vertiefen oder neues zu erlangen.",
  },
  {
    name: "Nina__21",
    store: "apple" as const,
    date: "30.12.2025",
    text: "Die App ist sehr übersichtlich und motivierend gestaltet. Die Informationen haben mir geholfen, mein Finanzwissen auszubauen. Große Empfehlung!",
  },
  {
    name: "Micha8700",
    store: "apple" as const,
    date: "16.09.2025",
    text: "War schon Beta-Tester und hatte eine Menge Spaß. Durch die spielerische Note beim Lernen und den Ranglisten wird einem das trockene Thema super nahegebracht.",
  },
  {
    name: "Elias",
    store: "google" as const,
    date: "28.01.2026",
    text: "Super Sache um sich eine Basis an Wissen anzueignen. Sehr sympathisches Team! Die App macht Finanzbildung endlich zugänglich und verständlich.",
  },
] as const;
// INTERFACES
interface TrustSignalBarProps {
  preTitle?: string;
  highlight?: string;
  showReviews?: boolean;
  showPartners?: boolean;
}

export default function TrustSignalBar({
  showReviews = false,
  showPartners = false,
  preTitle = "5.000+ Menschen",
  highlight = "vertrauen auf Bea",
}: TrustSignalBarProps) {
  return (
    <Section className="bg-gray-50 py-8 md:py-12">
      <div className="max-w-5xl mx-auto text-center">
        <SectionHeader
          preTitle={preTitle}
          highlight={highlight}
          wrapperClassName="mb-10"
        />
        <div className="flex justify-center relative bottom-1">
          <div
            className="relative grid grid-cols-2 items-center rounded-2xl px-6 md:px-10 py-4 md:py-5"
            style={{
              border: "1px solid rgba(232,119,32,0.12)",
              background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
              boxShadow:
                "0 4px 16px rgba(0,0,0,0.04), 0 0 0 1px rgba(232,119,32,0.04)",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute left-1/2 -translate-x-1/2 w-px h-12 bg-primaryOrange/10"
            />
            {STORES.map((store) => (
              <div
                key={store.label}
                className="px-3 md:px-4 flex justify-center"
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{ background: "rgba(232,119,32,0.06)" }}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  >
                    <Image
                      width={100}
                      height={100}
                      src={store.src}
                      alt={store.alt}
                      className="object-contain w-8 h-8 md:w-12 md:h-12"
                    />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-semibold text-darkerGray leading-none text-start relative left-[1%]">
                      {store.label}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div
                        className="flex items-center gap-0.5"
                        aria-label="5.0 von 5 Sternen"
                      >
                        {[...Array(5)].map((_, j) => (
                          <svg
                            key={j}
                            width="14"
                            height="14"
                            stroke="none"
                            fill="#E87720"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                          >
                            <path d={STAR_PATH} />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm md:text-base font-bold text-primaryOrange">
                        5.0
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Partner logos — optional */}
        {showPartners && (
          <div className="mt-8 md:mt-12 overflow-hidden">
            <div className="relative">
              {/* Fade edges */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"
              />
              {/* Scrolling track */}
              <div className="flex animate-scroll-left gap-10 md:gap-14 items-center w-max">
                {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
                  <Image
                    width={120}
                    height={48}
                    src={logo.src}
                    alt={logo.alt}
                    key={`${logo.alt}-${i}`}
                    className="object-contain h-8 md:h-10 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {/* User reviews — horizontal scroll */}
        {showReviews && (
          <div className="mt-8 md:mt-10 overflow-hidden">
            <div className="relative">
              {/* Fade edges */}
              <div
                className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"
                aria-hidden="true"
              />
              {/* Scrolling track */}
              <div className="flex animate-scroll-left-slow gap-4 items-stretch w-max">
                {[...USER_REVIEWS, ...USER_REVIEWS].map((review, i) => (
                  <div
                    key={`${review.name}-${i}`}
                    className="w-[280px] md:w-[320px] flex-shrink-0 rounded-xl p-4 md:p-5 border border-primaryOrange/10 bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Image
                          src={
                            review.store === "apple"
                              ? "/assets/Apple.png"
                              : "/assets/Android.png"
                          }
                          alt={
                            review.store === "apple"
                              ? "App Store"
                              : "Google Play"
                          }
                          width={16}
                          height={16}
                          className="object-contain w-4 h-4 flex-shrink-0"
                        />
                        <span className="text-xs md:text-sm font-semibold text-darkerGray">
                          {review.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <svg
                            key={j}
                            width="10"
                            height="10"
                            stroke="none"
                            fill="#E87720"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                          >
                            <path d={STAR_PATH} />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-lightGray leading-relaxed line-clamp-4">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <p className="text-[10px] text-lightGray/50 mt-2">
                      {review.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

"use client";

// STANDARD COMPONENTS
import Link from "next/link";
import Image from "next/image";
// CUSTOM COMPONENTS
import Section from "@/components/Section";
import TrustBadge from "@/components/Trustbadge";
import SectionHeader from "@/components/SectionHeader";
import RatgeberSection from "@/components/RatGeber";
// IMPORTS
import { motion } from "framer-motion";
import { type SanityGuide } from "@/lib/sanity.client";
import {
  getGuidePostPath,
  getRatgeberCategoryPath,
  type BlogCategory,
} from "@/lib/blog";
// ICONS
import { PawPrint, ArrowRight } from "lucide-react";

// TYPES
interface RatgeberCategoryProps {
  guides: SanityGuide[];
  category: BlogCategory;
}

// CONSTANTS
const APP_URL = "https://beafox.app";
const APP_STORE_URL = "https://apps.apple.com/de/app/beafox/id6746110612";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.beafox";

const CATEGORY_MASCOTS: Record<string, string> = {
  azubis: "/Maskottchen/Maskottchen-Azubi.webp",
  schueler: "/Maskottchen/Maskottchen-Schueler.png",
  studenten: "/Maskottchen/Maskottchen-Studenten.webp",
  investieren: "/Maskottchen/Maskottchen-Investieren.webp",
  berufseinsteiger: "/Maskottchen/Maskottchen-Berufseinsteiger.webp",
  lebenssituation: "/Maskottchen/Maskottchen-Lebenssituationen.webp",
};

// Bea-Motive für die Ratgeber-Karten, deterministisch per Index rotiert
const BEA_RATGEBER_IMAGES: readonly string[] = [
  "/Maskottchen/Maskottchen-Setup.webp",
  "/Maskottchen/Maskottchen-Freude.webp",
  "/Maskottchen/Maskottchen-Loesung.webp",
  "/Maskottchen/Maskottchen-Rechner.webp",
  "/Maskottchen/Maskottchen-Beratung.webp",
  "/Maskottchen/Maskottchen-Begleitung.webp",
] as const;

// STYLE CONSTANTS
const ORANGE_GRADIENT = "linear-gradient(135deg, #F5944B 0%, #E87720 100%)";
const STORE_BUTTON_STYLE = {
  border: "1px solid rgba(232,119,32,0.2)",
  boxShadow: "0 8px 24px rgba(232,119,32,0.1), 0 2px 4px rgba(0,0,0,0.04)",
} as const;
const HERO_BG_BLOB_STYLE = {
  background: "radial-gradient(circle, #E87720, transparent 70%)",
} as const;
const HERO_MASCOT_GLOW_STYLE = {
  background:
    "radial-gradient(ellipse 80% 70% at 50% 30%, rgba(232,119,32,0.12), transparent 65%)",
} as const;
const APP_CTA_STYLE = {
  background:
    "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.18), transparent 55%), " +
    ORANGE_GRADIENT,
} as const;

// HELPERS FUNCTIONS
function getMascot(categorySlug: string): string {
  return CATEGORY_MASCOTS[categorySlug] ?? "/Maskottchen/Maskottchen-Ratgeber.webp";
}

function getBeaImage(index: number): string {
  return BEA_RATGEBER_IMAGES[index % BEA_RATGEBER_IMAGES.length];
}

function renderTitleWithHighlight(title: string): React.ReactNode {
  const lastSpace = title.lastIndexOf(" ");
  if (lastSpace === -1) return <span className="text-primaryOrange">{title}</span>;
  return (
    <>
      {title.slice(0, lastSpace)}{" "}
      <span className="text-primaryOrange">{title.slice(lastSpace + 1)}</span>
    </>
  );
}

// SUBCOMPONENTS
interface StoreButtonProps {
  href: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
}
function StoreButton({ href, imageSrc, imageAlt, label }: StoreButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={STORE_BUTTON_STYLE}
      className="group flex flex-1 items-center gap-2 md:gap-3 justify-start sm:justify-center rounded-xl md:rounded-2xl bg-white px-3 py-2.5 md:px-5 md:py-4 hover:scale-[1.04] transition-all duration-300"
    >
      <Image
        width={160}
        height={52}
        src={imageSrc}
        alt={imageAlt}
        className="object-contain w-[24px] md:w-[36px] h-auto shrink-0"
      />
      <span className="text-xs md:text-base font-black text-darkerGray text-left leading-tight">
        {label}
      </span>
    </a>
  );
}

interface GuideCardProps {
  index: number;
  guide: SanityGuide;
  categorySlug: string;
}
function GuideCard({ guide, index, categorySlug }: GuideCardProps) {
  const beaImage = getBeaImage(index);
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="h-full"
    >
      <article
        className="group relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-[0_8px_30px_-18px_rgba(17,24,39,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primaryOrange/40 hover:shadow-[0_22px_48px_-20px_rgba(232,119,32,0.42)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primaryOrange/[0.035] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF7EF] via-white to-[#FFE8D2]">
          <div aria-hidden className="absolute -right-10 -top-14 h-36 w-36 rounded-full bg-primaryOrange/10 blur-2xl" />
          <div aria-hidden className="absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-primaryOrange/10 blur-2xl" />
          <div className="relative h-40 w-40 scale-105 transition-all duration-500 ease-out group-hover:rotate-[5deg] group-hover:scale-120">
            <Image
              src={beaImage}
              alt=""
              fill
              className="object-contain drop-shadow-[0_16px_26px_rgba(232,119,32,0.22)]"
              sizes="160px"
            />
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-6 md:p-7">
          <h3 className="mb-3 text-[20px] font-bold leading-snug text-darkerGray transition-colors duration-300 group-hover:text-primaryOrange md:text-[22px]">
            {guide.title}
          </h3>

          <p className="mb-7 line-clamp-3 flex-1 text-[15px] leading-relaxed text-lightGray">
            {guide.excerpt}
          </p>

          <Link
            href={getGuidePostPath(categorySlug, guide.slug)}
            className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primaryOrange px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(232,119,32,0.65)] transition-all duration-300 hover:bg-darkOrange hover:shadow-[0_14px_30px_-10px_rgba(232,119,32,0.75)]"
          >
            Ratgeber starten
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </article>
    </motion.li>
  );
}

// RATGEBER_CATEGORY
export default function RatgeberCategory({ category, guides }: RatgeberCategoryProps) {
  // CONSTANTS
  const mascotSrc = getMascot(category.slug);
  const categoryUrl = `${APP_URL}${getRatgeberCategoryPath(category.slug)}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
      { "@type": "ListItem", position: 2, name: "Ratgeber", item: `${APP_URL}/ratgeber` },
      { "@type": "ListItem", position: 3, name: category.navLabel, item: categoryUrl },
    ],
  };
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    url: categoryUrl,
    description: category.description,
    inLanguage: "de-DE",
    about: category.navLabel,
  };

  return (
    <>
      {/* STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* ─── 1. HERO ─── */}
      <Section
        defaultPadding={false}
        noContainer
        className="relative w-full overflow-hidden bg-gradient-to-b from-[#fafafa] to-white pt-28 pb-6 md:pt-32 md:pb-8"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-20 h-[420px] w-[420px] rounded-full opacity-[0.05] blur-3xl"
          style={HERO_BG_BLOB_STYLE}
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 md:px-6">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative overflow-hidden rounded-[24px] border border-gray-200/80 bg-white shadow-[0_4px_24px_-8px_rgba(17,24,39,0.08),0_1px_2px_rgba(17,24,39,0.04)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_min(420px,36vw)]">
              {/* Text column */}
              <div className="flex flex-col justify-center p-5 sm:p-7 md:p-8 lg:p-10 lg:pr-8">

                {/* Title */}
                <h1 className="mb-3 text-4xl font-bold leading-tight text-darkerGray sm:text-5xl md:mb-4 md:text-6xl lg:text-7xl">
                  {renderTitleWithHighlight(category.title)}
                </h1>

                {/* Description */}
                <p className="mb-4 max-w-xl text-sm leading-relaxed text-lightGray md:mb-5 md:text-base lg:text-lg">
                  {category.description}
                </p>

                {/* Actions */}
                  <div className="flex max-w-[280px] gap-2 sm:max-w-md md:gap-3 lg:gap-4">
                      <StoreButton
                        href={APP_STORE_URL}
                        label="App Store"
                        imageSrc="/assets/Apple.webp"
                        imageAlt="BeAFox im App Store laden"
                      />
                      <StoreButton
                        href={PLAY_STORE_URL}
                        label="Google Play"
                        imageSrc="/assets/Android.webp"
                        imageAlt="BeAFox bei Google Play laden"
                      />
                  </div>
                <TrustBadge />
              </div>

              {/* Mascot column */}
              <div className="relative flex flex-col items-center justify-center gap-6 overflow-hidden border-t border-gray-100 bg-gradient-to-br from-[#FEF6EF] via-[#FFFDFB] to-[#FEF6EF] px-6 py-8 lg:border-l lg:border-t-0">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={HERO_MASCOT_GLOW_STYLE}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-6 right-7 h-2 w-2 animate-pulse rounded-full bg-primaryOrange/50"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-14 right-14 h-1.5 w-1.5 rounded-full bg-primaryOrange/35"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-24 left-8 h-1 w-1 rounded-full bg-primaryOrange/40"
                />

                <div className="relative z-[1] flex w-full items-center justify-center">
                  <div className="relative h-[240px] w-full max-w-[340px] lg:h-[320px] lg:max-w-[400px]">
                    <Image
                      src={mascotSrc}
                      alt={`BeAFox Maskottchen für ${category.navLabel}`}
                      fill
                      priority
                      className="scale-125 object-contain object-center drop-shadow-[0_12px_32px_rgba(232,119,32,0.18)]"
                      sizes="(max-width: 1024px) 340px, 400px"
                    />
                  </div>
                </div>
                <Link
                  href="/bea-ai"
                  className="group relative z-[1] inline-flex w-full max-w-[300px] items-center justify-center gap-2 rounded-full bg-primaryOrange px-5 py-3 text-sm font-bold text-white shadow-[0_10px_26px_-8px_rgba(232,119,32,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-darkOrange"
                >
                  Direkt mit Bea chatten
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ─── 2. ALLE RATGEBER ─── */}
      <Section
        id="ratgeber"
        width="wide"
        className="scroll-mt-24 bg-[#fafafa] py-12 md:py-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="mb-8 text-center md:mb-10"
        >
          <SectionHeader
            pillClassName="mb-4 sm:mb-6"
            preTitle="Alle"
            highlight="Ratgeber"
            subtitle={
              <>
                <span className="mt-1 block bold">
                  <span className="text-primaryOrange">
                    Schritt für Schritt mit Bea: <br /> 
                    <span className="text-lightGray">Von der ersten Frage bis zur konkreten Umsetzung.</span>
                  </span>
                </span>
              </>
            }
          />
        </motion.div>

        {guides.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {guides.map((guide, i) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                index={i}
                categorySlug={category.slug}
              />
            ))}
          </ul>
        ) : (
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[20px] border border-gray-200 bg-white p-10 text-center shadow-[0_2px_8px_-2px_rgba(17,24,39,0.04)]">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primaryOrange/10 ring-1 ring-primaryOrange/20">
              <PawPrint className="h-6 w-6 text-primaryOrange" aria-hidden />
            </div>
            <h3 className="text-[18px] font-bold text-darkerGray">Bald geht's los</h3>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-lightGray">
              Für diese Kategorie sind die ersten Ratgeber in Arbeit. Schau gleich nochmal vorbei.
            </p>
          </div>
        )}
      </Section>

      {/* ─── 3. APP CTA ─── */}
      <Section width="wide" className="bg-white py-8 md:py-12">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-[26px] shadow-[0_20px_54px_-24px_rgba(232,119,32,0.5)] md:rounded-[30px]"
          style={APP_CTA_STYLE}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />
          <div className="relative grid min-h-[330px] grid-cols-1 items-center gap-6 p-6 sm:p-8 md:grid-cols-[1.15fr_0.85fr] md:gap-6 md:p-10 lg:min-h-[380px] lg:p-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-sm ring-1 ring-white/25 md:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Mit Bea weiterdenken
              </span>

              <h2 className="mt-5 max-w-[580px] text-[34px] font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-[42px] md:text-[48px] lg:text-[56px]">
                Deine Fragen direkt in der App beantworten.
              </h2>
              <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-white/85 md:text-base">
                Lies den Ratgeber und frag Bea danach, wie du die nächsten Schritte auf deine Situation anwendest.
              </p>

              <div className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
                <StoreButton
                  href={APP_STORE_URL}
                  imageSrc="/assets/Apple.webp"
                  label="App Store"
                  imageAlt="Im App Store laden"
                />
                <StoreButton
                  href={PLAY_STORE_URL}
                  imageSrc="/assets/Android.webp"
                  label="Google Play"
                  imageAlt="Bei Google Play laden"
                />
              </div>
            </div>

            <div className="relative flex min-h-[220px] items-center justify-center md:min-h-[300px]">
              <div
                aria-hidden
                className="absolute h-64 w-64 rounded-full bg-white/15 blur-3xl md:h-80 md:w-80"
              />
              <div className="relative h-60 w-60 md:h-[310px] md:w-[310px] lg:h-[350px] lg:w-[350px]">
                <Image
                  fill
                  src="/Maskottchen/Maskottchen-Handy.png"
                  alt=""
                  className="scale-110 object-contain drop-shadow-[0_24px_42px_rgba(120,52,0,0.22)] md:scale-120"
                  sizes="(max-width: 768px) 240px, (max-width: 1024px) 310px, 350px"
                />
              </div>
            </div>
          </div>
        </motion.section>
      </Section>

      {/* ─── 4. WEITERE KATEGORIEN ─── */}
      <Section width="wide" className="bg-[#fafafa] py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="mb-8 text-center md:mb-10"
        >
          <SectionHeader
            pillClassName="mb-4 sm:mb-6"
            preTitle="Weitere beliebte"
            highlight="Ratgeber"
            subtitle={
              <>
                <span className="block">
                  Ob Schüler, Azubi oder Berufseinsteiger:
                </span>
                <span className="mt-1 block">
                  <span className="text-primaryOrange">
                    Der Ratgeber der zu dir passt.
                  </span>
                </span>
              </>
            }
          />
        </motion.div>

        <RatgeberSection
          viewAllLabel="Alle beliebten Ratgeber entdecken"
          categoryCtaLabel="Ratgeber ansehen"
        />
      </Section>
    </>
  );
}
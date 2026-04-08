// IMPORTS
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
// CUSTOM COMPONENTS
import StructuredData from "@/components/StructuredData";
import MagazinFilter from "@/components/magazin/MagazinFilter";
// ICONS
import { Mail, Clock, ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import {
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";
// UTILS & DATA
import {
  getAllClusters,
  getAllArticles,
  CLUSTER_COLORS,
  getFeaturedArticles,
  ARTICLE_TYPE_LABELS,
} from "@/lib/wissen";
import type { WissenArticleCard } from "@/lib/wissen";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";

// ISR
export const revalidate = 60;

// CONSTANTS
const MASCOT_BASE = "/Maskottchen";

// Floating mascots — randomly distributed left & right
// Each has a unique animation delay + duration for organic motion
const HERO_MASCOTS = [
  // LEFT side cluster — closer to center, larger sizes
  {
    src: "Maskottchen-Studenten.webp",
    side: "left",
    top: "36%",
    offset: "18%",
    size: 120,
    rotate: -10,
    animDelay: 0,
    animDur: 7,
  },
  {
    src: "Maskottchen-Azubi.webp",
    side: "left",
    top: "25%",
    offset: "4%",
    size: 140,
    rotate: 6,
    animDelay: 1.5,
    animDur: 8.5,
  },
  {
    src: "Maskottchen-Hero.webp",
    side: "left",
    top: "52%",
    offset: "10%",
    size: 120,
    rotate: -8,
    animDelay: 0.8,
    animDur: 9,
  },
  {
    src: "Maskottchen-Freude.webp",
    side: "left",
    top: "55%",
    offset: "26%",
    size: 120,
    rotate: 12,
    animDelay: 2.2,
    animDur: 7.5,
  },
  {
    src: "Maskottchen-Lebenssituationen.webp",
    side: "left",
    top: "19%",
    offset: "23%",
    size: 120,
    rotate: -4,
    animDelay: 3,
    animDur: 8,
  },
  // RIGHT side cluster
  {
    src: "Maskottchen-Berufseinsteiger.webp",
    side: "right",
    top: "36%",
    offset: "18%",
    size: 125,
    rotate: 8,
    animDelay: 0.5,
    animDur: 8,
  },
  {
    src: "Maskottchen-School.webp",
    side: "right",
    top: "25%",
    offset: "5%",
    size: 130,
    rotate: -6,
    animDelay: 1.8,
    animDur: 9.5,
  },
  {
    src: "Maskottchen-Investieren.webp",
    side: "right",
    top: "52%",
    offset: "10%",
    size: 120,
    rotate: 9,
    animDelay: 0.3,
    animDur: 7,
  },
  {
    src: "Maskottchen-Business.webp",
    side: "right",
    top: "55%",
    offset: "26%",
    size: 120,
    rotate: -11,
    animDelay: 2.5,
    animDur: 8.5,
  },
  {
    src: "Maskottchen-Rechner.webp",
    side: "right",
    top: "18%",
    offset: "23%",
    size: 120,
    rotate: 6,
    animDelay: 1.2,
    animDur: 7.5,
  },
] as const;

const SOCIAL_LINKS = [
  {
    icon: FaInstagram,
    href: "https://instagram.com/beafox_app",
    labelKey: "instagram",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/company/beafox-app/",
    labelKey: "linkedin",
  },
  {
    icon: FaFacebook,
    href: "https://facebook.com/beafox",
    labelKey: "facebook",
  },
  { icon: FaYoutube, href: "https://youtube.com/@beafox", labelKey: "youtube" },
  {
    icon: FaTiktok,
    href: "https://www.tiktok.com/@beafox_app",
    labelKey: "tiktok",
  },
] as const;

// METADATA
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("magazin");

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: "https://beafox.app/magazin",
      siteName: "BeAFox",
      locale: "de_DE",
    },
    alternates: {
      canonical: "https://beafox.app/magazin",
    },
  };
}

// COMPONENT
export default async function MagazinPage() {
  const t = await getTranslations("magazin");
  const clusters = await getAllClusters();
  const featuredArticles = await getFeaturedArticles(3);
  const allArticles = await getAllArticles();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("page.hero.title"),
    description: t("description"),
    url: "https://beafox.app/magazin",
    publisher: {
      "@type": "Organization",
      name: "BeAFox",
      logo: {
        "@type": "ImageObject",
        url: "https://beafox.app/assets/Logos/Logo.webp",
      },
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />

      {/* ─── INLINE KEYFRAMES (server-rendered) ─── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes magazinFloat {
              0%, 100% {
                transform: translate(0, 0) rotate(var(--rot, 0deg));
              }
              25% {
                transform: translate(6px, -14px) rotate(calc(var(--rot, 0deg) + 3deg));
              }
              50% {
                transform: translate(-4px, -22px) rotate(calc(var(--rot, 0deg) - 2deg));
              }
              75% {
                transform: translate(-8px, -10px) rotate(calc(var(--rot, 0deg) + 1deg));
              }
            }
            @keyframes magazinDrift {
              0%, 100% {
                transform: translate(0, 0) rotate(var(--rot, 0deg));
              }
              33% {
                transform: translate(-10px, -18px) rotate(calc(var(--rot, 0deg) - 4deg));
              }
              66% {
                transform: translate(8px, -12px) rotate(calc(var(--rot, 0deg) + 5deg));
              }
            }
            .magazin-mascot {
              animation: magazinFloat var(--dur, 8s) ease-in-out infinite;
              animation-delay: var(--delay, 0s);
              will-change: transform;
            }
            .magazin-mascot.drift {
              animation-name: magazinDrift;
            }
            @media (prefers-reduced-motion: reduce) {
              .magazin-mascot {
                animation: none !important;
              }
            }
          `,
        }}
      />

      {/* ─── 1. HERO SECTION ─── */}
      <Section className="overflow-hidden bg-primaryWhite pt-28 md:pt-36 pb-24 md:pb-32">
        {/* Soft orange ambient glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(232,119,32,0.08) 0%, transparent 60%)",
          }}
        />

        {/* Floating mascots — Desktop only */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          {HERO_MASCOTS.map((mascot, idx) => (
            <FloatingMascot key={idx} mascot={mascot} index={idx} />
          ))}
        </div>

        {/* Centered Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge — aligned with LandingHero */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 text-lightGray text-xs md:text-sm border text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 py-1.5 md:py-2">
              <Sparkles
                aria-hidden="true"
                className="w-3 h-3 md:w-6 md:h-6 text-primaryOrange flex-shrink-0"
              />
              <span className="font-bold whitespace-pre-line text-center leading-tight text-base">
                {t("page.hero.badge")}
              </span>
              <Sparkles
                aria-hidden="true"
                className="w-3 h-3 md:w-6 md:h-6 text-primaryOrange flex-shrink-0"
              />
            </div>
          </div>

          {/* H1 Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-darkerGray mb-6 leading-[1.05] tracking-tight">
            {t("page.hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-lightGray leading-relaxed max-w-2xl mx-auto mb-10 whitespace-pre-line">
            {t("page.hero.subtitle")}
          </p>

          {/* Mobile mascots */}
          <div className="flex lg:hidden justify-center items-center gap-2 mb-8 opacity-90">
            {HERO_MASCOTS.slice(0, 4).map((mascot, idx) => (
              <div
                key={`mobile-${idx}`}
                className="relative w-14 h-14 flex-shrink-0"
              >
                <Image
                  src={`${MASCOT_BASE}/${mascot.src}`}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="56px"
                />
              </div>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-3">
            {SOCIAL_LINKS.map(({ icon: Icon, href, labelKey }) => (
              <a
                key={labelKey}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t(`page.social.${labelKey}`)}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:rotate-6"
                style={{
                  background: "rgba(232,119,32,0.08)",
                  border: "1.5px solid rgba(232,119,32,0.25)",
                }}
              >
                <Icon
                  className="w-5 h-5 text-primaryOrange"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── 2. POPULAR ARTICLES ─── */}
      {featuredArticles.length > 0 && (
        <Section className="relative bg-gray-50 py-16 border-t border-gray-100 overflow-hidden">
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Editorial Header */}
            <div className="mb-10 md:mb-14">
              <SectionHeader
                title={t("page.featured.title")}
                subtitle={t("page.featured.description")}
                subtitleClassName="mt-6"
              />
            </div>

            {/* Articles Grid with rank numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredArticles.map((article, index) => (
                <PopularArticleCard
                  key={article._id}
                  article={article}
                  rank={index + 1}
                  readingTimeLabel={t("page.articleCard.readingTime", {
                    minutes: article.readingTime,
                  })}
                  readMoreLabel={t("page.articleCard.readMore")}
                />
              ))}
            </div>
          </div>
        </Section>
      )}
      {/* ─── 3. ALL ARTICLES + FILTER ─── */}
      <Section className="bg-primaryWhite py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <SectionHeader
              title={t("page.allArticles.title")}
              subtitle={t("page.allArticles.subtitle")}
              subtitleClassName="mt-6"
            />
          </div>

          <MagazinFilter clusters={clusters} articles={allArticles} />
        </div>
      </Section>

{/* ─── 4. PRODUCTS / CONVERSION SECTION ─── */}
<Section className="relative bg-gray-50 py-16 md:py-24 border-t border-gray-100 overflow-hidden">
  {/* Ambient glow */}
  <div
    aria-hidden="true"
    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
    style={{
      background:
        "radial-gradient(ellipse at bottom, rgba(232,119,32,0.06) 0%, transparent 70%)",
    }}
  />

  <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="mb-12 md:mb-16">
      <SectionHeader
        title={t("page.products.title")}
        subtitle={t("page.products.subtitle")}
        subtitleClassName="mt-6"
      />
    </div>

    {/* Hero Card — Unlimited (B2C) */}
    <div className="mb-6 md:mb-8">
      <UnlimitedHeroCard
        badge={t("page.products.unlimited.badge")}
        title={t("page.products.unlimited.title")}
        description={t("page.products.unlimited.description")}
        primaryCta={t("page.products.unlimited.primaryCta")}
        secondaryCta={t("page.products.unlimited.secondaryCta")}
        href="/unlimited"
      />
    </div>

    {/* Two B2B Cards Grid */}
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      <ProductCard
        badge={t("page.products.business.badge")}
        title={t("page.products.business.title")}
        description={t("page.products.business.description")}
        href="/unternehmen"
        linkLabel={t("page.products.cardLinkLabel")}
        mascot="Maskottchen-Business.webp"
      />
      <ProductCard
        badge={t("page.products.schools.badge")}
        title={t("page.products.schools.title")}
        description={t("page.products.schools.description")}
        href="/schulen"
        linkLabel={t("page.products.cardLinkLabel")}
        mascot="Maskottchen-School.webp"
      />
    </div>
  </div>
</Section>

      {/* ─── 5. NEWSLETTER CTA ─── */}
      <Section className="bg-primaryWhite py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative overflow-hidden rounded-3xl p-8 md:p-12"
            style={{
              background:
                "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 50%, #FFEEDB 100%)",
              border: "2px solid rgba(232,119,32,0.18)",
              boxShadow: "0 12px 40px rgba(232,119,32,0.08)",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(232,119,32,0.08) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 grid md:grid-cols-[auto_1fr] gap-8 md:gap-10 items-center">
              <div className="hidden md:block">
                <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                  <Image
                    src={`${MASCOT_BASE}/Maskottchen-Hero.webp`}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="160px"
                  />
                </div>
              </div>

              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4"
                  style={{
                    background: "rgba(232,119,32,0.1)",
                    border: "1px solid rgba(232,119,32,0.2)",
                  }}
                >
                  <Mail
                    className="w-3.5 h-3.5 text-primaryOrange"
                    aria-hidden="true"
                  />
                  <span className="text-[11px] font-bold text-primaryOrange uppercase tracking-widest">
                    {t("page.newsletter.badge")}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-3 leading-tight">
                  {t("page.newsletter.title")}
                </h3>
                <p className="text-base md:text-lg text-lightGray mb-6 max-w-xl">
                  {t("page.newsletter.subtitle")}
                </p>

                <form
                  className="flex flex-col sm:flex-row gap-3 max-w-lg"
                  action="/api/newsletter"
                  method="POST"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder={t("page.newsletter.emailPlaceholder")}
                    required
                    aria-label={t("page.newsletter.emailAriaLabel")}
                    className="flex-1 px-5 py-3.5 rounded-xl bg-white border-2 border-gray-200 focus:outline-none focus:border-primaryOrange transition-colors text-darkerGray placeholder:text-lightGray"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primaryOrange text-white font-semibold rounded-xl hover:bg-primaryOrange/90 transition-all whitespace-nowrap shadow-sm shadow-primaryOrange/25"
                  >
                    {t("page.newsletter.button")}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>

                <p className="text-xs text-lightGray mt-3">
                  {t("page.newsletter.privacyPrefix")}{" "}
                  <Link
                    href="/datenschutz"
                    className="text-primaryOrange hover:underline"
                  >
                    {t("page.newsletter.privacyLink")}
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════════

interface PopularArticleCardProps {
  article: WissenArticleCard;
  rank: number;
  readingTimeLabel: string;
  readMoreLabel: string;
}

function PopularArticleCard({
  article,
  rank,
  readingTimeLabel,
  readMoreLabel,
}: PopularArticleCardProps) {
  const typeLabel = ARTICLE_TYPE_LABELS[article.articleType];
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "de-DE",
    { day: "2-digit", month: "short", year: "numeric" },
  );

  return (
    <Link
      href={`/magazin/${article.cluster.slug}/${article.slug}`}
      className="group relative flex flex-col h-full rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-primaryOrange/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* ─── IMAGE BLOCK ─── */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/40">
        {/* Rank Badge — top left */}
        <div
          className="absolute top-4 left-4 z-20 w-11 h-11 rounded-xl flex items-center justify-center font-black text-base text-white"
          style={{
            background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
            boxShadow: "0 6px 20px rgba(232,119,32,0.4)",
          }}
        >
          #{rank}
        </div>

        {/* Image OR Mascot Fallback */}
        {article.heroImage ? (
          <Image
            src={article.heroImage.asset.url || ""}
            alt={article.heroImage.alt || article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-3/5 h-4/5 group-hover:scale-105 transition-transform duration-500 ease-out">
              <Image
                src={`${MASCOT_BASE}/Maskottchen-Hero.webp`}
                alt={article.title}
                fill
                className="object-contain"
                style={{
                  filter: "drop-shadow(0 12px 28px rgba(232,119,32,0.25))",
                }}
                sizes="(max-width: 768px) 60vw, (max-width: 1200px) 30vw, 20vw"
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── BODY BLOCK ─── */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        {/* Meta Row: Cluster (indigo) + Type (neutral) */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)",
              color: "#6366F1",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#6366F1" }}
            />
            {article.cluster.title}
          </span>

          {typeLabel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-darkerGray border border-gray-200">
              <span aria-hidden="true">{typeLabel.icon}</span>
              {typeLabel.label}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-darkerGray mb-3 group-hover:text-primaryOrange transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-lightGray leading-relaxed line-clamp-2 mb-5 flex-1">
          {article.excerpt}
        </p>

        {/* Footer: Reading time + Date + Read more */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-lightGray">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {readingTimeLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formattedDate}</span>
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-primaryOrange opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
            {readMoreLabel}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </Link>
  );
}

interface FloatingMascotProps {
  mascot: (typeof HERO_MASCOTS)[number];
  index: number;
}

function FloatingMascot({ mascot, index }: FloatingMascotProps) {
  // Alternate animation type for visual variety
  const useDrift = index % 2 === 0;
  const positionStyle: React.CSSProperties = {
    top: mascot.top,
    width: mascot.size,
    height: mascot.size,
    [mascot.side]: mascot.offset,
    // CSS variables for the keyframes
    ["--rot" as string]: `${mascot.rotate}deg`,
    ["--dur" as string]: `${mascot.animDur}s`,
    ["--delay" as string]: `${mascot.animDelay}s`,
    filter: "drop-shadow(0 8px 24px rgba(232,119,32,0.18))",
  };

  return (
    <div
      className={`absolute magazin-mascot ${useDrift ? "drift" : ""}`}
      style={positionStyle}
    >
      <Image
        src={`${MASCOT_BASE}/${mascot.src}`}
        alt=""
        fill
        className="object-contain"
        sizes={`${mascot.size}px`}
        priority={false}
      />
    </div>
  );
}
// ═══════════════════════════════════════════════════════════════
// UNLIMITED HERO CARD (B2C)
// ═══════════════════════════════════════════════════════════════

interface UnlimitedHeroCardProps {
  badge: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  href: string;
}

function UnlimitedHeroCard({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
  href,
}: UnlimitedHeroCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-3xl"
      style={{
        background:
          "linear-gradient(135deg, #FF8B3D 0%, #E87720 50%, #D85F0A 100%)",
        boxShadow:
          "0 20px 60px rgba(232,119,32,0.25), 0 0 0 1px rgba(255,255,255,0.1) inset",
      }}
    >
      {/* Decorative background pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Decorative blob right side */}
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)",
        }}
      />

      {/* Decorative blob left side */}
      <div
        aria-hidden="true"
        className="absolute -left-32 -bottom-32 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center p-8 md:p-12 lg:p-16">
        {/* Left: Content */}
        <div className="text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5 bg-white/20 backdrop-blur-sm border border-white/30">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] font-bold text-white uppercase tracking-widest">
              {badge}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight mb-4">
            {title}
          </h3>

          {/* Description */}
          <p className="text-base md:text-lg text-white/90 leading-relaxed mb-8 max-w-xl">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href={href}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-primaryOrange font-bold text-sm md:text-base hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/10"
            >
              {primaryCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href={href}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm md:text-base font-semibold text-white/90 hover:text-white transition-colors group/link"
            >
              {secondaryCta}
              <ArrowRight
                className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* Right: Mascot */}
        <div className="hidden md:block relative w-48 h-48 lg:w-56 lg:h-56 flex-shrink-0">
          <div className="relative w-full h-full group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-700 ease-out">
            <Image
              src={`${MASCOT_BASE}/Maskottchen-Hero.webp`}
              alt=""
              fill
              className="object-contain"
              style={{
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.25))",
              }}
              sizes="(max-width: 768px) 0px, 224px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT CARD (B2B)
// ═══════════════════════════════════════════════════════════════

interface ProductCardProps {
  badge: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  mascot: string;
}

function ProductCard({
  badge,
  title,
  description,
  href,
  linkLabel,
  mascot,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col h-full rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-primaryOrange/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Header: Badge + Title (left) + Mascot (right) */}
      <div className="relative flex items-start justify-between gap-4 p-6 md:p-7 pb-4 bg-gradient-to-br from-orange-50 via-orange-50/60 to-orange-100/40 overflow-hidden">
        {/* Decorative ambient glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at right, rgba(232,119,32,0.1) 0%, transparent 60%)",
          }}
        />

        {/* Left: Badge + Title */}
        <div className="relative z-10 flex-1 min-w-0">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mb-3"
            style={{
              background: "rgba(232,119,32,0.12)",
              border: "1px solid rgba(232,119,32,0.25)",
            }}
          >
            <span className="text-[10px] font-bold text-primaryOrange uppercase tracking-widest">
              {badge}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold text-darkerGray group-hover:text-primaryOrange transition-colors leading-tight">
            {title}
          </h3>
        </div>

        {/* Right: Mascot */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 ease-out">
          <Image
            src={`${MASCOT_BASE}/${mascot}`}
            alt=""
            fill
            className="object-contain"
            style={{
              filter: "drop-shadow(0 10px 24px rgba(232,119,32,0.25))",
            }}
            sizes="(max-width: 768px) 96px, 112px"
          />
        </div>
      </div>

      {/* Body: Description + CTA */}
      <div className="flex flex-col flex-1 p-6 md:p-7 pt-5">
        <p className="text-sm md:text-base text-lightGray leading-relaxed mb-6 flex-1">
          {description}
        </p>

        {/* CTA */}
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-primaryOrange group-hover:gap-3 transition-all">
          {linkLabel}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
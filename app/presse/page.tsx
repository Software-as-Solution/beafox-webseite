import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Download,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import Section from "@/components/Section";
import LandingHero from "@/components/LandingHero";
import { getNewsCategory, getNewsPostBySlug } from "@/lib/news-posts";

type PressItem = {
  slug: string;
  title: string;
  source: string;
  url: string;
};

export default async function PressPage() {
  const t = await getTranslations("press");
  const mentions = (t.raw("coverage.items") as PressItem[]) ?? [];
  const assets = (t.raw("assets.points") as string[]) ?? [];
  const email = t("contact.email");
  const pressKitMailHref = `mailto:${email}?subject=${encodeURIComponent("Pressekit Anfrage")}&body=${encodeURIComponent(
    "Hallo BeAFox Team,\n\nich moechte gerne das aktuelle Pressekit erhalten.\n\nVielen Dank!"
  )}`;
  const mentionCards = mentions.flatMap((item) => {
    const post = getNewsPostBySlug(item.slug);
    return post ? [{ item, post }] : [];
  });
  const getRotationClass = (rotation?: "cw90" | "ccw90" | "rotate180") => {
    if (rotation === "cw90") return "rotate-90";
    if (rotation === "ccw90") return "-rotate-90";
    if (rotation === "rotate180") return "rotate-180";
    return "";
  };

  return (
    <>
      <LandingHero
        badge={t("hero.eyebrow")}
        mascotAlt={t("hero.eyebrow")}
        mascotSrc="/Maskottchen/Maskottchen-News.webp"
        description={t("description")}
        title={
          <>
            {t("hero.titlePre")}{" "}
            <span className="text-primaryOrange">{t("hero.titleHighlight")}</span>
          </>
        }
        actions={
          <>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primaryOrange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-darkOrange w-full sm:w-auto"
            >
              {t("contact.contactCta")}
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primaryOrange px-5 py-2.5 text-sm font-semibold text-primaryOrange transition-colors hover:bg-primaryOrange/5 w-full sm:w-auto"
            >
              {t("coverage.title")}
            </Link>
          </>
        }
      />

      <Section className="bg-gray-50 py-8 md:py-12" width="wide">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="overflow-hidden rounded-3xl border border-primaryOrange/20 bg-white shadow-sm">
            <div className="relative aspect-[16/9] w-full bg-gray-100">
              <Image
                src="/Team/Alex-Seli.webp"
                alt={t("contact.imageAlt")}
                fill
                loading="eager"
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <p className="text-base font-bold text-white">{t("contact.teamLabel")}</p>
              </div>
            </div>

            <div className="space-y-4 p-6 md:p-8">
              <h2 className="text-xl font-bold text-darkerGray">{t("contact.title")}</h2>
              <p className="text-sm leading-relaxed text-lightGray">{t("contact.note")}</p>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primaryOrange hover:underline md:text-base"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {email}
              </a>
              <div className="grid gap-2 text-xs text-darkerGray sm:grid-cols-2">
                <div className="inline-flex items-center gap-2 rounded-xl border border-primaryOrange/20 bg-primaryOrange/5 px-3 py-2">
                  <Clock3 className="h-3.5 w-3.5 text-primaryOrange" aria-hidden="true" />
                  {t("contact.responseTime")}
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-primaryOrange/20 bg-primaryOrange/5 px-3 py-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primaryOrange" aria-hidden="true" />
                  {t("contact.directTeam")}
                </div>
              </div>
              <Link
                href="/kontakt"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-darkerGray transition-colors hover:border-primaryOrange/40 hover:text-primaryOrange"
              >
                {t("contact.contactCta")}
              </Link>
            </div>
          </article>

          <article className="rounded-3xl border border-primaryOrange/20 bg-gradient-to-br from-white via-white to-primaryOrange/10 p-6 shadow-sm md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primaryOrange/20 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primaryOrange">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {t("assets.badge")}
            </div>
            <h3 className="mt-4 text-xl font-bold text-darkerGray">{t("assets.title")}</h3>
            <p className="mt-2 text-sm text-lightGray">{t("assets.subtitle")}</p>
            <ul className="mt-5 space-y-2.5">
              {assets.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 rounded-xl bg-white/80 px-3 py-2.5 text-sm text-darkerGray md:text-base"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primaryOrange" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2.5">
              <a
                href={pressKitMailHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primaryOrange px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-darkOrange hover:shadow-md"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {t("assets.requestNow")}
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primaryOrange/25 bg-white px-4 py-2.5 text-sm font-bold text-primaryOrange transition-colors hover:bg-primaryOrange/5"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {t("assets.emailRequest")}
              </a>
            </div>
          </article>
        </div>
      </Section>

      <Section className="py-10 md:py-14" width="wide">
        <article className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primaryOrange/20 bg-primaryOrange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primaryOrange">
            <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
            {t("coverage.badge")}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-darkerGray">{t("coverage.title")}</h2>
          <p className="mt-2 text-sm text-lightGray md:text-base">{t("coverage.subtitle")}</p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {mentionCards.map(({ item, post }) => {
              const category = getNewsCategory(post.category);
              return (
                <li key={`${item.slug}-${item.source}`}>
                  <a
                    href={item.url}
                    target={item.url.startsWith("http") ? "_blank" : undefined}
                    rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-primaryOrange/35 hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                          getRotationClass(post.imageRotation)
                        }`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-primaryOrange px-2.5 py-1 text-[11px] font-bold text-white">
                        {category.label}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3 px-4 py-3">
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-lightGray">
                          {item.source}
                        </span>
                        <span className="mt-1 block text-sm font-semibold leading-snug text-darkerGray md:text-base">
                          {item.title}
                        </span>
                        <span className="mt-2 block line-clamp-2 text-xs text-lightGray md:text-sm">
                          {post.excerpt}
                        </span>
                      </span>
                      <ArrowRight
                        className="mt-1 h-4 w-4 flex-shrink-0 text-primaryOrange transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </article>
      </Section>
    </>
  );
}

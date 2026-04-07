// CUSTOM COMPONENTS
import Section from "@/components/Section";
// IMPORTS
import Link from "next/link";
import { useTranslations } from "next-intl";
// ICONS
import {
  Mail,
  Home,
  Code,
  Bell,
  Heart,
  Clock,
  Scale,
  Sparkles,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Accessibility,
} from "lucide-react";
// TYPES
import type { LucideIcon } from "lucide-react";

// TYPES
type BarrierefreiheitIconId =
  | "code"
  | "mail"
  | "alert"
  | "heart"
  | "scale"
  | "check"
  | "refresh"
  | "sparkles";
type ContentItem = {
  text?: string;
  list?: string[];
  subtitle?: string;
};
type BarrierefreiheitSection = {
  id: number;
  title: string;
  content: ContentItem[];
  iconId: BarrierefreiheitIconId;
};
type ContactBlock = {
  cta: string;
  text: string;
  title: string;
  labels: {
    email: string;
    phone: string;
  };
};
// CONSTANTS
const ICON_MAP: Record<BarrierefreiheitIconId, LucideIcon> = {
  code: Code,
  mail: Mail,
  heart: Heart,
  scale: Scale,
  alert: AlertCircle,
  sparkles: Sparkles,
  refresh: RefreshCw,
  check: CheckCircle2,
};

export default function BarrierefreiheitPage() {
  const t = useTranslations("barrierefreiheit");
  const sections = (t.raw("sections") as BarrierefreiheitSection[]) ?? [];
  const contact = t.raw("contact") as ContactBlock;
  const company = t.raw("company") as {
    email: string;
    phone: string;
    phoneHref: string;
  };

  return (
    <>
      {/* ─── 1. BREADCRUMB ─── */}
      <div className="bg-white border-b border-gray-100 pt-24 md:pt-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav
            aria-label={t("breadcrumb.ariaLabel")}
            className="flex items-center gap-1.5 text-xs md:text-sm text-lightGray"
          >
            <Link
              href="/"
              aria-label={t("breadcrumb.homeAria")}
              className="hover:text-primaryOrange transition-colors flex items-center"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
            <ChevronRight
              aria-hidden="true"
              className="w-3 h-3 text-gray-300"
            />
            <span className="text-darkerGray font-medium">
              {t("hero.title")}
            </span>
          </nav>
        </div>
      </div>

      {/* ─── 2. HERO ─── */}
      <Section className="bg-primaryWhite py-10 md:py-16 lg:py-20 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-1/3 translate-x-1/3"
          style={{
            background:
              "radial-gradient(circle, rgba(232,119,32,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6"
            style={{
              background: "rgba(232,119,32,0.08)",
              border: "1px solid rgba(232,119,32,0.15)",
            }}
          >
            <Accessibility
              className="w-3.5 h-3.5 text-primaryOrange"
              aria-hidden="true"
            />
            <span className="text-[11px] font-bold text-primaryOrange uppercase tracking-widest">
              {t("hero.badge")}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-5 leading-[1.1]">
            {t("hero.title")}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-lightGray leading-relaxed max-w-3xl">
            {t("hero.subtitle")}
          </p>
        </div>
      </Section>

      {/* ─── 4. TABLE OF CONTENTS ─── */}
      {sections.length > 0 && (
        <Section className="bg-gray-50 pt-0 pb-8 md:pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-sm font-bold text-lightGray uppercase tracking-widest mb-4">
              {t("tableOfContents.title")}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#section-${section.id}`}
                  className="group flex items-center gap-3 rounded-xl bg-white border border-gray-200 hover:border-primaryOrange/30 hover:shadow-sm px-3 py-2.5 transition-all"
                >
                  <span className="text-[11px] font-bold text-primaryOrange tabular-nums w-6 flex-shrink-0">
                    § {section.id}
                  </span>
                  <span className="text-xs md:text-sm text-darkerGray group-hover:text-primaryOrange transition-colors flex-1 truncate">
                    {section.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ─── 5. EDITORIAL CONTENT ─── */}
      <Section className="bg-primaryWhite py-12 md:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="space-y-12 md:space-y-16">
            {sections.map((section) => {
              const Icon = ICON_MAP[section.iconId] ?? Code;
              return (
                <section
                  key={section.id}
                  className="scroll-mt-32"
                  id={`section-${section.id}`}
                  aria-labelledby={`section-${section.id}-heading`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(232,119,32,0.1)",
                        border: "1px solid rgba(232,119,32,0.15)",
                      }}
                    >
                      <Icon
                        aria-hidden="true"
                        className="w-5 h-5 text-primaryOrange"
                      />
                    </div>
                    <h2
                      id={`section-${section.id}-heading`}
                      className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray leading-tight"
                    >
                      <span className="text-primaryOrange">§ {section.id}</span>{" "}
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-5 max-w-4xl">
                    {section.content.map((item, idx) => (
                      <ContentItemBlock key={idx} item={item} />
                    ))}
                  </div>
                </section>
              );
            })}
          </article>
        </div>
      </Section>

      {/* ─── 6. FEEDBACK CONTACT BLOCK (BFSG-Pflicht) ─── */}
      <Section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative overflow-hidden rounded-2xl p-6 md:p-10"
            style={{
              border: "2px solid rgba(232,119,32,0.2)",
              boxShadow: "0 8px 24px rgba(232,119,32,0.06)",
              background:
                "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(232,119,32,0.06) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10 grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(232,119,32,0.1)",
                  border: "1px solid rgba(232,119,32,0.15)",
                }}
              >
                <Accessibility
                  aria-hidden="true"
                  className="w-7 h-7 md:w-9 md:h-9 text-primaryOrange"
                />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-darkerGray mb-3">
                  {contact.title}
                </h2>
                <p className="text-base md:text-lg text-lightGray leading-relaxed mb-5 max-w-2xl">
                  {contact.text}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <a
                    href={`mailto:${company.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-primaryOrange/20 hover:border-primaryOrange/40 transition-colors text-sm font-medium text-darkerGray"
                  >
                    <Mail
                      aria-hidden="true"
                      className="w-4 h-4 text-primaryOrange"
                    />
                    {company.email}
                  </a>
                  <a
                    href={company.phoneHref}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-primaryOrange/20 hover:border-primaryOrange/40 transition-colors text-sm font-medium text-darkerGray"
                  >
                    <Bell
                      aria-hidden="true"
                      className="w-4 h-4 text-primaryOrange"
                    />
                    {company.phone}
                  </a>
                </div>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primaryOrange text-white rounded-xl font-semibold text-sm md:text-base hover:bg-primaryOrange/90 transition-all shadow-sm shadow-primaryOrange/25"
                >
                  {contact.cta}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 7. RELATED LEGAL PAGES ─── */}
      <Section className="bg-primaryWhite py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-bold text-darkerGray mb-6">
            {t("legalLinks.title")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <LegalLinkCard
              href="/datenschutz"
              title={t("legalLinks.privacy")}
            />
            <LegalLinkCard href="/agb" title={t("legalLinks.terms")} />
            <LegalLinkCard href="/impressum" title={t("legalLinks.imprint")} />
          </div>
        </div>
      </Section>

      {/* ─── 8. LAST UPDATED FOOTER ─── */}
      <Section className="bg-gray-50 py-6 md:py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-1 text-lightGray text-center">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <p className="text-xs md:text-sm font-medium">
                {t("lastUpdated.stand")}
              </p>
            </div>
            <p className="text-xs text-lightGray">{t("lastUpdated.notice")}</p>
          </div>
        </div>
      </Section>
    </>
  );
}

// SUBCOMPONENTS
interface ContentItemBlockProps {
  item: ContentItem;
}
function ContentItemBlock({ item }: ContentItemBlockProps) {
  return (
    <div>
      {item.subtitle && (
        <h3 className="text-lg md:text-xl font-bold text-darkerGray mb-2">
          {item.subtitle}
        </h3>
      )}
      {item.text && (
        <p className="text-base md:text-lg text-lightGray leading-relaxed">
          {item.text}
        </p>
      )}
      {item.list && item.list.length > 0 && (
        <ul className="mt-3 space-y-2.5">
          {item.list.map((listItem, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-base md:text-lg text-darkerGray leading-relaxed"
            >
              <CheckCircle2
                className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{listItem}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface LegalLinkCardProps {
  href: string;
  title: string;
}
function LegalLinkCard({ href, title }: LegalLinkCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-2xl bg-white border border-gray-200 hover:border-primaryOrange/30 hover:shadow-md p-4 md:p-5 transition-all"
    >
      <span className="text-sm md:text-base font-semibold text-darkerGray group-hover:text-primaryOrange transition-colors">
        {title}
      </span>
      <div className="w-8 h-8 rounded-full bg-primaryOrange/10 flex items-center justify-center group-hover:bg-primaryOrange transition-colors flex-shrink-0">
        <ArrowRight
          aria-hidden="true"
          className="w-4 h-4 text-primaryOrange group-hover:text-white transition-colors"
        />
      </div>
    </Link>
  );
}

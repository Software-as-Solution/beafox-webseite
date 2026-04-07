"use client";

// CUSTOM COMPONENTS
import Section from "@/components/Section";
// IMPORTS
import Link from "next/link";
import { useTranslations } from "next-intl";
// ICONS
import {
  Bot,
  Ban,
  Mail,
  Home,
  Scale,
  Shield,
  FileText,
  Building2,
  Handshake,
  Copyright,
  ArrowRight,
  AlertCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
// TYPES
import type { LucideIcon } from "lucide-react";

// TYPES
type ImprintContentItem = {
  text?: string;
  subtitle?: string;
  details?: string[];
  link?: { text: string; href: string };
};
type ImprintSection = {
  id: number;
  title: string;
  content: ImprintContentItem[];
};
// CONSTANTS
const SECTION_ICONS: Record<number, LucideIcon> = {
  1: Building2,
  2: Mail,
  3: Scale,
  4: FileText,
  5: FileText,
  6: Shield,
  7: AlertCircle,
  8: Handshake,
  9: Ban,
  10: Bot,
};

export default function ImpressumPage() {
  const t = useTranslations("imprint");
  const sections = t.raw("sections") as ImprintSection[];
  const currentYear = new Date().getFullYear();
  const company = t.raw("company") as {
    name: string;
    street: string;
    city: string;
    country: string;
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
              className="w-3 h-3 text-gray-300"
              aria-hidden="true"
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
            <FileText
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

      {/* ─── 3. EDITORIAL CONTENT ─── */}
      <Section className="bg-primaryWhite py-8 md:py-10 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="space-y-12 md:space-y-16">
            {sections.map((section) => {
              const Icon = SECTION_ICONS[section.id] ?? FileText;
              return (
                <section
                  key={section.id}
                  aria-labelledby={`section-${section.id}-heading`}
                  className="scroll-mt-32"
                  id={`section-${section.id}`}
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
                        className="w-5 h-5 text-primaryOrange"
                        aria-hidden="true"
                      />
                    </div>
                    <h2
                      id={`section-${section.id}-heading`}
                      className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray leading-tight"
                    >
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-5 max-w-4xl">
                    {section.content.map((item, idx) => (
                      <ContentItem key={idx} item={item} />
                    ))}
                  </div>
                </section>
              );
            })}
          </article>
        </div>
      </Section>

      {/* ─── 4. RELATED LEGAL PAGES ─── */}
      <Section className="bg-gray-50 py-12 md:py-16">
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
            <LegalLinkCard
              href="/widerrufsbelehrung"
              title={t("legalLinks.withdrawal")}
            />
            <LegalLinkCard
              href="/community-richtlinien"
              title={t("legalLinks.communityGuidelines")}
            />
            <LegalLinkCard
              href="/barrierefreiheit"
              title={t("legalLinks.accessibility")}
            />
          </div>
        </div>
      </Section>

      {/* ─── 5. COPYRIGHT FOOTER ─── */}
      <Section className="bg-primaryWhite py-6 md:py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-lightGray">
            <Copyright
              aria-hidden="true"
              className="w-3.5 h-3.5 flex-shrink-0"
            />
            <p className="text-xs md:text-sm">
              {t("footer.copyright", {
                year: currentYear,
                company: company.name,
              })}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

// SUBCOMPONENTS
interface ContentItemProps {
  item: ImprintContentItem;
}
function ContentItem({ item }: ContentItemProps) {
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
      {item.details && item.details.length > 0 && (
        <div
          className="mt-3 rounded-xl p-4 md:p-5 border-l-2 border-primaryOrange/30"
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
          }}
        >
          {item.details.map((detail, idx) => (
            <p
              key={idx}
              className="text-sm md:text-base text-darkerGray leading-relaxed mb-1 last:mb-0"
            >
              {detail}
            </p>
          ))}
        </div>
      )}
      {item.link && (
        <a
          target="_blank"
          href={item.link.href}
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-2 text-sm md:text-base font-semibold text-primaryOrange hover:underline"
        >
          {item.link.text}
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
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
          className="w-4 h-4 text-primaryOrange group-hover:text-white transition-colors"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

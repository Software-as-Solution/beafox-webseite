// CUSTOM COMPONENTS
import Section from "@/components/Section";
// IMPORTS
import Link from "next/link";
import { useTranslations } from "next-intl";
// ICONS
import {
  Bot,
  Eye,
  Flag,
  Home,
  Mail,
  Bell,
  Users,
  Heart,
  Clock,
  Scale,
  Shield,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
// TYPES
import type { LucideIcon } from "lucide-react";

// TYPES
type GuidelineItem = {
  id: number;
  title: string;
  rules: string[];
  description: string;
};
type ViolationsData = {
  title: string;
  actions: string[];
  description: string;
};
type ContactDetails = {
  email?: string;
  phone?: string;
  address?: string;
  appeals?: string;
  compliance?: string;
  emergencyReport?: string;
};
// CONSTANTS
const ICON_BY_ID: Record<number, LucideIcon> = {
  1: Heart, // Respektvolles Verhalten
  2: MessageSquare, // Konstruktive Kommunikation
  3: ShieldAlert, // Verbotene Inhalte (DSA)
  4: Shield, // Sicherheit und Privatsphäre
  5: Users, // Jugendschutz
  6: AlertTriangle, // Keine Finanzberatung
  7: Bot, // KI und Bea
  8: Flag, // Meldung rechtswidriger Inhalte (DSA Art. 16)
  9: Eye, // Inhaltsmoderation (DSA Art. 14, 17)
  10: Scale, // Beschwerdemanagement (DSA Art. 20)
};
export default function GuidelinesPage() {
  const t = useTranslations("guidelines");
  const company = t.raw("company") as {
    email: string;
    phone: string;
    phoneHref: string;
  };

  const guidelines = (t.raw("items") as GuidelineItem[]) ?? [];
  const violations = t.raw("violations") as ViolationsData;

  // contact.details is optional — safely attempt to read
  let contactDetails: ContactDetails | null = null;
  try {
    contactDetails = t.raw("contact.details") as ContactDetails;
  } catch {
    contactDetails = null;
  }

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
              {t("hero.badge")}
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6"
            style={{
              background: "rgba(232,119,32,0.08)",
              border: "1px solid rgba(232,119,32,0.15)",
            }}
          >
            <Heart
              aria-hidden="true"
              className="w-3.5 h-3.5 text-primaryOrange"
            />
            <span className="text-[11px] font-bold text-primaryOrange uppercase tracking-widest">
              {t("hero.badge")}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-5 leading-[1.1]">
            {t("hero.title.pre")}{" "}
            <span className="text-primaryOrange">
              {t("hero.title.highlight")}
            </span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-lightGray leading-relaxed max-w-3xl">
            {t("hero.description")}
          </p>
        </div>
      </Section>

      {/* ─── 3. TABLE OF CONTENTS ─── */}
      {guidelines.length > 0 && (
        <Section className="bg-gray-50 py-8 md:py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-sm font-bold text-lightGray uppercase tracking-widest mb-4">
              {t("tableOfContents.title")}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {guidelines.map((item) => {
                const Icon = ICON_BY_ID[item.id] ?? Shield;
                return (
                  <a
                    key={item.id}
                    href={`#guideline-${item.id}`}
                    className="group flex items-center gap-3 rounded-xl bg-white border border-gray-200 hover:border-primaryOrange/30 hover:shadow-sm px-3 py-2.5 transition-all"
                  >
                    <Icon
                      aria-hidden="true"
                      className="w-4 h-4 text-primaryOrange flex-shrink-0"
                    />
                    <span className="text-xs md:text-sm text-darkerGray group-hover:text-primaryOrange transition-colors flex-1 truncate">
                      {item.title}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </Section>
      )}

      {/* ─── 4. GUIDELINE ITEMS ─── */}
      <Section className="bg-primaryWhite py-12 md:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="space-y-12 md:space-y-16">
            {guidelines.map((guideline) => (
              <GuidelineSection key={guideline.id} guideline={guideline} />
            ))}
          </article>
        </div>
      </Section>

      {/* ─── 5. VIOLATIONS WARNING ─── */}
      {violations && (
        <Section className="bg-gray-50 py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-2xl p-6 md:p-10 border-l-4"
              style={{
                borderLeftColor: "#DC2626",
                boxShadow: "0 4px 12px rgba(220,38,38,0.06)",
                background: "linear-gradient(135deg, #FFFFFF 0%, #FEF2F2 100%)",
              }}
            >
              <div className="grid md:grid-cols-[auto_1fr] gap-5 md:gap-6 items-start">
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(220,38,38,0.08)",
                    border: "1px solid rgba(220,38,38,0.2)",
                  }}
                >
                  <AlertTriangle
                    aria-hidden="true"
                    className="w-6 h-6 md:w-7 md:h-7 text-red-600"
                  />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-darkerGray mb-3">
                    {violations.title}
                  </h2>
                  <p className="text-base md:text-lg text-lightGray leading-relaxed mb-6 max-w-3xl">
                    {violations.description}
                  </p>
                  <ol className="space-y-3">
                    {violations.actions.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-base md:text-lg text-darkerGray leading-relaxed pt-0.5">
                          {action}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* ─── 6. DSA CONTACT BLOCK ─── */}
      <Section className="bg-primaryWhite py-12 md:py-16">
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
                <BookOpen
                  aria-hidden="true"
                  className="w-7 h-7 md:w-9 md:h-9 text-primaryOrange"
                />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-darkerGray mb-3">
                  {t("contact.title")}
                </h2>
                <p className="text-base md:text-lg text-lightGray leading-relaxed mb-5 max-w-2xl">
                  {t("contact.text")}
                </p>
                {/* Emergency Report (if exists) */}
                {contactDetails?.emergencyReport && (
                  <div
                    className="mb-5 p-4 rounded-xl flex items-start gap-3"
                    style={{
                      background: "rgba(220,38,38,0.05)",
                      border: "1px solid rgba(220,38,38,0.2)",
                    }}
                  >
                    <AlertTriangle
                      className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-red-700 leading-relaxed">
                      {contactDetails.emergencyReport}
                    </p>
                  </div>
                )}
                {/* Contact details grid */}
                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  <ContactPill
                    icon={Mail}
                    label={contactDetails?.email ?? company.email}
                    href={`mailto:${contactDetails?.email ?? company.email}`}
                  />
                  {contactDetails?.compliance && (
                    <ContactPill
                      icon={Shield}
                      label={contactDetails.compliance}
                      href={`mailto:${contactDetails.compliance}`}
                    />
                  )}
                  {contactDetails?.appeals && (
                    <ContactPill
                      icon={Scale}
                      label={contactDetails.appeals}
                      href={`mailto:${contactDetails.appeals}`}
                    />
                  )}
                  <ContactPill
                    icon={Bell}
                    href={company.phoneHref}
                    label={contactDetails?.phone ?? company.phone}
                  />
                </div>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primaryOrange text-white rounded-xl font-semibold text-sm md:text-base hover:bg-primaryOrange/90 transition-all shadow-sm shadow-primaryOrange/25"
                >
                  {t("contact.cta")}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 7. RELATED LEGAL PAGES ─── */}
      <Section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-bold text-darkerGray mb-6">
            {t("legalLinks.title")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <LegalLinkCard
              href="/agb"
              title={t("legalLinks.terms")}
            />
            <LegalLinkCard
              href="/datenschutz"
              title={t("legalLinks.privacy")}
            />
            <LegalLinkCard href="/impressum" title={t("legalLinks.imprint")} />
          </div>
        </div>
      </Section>

      {/* ─── 8. LAST UPDATED ─── */}
      <Section className="bg-primaryWhite py-6 md:py-8 border-t border-gray-100">
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
interface GuidelineSectionProps {
  guideline: GuidelineItem;
}
function GuidelineSection({ guideline }: GuidelineSectionProps) {
  const Icon = ICON_BY_ID[guideline.id] ?? Shield;

  return (
    <section
      className="scroll-mt-32"
      id={`guideline-${guideline.id}`}
      aria-labelledby={`guideline-${guideline.id}-heading`}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(232,119,32,0.1)",
            border: "1px solid rgba(232,119,32,0.15)",
          }}
        >
          <Icon className="w-5 h-5 text-primaryOrange" aria-hidden="true" />
        </div>
        <h2
          id={`guideline-${guideline.id}-heading`}
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray leading-tight"
        >
          <span className="text-primaryOrange">§ {guideline.id}</span>{" "}
          {guideline.title}
        </h2>
      </div>

      <p className="text-base md:text-lg text-lightGray mb-5 max-w-4xl leading-relaxed">
        {guideline.description}
      </p>

      <ul className="space-y-3 max-w-4xl">
        {guideline.rules.map((rule, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 text-base md:text-lg text-darkerGray leading-relaxed"
          >
            <CheckCircle2
              aria-hidden="true"
              className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5"
            />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface ContactPillProps {
  href: string;
  label: string;
  icon: LucideIcon;
}
function ContactPill({ icon: Icon, label, href }: ContactPillProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-primaryOrange/20 hover:border-primaryOrange/40 transition-colors text-sm font-medium text-darkerGray truncate"
    >
      <Icon
        aria-hidden="true"
        className="w-4 h-4 text-primaryOrange flex-shrink-0"
      />
      <span className="truncate">{label}</span>
    </a>
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

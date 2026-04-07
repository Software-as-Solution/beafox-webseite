"use client";

// STANDARD COMPONENTS
import Link from "next/link";
import Image from "next/image";
// CUSTOM COMPONENTS
import Button from "@/components/Button";
// IMPORTS
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
// ICONS
import {
  Home,
  Wrench,
  School,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Infinity as InfinityIcon,
  type LucideIcon,
} from "lucide-react";

// TYPES
export type RatgeberVariant = "guides" | "faqProducts" | "unlimitedTargets";
interface RatgeberCategory {
  slug: string;
  href: string;
  mascot: string;
  icon: LucideIcon;
}
interface FaqProductLink {
  id: string;
  href: string;
  title: string;
  description: string;
}
interface UnlimitedTargetGroup {
  id: "students" | "apprentices" | "careerStarters";
  icon: LucideIcon;
  mascot: string;
}
interface RatgeberSectionProps {
  variant?: RatgeberVariant;
}
// CONSTANTS
const RATGEBER_CATEGORIES: RatgeberCategory[] = [
  {
    icon: Wrench,
    slug: "finanzen-fuer-azubis",
    href: "/finanzen-fuer-azubis",
    mascot: "/Maskottchen/Maskottchen-Azubi.png",
  },
  {
    icon: Home,
    slug: "finanzen-bei-lebensereignissen",
    href: "/finanzen-bei-lebensereignissen",
    mascot: "/Maskottchen/Maskottchen-Lebenssituationen.png",
  },
  {
    icon: Briefcase,
    slug: "finanzen-fuer-berufseinsteiger",
    href: "/finanzen-fuer-berufseinsteiger",
    mascot: "/Maskottchen/Maskottchen-Berufseinsteiger.png",
  },
];
const ICON_STYLE = {
  background: "rgba(232,119,32,0.08)",
  border: "1px solid rgba(232,119,32,0.12)",
} as const;
const HOVER_GRADIENT_STYLE = {
  background:
    "linear-gradient(180deg, rgba(232,119,32,0.04) 0%, rgba(232,119,32,0.01) 100%)",
} as const;
const FAQ_PRODUCT_ORDER = ["unlimited", "business", "schools"] as const;
const FAQ_PRODUCT_META: Record<
  (typeof FAQ_PRODUCT_ORDER)[number],
  { mascot: string; icon: LucideIcon }
> = {
  unlimited: {
    mascot: "/Maskottchen/Maskottchen-Unlimited.png",
    icon: InfinityIcon,
  },
  business: {
    mascot: "/Maskottchen/Maskottchen-Business.png",
    icon: Briefcase,
  },
  schools: {
    mascot: "/Maskottchen/Maskottchen-School.png",
    icon: School,
  },
};
const UNLIMITED_TARGET_GROUPS: UnlimitedTargetGroup[] = [
  {
    id: "students",
    icon: GraduationCap,
    mascot: "/Maskottchen/Maskottchen-Studenten.png",
  },
  {
    id: "apprentices",
    icon: Briefcase,
    mascot: "/Maskottchen/Maskottchen-Azubi.png",
  },
  {
    id: "careerStarters",
    icon: Briefcase,
    mascot: "/Maskottchen/Maskottchen-Berufseinsteiger.png",
  },
];

export default function RatgeberSection({
  variant = "guides",
}: RatgeberSectionProps) {
  // HOOKS
  const tFaq = useTranslations("faq.quickLinks");
  const tGuides = useTranslations("home.ratgeberHomeSection");
  const tUnlimited = useTranslations("unlimited.hero");
  // CONSTANTS
  const categories = useMemo(() => RATGEBER_CATEGORIES, []);
  const faqProductRows = useMemo(() => {
    if (variant !== "faqProducts") return [];
    const raw = tFaq.raw("links") as FaqProductLink[];
    const byId = new Map(
      raw
        .filter((l) => l.id && l.id in FAQ_PRODUCT_META)
        .map((l) => [l.id, l] as const),
    );
    return FAQ_PRODUCT_ORDER.map((id) => {
      const row = byId.get(id);
      if (!row) return null;
      const meta = FAQ_PRODUCT_META[id];
      return {
        id,
        href: row.href,
        title: row.title,
        description: row.description,
        mascot: meta.mascot,
        icon: meta.icon,
      };
    }).filter(Boolean) as {
      id: (typeof FAQ_PRODUCT_ORDER)[number];
      href: string;
      title: string;
      description: string;
      mascot: string;
      icon: LucideIcon;
    }[];
  }, [variant, tFaq]);
  const listAria =
    variant === "faqProducts"
      ? tFaq("subtitle")
      : variant === "unlimitedTargets"
        ? tUnlimited("tag")
        : tGuides("listLabel");

  return (
    <div className="max-w-5xl mx-auto">
      <div
        role="list"
        aria-label={listAria}
        className={
          variant === "unlimitedTargets"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
            : "grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5"
        }
      >
        {variant === "faqProducts"
          ? faqProductRows.map((row, idx) => {
              const Icon = row.icon;
              return (
                <motion.div
                  key={row.id}
                  role="listitem"
                  viewport={{ once: true }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.1 }}
                >
                  <div className="group relative flex flex-col h-full rounded-2xl bg-white border border-gray-200/80 hover:border-primaryOrange/30 transition-all duration-200 hover:shadow-lg overflow-hidden pt-2">
                    <div
                      style={HOVER_GRADIENT_STYLE}
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />
                    <div className="relative flex flex-col flex-1 p-4 md:p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div
                            style={ICON_STYLE}
                            className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-all duration-200 group-hover:bg-primaryOrange/15"
                          >
                            <Icon
                              aria-hidden="true"
                              className="w-6 h-6 text-primaryOrange"
                            />
                          </div>
                          <h3 className="text-sm md:text-base font-bold text-darkerGray group-hover:text-primaryOrange transition-colors">
                            {row.title}
                          </h3>
                          <p className="text-[11px] md:text-xs text-lightGray leading-relaxed mt-2">
                            {row.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 -mt-1 -mr-1">
                          <Image
                            alt={`Bea Maskottchen — ${row.title}`}
                            width={500}
                            height={500}
                            loading="lazy"
                            src={row.mascot}
                            className="object-contain w-16 h-16 md:w-32 md:h-32 group-hover:scale-110 transition-transform duration-300 scale-150 relative top-2"
                          />
                        </div>
                      </div>
                      <Link
                        href={row.href}
                        aria-label={`${tFaq("learnMore")}: ${row.title}`}
                        className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs md:text-sm font-semibold text-primaryOrange hover:gap-3 transition-all mt-4 w-full"
                      >
                        {tFaq("learnMore")}
                        <ArrowRight
                          aria-hidden="true"
                          className="w-3.5 h-3.5 shrink-0"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })
          : variant === "unlimitedTargets"
            ? UNLIMITED_TARGET_GROUPS.map((group, idx) => {
                const Icon = group.icon;
                return (
                  <motion.div
                    key={group.id}
                    role="listitem"
                    viewport={{ once: true }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                  >
                    <div className="group relative overflow-hidden rounded-2xl p-5 md:p-6 border border-primaryOrange/15 hover:border-primaryOrange/30 transition-all hover:shadow-lg bg-white">
                      <div
                        style={HOVER_GRADIENT_STYLE}
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      />
                      <div className="relative z-10 flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div
                            style={ICON_STYLE}
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                          >
                            <Icon
                              aria-hidden="true"
                              className="w-5 h-5 text-primaryOrange"
                            />
                          </div>
                          <h3 className="text-base md:text-lg font-bold text-darkerGray mb-1 group-hover:text-primaryOrange transition-colors">
                            {tUnlimited(`targetGroups.${group.id}.title`)}
                          </h3>
                          <p className="text-xs md:text-sm text-lightGray leading-relaxed">
                            {tUnlimited(
                              `targetGroups.${group.id}.description`,
                            )}
                          </p>
                        </div>
                        <div className="flex-shrink-0 -mt-1 -mr-1">
                          <Image
                            alt={`Bea Maskottchen — ${tUnlimited(`targetGroups.${group.id}.title`)}`}
                            width={400}
                            height={400}
                            loading="lazy"
                            src={group.mascot}
                            className="object-contain w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 group-hover:scale-110 transition-transform duration-300 scale-125 relative top-1"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            : categories.map((cat, idx) => {
              const Icon = cat.icon;
              const label = tGuides(`categories.${cat.slug}.label`);
              const desc = tGuides(`categories.${cat.slug}.desc`);
              return (
                <motion.div
                  key={cat.slug}
                  role="listitem"
                  viewport={{ once: true }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.1 }}
                >
                  <div className="group relative flex flex-col h-full rounded-2xl bg-white border border-gray-200/80 hover:border-primaryOrange/30 transition-all duration-200 hover:shadow-lg overflow-hidden pt-2">
                    <div
                      style={HOVER_GRADIENT_STYLE}
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />
                    {/* CONTENT */}
                    <div className="relative flex flex-col flex-1 p-4 md:p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div
                            style={ICON_STYLE}
                            className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-all duration-200 group-hover:bg-primaryOrange/15"
                          >
                            <Icon
                              aria-hidden="true"
                              className="w-6 h-6 text-primaryOrange"
                            />
                          </div>
                          {/* Title */}
                          <h3 className="text-sm md:text-base font-bold text-darkerGray group-hover:text-primaryOrange transition-colors">
                            {label}
                          </h3>
                          {/* Description */}
                          <p className="text-[11px] md:text-xs text-lightGray leading-relaxed mt-2">
                            {desc}
                          </p>
                        </div>
                        {/* Mascot */}
                        <div className="flex-shrink-0 -mt-1 -mr-1">
                          <Image
                            alt={`Bea Maskottchen — ${label}`}
                            width={400}
                            height={400}
                            loading="lazy"
                            src={cat.mascot}
                            className="object-contain w-16 h-16 md:w-32 md:h-32 group-hover:scale-110 transition-transform duration-300 scale-150 relative top-2"
                          />
                        </div>
                      </div>
                      <Link
                        href={cat.href}
                        aria-label={tGuides("viewCategoryAria", { label })}
                        className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs md:text-sm font-semibold text-primaryOrange hover:gap-3 transition-all mt-4 w-full"
                      >
                        {tGuides("viewCategory")}
                        <ArrowRight
                          aria-hidden="true"
                          className="w-3.5 h-3.5 shrink-0"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
      </div>
      {/* ALL RATGEBER BUTTON */}
      {variant === "guides" && (
        <motion.div
          initial={{ opacity: 0 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-10"
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Button
            href="/ratgeber"
            variant="primary"
            className="inline-flex items-center justify-center gap-2 !px-6 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
          >
            {tGuides("viewAll")}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}

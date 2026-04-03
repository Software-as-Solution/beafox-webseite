"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// CUSTOM COMPONENTS
import Button from "@/components/Button";
import Section from "@/components/Section";
import LandingHero from "@/components/LandingHero";
import DownloadModal from "@/components/DownloadModal";
import SectionHeader from "@/components/SectionHeader";
import DemoBookingCtaSection from "@/components/DemoBookingCtaSection";
// IMPORTS
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState, useCallback, useMemo } from "react";
// ICONS
import {
  Users,
  Award,
  Quote,
  Target,
  PawPrint,
  Linkedin,
  Sparkles,
  Download,
  Lightbulb,
  Building2,
  TrendingUp,
  Presentation,
} from "lucide-react";

// TYPES
interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin: string;
}
interface TimelineItem {
  year: string;
  title: string;
  description: string;
}
// CONSTANTS
const TEAM_MEMBER_META = [
  {
    image: "/Team/Alex.png",
    linkedin: "https://www.linkedin.com/in/alexandru-tapelea-43a400245/",
  },
  {
    image: "/Team/Selina.png",
    linkedin: "https://www.linkedin.com/in/selina-fuchs-7b0873371/",
  },
  {
    image: "/Team/Marcel.png",
    linkedin: "https://www.linkedin.com/in/marceldulgeridis/",
  },
] as const;
const VALUE_ICONS = [Target, Lightbulb, Building2] as const;
const GRADIENT_CARD_STYLE = {
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
} as const;
const STORY_BG = { background: "rgba(232,119,32,0.04)" } as const;
const ACHIEVEMENT_CARD_STYLE = {
  border: "1px solid rgba(232,119,32,0.2)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.06)",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
} as const;
const AWARD_PILLS = [
  { label: "Gründerpreis", icon: Award },
  { label: "Startup Summit Deutschland", icon: TrendingUp },
  { label: "Startchancen-Programm", icon: Sparkles },
] as const;
const PIVOT_ITEM: TimelineItem = {
  year: "2026",
  title: "Dein Lernbegleiter",
  description:
    "Statt Wissen vermitteln, begleitet Bea junge Menschen durch echte Finanzsituationen — personalisiert, neutral und in ihrem Tempo.",
};
const GLOW = (opacity: number) => ({
  background: `radial-gradient(circle, rgba(232,119,32,${opacity}) 0%, transparent 70%)`,
});

export default function AboutPage() {
  // HOOKS
  const t = useTranslations("about");
  const tHome = useTranslations("home");
  // STATES
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const openDownloadModal = useCallback(() => setIsDownloadModalOpen(true), []);
  const closeDownloadModal = useCallback(
    () => setIsDownloadModalOpen(false),
    [],
  );
  // CONSTANTS
  const stats = useMemo(
    () => [
      { value: "5,000+", label: t("stats.activeUsers"), icon: Users },
      { value: "10+", label: t("stats.schoolsCompanies"), icon: Building2 },
    ],
    [t],
  );
  const values = useMemo(() => {
    const raw =
      (t.raw("values") as { title: string; description: string }[]) ?? [];
    return raw.map((v, i) => ({ ...v, icon: VALUE_ICONS[i] }));
  }, [t]);
  const teamMembers: TeamMember[] = useMemo(() => {
    const raw =
      (t.raw("team.members") as { name: string; role: string }[]) ?? [];
    return raw.map((m, i) => ({ ...m, ...TEAM_MEMBER_META[i] }));
  }, [t]);
  const timelineData: TimelineItem[] = useMemo(
    () => [...((t.raw("timeline.items") as TimelineItem[]) ?? []), PIVOT_ITEM],
    [t],
  );

  return (
    <>
      {/* ─── 1. HERO ─── */}
      <LandingHero
        badge={t("hero.badge")}
        mascotAlt={t("hero.badge")}
        cardText={t("hero.subtitle")}
        mascotSrc="/Maskottchen/Maskottchen-Friends.png"
        title={
          <>
            {t("hero.titlePre")}
            <span className="text-primaryOrange">
              {t("hero.titleHighlight")}
            </span>
            {t("hero.titlePost")}
          </>
        }
        actions={
          <>
            <Button
              variant="primary"
              onClick={openDownloadModal}
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Download
                aria-hidden="true"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
              {t("cta.downloadCta")}
            </Button>
            <Button
              href="/kontakt"
              variant="outline"
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Presentation
                aria-hidden="true"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
              {t("cta.partnerCta")}
            </Button>
          </>
        }
      />
      {/* ─── 2. STORY ─── */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-8 lg:mb-12"
          >
            <SectionHeader
              preTitle={t("story.title.pre")}
              highlight={t("story.title.highlight")}
            />
          </motion.div>
          <div className="space-y-6 md:space-y-8">
            <motion.div
              style={STORY_BG}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="rounded-xl p-4 md:p-8 border-l-4 border-primaryOrange"
            >
              <div className="flex items-start gap-4">
                <Sparkles
                  aria-hidden="true"
                  className="w-7 h-7 text-primaryOrange flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-darkerGray mb-2">
                    {t("story.problemTitle")}
                  </h3>
                  <p className="text-lightGray text-sm md:text-base leading-relaxed">
                    {t("story.problemText")}
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              style={STORY_BG}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="rounded-xl p-4 md:p-8 border-l-4 border-primaryOrange"
            >
              <div className="flex items-start gap-4">
                <Target
                  aria-hidden="true"
                  className="w-7 h-7 text-primaryOrange flex-shrink-0 mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-darkerGray mb-2">
                        {t("story.solutionTitle")}
                      </h3>
                      <p className="text-lightGray text-sm md:text-base leading-relaxed">
                        {t("story.solutionText")}
                      </p>
                    </div>
                    <Image
                      width={300}
                      height={300}
                      loading="lazy"
                      alt={t("images.beaMascotAlt")}
                      src="/Maskottchen/Maskottchen-Hero.png"
                      className="object-contain w-20 h-20 md:w-28 md:h-28 scale-150 flex-shrink-0 hidden sm:block"
                      style={{
                        filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ─── 3. ANTRIEB ─── */}
      <Section className="bg-gray-50 py-10 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-10 md:mb-14"
          >
            <SectionHeader
              pillClassName="mb-4 md:mb-6"
              title={
                <>
                  {t("drive.title")}{" "}
                  <span className="text-primaryOrange">
                    {t("drive.subtitle")}
                  </span>
                </>
              }
            />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-12 md:mb-16">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  viewport={{ once: true }}
                  style={GRADIENT_CARD_STYLE}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-2xl p-6 md:p-8 border border-primaryOrange/15 hover:border-primaryOrange/30 transition-all hover:shadow-lg group"
                >
                  <div
                    style={GLOW(0.08)}
                    aria-hidden="true"
                    className="absolute -top-12 -right-12 w-[140px] h-[140px] rounded-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-105"
                      style={{
                        background: "rgba(232,119,32,0.1)",
                        border: "1px solid rgba(232,119,32,0.15)",
                      }}
                    >
                      <Icon
                        aria-hidden="true"
                        className="w-6 h-6 text-primaryOrange"
                      />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-darkerGray mb-2 group-hover:text-primaryOrange transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-sm md:text-base text-lightGray leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  width={600}
                  height={450}
                  loading="lazy"
                  src="/Team/Team.png"
                  alt={t("images.teamPhotoAlt")}
                  className="object-cover w-full h-auto aspect-[4/3]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <p className="text-primaryWhite text-xs md:text-sm italic leading-relaxed">
                    {tHome("experienceSection.quote")}
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              viewport={{ once: true }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-center md:text-left"
            >
              <div className="bg-white rounded-xl p-4 md:p-5 border-l-4 border-r-4 border-primaryOrange shadow-sm mb-6">
                <p className="text-sm md:text-base text-primaryOrange font-semibold leading-relaxed">
                  {tHome("experienceSection.paragraph3")}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Button
                  variant="primary"
                  onClick={openDownloadModal}
                  className="flex items-center justify-center gap-1.5 md:gap-2 !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
                >
                  <Download
                    aria-hidden="true"
                    className="w-3.5 h-3.5 md:w-4 md:h-4"
                  />
                  {tHome("hero.cta.download")}
                </Button>
                <Button
                  href="/kontakt"
                  variant="outline"
                  className="flex items-center justify-center gap-1.5 md:gap-2 !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
                >
                  <Presentation
                    aria-hidden="true"
                    className="w-3.5 h-3.5 md:w-4 md:h-4"
                  />
                  {tHome("hero.cta.partner")}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ─── 4. TEAM ─── */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <motion.div
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <SectionHeader
            pillClassName="mb-4 md:mb-6"
            subtitle={t("team.subtitle")}
            title={
              <>
                {t("team.titlePre")}
                <span className="text-primaryOrange">
                  {t("team.titleHighlight")}
                </span>
                {t("team.titlePost")}
              </>
            }
          />
        </motion.div>
        <div
          role="list"
          aria-label="Team-Mitglieder"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              role="listitem"
              key={member.name}
              viewport={{ once: true }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-200 hover:border-primaryOrange/30 rounded-2xl p-4 md:p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 mb-3 md:mb-4 rounded-full overflow-hidden border-2 border-primaryOrange/20 group-hover:border-primaryOrange/50 transition-all flex-shrink-0">
                <Image
                  fill
                  loading="lazy"
                  alt={member.name}
                  src={member.image}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm md:text-base font-bold text-darkerGray mb-1 group-hover:text-primaryOrange transition-colors">
                {member.name}
              </h3>
              <p className="text-xs md:text-sm text-lightGray mb-3 flex-grow">
                {member.role}
              </p>
              {member.linkedin && (
                <a
                  target="_blank"
                  href={member.linkedin}
                  rel="noopener noreferrer"
                  aria-label={`${member.name} auf LinkedIn`}
                  className="w-8 h-8 bg-primaryOrange/10 rounded-full flex items-center justify-center hover:bg-primaryOrange hover:scale-110 transition-all group/link"
                >
                  <Linkedin
                    aria-hidden="true"
                    className="w-4 h-4 text-primaryOrange group-hover/link:text-white transition-colors"
                  />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ─── 5. TIMELINE + ACHIEVEMENTS ─── */}
      <Section className="bg-gray-50 py-10 md:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-10 md:mb-14"
          >
            <SectionHeader
              preTitle={t("timeline.titlePre")}
              highlight={t("timeline.titleHighlight")}
            />
          </motion.div>
          <div className="relative px-4 md:px-0 mb-12 md:mb-16">
            <div
              aria-hidden="true"
              className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-0.5 bg-primaryOrange/15 -translate-x-1/2"
            />
            <div className="space-y-3 md:space-y-4">
              {timelineData.map((item, index) => {
                const isLast = index === timelineData.length - 1;
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    viewport={{ once: true }}
                    key={`${item.year}-${index}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    className={`relative flex items-start gap-4 md:gap-8 ${isEven ? "" : "md:flex-row-reverse"}`}
                  >
                    <motion.div
                      aria-hidden="true"
                      className={`absolute left-[8px] md:left-1/2 top-6 -translate-x-1/2 z-10 rounded-full border-4 border-white shadow-lg ${isLast ? "w-6 h-6 md:w-7 md:h-7 bg-primaryOrange" : "w-4 h-4 md:w-5 md:h-5 bg-primaryOrange"}`}
                      {...(isLast
                        ? {
                            animate: {
                              boxShadow: [
                                "0 0 0 0 rgba(232,119,32,0.4)",
                                "0 0 0 8px rgba(232,119,32,0)",
                              ],
                            },
                            transition: {
                              duration: 1.5,
                              ease: "easeOut",
                              repeat: Infinity,
                            },
                          }
                        : {})}
                    />
                    <div
                      className={`w-full md:w-5/12 ml-8 md:ml-0 ${isEven ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"}`}
                    >
                      <div
                        className={`rounded-xl p-4 md:p-5 transition-all ${isLast ? "border-2 border-primaryOrange shadow-md" : "bg-white border border-gray-200 shadow-sm hover:border-primaryOrange/30 hover:shadow-md"}`}
                        style={
                          isLast
                            ? {
                                background:
                                  "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
                              }
                            : undefined
                        }
                      >
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 mb-2 text-xs font-bold ${isLast ? "bg-primaryOrange text-white" : "bg-primaryOrange/10 text-primaryOrange"}`}
                        >
                          {isLast && (
                            <Sparkles className="w-3 h-3" aria-hidden="true" />
                          )}
                          {item.year}
                        </div>
                        <h3
                          className={`text-sm md:text-base font-bold mb-1 ${isLast ? "text-primaryOrange" : "text-darkerGray"}`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-lightGray text-xs md:text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl p-6 md:p-10"
            style={ACHIEVEMENT_CARD_STYLE}
          >
            <div
              style={GLOW(0.08)}
              aria-hidden="true"
              className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full pointer-events-none"
            />
            <div
              style={GLOW(0.05)}
              aria-hidden="true"
              className="absolute -bottom-16 -left-16 w-[200px] h-[200px] rounded-full pointer-events-none"
            />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-1 min-w-0 text-center md:text-left">
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4"
                  style={{
                    background: "rgba(232,119,32,0.1)",
                    border: "1px solid rgba(232,119,32,0.2)",
                  }}
                >
                  <Award
                    aria-hidden="true"
                    className="w-3.5 h-3.5 text-primaryOrange"
                  />
                  <span className="text-[11px] font-bold text-primaryOrange uppercase tracking-wide">
                    {t("achievements.tag")}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-darkerGray mb-3">
                  {t("achievements.titlePre")}
                  <span className="text-primaryOrange">
                    {t("achievements.titleHighlight")}
                  </span>
                </h3>
                <p className="text-sm md:text-base text-lightGray leading-relaxed mb-5">
                  {t("achievements.description")}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                  {AWARD_PILLS.map(({ label, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-primaryOrange/10 border border-primaryOrange/20 text-primaryOrange"
                    >
                      <Icon className="w-3 h-3" aria-hidden="true" />
                      {label}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.value}
                        className="flex items-center gap-2 bg-white rounded-full px-3.5 py-2 border border-gray-200 shadow-sm"
                      >
                        <div className="w-7 h-7 rounded-full bg-primaryOrange/10 flex items-center justify-center flex-shrink-0">
                          <Icon
                            className="w-3.5 h-3.5 text-primaryOrange"
                            aria-hidden="true"
                          />
                        </div>
                        <span className="text-sm font-bold text-primaryOrange">
                          {stat.value}
                        </span>
                        <span className="text-[11px] text-lightGray font-medium">
                          {stat.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <motion.div
                className="flex-shrink-0 relative"
                viewport={{ once: true }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div
                  style={GLOW(0.1)}
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-full pointer-events-none"
                />
                <Image
                  alt={t("images.beaMascotAlt")}
                  width={200}
                  height={200}
                  loading="lazy"
                  src="/Maskottchen/Maskottchen-Hero.png"
                  className="relative z-10 object-contain w-32 h-32 md:w-44 md:h-44"
                  style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.1))" }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ─── 6. QUOTE ─── */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 md:p-10 shadow-lg border border-primaryOrange/15 relative"
          >
            <Quote
              aria-hidden="true"
              className="w-10 h-10 md:w-14 md:h-14 text-primaryOrange/15 absolute top-4 left-4"
            />
            <div className="relative z-10">
              <blockquote className="text-lg md:text-xl lg:text-2xl font-semibold text-darkerGray mb-6 italic leading-relaxed">
                &ldquo;{t("quote.text")}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primaryOrange rounded-full flex items-center justify-center flex-shrink-0">
                  <PawPrint
                    aria-hidden="true"
                    className="w-5 h-5 text-primaryWhite"
                  />
                </div>
                <div>
                  <div className="font-bold text-darkerGray text-sm">
                    {t("quote.teamName")}
                  </div>
                  <div className="text-lightGray text-xs">
                    {t("quote.teamSubtitle")}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ─── 7. CTA ─── */}
      <DemoBookingCtaSection />
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={closeDownloadModal}
      />
    </>
  );
}

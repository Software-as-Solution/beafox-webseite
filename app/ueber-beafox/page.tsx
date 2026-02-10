"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import DownloadModal from "@/components/DownloadModal";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Target,
  Lightbulb,
  Building2,
  PawPrint,
  Linkedin,
  Instagram,
  Users,
  Award,
  TrendingUp,
  Heart,
  Sparkles,
  Quote,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const stats = [
    { value: "3,000+", label: t("stats.activeUsers"), icon: Users, color: "text-primaryOrange" },
    { value: "5+", label: t("stats.schoolsCompanies"), icon: Building2, color: "text-primaryOrange" },
    { value: "1,000+", label: t("stats.studentsApprentices"), icon: Users, color: "text-primaryOrange" },
    { value: "5", label: t("stats.awards"), icon: Award, color: "text-primaryOrange" },
  ];

  const timelineData = t.raw("timeline.items") as { year: string; title: string; description: string }[];
  const valueIcons = [Target, Lightbulb, Building2];
  const valuesData = t.raw("values") as { title: string; description: string }[];
  const values = valuesData.map((v, i) => ({ icon: valueIcons[i], title: v.title, description: v.description }));

  const teamMembersTranslated = t.raw("team.members") as { name: string; role: string }[];
  const teamMemberMeta = [
    { image: "/Team/Alex.png", linkedin: "https://www.linkedin.com/in/alexandru-tapelea-43a400245/" },
    { image: "/Team/Selina.png", linkedin: "https://www.linkedin.com/in/selina-fuchs-7b0873371/" },
    { image: "/Team/Marcel.png", linkedin: "https://www.linkedin.com/in/marceldulgeridis/" },
    { image: "/Team/Nico.png", linkedin: "https://www.linkedin.com/in/nico-moos-355b881a8/" },
  ];
  const teamMembers = teamMemberMeta.map((meta, i) => ({ ...meta, ...teamMembersTranslated[i] }));

  return (
    <>
      {/* Hero - Über uns */}
      <Section className="bg-gradient-to-br from-primaryWhite via-white to-primaryOrange/5 py-12 mt-14 md:mt-4 md:py-16 lg:pt-24 lg:pb-10">
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6 md:mb-8"
          >
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h2 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              {t("hero.badge")}
            </h2>
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-darkerGray mb-4 md:mb-6"
          >
            {t("hero.titlePre")}<span className="text-primaryOrange">{t("hero.titleHighlight")}</span>{t("hero.titlePost")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl text-lightGray max-w-3xl mx-auto mb-8 md:mb-12"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-primaryOrange/20 hover:border-primaryOrange/40 transition-all"
              >
                <stat.icon
                  className={`w-8 h-8 md:w-10 md:h-10 ${stat.color} mb-3 mx-auto`}
                />
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-lightGray">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Story Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6">
              <Heart className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">{t("story.tag")}</span>
              <Heart className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-0 lg:mb-6">
              {t("story.title.pre")}{" "}
              <span className="text-primaryOrange">{t("story.title.highlight")}</span>
            </h2>
          </motion.div>

          <div className="space-y-8 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-primaryOrange/5 rounded-xl p-4 md:p-8 border-l-4 border-primaryOrange"
            >
              <div className="flex items-start gap-4">
                <Sparkles className="w-8 h-8 text-primaryOrange flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-darkerGray mb-3">
                    {t("story.problemTitle")}
                  </h3>
                  <p className="text-lightGray text-sm md:text-base leading-relaxed">
                    {t("story.problemText")}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-primaryOrange/5 rounded-xl p-4 md:p-8 border-l-4 border-primaryOrange"
            >
              <div className="flex items-start gap-4">
                <Target className="w-8 h-8 text-primaryOrange flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-darkerGray mb-3">
                    {t("story.solutionTitle")}
                  </h3>
                  <p className="text-lightGray text-sm md:text-base leading-relaxed">
                    {t("story.solutionText")}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Unser Antrieb Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
          {/* Left: Unser Antrieb */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1"
          >
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto md:mx-0 mb-6 md:mb-8">
              <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">{t("drive.tag")}</span>
              <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-2 text-center md:text-left">
              {t("drive.title")}
            </h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primaryOrange mb-6 text-center md:text-left">
              {t("drive.subtitle")}
            </h3>
            <p className="text-lightGray text-base md:text-lg mb-6 md:mb-8">
              {t("drive.description")}
            </p>
            <Button
              href="/kontakt"
              variant="primary"
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-4 !py-2 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              {t("drive.ctaPartner")} →
            </Button>
          </motion.div>

          {/* Center: Mockups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-1 flex items-center justify-center relative"
          >
            <div className="relative flex items-center justify-center">
              {/* Mockup 1 - Left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative z-10 transform rotate-[-8deg]"
                style={{ marginRight: "-20px" }}
              >
                <Image
                  src="/assets/Mockups/Mockup-Profil.png"
                  alt={t("mockups.profilAlt")}
                  width={200}
                  height={428}
                  className="object-contain drop-shadow-2xl w-[100px] sm:w-[140px] md:w-[200px] lg:w-[240px] h-auto"
                />
              </motion.div>

              {/* Mockup 2 - Center */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative z-20"
              >
                <Image
                  src="/assets/Mockups/Mockup-Lernpfad.png"
                  alt={t("mockups.learningPathAlt")}
                  width={240}
                  height={514}
                  className="object-contain drop-shadow-2xl w-[120px] sm:w-[160px] md:w-[240px] lg:w-[280px] h-auto"
                />
              </motion.div>

              {/* Mockup 3 - Right */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative z-10 transform rotate-[8deg]"
                style={{ marginLeft: "-20px" }}
              >
                <Image
                  src="/assets/Mockups/Mockup-Rangliste.png"
                  alt={t("mockups.rankingAlt")}
                  width={200}
                  height={428}
                  className="object-contain drop-shadow-2xl w-[100px] sm:w-[140px] md:w-[200px] lg:w-[240px] h-auto"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Mission, Vision, Motto */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-1 space-y-4 md:space-y-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-primaryOrange/10 rounded-xl p-4 md:p-6 border border-primaryOrange/30"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="flex-shrink-0 w-12 h-12 bg-primaryOrange rounded-full flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <value.icon className="w-6 h-6 text-primaryWhite" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-darkerGray mb-2">
                      {value.title}
                    </h3>
                    <p className="text-lightGray text-sm md:text-base">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Team Section */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="text-center mb-8 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6 md:mb-8"
          >
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <span className="font-bold">{t("team.tag")}</span>
            <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4"
          >
            {t("team.titlePre")}<span className="text-primaryOrange">{t("team.titleHighlight")}</span>{t("team.titlePost")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-lightGray max-w-3xl mx-auto"
          >
            {t("team.subtitle")}
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white border-2 border-primaryOrange rounded-xl p-4 md:p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all cursor-pointer group h-full"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4 md:mb-6 rounded-full overflow-hidden border-2 border-primaryOrange group-hover:border-primaryOrange/80 transition-all flex-shrink-0">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-darkerGray mb-2 group-hover:text-primaryOrange transition-colors">
                {member.name}
              </h3>
              <p className="text-sm md:text-base text-lightGray mb-4 md:mb-6 flex-grow">
                {member.role}
              </p>
              <div className="flex gap-3 justify-center mt-auto">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primaryOrange rounded-full flex items-center justify-center hover:bg-primaryOrange/80 hover:scale-110 transition-all"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin className="w-5 h-5 text-primaryWhite" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Timeline Section */}
      <Section className="bg-primaryWhite py-8 md:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-16"
          >
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">{t("timeline.tag")}</span>
              <Calendar className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              {t("timeline.titlePre")}
              <span className="text-primaryOrange">{t("timeline.titleHighlight")}</span>
            </h2>
          </motion.div>

          <div className="relative px-4 md:px-0">
            <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-0.5 md:w-1 bg-primaryOrange/30 transform -translate-x-1/2 md:-translate-x-1/2"></div>

            <div className="space-y-4 md:space-y-6">
              {timelineData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative flex items-start gap-4 md:gap-8 flex-row md:flex-row md:even:flex-row-reverse"
                >
                  {/* Timeline Dot - zentriert auf der Linie */}
                  <div className="absolute left-[8px] md:left-1/2 top-6 w-4 h-4 md:w-5 md:h-5 bg-primaryOrange rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 md:-translate-x-1/2 z-10 flex-shrink-0"></div>

                  {/* Content */}
                  <div className="w-full md:w-5/12 ml-8 md:ml-0 md:even:pr-8 md:even:text-right md:odd:pl-8 md:odd:text-left">
                    <div className="bg-white rounded-xl p-4 md:p-6 lg:p-8 shadow-lg border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all">
                      <div className="text-primaryOrange font-bold text-base md:text-lg lg:text-xl mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-darkerGray mb-2 md:mb-3">
                        {item.title}
                      </h3>
                      <p className="text-lightGray text-sm md:text-base lg:text-lg">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Achievements */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6">
              <Award className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">{t("achievements.tag")}</span>
              <Award className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              {t("achievements.titlePre")}
              <span className="text-primaryOrange">{t("achievements.titleHighlight")}</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 border-2 border-primaryOrange rounded-xl p-6 md:p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primaryOrange/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <Award className="w-12 h-12 text-primaryOrange mb-4" />
                <h3 className="text-xl md:text-2xl font-bold text-primaryOrange mb-3 md:mb-4">
                  {t("achievements.award1Title")}
                </h3>
                <p className="text-lightGray text-base md:text-lg">
                  {t("achievements.award1Text")}
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 border-2 border-primaryOrange rounded-xl p-6 md:p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primaryOrange/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <TrendingUp className="w-12 h-12 text-primaryOrange mb-4" />
                <h3 className="text-xl md:text-2xl font-bold text-primaryOrange mb-3 md:mb-4">
                  {t("achievements.award2Title")}
                </h3>
                <p className="text-lightGray text-base md:text-lg">
                  {t("achievements.award2Text")}
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-12"
          >
            <Button
              href="/#blog"
              variant="secondary"
              className="flex items-center justify-center gap-2 !border-primaryOrange !text-primaryWhite hover:!bg-primaryOrange hover:!text-primaryWhite !px-4 !py-2 md:!px-6 md:!py-3"
            >
              {t("achievements.blogCta")}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* Quote Section */}
      <Section className="bg-primaryWhite pb-8 md:pb-12 lg:pb-16 pt-0">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border-2 border-primaryOrange/20 relative"
          >
            <Quote className="w-12 h-12 md:w-16 md:h-16 text-primaryOrange/20 absolute top-4 left-4" />
            <div className="relative z-10">
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-darkerGray mb-6 italic leading-relaxed">
                &quot;{t("quote.text")}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primaryOrange rounded-full flex items-center justify-center">
                  <PawPrint className="w-6 h-6 text-primaryWhite" />
                </div>
                <div>
                  <div className="font-bold text-darkerGray">{t("quote.teamName")}</div>
                  <div className="text-lightGray text-sm">{t("quote.teamSubtitle")}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 py-8 md:py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Sparkles className="w-16 h-16 text-primaryWhite mx-auto mb-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primaryWhite"
          >
            {t("cta.titlePre")}<span className="text-darkerGray">{t("cta.titleHighlight")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl mb-8 text-primaryWhite/90"
          >
            {t("cta.description")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
          >
            <Button
              href="/kontakt"
              variant="secondary"
              className="flex items-center justify-center gap-1.5 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite md:gap-2 w-full sm:w-auto !px-4 !py-2 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              {t("cta.partnerCta")}
            </Button>
            <Button
              onClick={() => setIsDownloadModalOpen(true)}
              variant="secondary"
              className="flex items-center justify-center gap-1.5 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite md:gap-2 w-full sm:w-auto !px-4 !py-2 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              {t("cta.downloadCta")}
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </>
  );
}

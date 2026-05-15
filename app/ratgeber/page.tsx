"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle, Target } from "lucide-react";
import Button from "@/components/Button";
import Section from "@/components/Section";
import LandingHero from "@/components/LandingHero";
import SectionHeader from "@/components/SectionHeader";
import RatgeberSection from "@/components/RatGeber";

const APP_STORE_URL = "https://apps.apple.com/de/app/beafox/id6746110612";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.tapelea.beafox&pcampaignid=web_share";

const APP_CTA_STYLE = {
  background:
    "radial-gradient(circle at 85% 10%, rgba(255,255,255,0.2), transparent 28%), linear-gradient(135deg, #E87720 0%, #F59B45 100%)",
} as const;

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
      className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)]"
    >
      <Image
        width={160}
        height={52}
        src={imageSrc}
        alt={imageAlt}
        className="h-auto w-7 shrink-0 object-contain"
      />
      <span className="text-sm font-black leading-tight text-darkerGray">
        {label}
      </span>
    </a>
  );
}

export default function RatgeberHubPage() {
  return (
    <main>
      <LandingHero
        badge="Ratgeber für jede Lebensphase"
        mascotSrc="/Maskottchen/Maskottchen-Ratgeber.webp"
        mascotAlt="BeAFox Maskottchen für Ratgeber"
        description={
          <>
            Ob Schüler, Azubi, Student oder Berufseinsteiger: <br />
            Hier findest du alle Ratgeber-Kategorien.
          </>
        }
        title={
          <>
            Finanzwissen, das zu deiner{" "}
            <span className="text-primaryOrange">Situation</span> passt.
          </>
        }
        actions={
          <Button
            href="/bea-ai"
            variant="primary"
            className="w-full gap-2 sm:w-auto"
          >
            Mit Bea chatten
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        }
        trustBadgeFirst
        mascotClassName="relative right-0 md:top-6"
      />

      <Section
        id="ratgeber-kategorien"
        width="wide"
        className="scroll-mt-24 bg-[#fafafa] py-12 md:py-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center"
        >
          <SectionHeader
            pillClassName="mb-4 sm:mb-6"
            preTitle="Entdecke unsere"
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
          guidesOuterClassName="w-full"
          categoryCtaLabel="Ratgeber ansehen"
          showAllGuideCategories
          showViewAllButton={false}
        />
      </Section>

      <Section width="wide" className="bg-white py-10 md:py-14">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-[30px] p-7 shadow-[0_20px_54px_-24px_rgba(232,119,32,0.5)] md:p-10 lg:p-12"
          style={APP_CTA_STYLE}
        >
          <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-sm ring-1 ring-white/25">
                <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                Ratgeber mit Bea umsetzen
              </span>
              <h2 className="mt-5 max-w-xl text-3xl font-black leading-tight tracking-[-0.04em] text-white md:text-5xl">
                Deine Fragen direkt in der App beantworten.
              </h2>
              <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-white/85 md:text-base">
                Lies den passenden Ratgeber und frag Bea danach, wie du die
                nächsten Schritte auf deine Situation anwendest.
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
            <div className="relative flex items-center justify-center">
              <Image
                width={420}
                height={420}
                src="/Maskottchen/Maskottchen-Handy.png"
                alt=""
                className="h-72 w-72 object-contain drop-shadow-[0_24px_42px_rgba(120,52,0,0.22)] md:h-80 md:w-80"
              />
            </div>
          </div>
        </motion.section>
      </Section>
    </main>
  );
}

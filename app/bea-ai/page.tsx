"use client";

// ─── BeaAIPage ────────────────────────────────────────────
// Slim three-phase orchestrator: welcome → onboarding → chat.
// All business logic and UI lives in extracted sub-components.

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import OnboardingFlow from "@/components/bea-ai/OnboardingFlow";
import OnboardingProgress from "@/components/bea-ai/OnboardingProgress";
import WelcomePhase from "@/components/bea-ai/welcome/WelcomePhase";
import ChatPhase from "@/components/bea-ai/chat/ChatPhase";
import BackToSiteButton from "@/components/bea-ai/shared/BackToSiteButton";
import {
  TOTAL_STEPS,
  emptyProfile,
  type UserProfile,
} from "@/lib/bea-ai/onboarding";
import { getTopicSeed } from "@/lib/bea-ai/topicSeeds";
import {
  trackOnboardingStarted,
} from "@/lib/analytics";

// CONFIG
// Onboarding ist standardmäßig AUS. Zum Wiedereinschalten:
// NEXT_PUBLIC_BEA_ONBOARDING="on" setzen (Env / Vercel). Bei "off"/unset geht
// der Welcome-CTA direkt in den Chat (Default-Profil), die Onboarding-Phase
// wird nie erreicht (Code bleibt erhalten, also jederzeit reversibel).
const ONBOARDING_ENABLED = process.env.NEXT_PUBLIC_BEA_ONBOARDING === "on";

// TYPES
type Phase = "welcome" | "onboarding" | "chat";

interface OnboardingState {
  total: number;
  stepIdx: number;
  isComplete: boolean;
}

const INITIAL_ONBOARDING_STATE: OnboardingState = {
  stepIdx: 0,
  total: TOTAL_STEPS,
  isComplete: false,
};

export default function BeaAIPage() {
  // useSearchParams erfordert eine Suspense-Boundary (Next.js App-Router).
  return (
    <Suspense fallback={<BeaAIFallback />}>
      <BeaAIPageInner />
    </Suspense>
  );
}

function BeaAIFallback() {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center bg-white" />
  );
}

function BeaAIPageInner() {
  const searchParams = useSearchParams();

  // Deep-Links EINMAL beim Mount auswerten → Welcome + Onboarding überspringen,
  // direkt in den Chat mit Seed-Frage (Auto-Send). Zwei Varianten:
  //   • `/bea-ai?topic=<slug>`     — Kategorie-Karte (hinterlegte Seed-Frage)
  //   • `/bea-ai?context=<text>`   — Ratgeber-Artikel (GuideArticle, freier Text)
  // Nichts/unbekannt → normaler Welcome-Flow (kein Auto-Send).
  const [topicEntry] = useState(() => {
    // 1) Kategorie-Deep-Link mit hinterlegter Seed-Frage.
    const seed = getTopicSeed(searchParams.get("topic"));
    if (seed) {
      return {
        seedQuestion: seed.seedQuestion,
        profile: {
          ...emptyProfile(),
          lebenssituation: seed.lebenssituation,
        } satisfies UserProfile,
      };
    }
    // 2) Artikel-Deep-Link: der Kontext IST die Seed-Frage. Auf 2000 Zeichen
    // begrenzt (Parität zum Chat-Validator; verhindert aufgeblähte URLs/Kosten).
    const rawContext = searchParams.get("context")?.trim();
    if (rawContext) {
      return {
        seedQuestion: rawContext.slice(0, 2000),
        // Default-Profil (kein Onboarding) — der Chat rendert nur mit Profil,
        // und der Artikel-Kontext selbst trägt das Thema.
        profile: emptyProfile() satisfies UserProfile,
      };
    }
    return null;
  });

  const [phase, setPhase] = useState<Phase>(
    topicEntry ? "chat" : "welcome",
  );
  const [profile, setProfile] = useState<UserProfile | null>(
    topicEntry?.profile ?? null,
  );
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(
    INITIAL_ONBOARDING_STATE,
  );
  // Seed-Frage nur für den Deep-Link-Einstieg. Wird beim Reset und beim
  // Onboarding-Abschluss geleert, damit ein erneuter Chat-Einstieg keinen
  // weiteren Auto-Send (= LLM-Call) auslöst.
  const [autoSend, setAutoSend] = useState<string | undefined>(
    topicEntry?.seedQuestion,
  );
  const onboardingScrollRef = useRef<HTMLDivElement>(null);
  const onboardingStartedRef = useRef(false);

  // ─── Phase Handlers ──────────────────────────────────────
  const handleStartOnboarding = useCallback(() => {
    // Onboarding deaktiviert (Default) → direkt in den Chat mit Default-Profil.
    // Kein Auto-Send (Bea begrüßt normal); kein LLM-Call durch diesen Schritt.
    if (!ONBOARDING_ENABLED) {
      setProfile(emptyProfile());
      setAutoSend(undefined);
      setPhase("chat");
      return;
    }
    setPhase("onboarding");
    if (!onboardingStartedRef.current) {
      onboardingStartedRef.current = true;
      try {
        trackOnboardingStarted();
      } catch {
        // silent: tracking must never break UX
      }
    }
  }, []);

  const handleOnboardingFinish = useCallback((p: UserProfile) => {
    setProfile(p);
    setAutoSend(undefined); // Onboarding-Einstieg sendet nichts automatisch
    setPhase("chat");
  }, []);

  const handleOnboardingStateChange = useCallback(
    (state: OnboardingState) => {
      setOnboardingState(state);
    },
    [],
  );

  const handleChatReset = useCallback(() => {
    setProfile(null);
    setAutoSend(undefined); // kein erneuter Auto-Send nach Reset
    setOnboardingState(INITIAL_ONBOARDING_STATE);
    setPhase("welcome");
  }, []);

  // Reset onboarding scroll on step change
  useEffect(() => {
    if (phase !== "onboarding") return;
    onboardingScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase, onboardingState.stepIdx]);

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white">
      <BackToSiteButton />

      {phase === "welcome" && (
        <WelcomePhase onStartOnboarding={handleStartOnboarding} />
      )}

      {phase === "onboarding" && (
        <div
          ref={onboardingScrollRef}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto"
        >
          {!onboardingState.isComplete && (
            <div className="sticky top-0 z-10 border-b border-primaryOrange/10 bg-white/95 pb-2.5 pl-14 pr-4 pt-3 backdrop-blur sm:pl-40 md:pl-48 md:pr-6 md:pt-4">
              <div className="mx-auto w-full max-w-6xl">
                <OnboardingProgress
                  current={onboardingState.stepIdx}
                  total={onboardingState.total}
                />
              </div>
            </div>
          )}
          <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center py-4 sm:px-2 sm:py-6">
            <OnboardingFlow
              onFinish={handleOnboardingFinish}
              onStateChange={handleOnboardingStateChange}
            />
          </div>
        </div>
      )}

      {phase === "chat" && profile && (
        <ChatPhase
          profile={profile}
          onReset={handleChatReset}
          autoSend={autoSend}
        />
      )}
    </div>
  );
}

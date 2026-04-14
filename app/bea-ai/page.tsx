"use client";

// ─── BeaAIPage ────────────────────────────────────────────
// Slim three-phase orchestrator: welcome → onboarding → chat.
// All business logic and UI lives in extracted sub-components.

import { useCallback, useEffect, useRef, useState } from "react";

import OnboardingFlow from "@/components/bea-ai/OnboardingFlow";
import OnboardingProgress from "@/components/bea-ai/OnboardingProgress";
import WelcomePhase from "@/components/bea-ai/welcome/WelcomePhase";
import ChatPhase from "@/components/bea-ai/chat/ChatPhase";
import BackToSiteButton from "@/components/bea-ai/shared/BackToSiteButton";
import {
  TOTAL_STEPS,
  type UserProfile,
} from "@/lib/bea-ai/onboarding";
import {
  trackOnboardingStarted,
} from "@/lib/analytics";

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
  const [phase, setPhase] = useState<Phase>("welcome");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(
    INITIAL_ONBOARDING_STATE,
  );
  const onboardingScrollRef = useRef<HTMLDivElement>(null);
  const onboardingStartedRef = useRef(false);

  // ─── Phase Handlers ──────────────────────────────────────
  const handleStartOnboarding = useCallback(() => {
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
        <ChatPhase profile={profile} onReset={handleChatReset} />
      )}
    </div>
  );
}

"use client";

// ─── WelcomePhase ─────────────────────────────────────────
// Orchestrates the two welcome steps (greeting → disclaimer)
// before the user enters the onboarding flow.

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import WelcomeGreeting from "./WelcomeGreeting";
import WelcomeDisclaimer from "./WelcomeDisclaimer";
import WelcomeDecor from "./WelcomeDecor";

type WelcomeStep = "greeting" | "disclaimer";

interface Props {
  /** Called when the user completes both welcome steps and is ready
   *  to start the onboarding flow. */
  onStartOnboarding: () => void;
}

export default function WelcomePhase({ onStartOnboarding }: Props) {
  const [step, setStep] = useState<WelcomeStep>("greeting");

  const handleContinue = useCallback(() => setStep("disclaimer"), []);
  const handleBack = useCallback(() => setStep("greeting"), []);

  return (
    <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4">
      <WelcomeDecor />
      <AnimatePresence mode="wait">
        {step === "greeting" ? (
          <WelcomeGreeting onContinue={handleContinue} />
        ) : (
          <WelcomeDisclaimer
            onContinue={onStartOnboarding}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  STEP_ORDER,
  TOTAL_STEPS,
  emptyProfile,
  type StepId,
  type UserProfile,
} from "@/lib/bea-ai/onboarding";

// Steps
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import Step7 from "./steps/Step7";
import Step8 from "./steps/Step8";
import Step9 from "./steps/Step9";
import Step10 from "./steps/Step10";

// Complete
import OnboardingComplete from "./OnboardingComplete";

interface OnboardingFlowProps {
  /** Called once the user finishes the completion reveal and wants to chat. */
  onFinish: (profile: UserProfile) => void;
  /**
   * Fires whenever the current step or completion state changes.
   * Use this to render the progress indicator in the parent header
   * instead of a duplicate bar inside the flow.
   */
  onStateChange?: (state: {
    stepIdx: number;
    total: number;
    isComplete: boolean;
  }) => void;
}

/**
 * The top-level orchestrator for the Bea AI onboarding journey.
 *
 * Renders only the step content + transitions. Progress UI is delegated to
 * the parent via `onStateChange` so it can live in the global header bar.
 */
export default function OnboardingFlow({
  onFinish,
  onStateChange,
}: OnboardingFlowProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [isComplete, setIsComplete] = useState(false);

  const currentStepId: StepId | undefined = STEP_ORDER[stepIdx];

  // Notify parent of state changes — used for header progress UI
  useEffect(() => {
    onStateChange?.({ stepIdx, total: TOTAL_STEPS, isComplete });
  }, [stepIdx, isComplete, onStateChange]);

  // Advance to the next step
  const advance = useCallback(() => {
    if (stepIdx + 1 >= TOTAL_STEPS) {
      setIsComplete(true);
    } else {
      setStepIdx(stepIdx + 1);
    }
  }, [stepIdx]);

  // Typed setters per step. Each updates the profile AND advances.
  const handleLifeSituation = useCallback(
    (id: string) => {
      setProfile((p) => ({ ...p, lebenssituation: id }));
      advance();
    },
    [advance],
  );

  const handleAge = useCallback(
    (age: number) => {
      setProfile((p) => ({ ...p, alter: age }));
      advance();
    },
    [advance],
  );

  const handleMoneyFeeling = useCallback(
    (id: "freiheit" | "stress") => {
      setProfile((p) => ({ ...p, geldgefuehl: id }));
      advance();
    },
    [advance],
  );

  const handleSelfRating = useCallback(
    (level: number) => {
      setProfile((p) => ({ ...p, wissensstand: level }));
      advance();
    },
    [advance],
  );

  const handleKnowledgeQuiz = useCallback(
    (answerId: string, correct: boolean) => {
      setProfile((p) => ({
        ...p,
        wissenstest: { answerId, correct },
      }));
      advance();
    },
    [advance],
  );

  const handlePriorities = useCallback(
    (priorities: string[]) => {
      setProfile((p) => ({ ...p, prioritaeten: priorities }));
      advance();
    },
    [advance],
  );

  const handleScenario = useCallback(
    (insight: string) => {
      setProfile((p) => ({ ...p, szenarioInsight: insight }));
      advance();
    },
    [advance],
  );

  const handleSaving = useCallback(
    (percent: number) => {
      setProfile((p) => ({ ...p, sparverhaltenProzent: percent }));
      advance();
    },
    [advance],
  );

  const handlePersonality = useCallback(
    (answers: Record<string, boolean>) => {
      setProfile((p) => ({ ...p, persoenlichkeit: answers }));
      advance();
    },
    [advance],
  );

  const handleGoal = useCallback(
    (goal: string) => {
      setProfile((p) => ({ ...p, ziel: goal }));
      advance();
    },
    [advance],
  );

  const handleStartChat = useCallback(() => {
    onFinish(profile);
  }, [profile, onFinish]);

  // ─── Render ─────────────────────────────────────────────
  return (
    <AnimatePresence mode="wait">
      {isComplete ? (
        <motion.div
          key="complete"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-full"
        >
          <OnboardingComplete profile={profile} onStartChat={handleStartChat} />
        </motion.div>
      ) : (
        <motion.div
          key={currentStepId}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="min-h-full"
        >
          {currentStepId === "lebenssituation" && (
            <Step1 onSelect={handleLifeSituation} />
          )}
          {currentStepId === "alter" && <Step2 onSelect={handleAge} />}
          {currentStepId === "geldgefuehl" && (
            <Step3 onSelect={handleMoneyFeeling} />
          )}
          {currentStepId === "wissensstand" && (
            <Step4 onSelect={handleSelfRating} />
          )}
          {currentStepId === "wissenstest" && (
            <Step5 onSelect={handleKnowledgeQuiz} />
          )}
          {currentStepId === "prioritaeten" && (
            <Step6 onSelect={handlePriorities} />
          )}
          {currentStepId === "szenario" && <Step7 onSelect={handleScenario} />}
          {currentStepId === "sparverhalten" && (
            <Step8 onSelect={handleSaving} />
          )}
          {currentStepId === "persoenlichkeit" && (
            <Step9 onSelect={handlePersonality} />
          )}
          {currentStepId === "ziel" && <Step10 onSelect={handleGoal} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

// IMPORTS
import type { ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// ANALYTICS
import {
  trackOnboardingStarted,
  trackStepViewed,
  trackStepCompleted,
  trackStepAbandoned,
  trackOnboardingCompleted,
} from "@/lib/analytics";
// LIB
import {
  STEP_ORDER,
  TOTAL_STEPS,
  emptyProfile,
  type StepId,
  type LifeValue,
  type UserProfile,
  type MoneyFeeling,
  type BehaviorBias,
} from "@/lib/bea-ai/onboarding";
// STEPS
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
import Step11 from "./steps/Step11";
import Step12 from "./steps/Step12";
// CUSTOM COMPONENTS
import OnboardingComplete from "./OnboardingComplete";

// TYPES
interface OnboardingFlowProps {
  onFinish: (profile: UserProfile) => void;
  onNewsletterSubmit?: (
    email: string,
    profile: UserProfile,
  ) => Promise<void> | void;
  onStateChange?: (state: {
    stepIdx: number;
    total: number;
    isComplete: boolean;
  }) => void;
}
/**
 * A step definition pairs a StepId with the React component that renders
 * it AND a profile-merge function describing what the step contributes.
 */
interface StepDefinition {
  id: StepId;
  Component: ComponentType<{ onSelect: (...args: never[]) => void }>;
  toProfilePatch: (...args: never[]) => Partial<UserProfile>;
}
// STEP CONFIGURATION
const STEP_DEFINITIONS: readonly StepDefinition[] = [
  {
    id: "lebenssituation",
    Component: Step1 as StepDefinition["Component"],
    toProfilePatch: (id: string) => ({ lebenssituation: id }),
  },
  {
    id: "alter",
    Component: Step2 as StepDefinition["Component"],
    toProfilePatch: (age: number) => ({ alter: age }),
  },
  {
    id: "wohnsituation",
    Component: Step3 as StepDefinition["Component"],
    toProfilePatch: (id: string) => ({ wohnsituation: id }),
  },
  {
    id: "einkommen",
    Component: Step4 as StepDefinition["Component"],
    toProfilePatch: (id: string) => ({ einkommensRange: id }),
  },
  {
    id: "schulden",
    Component: Step5 as StepDefinition["Component"],
    toProfilePatch: (debtId: string) => ({
      schuldenOptionId: debtId,
      hatSchulden: debtId !== "" && debtId !== "debt_none",
    }),
  },
  {
    id: "zeithorizont",
    Component: Step6 as StepDefinition["Component"],
    toProfilePatch: (id: string) => ({ zeithorizont: id }),
  },
  {
    id: "prioritaeten",
    Component: Step7 as StepDefinition["Component"],
    toProfilePatch: (priorities: string[]) => ({ prioritaeten: priorities }),
  },
  {
    id: "wissenstest",
    Component: Step8 as StepDefinition["Component"],
    toProfilePatch: (correctCount: number, answeredIds: string[]) => ({
      wissenstest: { correctCount, answeredIds },
    }),
  },
  {
    id: "szenario",
    Component: Step9 as StepDefinition["Component"],
    toProfilePatch: (windfallBias: BehaviorBias, crisisBias: BehaviorBias) => ({
      szenario: { windfallBias, crisisBias },
    }),
  },
  {
    id: "persoenlichkeit",
    Component: Step10 as StepDefinition["Component"],
    toProfilePatch: (answers: Record<string, boolean>) => ({
      persoenlichkeit: answers,
    }),
  },
  {
    id: "geldgefuehl",
    Component: Step11 as StepDefinition["Component"],
    toProfilePatch: (feeling: MoneyFeeling, praegung: string) => ({
      geldgefuehl: feeling,
      geldpraegung: praegung,
    }),
  },
  {
    id: "zielbild",
    Component: Step12 as StepDefinition["Component"],
    toProfilePatch: (zielbild: string, lebenswerte: LifeValue[]) => ({
      zielbild,
      lebenswerte: lebenswerte ?? [],
    }),
  },
] as const;

// CONSTANTS
const STEP_TRANSITION = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
} as const;
const COMPLETE_TRANSITION = {
  duration: 0.5,
} as const;
const STEP_EXIT = { opacity: 0, y: -24 } as const;
const STEP_ANIMATE = { opacity: 1, y: 0 } as const;
const STEP_INITIAL = { opacity: 0, y: 24 } as const;

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Top-level orchestrator for the Bea AI onboarding journey.
 *
 * Renders 12 sequential steps then a completion reveal.
 * Each step is config-driven via STEP_DEFINITIONS — adding a new step
 * means one entry, no handler or render code.
 *
 * Progress UI is delegated to the parent via onStateChange so the
 * progress bar can live in the global header instead of duplicating here.
 *
 * Edit-from-complete: when the user clicks an edit button in
 * OnboardingComplete, handleEditStep jumps back to the requested step
 * and re-enters the flow. After re-answering, they advance back through
 * any remaining steps (or directly to complete if it was the last step).
 */
export default function OnboardingFlow({
  onFinish,
  onStateChange,
  onNewsletterSubmit,
}: OnboardingFlowProps) {
  // STATE
  const [stepIdx, setStepIdx] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  // ANALYTICS — timing refs for duration measurements
  const onboardingStartRef = useRef<number>(Date.now());
  const stepStartRef = useRef<number>(Date.now());
  // CONSTANTS
  const currentDefinition = useMemo(
    () => STEP_DEFINITIONS[stepIdx] ?? null,
    [stepIdx],
  );
  // FUNCTIONS
  // Single advance function — replaces 12 individual handlers
  const advance = useCallback(() => {
    setStepIdx((prev) => {
      const next = prev + 1;
      if (next >= TOTAL_STEPS) {
        setIsComplete(true);
        return prev;
      }
      return next;
    });
  }, []);
  // Generic handler — closes over the current step's patch function.
  const handleStepSelect = useCallback(
    (...args: never[]) => {
      const definition = STEP_DEFINITIONS[stepIdx];
      if (!definition) return;
      const patch = definition.toProfilePatch(...args);
      // ANALYTICS — step completed
      const duration = Date.now() - stepStartRef.current;
      trackStepCompleted(
        definition.id,
        stepIdx,
        duration,
        patch as Record<string, unknown>,
      );
      setProfile((prev) => ({ ...prev, ...patch }));
      advance();
    },
    [stepIdx, advance],
  );
  // Edit-from-complete: jump back to a specific step
  const handleEditStep = useCallback((targetStepId: StepId) => {
    const targetIdx = STEP_ORDER.indexOf(targetStepId);
    if (targetIdx >= 0) {
      setStepIdx(targetIdx);
      setIsComplete(false);
    }
  }, []);
  // Newsletter submission proxy
  const handleNewsletterSubmit = useCallback(
    async (email: string) => {
      if (onNewsletterSubmit) {
        await onNewsletterSubmit(email, profile);
        return;
      }

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Newsletter submit failed");
      }
    },
    [onNewsletterSubmit, profile],
  );
  const handleStartChat = useCallback(() => {
    onFinish(profile);
  }, [profile, onFinish]);
  // USE EFFECT
  useEffect(() => {
    onStateChange?.({ stepIdx, total: TOTAL_STEPS, isComplete });
  }, [stepIdx, isComplete, onStateChange]);

  // ANALYTICS — onboarding.started beim ersten Mount
  useEffect(() => {
    trackOnboardingStarted();
    onboardingStartRef.current = Date.now();
    // Cleanup: wenn User die Seite verlässt, ohne abgeschlossen zu haben
    const handleBeforeUnload = () => {
      if (!isComplete) {
        const def = STEP_DEFINITIONS[stepIdx];
        if (def) {
          trackStepAbandoned(
            def.id,
            stepIdx,
            Date.now() - stepStartRef.current,
          );
        }
      }
    };
    window.addEventListener("pagehide", handleBeforeUnload);
    return () => {
      window.removeEventListener("pagehide", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ANALYTICS — step.viewed bei jedem Step-Wechsel
  useEffect(() => {
    if (isComplete) return;
    const def = STEP_DEFINITIONS[stepIdx];
    if (!def) return;
    stepStartRef.current = Date.now();
    trackStepViewed(def.id, stepIdx);
  }, [stepIdx, isComplete]);

  // ANALYTICS — onboarding.completed
  useEffect(() => {
    if (!isComplete) return;
    const totalDuration = Date.now() - onboardingStartRef.current;
    trackOnboardingCompleted(profile, totalDuration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  // Validate STEP_DEFINITIONS matches STEP_ORDER at render time.
  if (
    process.env.NODE_ENV !== "production" &&
    STEP_DEFINITIONS.length !== STEP_ORDER.length
  ) {
    console.warn(
      `OnboardingFlow: STEP_DEFINITIONS has ${STEP_DEFINITIONS.length} entries ` +
        `but STEP_ORDER has ${STEP_ORDER.length}. They must match.`,
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isComplete ? (
        <motion.div
          key="complete"
          exit={{ opacity: 0 }}
          className="min-h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={COMPLETE_TRANSITION}
        >
          <OnboardingComplete
            profile={profile}
            onEditStep={handleEditStep}
            onStartChat={handleStartChat}
            onNewsletterSubmit={handleNewsletterSubmit}
          />
        </motion.div>
      ) : currentDefinition ? (
        <motion.div
          exit={STEP_EXIT}
          className="min-h-full"
          initial={STEP_INITIAL}
          animate={STEP_ANIMATE}
          key={currentDefinition.id}
          transition={STEP_TRANSITION}
        >
          <currentDefinition.Component onSelect={handleStepSelect} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

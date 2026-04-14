"use client";

// ─── BeaCardRenderer ──────────────────────────────────────
// Dispatcher: maps a BeaCard discriminator to the right component.
// All cards share the same indented column position (after avatar gap).

import WelcomeCard from "./WelcomeCard";
import BetaAccessCardInline from "./BetaAccessCardInline";
import RatgeberCard from "./RatgeberCard";
import RechnerCard from "./RechnerCard";
import QuickPollCard from "./QuickPollCard";
import MilestoneCard from "./MilestoneCard";
import type { BeaCard } from "@/lib/bea-ai/chat/chatTypes";

interface Props {
  card: BeaCard;
  /**
   * Generic event channel for cards. Action ID is card-specific:
   *   "welcome.quickStart" → payload: prompt string
   *   "beta_access.accept" / "beta_access.dismiss"
   *   "rechner.result" → payload: number
   *   "quick_poll.answer" → payload: option value
   */
  onAction?: (action: string, payload?: unknown) => void;
}

export default function BeaCardRenderer({ card, onAction }: Props) {
  // Bea-Card-Lane: indented to align with message content (past avatar)
  const wrap = (children: React.ReactNode) => (
    <div className="flex gap-2.5">
      <div className="h-8 w-8 shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  );

  switch (card.type) {
    case "welcome":
      return wrap(
        <WelcomeCard
          userProfile={card.userProfile}
          insights={card.insights}
          onQuickStart={(prompt) => onAction?.("welcome.quickStart", prompt)}
        />,
      );
    case "beta_access":
      return wrap(
        <BetaAccessCardInline
          onAccept={() => onAction?.("beta_access.accept")}
          onDismiss={() => onAction?.("beta_access.dismiss")}
        />,
      );
    case "ratgeber":
      return wrap(
        <RatgeberCard
          slug={card.slug}
          title={card.title}
          description={card.description}
        />,
      );
    case "rechner":
      return wrap(
        <RechnerCard
          rechnerType={card.rechnerType}
          onResult={(value) => onAction?.("rechner.result", value)}
        />,
      );
    case "quick_poll":
      return wrap(
        <QuickPollCard
          question={card.question}
          options={card.options}
          onAnswer={(value) => onAction?.("quick_poll.answer", value)}
        />,
      );
    case "milestone":
      return wrap(
        <MilestoneCard
          milestone={card.milestone}
          description={card.description}
        />,
      );
  }
}

---
name: beafox-code-style
description: BeAFox's code organization and structure conventions for TypeScript and React files. Use this skill WHENEVER Claude writes a new `.tsx`/`.ts` file, edits an existing one, refactors, cleans up imports, or organizes code in the BeAFox website repo — even if the user doesn't explicitly ask for "style" or "cleanup". It applies to React components (pages, sections, subcomponents), hooks, utilities, `lib/` modules, and Next.js API routes (`route.ts`). Covers import grouping with comment headers, ordering of TYPES/CONSTANTS/STYLE CONSTANTS/HELPERS/SUBCOMPONENTS, style-constant naming with `as const`, JSX section markers, and the in-component ordering of HOOKS → STATES → CONSTANTS → FUNCTIONS → return. If you are touching `.tsx` or `.ts` in this project, you should be using this skill.
---

# BeAFox Code Style & Structure

Alex has very specific, consistent code-organization conventions across the BeAFox codebase. The goal of this skill is to make every new or edited file feel like it was written by him: imports grouped under labelled banners, top-level sections (types, constants, style constants, helpers, subcomponents, main export) in a fixed order, and a predictable internal shape inside each main component (hooks → states → constants → functions → return).

This skill is triggered for **any** TypeScript or TSX work in the BeAFox webseite repo. Don't wait for the user to ask for "cleanup" — the moment you open, create, or modify a `.tsx`/`.ts` file, think about whether it matches the layout below. If you are *adding* code to an existing file, keep the same structure and put new imports/constants/helpers in the right section rather than appending at the bottom.

## Why this structure exists

Alex scans files top-to-bottom and expects to find things in the same place every time. A file that's "correct behaviorally but messy structurally" forces him to re-read it and reorganize by hand. The banners aren't decoration — they're a table of contents. Keeping them consistent means the cost of navigating any file in the repo stays low as it grows.

## File-level order

Every `.tsx` / `.ts` file in this repo follows this top-to-bottom order. Skip sections that would be empty (pragmatic approach — don't emit an empty `// TYPES` header just to fill the slot). Sections that are present must be in this order and use these exact banner comments:

1. `"use client";` directive (client components and hooks only — omit for server components, server actions, and pure utilities)
2. **Imports**, grouped and banner-commented (see *Imports* below)
3. `// TYPES` — interfaces and type aliases used in this file
4. `// CONSTANTS` — data constants (URLs, arrays, Records, config objects)
5. `// STYLE CONSTANTS` — inline-style objects typed with `as const`
6. `// HELPERS FUNCTIONS` — pure functions (data builders, formatters, small utilities) used only in this file
7. `// SUBCOMPONENTS` — small React sub-components used only in this file, each with its Props interface directly above it
8. `// <COMPONENT_NAME>` — a banner comment right before the default export (e.g. `// HOMEPAGE`, `// FAQ_ACCORDION`, `// USE_ANALYTICS`)
9. The default export itself

For hooks, utilities, and API routes the banners map 1:1 — just skip the ones that don't apply. A hook file typically has `// TYPES` → `// CONSTANTS` → `// HELPERS FUNCTIONS` → `// <HOOK_NAME>` (the exported hook). An API route typically has `// TYPES` → `// CONSTANTS` → `// HELPERS FUNCTIONS` → the `GET`/`POST`/etc. exports (banner them as `// GET`, `// POST`, etc.).

## Imports

Imports are grouped by *role*, each group preceded by a banner comment. Use this exact set of banners, in this order, and only include the ones you actually use:

```
// STANDARD COMPONENTS   — Next.js primitives: Link, Image, dynamic, Script, etc.
// CUSTOM COMPONENTS     — anything from @/components/*
// DYNAMIC COMPONENTS    — const Foo = dynamic(() => import("@/components/..."));
// IMPORTS               — libraries + React hooks/types (next-intl, framer-motion, react, zod, etc.)
// ICONS                 — lucide-react icon imports
```

**Within each group, sort imports by line length, ascending** (shortest first). This is a visual ordering — it gives the import block a staircase shape that makes it easy to scan.

If a group would be empty, omit its banner entirely. Do not reorder groups. Use `import { type Foo } from "..."` or `import { ..., type Foo } from "..."` for type-only named imports — the `type` keyword goes inline, not on a separate `import type` line, unless the whole line is type-only.

**Example:**

```tsx
"use client";

// STANDARD COMPONENTS
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
// CUSTOM COMPONENTS
import Button from "@/components/Button";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
// DYNAMIC COMPONENTS
const FaqAccordion = dynamic(() => import("@/components/FaqAccordion"));
const DownloadModal = dynamic(() => import("@/components/DownloadModal"));
// IMPORTS
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, type ReactNode } from "react";
// ICONS
import { Check, ArrowRight, Sparkles } from "lucide-react";
```

## Types

`// TYPES` is a single block. Interfaces and type aliases sit together with no blank lines between them when they're short. Prefer `interface` for object shapes that describe component props or domain entities, and `type` for unions, intersections, or utility aliases. Interface names for component props follow `<ComponentName>Props` — e.g. `ProblemCardProps`, `StoreButtonProps`.

```tsx
// TYPES
interface UseCase {
  id: string;
  href: string;
  mascot: string;
  mascotAlt: string;
}
interface TrustLogo {
  src: string;
  alt: string;
}
```

Fields inside an interface should also be sorted by length, ascending, when the order is not semantically meaningful. If the interface has a natural semantic order (e.g. step-1, step-2), keep that order instead — consistency with meaning beats consistency with shape.

## Constants

`// CONSTANTS` holds all file-local data that doesn't change: URLs, tuples of config objects, Record lookups, etc. Name constants in `SCREAMING_SNAKE_CASE`. Type any array of objects as `readonly <T>[]` and terminate its literal with `as const` so TypeScript infers the narrowest possible type:

```tsx
// CONSTANTS
const APP_STORE_URL = "https://apps.apple.com/de/app/beafox/id6746110612";
const USE_CASES: readonly UseCase[] = [
  {
    id: "business",
    href: "/unternehmen",
    mascotAlt: "BeAFox für Unternehmen",
    mascot: "/Maskottchen/Maskottchen-Business.webp",
  },
] as const;
```

If the file has a large block of structured-data / JSON-LD constants, you may optionally group them under a sub-banner `// STRUCTURED DATA` inside the `// CONSTANTS` section to signal "these belong together but are a different kind of thing".

## Style constants

`// STYLE CONSTANTS` is where all inline-style objects live. Never inline a style object into JSX (`style={{ background: "..." }}`) if it's non-trivial — extract it to a constant and reference it by name. Rules:

- Name ends in `_STYLE` (e.g. `PROBLEM_CARD_STYLE`, `CTA_PATTERN_STYLE`)
- Always typed with `as const`
- Short, descriptive names that identify *where* the style is used, not just *what* it does — `PROBLEM_CARD_STYLE` beats `CARD_STYLE` when a file has several card styles
- Reusable color/gradient tokens live above their consumers as plain string constants (e.g. `const ORANGE_GRADIENT = "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)";`) so multiple `_STYLE` constants can reference them

```tsx
// STYLE CONSTANTS
const CHECK_BULLET_STYLE = {
  background: ORANGE_GRADIENT,
  boxShadow: "0 2px 6px rgba(232,119,32,0.3)",
} as const;
const MOCKUP_SHADOW_STYLE = {
  filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.16))",
} as const;
```

Prefer Tailwind classes for anything Tailwind can express. Drop into `_STYLE` constants only for gradients, box-shadows, custom radial/linear backgrounds, `backdrop-filter`, or anything Tailwind's arbitrary-value syntax would make unreadable.

## Helper functions

`// HELPERS FUNCTIONS` (note the plural — that's Alex's banner, don't "correct" it to `HELPER FUNCTIONS`) is for pure functions that belong only to this file. Good candidates: data-shape builders, small formatters, "highlight-this-substring" helpers. They go above the subcomponents so subcomponents can reference them without forward-declaration gymnastics.

Each helper is a regular `function` declaration (not `const foo = () =>`). Keep them short; if one grows beyond ~25 lines consider extracting it to `lib/`.

## Subcomponents

`// SUBCOMPONENTS` holds small React components used only in this file. Each has its Props interface *directly above* it, separated by a blank line between pairs:

```tsx
// SUBCOMPONENTS
function BenefitListItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      ...
    </li>
  );
}

interface ProblemCardProps {
  text: string;
  title: string;
  mascot: string;
  paddingClass?: string;
}
function ProblemCard({ text, title, mascot, paddingClass = "p-6 md:p-7" }: ProblemCardProps) {
  return ( ... );
}
```

When a subcomponent grows past ~60 lines or gets reused in a second file, promote it to its own file under `@/components/`.

## The main component

The main (default-exported) component gets its own banner comment right before it — `// HOMEPAGE`, `// FAQ_ACCORDION`, `// USE_ANALYTICS`, etc. — so the "this is the file's headline export" is unambiguous at a glance.

Inside the component body, the statements are grouped with **inline banner comments** in this exact order:

```tsx
export default function HomePage() {
  // HOOKS
  const locale = useLocale();
  const t = useTranslations("home");
  // STATES
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  // CONSTANTS
  const faqItems = t.raw("faqSection.items") as FaqAccordionItem[];
  const activeFeature = APP_FEATURES[selectedFeature];
  // FUNCTIONS
  const openDownloadModal = useCallback(() => setIsDownloadModalOpen(true), []);
  const closeDownloadModal = useCallback(() => setIsDownloadModalOpen(false), []);

  return ( ... );
}
```

Rules for the inner sections:

- `// HOOKS` — framework/third-party hooks (`useLocale`, `useTranslations`, `useRouter`, `useConsent`, custom hooks from `@/hooks`). NOT React state hooks.
- `// STATES` — `useState` / `useReducer` declarations only. If there are none, skip the banner.
- `// CONSTANTS` — derived values from translations, props, or state (including memoized arrays via `useMemo`). These are the "computed" inputs to the JSX.
- `// FUNCTIONS` — `useCallback` handlers and small inline callbacks. If there are none, skip the banner. `useEffect` blocks also belong here, after the `useCallback` handlers, because they're conceptually "behavior".

Pragmatic rule: **skip any of the four banners whose section would be empty**. A tiny component with one state and no callbacks only needs `// STATES`, not four headers with empty sections beneath them. But once a banner is present, the others that have content above it must be present too — the order is fixed.

## JSX section markers

Inside the `return` of a page-level component with multiple sections, mark each logical section with a box-drawing-character banner and a number:

```tsx
return (
  <>
    {/* ─── 1. HERO ─── */}
    <LandingHero ... />

    {/* ─── 2. SOLUTION SECTION ─── */}
    <Section ...>...</Section>

    {/* ─── 3. PROBLEM SECTION ─── */}
    <Section ...>...</Section>

    {/* MODALS + STICKY */}
    <DownloadModal ... />
    <StickyMobileCTA />

    {/* STRUCTURED DATA */}
    <StructuredData id="faq" data={FAQ_STRUCTURED_DATA} />
  </>
);
```

The numbered banners (`─── N. TITLE ───`) are for the *visible page flow*. Trailing utility blocks (modals, sticky CTAs, `<StructuredData>` tags) get un-numbered banners because they're not part of the flow but it's still useful to separate them visually.

For smaller components (e.g. a subcomponent or a section component), section banners are usually not needed — one return value, one logical block.

## Accessibility & JSX conventions

These are consistent across the codebase and should be applied whenever you write JSX:

- Decorative `<div>`s, blobs, ambient glows, and purely visual overlays get `aria-hidden="true"`
- Decorative `<Image>` (pure decoration, e.g. background mascots) gets `alt=""` AND `aria-hidden="true"`
- Icons (lucide-react) inside buttons/links get `aria-hidden="true"` — the surrounding text is the accessible name
- `role="tablist"` / `role="tab"` / `role="tabpanel"` + `aria-controls` / `aria-selected` / `aria-label` for tab UIs
- `<motion.div whileInView>` sections use `viewport={{ once: true }}` — animations fire once, not every scroll

## Destructuring and prop ordering

When destructuring props in a subcomponent signature, prefer listing them in the same order as the Props interface (which is itself length-ascending for non-semantic fields). Optional props go last. When destructuring is too long for one line, break each prop onto its own line and trailing-comma the last one.

## What NOT to do

- Don't emit empty banners (`// STATES` followed by nothing). If the section is empty, leave the banner out.
- Don't reorder banners to your own preference. The order is *fixed* because it's load-bearing for navigation.
- Don't append new imports at the end of the imports block — put them in the correct group (and re-sort the group by line length).
- Don't use default arrow-function exports for the main component. Use `export default function Name() { ... }` — the name shows up in React DevTools.
- Don't inline non-trivial style objects. Extract to `// STYLE CONSTANTS`.
- Don't split banners across files in ways that break the "one file = one default export + its locals" model. If a subcomponent is getting its own types and constants, that's a signal to promote it to its own file.

## When the file is too small to need structure

Some files really are just a few lines — a type alias, a tiny hook wrapper, a three-line component. In those cases, the banner machinery is overhead. The rule of thumb: if the file has only **one or two top-level declarations and no sections would have content**, skip the banners entirely. Still group the imports though — that's cheap and worth the consistency even in tiny files.

## When you're editing, not writing

When editing an existing file that already follows this structure: add your new code inside the correct banner section, not at the end of the file. If you're touching a file that does *not* follow this structure yet, mention it to the user and offer to reorganize — don't silently rewrite the whole file unless they asked. For small edits (one-line fixes), match the surrounding style and don't restructure.

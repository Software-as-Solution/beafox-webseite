"use client";

// ─── BackToSiteButton ─────────────────────────────────────
// Floating "back to homepage" pill, always visible across all
// chat phases. Mobile: icon-only. Desktop: pill with text.

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackToSiteButton() {
  return (
    <Link
      href="/"
      aria-label="Zurück zur BeAFox-Startseite"
      title="Zur Startseite"
      className="mt-2 group absolute left-3 top-3 z-30 inline-flex h-8 w-8 items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white/85 text-darkerGray shadow-sm backdrop-blur transition-all duration-200 hover:border-primaryOrange/40 hover:bg-white hover:text-primaryOrange sm:h-11 sm:w-auto sm:pl-3 sm:pr-4 sm:text-sm sm:font-semibold md:left-5 md:top-5"
    >
      <ArrowLeft
        className="h-[18px] w-[18px] transition-transform duration-200 group-hover:-translate-x-0.5"
        strokeWidth={2.4}
      />
      <span className="hidden sm:inline">Zur Startseite</span>
    </Link>
  );
}

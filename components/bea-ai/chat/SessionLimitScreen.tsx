"use client";

// ─── SessionLimitScreen ───────────────────────────────────
// Shown when the chat hits the per-session message limit.

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Plus } from "lucide-react";

interface Props {
  onReset: () => void;
}

export default function SessionLimitScreen({ onReset }: Props) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.95 }}
      className="mx-auto my-6 flex max-w-md flex-col items-center rounded-2xl border border-primaryOrange/20 bg-gradient-to-b from-white to-orange-50/50 p-6 text-center sm:my-8 sm:p-8"
    >
      <div className="relative mb-4 h-20 w-20 sm:mb-5 sm:h-24 sm:w-24">
        <Image
          fill
          alt="Bea mit Herzen"
          className="object-contain"
          src="/Maskottchen/Maskottchen-Herzen.webp"
        />
      </div>
      <h3 className="mb-2 text-lg font-bold text-darkerGray">
        Das war&apos;s für die Demo!
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-lightGray">
        In der BeAFox App kannst du unbegrenzt mit mir quatschen — und ich
        kenne dort deinen Fortschritt, deine Ziele und deinen Lernpfad.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="https://apps.apple.com/de/app/beafox/id6746110612"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #E87720, #F08A3C)",
          }}
        >
          <Download className="h-4 w-4" />
          App laden
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-darkerGray transition-colors hover:border-primaryOrange/40 hover:text-primaryOrange"
        >
          <Plus className="h-4 w-4" />
          Neuer Chat
        </button>
      </div>
    </motion.div>
  );
}

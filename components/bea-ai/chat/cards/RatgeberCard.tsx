"use client";

// ─── RatgeberCard ─────────────────────────────────────────
// Placeholder card linking to a Ratgeber-Artikel. Phase-1 stub.

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// STYLES
const CARD_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFFAF5 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 4px 16px rgba(232,119,32,0.08)",
} as const;

interface Props {
  slug: string;
  title: string;
  description: string;
}

export default function RatgeberCard({ slug, title, description }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={CARD_STYLE}
      className="mx-auto w-full max-w-[85%] overflow-hidden rounded-3xl rounded-bl-md p-5 md:max-w-[68%] md:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 md:h-14 md:w-14">
          <Image
            src="/Maskottchen/Maskottchen-Ratgeber.webp"
            alt="Ratgeber"
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primaryOrange">
            Ratgeber
          </span>
          <h3 className="mt-0.5 text-base font-black leading-tight text-darkerGray md:text-lg">
            {title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-lightGray md:text-sm">
            {description}
          </p>
        </div>
      </div>
      <Link
        href={`/ratgeber/${slug}`}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primaryOrange/10 px-4 py-2 text-xs font-bold text-primaryOrange transition-colors hover:bg-primaryOrange hover:text-white md:text-sm"
      >
        Zum Ratgeber
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </motion.div>
  );
}

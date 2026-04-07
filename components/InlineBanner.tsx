// CUSTOM COMPONENTS
import Link from "next/link";
import Image from "next/image";
// ICONS
import { ArrowRight } from "lucide-react";
// TYPES
import type { ReactNode } from "react";

// TYPES
export interface InlineBannerProps {
  title: string;
  ctaHref: string;
  ctaLabel: string;
  external?: boolean;
  description: string;
  children?: ReactNode;
  mascotSrc?: string;
  variant?: "primary" | "subtle" | "partner";
}
// CONSTANTS
const VARIANT_STYLES = {
  primary: {
    background:
      "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
    border: "2px solid rgba(232,119,32,0.25)",
    boxShadow: "0 8px 24px rgba(232,119,32,0.06)",
  },
  subtle: {
    background: "rgba(232,119,32,0.04)",
    border: "1px solid rgba(232,119,32,0.15)",
    boxShadow: "none",
  },
  partner: {
    background: "linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)",
    border: "2px dashed rgba(232,119,32,0.3)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },
} as const;
const DEFAULT_MASCOT_SRC = "/Maskottchen/Maskottchen-Hero.webp";

export default function InlineBanner({
  title,
  ctaHref,
  ctaLabel,
  external,
  children,
  description,
  variant = "primary",
  mascotSrc = DEFAULT_MASCOT_SRC,
}: InlineBannerProps) {
  // CONSTANTS
  const isExternal = external ?? /^https?:\/\//.test(ctaHref);
  const style = VARIANT_STYLES[variant];
  const linkProps = isExternal
    ? { href: ctaHref, target: "_blank", rel: "noopener noreferrer" }
    : { href: ctaHref };
  const LinkComponent = isExternal ? "a" : Link;

  return (
    <div
      style={style}
      className="relative overflow-hidden rounded-2xl p-6 md:p-8 my-8 sm:my-12"
    >
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(232,119,32,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 flex items-center gap-5 md:gap-6">
        <Image
          width={120}
          height={120}
          src={mascotSrc}
          aria-hidden="true"
          alt="Bea Maskottchen"
          style={{ filter: "drop-shadow(0 6px 12px rgba(232,119,32,0.15))" }}
          className="object-contain w-16 h-16 md:w-24 md:h-24 flex-shrink-0 scale-150"
        />
        <div className="flex-1 min-w-0 max-w-3xl">
          <h3 className="text-lg md:text-xl font-bold text-darkerGray mb-3">
            {title}
          </h3>
          <p className="text-sm md:text-base text-darkerGray leading-relaxed mb-5">
            {description}
          </p>
          {children}
          <LinkComponent
            {...linkProps}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primaryOrange text-white rounded-xl font-semibold text-sm md:text-base hover:bg-primaryOrange/90 transition-all shadow-sm shadow-primaryOrange/25"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </LinkComponent>
        </div>
      </div>
    </div>
  );
}

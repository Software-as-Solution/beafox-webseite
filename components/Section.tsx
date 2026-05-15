// IMPORTS
import { type Ref } from "react";

// TYPES
type SectionTag = "section" | "aside" | "article" | "div";
type SectionWidth = "default" | "narrow" | "wide" | "full";
interface SectionProps {
  id?: string;
  as?: SectionTag;
  className?: string;
  ariaLabel?: string;
  /** Prefer over `ariaLabel` when a visible heading exposes the accessible name (e.g. hero). */
  ariaLabelledBy?: string;
  /** When false, omits default `py-10 md:py-12` (use for loaders, heroes, asymmetric spacing). */
  defaultPadding?: boolean;
  width?: SectionWidth;
  noContainer?: boolean;
  children: React.ReactNode;
  sectionRef?: Ref<HTMLElement>;
}
// CONSTANTS
const BASE_STYLES = "py-10 md:py-12";
const CONTAINER_BASE = "mx-auto px-4 sm:px-6 lg:px-8";
const WIDTH_STYLES: Record<SectionWidth, string> = {
  full: "w-full",
  wide: "max-w-7xl",
  narrow: "max-w-4xl",
  default: "container",
};

export default function Section({
  id,
  children,
  ariaLabel,
  ariaLabelledBy,
  defaultPadding = true,
  sectionRef,
  className = "",
  width = "default",
  as: Tag = "section",
  noContainer = false,
}: SectionProps) {
  // CONSTANTS
  const sectionClassName = defaultPadding
    ? `${BASE_STYLES} ${className}`
    : className;
  const labelledProps =
    ariaLabelledBy !== undefined
      ? { "aria-labelledby": ariaLabelledBy }
      : ariaLabel !== undefined
        ? { "aria-label": ariaLabel }
        : {};
  const containerClassName = `${WIDTH_STYLES[width]} ${CONTAINER_BASE}`;
  // FUNCTIONS
  const setRef = (node: HTMLElement | null) => {
    if (!sectionRef) return;
    if (typeof sectionRef === "function") {
      sectionRef(node);
    } else if (sectionRef && "current" in sectionRef) {
      (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  const content = noContainer ? (
    children
  ) : (
    <div className={containerClassName}>{children}</div>
  );

  if (sectionRef) {
    return (
      <Tag id={id} ref={setRef} className={sectionClassName} {...labelledProps}>
        {content}
      </Tag>
    );
  }

  return (
    <Tag id={id} className={sectionClassName} {...labelledProps}>
      {content}
    </Tag>
  );
}

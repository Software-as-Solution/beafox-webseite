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
  sectionRef,
  className = "",
  width = "default",
  as: Tag = "section",
  noContainer = false,
}: SectionProps) {
  // CONSTANTS
  const sectionClassName = `${BASE_STYLES} ${className}`;
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

  const content = noContainer ? children : <div className={containerClassName}>{children}</div>;

  if (sectionRef) {
    return (
      <Tag id={id} ref={setRef} aria-label={ariaLabel} className={sectionClassName}>
        {content}
      </Tag>
    );
  }

  return (
    <Tag id={id} aria-label={ariaLabel} className={sectionClassName}>
      {content}
    </Tag>
  );
}

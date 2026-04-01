// ICONS
import { PawPrint } from "lucide-react";
// TYPES
import type { ReactNode } from "react";

// TYPES
interface HomeSectionHeaderProps {
  preTitle?: string;
  title?: ReactNode;
  highlight?: string;
  subtitle?: ReactNode;
  pillClassName?: string;
  titleClassName?: string;
  wrapperClassName?: string;
  subtitleClassName?: string;
}
// CONSTANTS
const BASE_WRAPPER = "text-center";
const BASE_PILL =
  "flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto";
const BASE_TITLE =
  "font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray";
const BASE_ICON =
  "w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange";
const BASE_SUBTITLE =
  "text-lightGray text-sm md:text-base lg:text-lg max-w-2xl mx-auto";

// COMPONENT
export default function HomeSectionHeader({
  title,
  preTitle,
  subtitle,
  highlight,
  pillClassName = "",
  titleClassName = "",
  wrapperClassName = "",
  subtitleClassName = "",
}: HomeSectionHeaderProps) {
  return (
    <div className={`${BASE_WRAPPER} ${wrapperClassName}`.trim()}>
      <div className={`${BASE_PILL} ${pillClassName}`.trim()}>
        <PawPrint className={BASE_ICON} aria-hidden="true" />
        <h2 className={`${BASE_TITLE} ${titleClassName}`.trim()}>
          {title ?? (
            <>
              {preTitle}{" "}
              {highlight && (
                <span className="text-primaryOrange">{highlight}</span>
              )}
            </>
          )}
        </h2>
        <PawPrint className={BASE_ICON} aria-hidden="true" />
      </div>
      {subtitle && (
        <p className={`${BASE_SUBTITLE} ${subtitleClassName}`.trim()}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

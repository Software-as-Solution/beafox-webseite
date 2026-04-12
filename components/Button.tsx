"use client";

// STANDARD COMPONENTS
import Link from "next/link";
// IMPORTS
import { forwardRef, useMemo } from "react";
// ICONS
import { Loader2 } from "lucide-react";

// TYPES
type ButtonVariant = "primary" | "secondary" | "outline";
interface ButtonBaseProps {
  rel?: string;
  target?: string;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  children: React.ReactNode;
}
interface ButtonAsButton extends ButtonBaseProps {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}
interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  type?: never;
  onClick?: never;
}
type ButtonProps = ButtonAsButton | ButtonAsLink;
// CONSTANTS
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-primaryOrange text-primaryWhite hover:bg-primaryOrange/90 shadow-sm shadow-primaryOrange/20 hover:shadow-md hover:shadow-primaryOrange/25",
  secondary:
    "bg-primaryOrange text-primaryWhite hover:bg-primaryOrange/90 shadow-sm shadow-primaryOrange/20 hover:shadow-md hover:shadow-primaryOrange/25",
  outline:
    "border-2 border-primaryOrange text-primaryOrange hover:bg-primaryOrange/5",
};
const LOADING_STYLES = "cursor-wait pointer-events-none";
const DISABLED_STYLES = "opacity-50 cursor-not-allowed pointer-events-none";
const BASE_STYLES =
  "inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold text-center transition-all duration-200 active:scale-[0.97]";

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      href,
      rel,
      target,
      onClick,
      children,
      className = "",
      type = "button",
      loading = false,
      disabled = false,
      variant = "primary",
    },
    ref,
  ) {
    // CONSTANTS
    const isDisabled = disabled || loading;
    const combinedClassName = useMemo(() => {
      return [
        BASE_STYLES,
        VARIANT_STYLES[variant],
        isDisabled && DISABLED_STYLES,
        loading && !disabled && LOADING_STYLES,
        className,
      ]
        .filter(Boolean)
        .join(" ");
    }, [variant, isDisabled, loading, disabled, className]);
    const content = (
      <>
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
        )}
        {children}
      </>
    );

    // LINK VARIANT
    if (href) {
      return (
        <Link
          rel={rel}
          href={href}
          target={target}
          className={combinedClassName}
          tabIndex={isDisabled ? -1 : undefined}
          aria-disabled={isDisabled || undefined}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        className={combinedClassName}
        aria-busy={loading || undefined}
        ref={ref as React.Ref<HTMLButtonElement>}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;

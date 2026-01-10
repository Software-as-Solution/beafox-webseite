import Link from "next/link";
import { motion } from "framer-motion";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  href,
  onClick,
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "px-8 py-3 rounded-full font-semibold transition-all duration-300 text-center";

  const variants = {
    primary:
      "bg-primaryOrange text-primaryWhite hover:bg-primaryOrange/90 shadow-lg hover:shadow-xl",
    secondary:
      "bg-primaryOrange text-primaryWhite hover:bg-primaryOrange/90 shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-primaryOrange text-primaryOrange hover:bg-primaryOrange hover:text-primaryWhite",
  };

  // Check if className contains w-full to determine if button should be full width
  // But respect responsive classes like sm:!w-auto
  const hasFullWidth =
    className.includes("w-full") || className.includes("!w-full");
  const hasResponsiveWidth =
    className.includes("sm:!w-auto") || className.includes("sm:w-auto");
  const isFullWidth = hasFullWidth && !hasResponsiveWidth;

  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={
          isFullWidth
            ? "block w-full"
            : hasResponsiveWidth
            ? "block"
            : "inline-block"
        }
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`border-none bg-transparent p-0 ${
        isFullWidth ? "w-full" : hasResponsiveWidth ? "w-full sm:w-auto" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {buttonContent}
    </button>
  );
}

import Link from "next/link";
import { motion } from "framer-motion";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export default function Button({
  href,
  onClick,
  children,
  variant = "primary",
  className = "",
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
  const isFullWidth =
    className.includes("w-full") || className.includes("!w-full");

  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        isFullWidth ? "w-full" : ""
      }`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={isFullWidth ? "block w-full" : "inline-block"}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="border-none bg-transparent p-0 w-full">
      {buttonContent}
    </button>
  );
}

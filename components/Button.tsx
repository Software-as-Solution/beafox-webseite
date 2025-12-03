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
  const baseStyles = "px-8 py-3 rounded-full font-semibold transition-all duration-300 inline-block text-center";
  
  const variants = {
    primary: "bg-primaryOrange text-primaryWhite hover:bg-primaryOrange/90 shadow-lg hover:shadow-xl",
    secondary: "bg-primaryOrange text-primaryWhite hover:bg-primaryOrange/90 shadow-lg hover:shadow-xl",
    outline: "border-2 border-primaryOrange text-primaryOrange hover:bg-primaryOrange hover:text-primaryWhite",
  };

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
    return <Link href={href}>{buttonContent}</Link>;
  }

  return (
    <button onClick={onClick} className="border-none bg-transparent p-0">
      {buttonContent}
    </button>
  );
}


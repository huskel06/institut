"use client";

import { motion } from "framer-motion";

interface PremiumButtonProps {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function PremiumButton({
  children,
  href,
  variant = "primary",
  className = "",
}: PremiumButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center px-8 py-3.5 font-sans text-sm font-medium tracking-[0.15em] uppercase rounded-full overflow-hidden transition-all duration-500 cursor-pointer";

  const variants = {
    primary:
      "bg-gradient-to-r from-emerald to-emerald-light text-white border border-emerald/30 shadow-[0_2px_16px_rgba(45,106,90,0.2)]",
    secondary:
      "bg-transparent text-emerald border border-emerald/40 hover:border-emerald",
  };

  return (
    <motion.a
      href={href}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 4px 24px rgba(45, 106, 90, 0.3)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-emerald-light to-emerald opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
    </motion.a>
  );
}

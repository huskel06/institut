"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface CatalogueButtonProps {
  onClick: () => void;
  className?: string;
}

export function CatalogueButton({ onClick, className = "" }: CatalogueButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className={`group relative w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-dark to-emerald text-white font-sans text-sm font-medium tracking-[0.15em] uppercase rounded-2xl shadow-[0_4px_24px_rgba(45,106,90,0.25)] overflow-hidden transition-shadow duration-500 hover:shadow-[0_8px_36px_rgba(45,106,90,0.38)] ${className}`}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
        animate={{ translateX: ["-100%", "200%"] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
      />
      <BookOpen className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:-rotate-3" />
      <span className="relative z-10">Découvrir tout le catalogue</span>
      <motion.span
        className="relative z-10 text-gold-light"
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        →
      </motion.span>
    </motion.button>
  );
}

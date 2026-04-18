"use client";

import { motion } from "framer-motion";

interface BotanicalDividerProps {
  variant?: "ornament" | "pampa" | "minimal";
  className?: string;
}

export default function BotanicalDivider({
  variant = "ornament",
  className = "",
}: BotanicalDividerProps) {
  if (variant === "minimal") {
    return (
      <div className={`relative py-2 ${className}`}>
        <div className="flex items-center justify-center gap-4">
          <div className="w-20 sm:w-32 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <div className="w-1.5 h-1.5 rotate-45 border border-gold/[0.42]" />
          <div className="w-20 sm:w-32 h-[1px] bg-gradient-to-l from-transparent via-gold/30 to-transparent" />
        </div>
      </div>
    );
  }

  if (variant === "pampa") {
    // Elegant pampa/feather-inspired divider
    return (
      <motion.div
        className={`relative py-3 flex justify-center ${className}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
      <svg
        width="300"
        height="50"
        viewBox="0 0 300 50"
        className="text-gold/[0.48]"
        fill="none"
      >
          {/* Left feathery strands */}
          <motion.path
            d="M50 25 Q100 22 150 25"
            stroke="currentColor"
            strokeWidth="0.8"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.path
            d="M150 25 Q200 28 250 25"
            stroke="currentColor"
            strokeWidth="0.8"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
          />
          {/* Delicate fronds */}
          <path d="M90 25 Q85 15 88 8" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
          <path d="M95 25 Q92 16 96 10" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
          <path d="M100 25 Q100 17 104 12" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />

          <path d="M200 25 Q205 15 202 8" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
          <path d="M205 25 Q208 16 204 10" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
          <path d="M210 25 Q210 17 206 12" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />

          {/* Center diamond */}
          <path d="M147 21 L150 18 L153 21 L150 24Z" fill="currentColor" opacity="0.5" />
          <path d="M144 25 L150 14 L156 25 L150 36Z" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </motion.div>
    );
  }

  // "ornament" variant — elegant symmetrical ornament
  return (
    <motion.div
      className={`relative py-3 flex justify-center overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <svg
        width="320"
        height="40"
        viewBox="0 0 320 40"
        className="text-emerald/80"
        fill="none"
      >
        {/* Left scrollwork */}
        <motion.path
          d="M60 20 Q80 20 100 20 Q120 20 140 20"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
        <motion.path
          d="M180 20 Q200 20 220 20 Q240 20 260 20"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
        />

        {/* Left curl */}
        <path d="M80 20 Q75 12 82 10 Q88 8 85 16" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <path d="M120 20 Q118 14 124 12 Q130 10 126 18" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />

        {/* Right curl (mirrored) */}
        <path d="M240 20 Q245 12 238 10 Q232 8 235 16" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <path d="M200 20 Q202 14 196 12 Q190 10 194 18" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />

        {/* Center ornament */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ transformOrigin: "160px 20px" }}
        >
          <path d="M155 20 L160 14 L165 20 L160 26Z" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
          <circle cx="160" cy="20" r="1.5" fill="currentColor" opacity="0.2" />
        </motion.g>

        {/* Small leaf accents */}
        <path d="M95 20 Q90 13 94 9 Q97 14 95 20Z" fill="currentColor" opacity="0.08" />
        <path d="M225 20 Q230 13 226 9 Q223 14 225 20Z" fill="currentColor" opacity="0.08" />
      </svg>
    </motion.div>
  );
}

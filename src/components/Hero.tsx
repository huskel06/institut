"use client";

import { motion } from "framer-motion";
import FairyLights from "./FairyLights";
import PremiumButton from "./PremiumButton";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden py-16 md:py-20">
      {/* Warm gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#2a2420] via-[#1e2a25] to-[#1a1f1c]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,150,90,0.08)_0%,transparent_70%)]" />

      {/* String lights */}
      <FairyLights count={24} variant="drape" className="z-[1]" />

      {/* Botanical corners */}
      <div className="absolute top-0 left-0 z-[1] opacity-10">
        <svg width="160" height="200" viewBox="0 0 160 200" className="text-gold-light">
          <path d="M0 60 Q20 45 15 20 Q30 38 45 30 Q35 50 38 62 Q20 55 0 60Z" fill="currentColor" />
          <path d="M0 100 Q30 85 22 50 Q40 70 52 60 Q42 88 46 105 Q25 95 0 100Z" fill="currentColor" opacity="0.6" />
          <path d="M0 40 Q50 30 30 0" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 z-[1] opacity-10 scale-x-[-1]">
        <svg width="160" height="200" viewBox="0 0 160 200" className="text-gold-light">
          <path d="M0 60 Q20 45 15 20 Q30 38 45 30 Q35 50 38 62 Q20 55 0 60Z" fill="currentColor" />
          <path d="M0 100 Q30 85 22 50 Q40 70 52 60 Q42 88 46 105 Q25 95 0 100Z" fill="currentColor" opacity="0.6" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Salon name in Sacramento */}
        <motion.h1
          className="font-script text-6xl sm:text-7xl md:text-8xl text-shimmer leading-[1.1] mb-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Maison Bohème
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="font-sans text-sm md:text-base tracking-[0.3em] uppercase text-gold-light mb-5 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Institut de beauté — Nice
        </motion.p>

        {/* Decorative line */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-5"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-gold-light/70" />
          <div className="w-1.5 h-1.5 rotate-45 bg-gold-light/60" />
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-gold-light/70" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-sans text-base md:text-lg text-white/85 max-w-xl mx-auto mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          Un cocon chaleureux où l&apos;esprit bohème rencontre l&apos;élégance,
          pensé pour sublimer votre beauté.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <PremiumButton href="#reservation">
            Réserver mon instant
          </PremiumButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-gold-light/60 to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

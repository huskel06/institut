"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(135deg, #1a2e28 0%, #1E4D3F 40%, #2D6A5A 70%, #1a2e28 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Subtle radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(184,150,90,0.08) 0%, transparent 70%)",
            }}
          />

          <motion.div
            className="flex flex-col items-center gap-5"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Image
                src="/logo2.png"
                alt="Maison Boh\u00e8me"
                width={80}
                height={80}
                className="rounded-full shadow-[0_0_40px_rgba(184,150,90,0.25)]"
                priority
              />
            </motion.div>

            <motion.h1
              className="font-script text-4xl md:text-5xl text-cream"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              Maison{" "}
              <span className="text-gold-light">Boh&egrave;me</span>
            </motion.h1>

            {/* Gold underline */}
            <motion.div
              className="h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 80, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2400); // Slightly longer for the drawing
    return () => clearTimeout(timer);
  }, []);

  // Hand-drawn style olive branch paths
  const branchPath = "M50,80 Q50,50 50,20"; // Main stem
  const leaves = [
    "M50,70 Q65,65 75,55", // Right leaf 1
    "M50,60 Q35,55 25,45", // Left leaf 1
    "M50,50 Q65,45 75,35", // Right leaf 2
    "M50,40 Q35,35 25,25", // Left leaf 2
    "M50,25 Q60,20 65,10", // Top right
    "M50,25 Q40,20 35,10", // Top left
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FDFCF8]"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />

          <div className="relative flex flex-col items-center">
            {/* Animated Botanical Branch */}
            <svg
              viewBox="0 0 100 100"
              className="w-32 h-32 md:w-40 md:h-40 mb-2 overflow-visible"
              fill="none"
              stroke="#B8965A"
              strokeWidth="1.2"
              strokeLinecap="round"
            >
              {/* Main Stem */}
              <motion.path
                d={branchPath}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              
              {/* Leaves */}
              {leaves.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.3 + (i * 0.15), 
                    ease: "easeOut" 
                  }}
                />
              ))}

              {/* Floating sparkles around the branch */}
              {[...Array(4)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={20 + i * 20}
                  cy={30 + (i % 2) * 40}
                  r="0.5"
                  fill="#B8965A"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.4, 0], scale: [0, 1.5, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 1 + i * 0.2, 
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                />
              ))}
            </svg>

            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <div className="mb-4" />

              <h1 className="font-serif text-3xl md:text-4xl text-charcoal/90 tracking-wider">
                Maison <span className="italic text-emerald">Bohème</span>
              </h1>
              
              <motion.p
                className="font-sans text-[10px] uppercase tracking-[0.4em] text-gold mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 1, delay: 1.6 }}
              >
                Instant de sérénité
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote:
      "Un vrai cocon de douceur ! L’équipe est adorable et le résultat toujours au top.",
    author: "Marie L.",
  },
  {
    quote:
      "Mon institut préféré à Nice. Les filles sont aux petits soins, on se sent comme à la maison.",
    author: "Sophie D.",
  },
  {
    quote:
      "Balayage parfait et ambiance chaleureuse. Je recommande les yeux fermés !",
    author: "Camille R.",
  },
  {
    quote:
      "Des mains en or et un accueil toujours souriant. Merci Maison Bohème !",
    author: "Léa M.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <section className="relative py-11 md:py-14 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-rose-pale/[0.14] to-cream pointer-events-none" />

      <div
        aria-hidden="true"
        className="absolute top-10 left-1/2 -translate-x-1/2 font-serif text-[11rem] leading-none text-gold/[0.05] select-none pointer-events-none"
      >
        “
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10">
        <motion.div
          className="text-center mb-12 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-gold font-medium mb-4">
            Témoignages
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-light text-charcoal mb-4 leading-tight">
            Ce qu’elles en{" "}
            <span className="italic font-medium text-gold">disent</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-gold/[0.28]" />
            <div className="w-1.5 h-1.5 rotate-45 border border-gold/[0.28]" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-gold/[0.28]" />
          </div>
        </motion.div>

        <div className="relative min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  opacity: 0,
                  x: dir * 40,
                }),
                center: {
                  opacity: 1,
                  x: 0,
                },
                exit: (dir: number) => ({
                  opacity: 0,
                  x: dir * -40,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-10"
            >
              <span
                aria-hidden="true"
                className="font-serif text-5xl leading-none text-gold/[0.34] mb-2 block"
              >
                “
              </span>

              <p className="font-serif text-xl md:text-2xl italic font-light text-charcoal leading-relaxed max-w-2xl">
                {testimonials[current].quote}
              </p>

              <div className="flex items-center gap-3 mt-6">
                <div className="w-8 h-[1px] bg-gold/[0.34]" />
                <span className="font-sans text-sm tracking-[0.15em] text-gold font-medium uppercase">
                  {testimonials[current].author}
                </span>
                <div className="w-8 h-[1px] bg-gold/[0.34]" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-3 mt-9">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Témoignage ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === current
                  ? "h-1.5 w-6 bg-gold/80"
                  : "h-2 w-2 bg-gold/20 hover:bg-gold/[0.38]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

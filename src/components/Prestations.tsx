"use client";

import { useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Scissors, Sparkles, Hand } from "lucide-react";
import PremiumCard from "./PremiumCard";
import { CatalogueButton } from "./CatalogueButton";

const CatalogueModal = dynamic(
  () => import("./Catalogue").then((module) => module.CatalogueModal),
  { ssr: false, loading: () => null }
);

const prestations = [
  {
    icon: Scissors,
    title: "Coiffure",
    subtitle: "Un rituel sacr\u00e9 pour sculpter votre lumi\u00e8re.",
    services: [
      "Coupe signature",
      "Balayage solaire",
      "Soin profond botox",
      "Coiffure \u00e9v\u00e9nementielle",
    ],
    buttonText: "R\u00e9v\u00e9ler ma parure",
    buttonHref: "#reservation",
    image: "/coupe-action.jpg",
  },
  {
    icon: Sparkles,
    title: "Esth\u00e9tique",
    subtitle: "Un sanctuaire de douceur pour sublimer votre peau.",
    services: [
      "Soin visage Hydrafacial",
      "Massage signature",
      "\u00c9pilation haute pr\u00e9cision",
      "Rehaussement de cils",
    ],
    buttonText: "\u00c9veiller mon \u00e9clat",
    buttonHref: "#reservation",
    image: "/coin-detente.jpg",
  },
  {
    icon: Hand,
    title: "Ongles & dermographie",
    subtitle: "Un rituel de pr\u00e9cision pour l'\u00e9l\u00e9gance de vos mains.",
    services: [
      "Pose semi-permanent",
      "Gainage gel",
      "Beaut\u00e9 des mains spa",
      "Dermographie",
    ],
    buttonText: "Sublimer mes mains",
    buttonHref: "#reservation",
    image: "/manucure-rouge.jpg",
  },
];

const stringLights: Array<{
  className: "string-bulb" | "string-bulb-alt";
  left: string;
  top: string;
  duration: string;
  delay: string;
}> = [
  { className: "string-bulb", left: "10%", top: "2rem", duration: "3s", delay: "0s" },
  { className: "string-bulb-alt", left: "25%", top: "1.5rem", duration: "4s", delay: "0.5s" },
  { className: "string-bulb", left: "40%", top: "2.5rem", duration: "3.5s", delay: "1s" },
  { className: "string-bulb-alt", left: "55%", top: "1.75rem", duration: "2.8s", delay: "0.3s" },
  { className: "string-bulb", left: "70%", top: "2.25rem", duration: "3.2s", delay: "0.7s" },
  { className: "string-bulb-alt", left: "85%", top: "1.25rem", duration: "4.2s", delay: "1.2s" },
];

export default function Prestations() {
  const [catalogueOpen, setCatalogueOpen] = useState(false);

  return (
    <section id="prestations" className="relative py-11 md:py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-emerald-pale/12 to-cream/95 pointer-events-none bg-lambris" />

      <div className="absolute top-0 left-0 right-0 h-20 opacity-[0.24] pointer-events-none">
        {stringLights.map((light) => {
          const style = {
            left: light.left,
            top: light.top,
            ["--duration" as const]: light.duration,
            ["--delay" as const]: light.delay,
            boxShadow: "0 0 6px 2px rgba(212,184,124,0.26)",
          } as CSSProperties;

          return (
            <div
              key={`${light.left}-${light.top}`}
              className={`absolute h-1 w-1 rounded-full bg-gold-light ${light.className}`}
              style={style}
            />
          );
        })}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          className="text-center mb-9 md:mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-emerald font-medium mb-4">
            Nos rituels
          </p>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-charcoal mb-4 leading-[0.98]">
            Des rituels pens&eacute;s avec{" "}
            <span className="italic font-medium text-emerald">justesse</span>
          </h2>
          <p className="font-sans text-base text-charcoal/[0.78] max-w-lg mx-auto mt-3 leading-relaxed">
            Coiffure, esth&eacute;tique et gestes pr&eacute;cis, dans le m&ecirc;me
            tempo calme et r\u00e9g\u00e9n\u00e9rant.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-gold/[0.36]" />
            <div className="w-1.5 h-1.5 rotate-45 border border-gold/[0.36]" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-gold/[0.36]" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {prestations.map((prestation, index) => (
            <PremiumCard key={prestation.title} {...prestation} index={index} />
          ))}
        </div>

        <motion.div
          className="mt-9 md:mt-11 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <CatalogueButton onClick={() => setCatalogueOpen(true)} />
        </motion.div>
      </div>

      {catalogueOpen ? (
        <CatalogueModal isOpen={catalogueOpen} onClose={() => setCatalogueOpen(false)} />
      ) : null}
    </section>
  );
}

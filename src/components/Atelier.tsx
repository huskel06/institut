"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart } from "lucide-react";
import FairyLights from "./FairyLights";

const galleryImages = [
  { src: "/coin-cosy.jpg", alt: "Le coin cosy avec guirlandes", span: "col-span-2 row-span-2" },
  { src: "/miroir-rond.jpg", alt: "Poste coiffure au miroir rond", span: "col-span-1 row-span-1" },
  { src: "/produits-salon.jpg", alt: "Nos produits professionnels", span: "col-span-1 row-span-1" },
  { src: "/canape-emeraude.jpg", alt: "L'espace détente émeraude", span: "col-span-1 row-span-2" },
  { src: "/brushing-cuivre.jpg", alt: "Brushing cuivré", span: "col-span-1 row-span-1" },
];

export default function Atelier() {
  return (
    <section id="atelier" className="relative py-11 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-dark/[0.035] via-cream to-cream-dark/[0.24] pointer-events-none bg-lambris" />

      <FairyLights count={16} variant="cascade" className="opacity-[0.22]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          className="text-center mb-12 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-emerald font-medium mb-4">
            Notre philosophie
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-light text-charcoal mb-4 leading-tight">
            Un lieu où le temps{" "}
            <span className="italic font-medium text-emerald">s&apos;arrête</span>
          </h2>
          <p className="font-sans text-base text-charcoal/[0.78] max-w-lg mx-auto mt-2 leading-relaxed">
            Une atmosphère feutrée, des gestes précis, une attention
            qui reste simple.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-emerald/[0.28]" />
            <div className="w-1.5 h-1.5 rotate-45 border border-emerald/[0.28]" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-emerald/[0.28]" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-emerald/20 via-gold/[0.16] to-transparent rounded-full" />

              <div className="pl-8">
                <p className="font-sans text-base text-charcoal leading-relaxed mb-6">
                  Maison Bohème est plus qu&apos;un institut de beauté.
                  C&apos;est une adresse feutrée, au cœur de Nice, où
                  l&apos;esprit bohème rencontre une élégance simple.
                </p>

                <p className="font-sans text-base text-charcoal leading-relaxed mb-6">
                  Guirlandes discrètes, velours émeraude, senteurs délicates,
                  lumière douce : l&apos;atmosphère accompagne le soin sans jamais
                  prendre toute la place.
                </p>

                <p className="font-sans text-base text-charcoal leading-relaxed mb-8">
                  Ici, chaque rendez-vous garde quelque chose d&apos;un rituel. Les
                  produits sont choisis avec exigence, le geste reste précis,
                  et le temps reprend un peu d&apos;espace.
                </p>

                <div className="flex items-start gap-3 p-5 rounded-[1.15rem] bg-emerald/[0.055] border border-emerald/[0.12] shadow-[0_10px_30px_rgba(58,54,50,0.04)]">
                  <Heart size={18} strokeWidth={1.5} className="text-gold mt-0.5 shrink-0" />
                  <span className="font-serif text-base italic text-charcoal/75 leading-relaxed">
                    &ldquo;La beauté commence lorsque l&apos;on se sent pleinement
                    soi. Ici, nous aidons simplement à le révéler.&rdquo;
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="grid grid-cols-3 grid-rows-3 gap-3 aspect-square">
                {galleryImages.map((image, index) => (
                  <motion.div
                    key={image.src}
                    className={`relative rounded-xl overflow-hidden ${image.span} group/img`}
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/img:scale-[1.05]"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-emerald-dark/0 group-hover/img:bg-emerald-dark/[0.16] transition-colors duration-500" />
                  </motion.div>
                ))}
              </div>

              <div className="absolute -top-3 -left-3 w-10 h-10 border-t border-l border-emerald/12 rounded-tl-xl pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b border-r border-gold/[0.16] rounded-br-xl pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import PremiumButton from "./PremiumButton";

interface PremiumCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  services: string[];
  buttonText: string;
  buttonHref: string;
  image: string;
  index: number;
}

export default function PremiumCard({
  icon: Icon,
  title,
  subtitle,
  services,
  buttonText,
  buttonHref,
  image,
  index,
}: PremiumCardProps) {
  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden rounded-[1.6rem] border border-cream-dark/60 bg-white/[0.82] backdrop-blur-[2px] shadow-[0_10px_30px_rgba(58,54,50,0.06)] transition-[transform,box-shadow,border-color,background-color] duration-500 hover:border-gold/[0.22] hover:bg-white/[0.9] hover:shadow-[0_18px_54px_rgba(58,54,50,0.1)]"
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.85, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
    >
      <div className="absolute inset-0 rounded-[1.6rem] border border-transparent transition-colors duration-500 group-hover:border-gold/[0.16] z-10 pointer-events-none" />

      <div className="relative h-52 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/[0.28] to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3
            className="font-serif text-2xl md:text-[1.7rem] font-semibold text-white mb-1"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.45)" }}
          >
            {title}
          </h3>
        </div>

        <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-gold/[0.16] bg-white/[0.88] backdrop-blur-sm shadow-[0_8px_18px_rgba(58,54,50,0.08)] transition-colors duration-500 group-hover:border-gold/[0.28] group-hover:bg-white/[0.94]">
          <Icon className="h-4 w-4 text-emerald" strokeWidth={1.5} />
        </div>
      </div>

      <div className="flex flex-col items-center flex-1 p-7 md:p-8">
        <p className="font-serif text-base italic text-charcoal/75 mb-6 text-center leading-relaxed">
          {subtitle}
        </p>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gold/[0.36]" />
          <div className="w-1 h-1 rotate-45 bg-gold/[0.44]" />
          <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gold/[0.36]" />
        </div>

        <ul className="space-y-3.5 mb-8 w-full">
          {services.map((service) => (
            <li
              key={service}
              className="flex items-center gap-3 text-base font-sans text-charcoal/90 tracking-[0.01em]"
            >
              <span className="w-4 h-[1px] bg-emerald/[0.34] shrink-0 transition-all duration-300 group-hover:w-5 group-hover:bg-gold/50" />
              {service}
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <PremiumButton href={buttonHref}>{buttonText}</PremiumButton>
        </div>
      </div>
    </motion.div>
  );
}

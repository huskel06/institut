"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Offer {
  _id: string;
  title: string;
  description: string;
  badge?: string;
  valid_until?: string;
}

const emptyStateLines = [
  "Aucune offre particuli\u00e8re pour le moment. L'accueil, lui, reste le m\u00eame.",
  "Pas d'offre en cours aujourd'hui, seulement notre fa\u00e7on de prendre soin de vous.",
  "Les offres reviendront en leur temps. L'attention, elle, ne change pas.",
];

function formatOfferDate(value: string | undefined | null) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}

export default function Offers() {
  const offersRaw = useQuery(api.offers.getActiveOffers);
  const offers = (offersRaw || []) as Offer[];
  const loaded = offersRaw !== undefined;

  const emptyStateText = useMemo(() => {
    return emptyStateLines[new Date().getDate() % emptyStateLines.length];
  }, []);

  if (!loaded || (offers.length === 0)) {
    return null;
  }

  return (
    <section className="relative py-9 md:py-11">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.035] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10">
        <motion.div
          className="text-center mb-6 md:mb-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-sans text-xs tracking-[0.32em] uppercase text-gold font-medium mb-3">
            En ce moment
          </p>
          <h2 className="font-serif text-3xl md:text-[2.65rem] font-light text-charcoal leading-tight">
            Quelques rituels privil&eacute;gi&eacute;s
          </h2>
          <p className="font-sans text-sm md:text-[0.95rem] text-charcoal/70 max-w-xl mx-auto mt-3 leading-relaxed">
            Lorsque certains rituels se pr&ecirc;tent &agrave; une parenth&egrave;se
            particuli&egrave;re, nous les partageons ici comme des invitations au ressourcement.
          </p>
        </motion.div>

        {offers.length > 0 && (
          <div className="space-y-3">
            {offers.map((offer, index) => {
              const validUntil = formatOfferDate(offer.valid_until);

              return (
                <motion.article
                  key={offer._id}
                  className="group rounded-[1.4rem] border border-charcoal/[0.06] bg-white/[0.55] px-5 py-4 md:px-6 md:py-5 shadow-[0_10px_34px_rgba(58,54,50,0.05)] backdrop-blur-[1px] transition-all duration-300 hover:border-gold/20 hover:bg-white/[0.68] hover:shadow-[0_14px_40px_rgba(58,54,50,0.08)]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5">
                        <Sparkles
                          size={15}
                          strokeWidth={1.5}
                          className="text-gold/80 shrink-0 transition-transform duration-300 group-hover:rotate-6"
                        />
                        <h3 className="font-serif text-xl md:text-[1.35rem] text-charcoal leading-tight">
                          {offer.title}
                        </h3>
                      </div>

                      {offer.description ? (
                        <p className="font-sans text-[0.97rem] text-charcoal/90 leading-relaxed">
                          <span className="font-semibold text-charcoal">{offer.title}</span>
                          {" — "}
                          {offer.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 md:justify-end md:pl-6">
                      {offer.badge ? (
                        <span className="inline-flex items-center rounded-full border border-gold/[0.22] bg-gold/[0.06] px-3 py-1 font-sans text-[0.68rem] font-medium uppercase tracking-[0.2em] text-gold">
                          {offer.badge}
                        </span>
                      ) : null}

                      {validUntil ? (
                        <span className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-charcoal/50">
                          Jusqu&apos;au {validUntil}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

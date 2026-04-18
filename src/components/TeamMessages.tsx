"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

interface TeamMessage {
  _id: string;
  staff_name: string;
  message: string;
  date_from: string;
  date_to: string;
}

function formatMessageDate(value: string, includeYear = false) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    ...(includeYear ? { year: "numeric" as const } : {}),
  });
}

export default function TeamMessages() {
  const messagesRaw = useQuery(api.team.getActiveMessages);
  const messages = (messagesRaw || []) as TeamMessage[];
  const loaded = messagesRaw !== undefined;


  if (!loaded || messages.length === 0) {
    return null;
  }

  return (
    <section className="relative py-5 md:py-7">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10">
        <motion.div
          className="text-center mb-4 md:mb-5"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold font-medium mb-2">
            Informations utiles
          </p>
          <h2 className="font-serif text-2xl md:text-[2rem] text-charcoal leading-tight">
            Avant votre visite
          </h2>
        </motion.div>

        <div className="space-y-3">
          {messages.map((message, index) => (
            <motion.div
              key={message._id}
            className="rounded-[1.2rem] border border-gold/15 bg-white/[0.52] px-5 py-4 shadow-[0_10px_26px_rgba(58,54,50,0.04)] backdrop-blur-[1px]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/[0.18] bg-gold/[0.06] text-gold/[0.85]">
                  <Info size={15} strokeWidth={1.6} />
                </span>

                <div className="min-w-0">
                  <p className="font-sans text-[0.97rem] text-charcoal/90 leading-relaxed">
                    <span className="font-semibold text-charcoal">{message.staff_name}</span>
                    {" â€” "}
                    {message.message}
                  </p>

                  <p className="font-sans text-xs uppercase tracking-[0.16em] text-charcoal/[0.48] mt-2">
                    Du {formatMessageDate(message.date_from)} au{" "}
                    {formatMessageDate(message.date_to, true)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Instagram } from "lucide-react";
import Image from "next/image";
import {
  formatBusinessHours,
  getBusinessDayLabel,
  hasAddressContact,
  hasInstagramContact,
  hasPhoneContact,
  orderedBusinessDays,
  siteSettings,
} from "@/lib/siteSettings";

export default function Footer() {
  const showAddress = hasAddressContact() || Boolean(siteSettings.city);
  const showPhone = hasPhoneContact();
  const showInstagram = hasInstagramContact();
  const showContactBlock =
    showAddress || showPhone || Boolean(siteSettings.contact_note);

  const addressLines = [...siteSettings.address_lines, siteSettings.city].filter(Boolean) as string[];
  const desktopColumns = showContactBlock ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <footer id="contact" className="relative bg-charcoal text-cream/80 overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-emerald/40 via-gold/40 to-emerald/40" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <motion.div
          className={`grid grid-cols-1 ${desktopColumns} gap-12 md:gap-8`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className="flex items-center mb-4">
              <h3 className="font-serif text-2xl font-semibold text-cream">
                Maison <span className="text-emerald-light">Boh&egrave;me</span>
              </h3>
            </div>

            <p className="font-sans text-sm text-cream/80 leading-relaxed max-w-xs">
              {siteSettings.site_description}
            </p>

            {showInstagram && siteSettings.instagram_url ? (
              <div className="flex items-center gap-4 mt-6">
                <a
                  href={siteSettings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:border-emerald-light/60 hover:text-emerald-light transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={16} strokeWidth={1.5} />
                </a>
              </div>
            ) : null}
          </div>

          <div>
            <h4 className="font-serif text-lg text-cream mb-4 flex items-center gap-2">
              <Clock size={16} strokeWidth={1.5} className="text-emerald-light" />
              Horaires
            </h4>
            <ul className="space-y-2 font-sans text-sm">
              {orderedBusinessDays.map((dayKey) => {
                const day = siteSettings.hours[dayKey];

                return (
                  <li key={dayKey} className="flex justify-between gap-4">
                    <span className="text-cream/60">{getBusinessDayLabel(dayKey)}</span>
                    <span className={day ? "text-cream/85" : "text-cream/40"}>
                      {formatBusinessHours(day)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {showContactBlock ? (
            <div>
              <h4 className="font-serif text-lg text-cream mb-4 flex items-center gap-2">
                <MapPin size={16} strokeWidth={1.5} className="text-emerald-light" />
                {showAddress ? "Nous trouver" : "Contact"}
              </h4>
              <address className="not-italic font-sans text-sm space-y-3">
                {showAddress ? (
                  <p className="text-cream/70">
                    {addressLines.map((line, index) => (
                      <span key={`${line}-${index}`}>
                        {line}
                        {index < addressLines.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </p>
                ) : null}

                {showPhone && siteSettings.phone_href && siteSettings.phone_display ? (
                  <a
                    href={siteSettings.phone_href}
                    className="flex items-center gap-2 text-cream/70 hover:text-emerald-light transition-colors duration-300 group"
                  >
                    <span className="w-7 h-7 rounded-full border border-cream/20 flex items-center justify-center group-hover:border-emerald-light/60 transition-colors duration-300">
                      <Phone size={13} strokeWidth={1.5} />
                    </span>
                    {siteSettings.phone_display}
                  </a>
                ) : null}

                {siteSettings.contact_note ? (
                  <p className="text-cream/55 leading-relaxed">{siteSettings.contact_note}</p>
                ) : null}
              </address>
            </div>
          ) : null}
        </motion.div>

        <div className="mt-12 pt-6 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-cream/40">
            &copy; 2026 {siteSettings.brand_name}. Tous droits r&eacute;serv&eacute;s.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/mentions-legales/"
              className="font-sans text-xs text-cream/30 hover:text-cream/60 transition-colors"
            >
              Mentions l&eacute;gales
            </Link>
            <Link
              href="/politique-confidentialite/"
              className="font-sans text-xs text-cream/30 hover:text-cream/60 transition-colors"
            >
              Confidentialit&eacute;
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

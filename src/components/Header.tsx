"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";
import { hasPhoneContact, siteSettings } from "@/lib/siteSettings";

const navLinks = [
  { label: "Prestations", href: "#prestations" },
  { label: "L'Atelier", href: "#atelier" },
  { label: "Galerie", href: "#galerie" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.classList.remove("mobile-menu-open");
      return;
    }

    document.body.classList.add("mobile-menu-open");
    const previousActive =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(", ");

    window.setTimeout(() => {
      const firstFocusable = mobileMenuRef.current?.querySelector<HTMLElement>(focusableSelectors);
      firstFocusable?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }

      if (event.key !== "Tab" || !mobileMenuRef.current) {
        return;
      }

      const focusables = Array.from(
        mobileMenuRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusables.length - 1];
      const currentTarget = document.activeElement;

      if (event.shiftKey && currentTarget === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && currentTarget === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("mobile-menu-open");
      window.removeEventListener("keydown", onKeyDown);
      previousActive?.focus();
    };
  }, [mobileOpen]);

  const showPhone = hasPhoneContact();

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-500 ${
        scrolled
          ? "bg-cream/70 backdrop-blur-xl border-b border-emerald/8 shadow-[0_1px_12px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <nav
        className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-3"
        aria-label="Navigation principale"
      >
        <a href="#" className="relative z-10 flex items-center gap-3">
          <Image
            src="/logo2.png"
            alt="Logo Maison Boh&egrave;me"
            width={56}
            height={56}
            className="shadow-sm"
          />
          <div
            className={`font-script text-2xl md:text-3xl transition-colors duration-500 ${
              scrolled ? "text-charcoal" : "text-cream"
            }`}
          >
            Maison{" "}
            <span
              className={`transition-colors duration-500 ${
                scrolled ? "text-emerald" : "text-gold-light"
              }`}
            >
              Boh&egrave;me
            </span>
          </div>
        </a>

        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`font-sans text-sm tracking-[0.12em] uppercase transition-colors duration-300 ${
                  scrolled
                    ? "text-charcoal-light hover:text-emerald"
                    : "text-cream/70 hover:text-gold-light"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}

          {showPhone && siteSettings.phone_href ? (
            <li>
              <a
                href={siteSettings.phone_href}
                className={`flex items-center gap-2 font-sans text-sm tracking-[0.08em] transition-colors duration-300 ${
                  scrolled
                    ? "text-charcoal-light hover:text-emerald"
                    : "text-cream/70 hover:text-gold-light"
                }`}
                aria-label="Nous appeler"
              >
                <Phone size={14} strokeWidth={1.5} />
                <span>Nous appeler</span>
              </a>
            </li>
          ) : null}

          <li>
            <a
              href="#reservation"
              className={`font-sans text-sm tracking-[0.12em] uppercase px-6 py-2.5 rounded-full border transition-all duration-400 ${
                scrolled
                  ? "border-emerald/40 text-emerald hover:bg-emerald hover:text-white"
                  : "border-gold-light/40 text-gold-light hover:bg-gold-light hover:text-charcoal"
              }`}
            >
              R&eacute;server
            </a>
          </li>
        </ul>

        <div className="md:hidden flex items-center gap-3 relative z-10">
          {showPhone && siteSettings.phone_href ? (
            <a
              href={siteSettings.phone_href}
              aria-label="Nous appeler"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
                scrolled
                  ? "border-charcoal/20 text-charcoal hover:border-emerald hover:text-emerald"
                  : "border-cream/30 text-cream hover:border-gold-light hover:text-gold-light"
              }`}
            >
              <Phone size={15} strokeWidth={1.5} />
            </a>
          ) : null}

          <button
            type="button"
            className={`transition-colors duration-300 ${scrolled ? "text-charcoal" : "text-cream"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X size={24} className="text-charcoal" /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-navigation"
            ref={mobileMenuRef}
            className="fixed inset-0 z-[80] bg-cream/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden overscroll-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu mobile"
          >
            <Image
              src="/logo2.png"
              alt="Logo"
              width={60}
              height={60}
              className="rounded-full shadow-md mb-4"
            />

            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="font-serif text-3xl text-charcoal hover:text-emerald transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}

            <motion.a
              href="#reservation"
              className="mt-4 font-sans text-sm tracking-[0.15em] uppercase px-8 py-3 rounded-full border border-emerald text-emerald hover:bg-emerald hover:text-white transition-all duration-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setMobileOpen(false)}
            >
              R&eacute;server
            </motion.a>

            {showPhone && siteSettings.phone_href ? (
              <motion.a
                href={siteSettings.phone_href}
                className="flex items-center gap-2 font-sans text-sm text-charcoal-light hover:text-emerald transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setMobileOpen(false)}
              >
                <Phone size={15} strokeWidth={1.5} />
                Nous appeler
              </motion.a>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

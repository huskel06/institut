"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Phone, Search, BookOpen } from "lucide-react";
import { siteSettings } from "@/lib/siteSettings";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Prestation {
  name: string;
  duration: string;
  price: string;
}

interface SubCategory {
  name: string;
  note?: string;
  prestations: Prestation[];
}

interface Category {
  id: string;
  name: string;
  type: "accordion" | "contact";
  subcategories?: SubCategory[];
  contact?: {
    person: string;
    phone: string;
    phoneHref?: string | null;
    description: string;
  };
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const catalogue: Category[] = [
  {
    id: "coiffure",
    name: "Coiffure",
    type: "accordion",
    subcategories: [
      {
        name: "Brushing & Coupe Femme",
        note: "Supplément cheveux épais + 5 €",
        prestations: [
          { name: "Shampoing + Brushing — Cheveux courts (au-dessus des épaules)", duration: "30 min", price: "25 €" },
          { name: "Shampoing + Brushing — Cheveux mi-longs (au niveau des épaules) + soin démêlant", duration: "30 min", price: "33 €" },
          { name: "Shampoing + Brushing — Cheveux longs (sous les omoplates) + soin démêlant", duration: "45 min", price: "36 €" },
          { name: "Shampoing coupe séchage cheveux très court", duration: "30 min", price: "30 €" },
          { name: "Shampoing + Coupe + Brushing — Cheveux courts (au-dessus des épaules)", duration: "30 min", price: "39 €" },
          { name: "Shampoing + Coupe + Brushing — Cheveux mi-longs (au niveau des épaules) + soin démêlant", duration: "45 min", price: "47 €" },
          { name: "Shampoing + Coupe + Brushing — Cheveux longs (sous les omoplates) + soin démêlant", duration: "1 h", price: "52 €" },
        ],
      },
      {
        name: "Couleur",
        prestations: [
          { name: "Couleur (racine) + Shampoing + Brushing — Cheveux courts (au-dessus des épaules)", duration: "1 h 30 min", price: "46 €" },
          { name: "Couleur (racine) + Shampoing + Brushing — Cheveux mi-longs (au niveau des épaules)", duration: "1 h 30 min", price: "56 €" },
          { name: "Couleur (racine) + Shampoing + Brushing — Cheveux longs (sous les omoplates)", duration: "2 h", price: "61 €" },
          { name: "Couleur (racine) + Shampoing + Coupe + Brushing — Cheveux courts (au-dessus des épaules)", duration: "1 h 30 min", price: "61 €" },
          { name: "Couleur (racine) + Shampoing + Coupe + Brushing — Cheveux mi-longs (au niveau des épaules)", duration: "1 h 30 min", price: "71 €" },
          { name: "Couleur (racine) + Shampoing + Coupe + Brushing — Cheveux longs (sous les omoplates)", duration: "2 h", price: "76 €" },
          { name: "Supplément couleur sur les longueurs", duration: "5 min", price: "10 à 15 €" },
        ],
      },
      {
        name: "Couleur sans ammoniaque",
        prestations: [
          { name: "Couleur, shampoing, brushing — Cheveux courts", duration: "1 h 30 min", price: "51 €" },
          { name: "Couleur + shampoing + brushing — Cheveux mi-longs (au niveau des épaules)", duration: "1 h 30 min", price: "61 €" },
          { name: "Couleur + shampoing + brushing — Cheveux longs (aux omoplates)", duration: "2 h", price: "66 €" },
          { name: "Couleur + shampoing + coupe + brushing — Cheveux courts (au-dessus des épaules)", duration: "1 h 30 min", price: "66 €" },
          { name: "Couleur + shampoing + coupe + brushing — Cheveux mi-longs (au niveau des épaules)", duration: "1 h 30 min", price: "76 €" },
          { name: "Couleur + shampoing + coupe + brushing — Cheveux longs (aux omoplates)", duration: "2 h", price: "81 €" },
        ],
      },
      {
        name: "Décoloration",
        prestations: [
          { name: "Décoloration (racines < 2 cm) patine, shampoing, soin, brushing — Cheveux courts + spray protecteur", duration: "2 h", price: "91 €" },
        ],
      },
      {
        name: "Couleur & Mèches",
        note: "Le tarif dépend de la technique utilisée, l'épaisseur et la longueur de la chevelure. Devis personnalisé au salon.",
        prestations: [
          { name: "Shampoing, couleur, mèches, brushing — Cheveux courts", duration: "2 h", price: "à partir de 96 €" },
          { name: "Shampoing, couleur, mèches, brushing — Cheveux mi-longs", duration: "2 h 30 min", price: "à partir de 116 €" },
          { name: "Shampoing, couleur, mèches, brushing — Cheveux longs", duration: "3 h", price: "à partir de 131 €" },
          { name: "Shampoing + Coupe + Couleur + Mèches + Brushing — Cheveux courts (au-dessus des épaules)", duration: "2 h", price: "à partir de 111 €" },
          { name: "Shampoing + Coupe + Couleur / Mèches + Brushing — Mi-longs (au niveau des épaules)", duration: "2 h 30 min", price: "à partir de 131 €" },
          { name: "Shampoing + Coupe + Couleur / Mèches + Brushing — Longs (sous les omoplates)", duration: "3 h", price: "à partir de 136 €" },
        ],
      },
      {
        name: "Mèches, Ombré & Balayage",
        note: "Le tarif varie selon la technique utilisée, l'épaisseur et la longueur de la chevelure. Devis personnalisé au salon.",
        prestations: [
          { name: "Mèches, Ombré ou Balayage, Shampoing + Brushing — Cheveux courts", duration: "2 h", price: "à partir de 76 €" },
          { name: "Mèches, Ombré ou Balayage, Shampoing + Brushing — Cheveux mi-longs", duration: "2 h 30 min", price: "à partir de 86 €" },
          { name: "Mèches, Ombré ou Balayage, Shampoing + Brushing — Cheveux longs", duration: "3 h", price: "à partir de 96 €" },
          { name: "Mèches, Ombré ou Balayage + Coupe + Shampoing + Brushing — Cheveux courts", duration: "2 h", price: "à partir de 91 €" },
          { name: "Mèches, Ombré ou Balayage + Coupe + Shampoing + Brushing — Cheveux mi-longs", duration: "2 h 30 min", price: "à partir de 101 €" },
          { name: "Mèches, Ombré ou Balayage + Coupe + Shampoing + Brushing — Cheveux longs", duration: "3 h", price: "à partir de 111 €" },
        ],
      },
      {
        name: "Permanente",
        prestations: [
          { name: "Shampoing, Permanente + coiffage — Cheveux courts (au-dessus des épaules)", duration: "1 h 30 min", price: "68 €" },
          { name: "Shampoing, coupe, permanente + coiffage — Cheveux courts", duration: "1 h 30 min", price: "83 €" },
          { name: "Shampoing, Permanente + coiffage — Cheveux mi-longs (au niveau des épaules)", duration: "1 h 30 min", price: "78 €" },
          { name: "Shampoing, coupe, permanente + coiffage — Cheveux mi-longs", duration: "1 h 30 min", price: "93 €" },
          { name: "Shampoing, Permanente + coiffage — Cheveux longs (au niveau des omoplates)", duration: "1 h 30 min", price: "88 €" },
          { name: "Shampoing, coupe, permanente + coiffage — Cheveux longs", duration: "2 h", price: "103 €" },
        ],
      },
      {
        name: "Soins",
        prestations: [
          { name: "Masque hydratant", duration: "10 min", price: "8 €" },
          { name: "Démêlant", duration: "5 min", price: "5 €" },
          { name: "Masque Kératine + Shampoing + Brushing — Cheveux longs", duration: "1 h 45 min", price: "98 €" },
        ],
      },
      {
        name: "Coupe Homme",
        prestations: [
          { name: "Shampoing + Coupe + Coiffage", duration: "30 min", price: "22 €" },
        ],
      },
      {
        name: "Coupe Enfant",
        prestations: [
          { name: "Shampoing, Coupe + Coiffage — Garçon -10 ans", duration: "30 min", price: "17 €" },
          { name: "Shampoing, Coupe, coiffage — Garçon, de 11 à 15 ans", duration: "30 min", price: "20 €" },
          { name: "Shampoing + Coupe + Séchage — Fille -10 ans", duration: "30 min", price: "25 €" },
          { name: "Shampoing + Coupe + Brushing — Fille -10 ans", duration: "30 min", price: "30 €" },
          { name: "Shampoing, coupe, séchage — de 11 à 14 ans", duration: "30 min", price: "28 €" },
          { name: "Shampoing, coupe, brushing — de 11 à 14 ans", duration: "30 min", price: "34 €" },
        ],
      },
    ],
  },
  {
    id: "esthetique",
    name: "Esthétique",
    type: "contact",
    contact: {
      person: "Léa",
      phone: siteSettings.phone_display || "",
      phoneHref: siteSettings.phone_href,
      description: "Contactez Léa pour connaître nos tarifs et prestations",
    },
  },
  {
    id: "ongles",
    name: "Ongles & Dermographie",
    type: "contact",
    contact: {
      person: "Chloé",
      phone: siteSettings.phone_display || "",
      phoneHref: siteSettings.phone_href,
      description: "Contactez Chloé pour connaître nos tarifs et prestations",
    },
  },
];

// ─────────────────────────────────────────────
// Helper: flatten all prestations for search
// ─────────────────────────────────────────────
function getAllPrestations() {
  const results: Array<{ prestation: Prestation; subcat: string; catId: string }> = [];
  for (const cat of catalogue) {
    if (cat.type === "accordion" && cat.subcategories) {
      for (const sub of cat.subcategories) {
        for (const p of sub.prestations) {
          results.push({ prestation: p, subcat: sub.name, catId: cat.id });
        }
      }
    }
  }
  return results;
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function PrestationRow({ name, duration, price, highlight }: Prestation & { highlight?: string }) {
  const highlightText = (text: string, query: string) => {
    if (!query) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-gold/25 text-charcoal rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div className="flex items-baseline gap-3 py-2.5 border-b border-cream-dark/60 last:border-0 group/row hover:bg-emerald-pale/30 -mx-4 px-4 rounded transition-colors duration-200">
      <span className="flex-1 font-sans text-sm text-charcoal/85 leading-snug pr-2">
        {highlight ? highlightText(name, highlight) : name}
      </span>
      <span className="shrink-0 font-sans text-xs text-charcoal/50 whitespace-nowrap">{duration}</span>
      <span className="shrink-0 font-serif text-base font-semibold text-emerald whitespace-nowrap min-w-[70px] text-right">
        {price}
      </span>
    </div>
  );
}

function SubCategoryAccordion({
  subcat,
  isOpen,
  onToggle,
  searchQuery,
}: {
  subcat: SubCategory;
  isOpen: boolean;
  onToggle: () => void;
  searchQuery: string;
}) {
  const filteredPrestations = searchQuery
    ? subcat.prestations.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : subcat.prestations;

  if (searchQuery && filteredPrestations.length === 0) return null;

  return (
    <div className="border border-cream-dark/70 rounded-xl overflow-hidden mb-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-white/60 hover:bg-emerald-pale/40 transition-colors duration-200 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-gold/70 shrink-0" />
          <span className="font-sans text-sm font-medium tracking-wide text-charcoal">
            {subcat.name}
          </span>
          <span className="font-sans text-xs text-charcoal/40">
            ({filteredPrestations.length})
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-emerald/70" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pt-1 pb-4 bg-white/40">
              {subcat.note && (
                <p className="font-sans text-xs italic text-gold/80 mb-3 pt-2 border-t border-cream-dark/50 leading-relaxed">
                  {subcat.note}
                </p>
              )}
              {/* Column headers */}
              <div className="flex items-center gap-3 pb-1.5 mb-1">
                <span className="flex-1 font-sans text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
                  Prestation
                </span>
                <span className="shrink-0 font-sans text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
                  Durée
                </span>
                <span className="shrink-0 font-sans text-[10px] uppercase tracking-[0.15em] text-charcoal/40 min-w-[70px] text-right">
                  Tarif
                </span>
              </div>
              {filteredPrestations.map((p, i) => (
                <PrestationRow key={i} {...p} highlight={searchQuery} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactCard({ contact }: { contact: NonNullable<Category["contact"]> }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-white/70 to-emerald-pale/40 backdrop-blur-sm p-6 md:p-8">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none">
        <div className="absolute top-3 right-3 w-16 h-16 border border-gold rounded-full" />
        <div className="absolute top-6 right-6 w-8 h-8 border border-gold rounded-full" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold/30 rounded-full" />
        <div>
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-emerald/70 mb-0.5">
            Sur rendez-vous
          </p>
          <p className="font-serif text-xl font-medium text-charcoal italic">
            {contact.description}
          </p>
        </div>
      </div>

      {contact.phone && contact.phoneHref ? (
        <a href={contact.phoneHref} className="inline-flex items-center gap-3 mt-2 group/tel">
          <div className="w-9 h-9 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center transition-all duration-300 group-hover/tel:bg-emerald group-hover/tel:border-emerald">
            <Phone className="w-4 h-4 text-emerald transition-colors duration-300 group-hover/tel:text-white" />
          </div>
          <span className="font-serif text-2xl font-light text-charcoal tracking-wider transition-colors duration-300 group-hover/tel:text-emerald">
            {contact.phone}
          </span>
        </a>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Catalogue Modal
// ─────────────────────────────────────────────
interface CatalogueProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CatalogueModal({ isOpen, onClose }: CatalogueProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string>("coiffure");
  const [expandedSubcats, setExpandedSubcats] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("catalogue-open");
    } else {
      document.body.classList.remove("catalogue-open");
    }
    return () => {
      document.body.classList.remove("catalogue-open");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

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
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(focusableSelectors);
      firstFocusable?.focus();
    }, 0);

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
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

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
      previousActive?.focus();
    };
  }, [isOpen, onClose]);

  // When search is active, auto-expand all subcats with results
  useEffect(() => {
    if (!searchQuery) return;
    const newExpanded: Record<string, boolean> = {};
    for (const cat of catalogue) {
      if (cat.type === "accordion" && cat.subcategories) {
        for (const sub of cat.subcategories) {
          const hasResult = sub.prestations.some((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (hasResult) {
            newExpanded[`${cat.id}::${sub.name}`] = true;
          }
        }
      }
    }
    setExpandedSubcats(newExpanded);
    // Also expand the category that has results
    const catWithResults = catalogue.find(
      (cat) =>
        cat.type === "accordion" &&
        cat.subcategories?.some((sub) =>
          sub.prestations.some((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
    );
    if (catWithResults) setExpandedCategory(catWithResults.id);
  }, [searchQuery]);

  const toggleSubcat = useCallback((catId: string, subcatName: string) => {
    const key = `${catId}::${subcatName}`;
    setExpandedSubcats((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleAllSubcats = (catId: string, subcategories: SubCategory[]) => {
    const keys = subcategories.map((s) => `${catId}::${s.name}`);
    const anyOpen = keys.some((k) => expandedSubcats[k]);
    const newState = { ...expandedSubcats };
    keys.forEach((k) => { newState[k] = !anyOpen; });
    setExpandedSubcats(newState);
  };

  // Search results count
  const searchResultsAll = searchQuery ? getAllPrestations().filter((r) =>
    r.prestation.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            key="panel"
            className="fixed inset-0 z-50 flex items-start justify-center pointer-events-none"
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="catalogue-title"
              className="relative w-full max-w-3xl mx-4 my-6 md:my-10 max-h-[calc(100vh-3rem)] flex flex-col bg-cream rounded-3xl shadow-[0_32px_80px_rgba(58,54,50,0.25)] pointer-events-auto overflow-hidden"
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* ── Header ── */}
              <div className="relative shrink-0 bg-gradient-to-br from-emerald-dark to-emerald px-6 md:px-8 pt-8 pb-6">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-t-3xl">
                  <div className="absolute -top-8 -right-8 w-48 h-48 border border-white/40 rounded-full" />
                  <div className="absolute -top-16 -right-16 w-72 h-72 border border-white/20 rounded-full" />
                  <div className="absolute top-4 left-1/2 w-1 h-1 bg-gold-light rounded-full" />
                  <div className="absolute top-8 left-1/3 w-1 h-1 bg-gold-light rounded-full opacity-60" />
                </div>

                <div className="relative">
                  <p className="font-sans text-xs tracking-[0.3em] uppercase text-white/60 mb-2">
                    Maison Bohème
                  </p>
                  <h2 id="catalogue-title" className="font-serif text-4xl md:text-5xl font-light text-white mb-1">
                    Notre <span className="italic font-medium text-gold-light">Catalogue</span>
                  </h2>
                  <p className="font-sans text-sm text-white/60 mt-2">
                    Tous nos tarifs — mis à jour régulièrement
                  </p>
                </div>

                {/* Search bar */}
                <div className="relative mt-5">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    aria-label="Rechercher une prestation"
                    placeholder="Rechercher une prestation…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:border-gold-light/50 focus:bg-white/15 transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <p className="font-sans text-xs text-white/50 mt-2">
                    {searchResultsAll.length} résultat{searchResultsAll.length !== 1 ? "s" : ""} trouvé{searchResultsAll.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* ── Category tabs ── */}
              {!searchQuery && (
                <div className="shrink-0 flex border-b border-cream-dark/70 bg-white/50 px-4 md:px-6">
                  {catalogue.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setExpandedCategory(cat.id)}
                      className={`relative px-4 py-3.5 font-sans text-sm font-medium tracking-wide transition-colors duration-200 whitespace-nowrap ${
                        expandedCategory === cat.id
                          ? "text-emerald"
                          : "text-charcoal/50 hover:text-charcoal/80"
                      }`}
                    >
                      {cat.name}
                      {expandedCategory === cat.id && (
                        <motion.div
                          layoutId="cat-underline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Scrollable body ── */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 md:px-6 py-6 space-y-4">
                {searchQuery ? (
                  // Search results view
                  <div>
                    {catalogue
                      .filter((cat) => cat.type === "accordion")
                      .map((cat) => {
                        const subcatsWithResults = cat.subcategories?.filter((sub) =>
                          sub.prestations.some((p) =>
                            p.name.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                        );
                        if (!subcatsWithResults || subcatsWithResults.length === 0) return null;
                        return (
                          <div key={cat.id} className="mb-6">
                            <p className="font-sans text-xs tracking-[0.2em] uppercase text-emerald/70 mb-3 font-medium">
                              {cat.name}
                            </p>
                            {subcatsWithResults.map((sub) => (
                              <SubCategoryAccordion
                                key={sub.name}
                                subcat={sub}
                                isOpen={!!expandedSubcats[`${cat.id}::${sub.name}`]}
                                onToggle={() => toggleSubcat(cat.id, sub.name)}
                                searchQuery={searchQuery}
                              />
                            ))}
                          </div>
                        );
                      })}
                    {searchResultsAll.length === 0 && (
                      <div className="text-center py-16">
                        <p className="font-serif text-2xl text-charcoal/30 italic mb-2">Aucun résultat</p>
                        <p className="font-sans text-sm text-charcoal/40">
                          Essayez avec un autre terme de recherche.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Normal category view
                  catalogue.map((cat) => {
                    if (cat.id !== expandedCategory) return null;

                    if (cat.type === "contact" && cat.contact) {
                      return (
                        <motion.div
                          key={cat.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                        >
                          <ContactCard contact={cat.contact} />
                        </motion.div>
                      );
                    }

                    if (cat.type === "accordion" && cat.subcategories) {
                      const openCount = cat.subcategories.filter(
                        (s) => expandedSubcats[`${cat.id}::${s.name}`]
                      ).length;
                      return (
                        <motion.div
                          key={cat.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                        >
                          {/* Expand/collapse all */}
                          <div className="flex justify-end mb-3">
                            <button
                              type="button"
                              onClick={() => toggleAllSubcats(cat.id, cat.subcategories!)}
                              className="font-sans text-xs text-charcoal/40 hover:text-emerald transition-colors underline underline-offset-2"
                            >
                              {openCount > 0 ? "Tout réduire" : "Tout déplier"}
                            </button>
                          </div>
                          {cat.subcategories.map((sub) => (
                            <SubCategoryAccordion
                              key={sub.name}
                              subcat={sub}
                              isOpen={!!expandedSubcats[`${cat.id}::${sub.name}`]}
                              onToggle={() => toggleSubcat(cat.id, sub.name)}
                              searchQuery=""
                            />
                          ))}
                        </motion.div>
                      );
                    }

                    return null;
                  })
                )}

                {/* ── Footer note ── */}
                <div className="mt-6 pt-5 border-t border-cream-dark/70">
                  <div className="flex items-start gap-3 bg-gold/8 border border-gold/20 rounded-xl px-4 py-3.5">
                    <div className="w-1 h-1 rotate-45 border border-gold/60 mt-2 shrink-0" />
                    <p className="font-sans text-xs text-charcoal/60 leading-relaxed italic">
                      Paiement en espèces et chèques uniquement. Pas de paiement par carte bancaire.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Close button ── */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer le catalogue"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/20 hover:border-white/40 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              >
                <X className="w-4.5 h-4.5 text-white" />
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────
// Trigger button
// ─────────────────────────────────────────────
interface CatalogueButtonProps {
  onClick: () => void;
  className?: string;
}

export function CatalogueButton({ onClick, className = "" }: CatalogueButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className={`group relative w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-dark to-emerald text-white font-sans text-sm font-medium tracking-[0.15em] uppercase rounded-2xl shadow-[0_4px_24px_rgba(45,106,90,0.25)] overflow-hidden transition-shadow duration-500 hover:shadow-[0_8px_36px_rgba(45,106,90,0.38)] ${className}`}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
        animate={{ translateX: ["−100%", "200%"] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
      />
      <BookOpen className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:-rotate-3" />
      <span className="relative z-10">Découvrir tout le catalogue</span>
      <motion.span
        className="relative z-10 text-gold-light"
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        →
      </motion.span>
    </motion.button>
  );
}

// ─────────────────────────────────────────────
// Default export: self-contained wrapper
// ─────────────────────────────────────────────
export default function Catalogue() {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <CatalogueButton onClick={handleOpen} />
      <CatalogueModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
}

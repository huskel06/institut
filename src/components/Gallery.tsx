"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Photo {
  _id: string;
  src: string;
  caption?: string;
  alt_text?: string;
}

const PHOTOS_PER_PAGE = 8;

export default function Gallery() {
  const photosRaw = useQuery(api.gallery.getPhotos);
  const photos = (photosRaw || []) as Photo[];
  
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const navigate = useCallback(
    (dir: number) => {
      if (lightbox === null) return;
      const next = lightbox + dir;
      if (next >= 0 && next < photos.length) setLightbox(next);
    },
    [lightbox, photos.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowLeft") navigate(-1);
      if (event.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, navigate]);

  useEffect(() => {
    if (lightbox !== null) {
      document.body.classList.add("gallery-lightbox-open");
    } else {
      document.body.classList.remove("gallery-lightbox-open");
    }

    return () => {
      document.body.classList.remove("gallery-lightbox-open");
    };
  }, [lightbox]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(photos.length / PHOTOS_PER_PAGE));
    setPage((currentPage) => Math.min(currentPage, totalPages - 1));
    setLightbox((currentLightbox) => {
      if (currentLightbox === null) return null;
      return currentLightbox < photos.length ? currentLightbox : null;
    });
  }, [photos.length]);

  const totalPages = Math.ceil(photos.length / PHOTOS_PER_PAGE);
  const paginatedPhotos = photos.slice(page * PHOTOS_PER_PAGE, (page + 1) * PHOTOS_PER_PAGE);

  return (
    <section id="galerie" className="relative py-12 md:py-16 bg-lambris">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-gold font-medium mb-3">
            Notre univers
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal">
            Galerie
          </h2>
        </motion.div>

        {paginatedPhotos.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {paginatedPhotos.map((photo, index) => (
                <motion.button
                  key={photo._id}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => setLightbox(page * PHOTOS_PER_PAGE + index)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt_text || photo.caption || "Photo de l'institut"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {photo.caption ? (
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-sans text-xs text-white/90 text-center">
                        {photo.caption}
                      </p>
                    </div>
                  ) : null}
                </motion.button>
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
                  disabled={page === 0}
                  className="px-3 py-2 rounded-lg border border-gold/30 font-sans text-sm text-charcoal/70 hover:border-gold/60 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index)}
                    className={`w-9 h-9 rounded-lg font-sans text-sm transition-all cursor-pointer ${
                      index === page
                        ? "bg-emerald text-white"
                        : "border border-gold/30 text-charcoal/70 hover:border-gold/60"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((currentPage) => Math.min(totalPages - 1, currentPage + 1))}
                  disabled={page === totalPages - 1}
                  className="px-3 py-2 rounded-lg border border-gold/30 font-sans text-sm text-charcoal/70 hover:border-gold/60 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <AnimatePresence>
        {lightbox !== null && photos[lightbox] ? (
          <motion.div
            className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
              onClick={() => setLightbox(null)}
            >
              <X size={28} />
            </button>

            {lightbox > 0 ? (
              <button
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(-1);
                }}
              >
                <ChevronLeft size={36} />
              </button>
            ) : null}

            {lightbox < photos.length - 1 ? (
              <button
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(1);
                }}
              >
                <ChevronRight size={36} />
              </button>
            ) : null}

            <motion.div
              className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={photos[lightbox].src}
                alt={photos[lightbox].alt_text || photos[lightbox].caption || "Photo de l'institut"}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </motion.div>

            {photos[lightbox].caption ? (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <p className="font-sans text-sm text-white/80 text-center">
                  {photos[lightbox].caption}
                </p>
              </div>
            ) : null}

            <div className="absolute bottom-8 right-8">
              <p className="font-sans text-xs text-white/40">
                {lightbox + 1} / {photos.length}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

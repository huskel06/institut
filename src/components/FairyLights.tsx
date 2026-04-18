"use client";

import { useMemo } from "react";

interface StringLightsProps {
  /** Number of bulbs on the string */
  count?: number;
  className?: string;
  /** "drape" = hanging garland across top, "cascade" = falling vertical strings */
  variant?: "drape" | "cascade";
}

export default function FairyLights({
  count = 20,
  className = "",
  variant = "drape",
}: StringLightsProps) {
  const bulbs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      duration: `${2.5 + (i % 5) * 0.8}s`,
      delay: `${(i % 7) * 0.4}s`,
      alt: i % 3 === 0,
    }));
  }, [count]);

  if (variant === "cascade") {
    // Vertical strings falling from top — like the curtain lights in the salon
    const strings = 8;
    const bulbsPerString = Math.ceil(count / strings);

    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {Array.from({ length: strings }, (_, si) => {
          const xPos = 8 + (si / (strings - 1)) * 84; // spread across 8%-92% width
          return (
            <div
              key={si}
              className="absolute top-0"
              style={{ left: `${xPos}%` }}
            >
              {/* Vertical wire */}
              <div
                className="w-[1px] bg-gradient-to-b from-gold-light/20 via-gold-light/10 to-transparent"
                style={{ height: `${60 + (si % 3) * 15}%` }}
              />
              {/* Bulbs along the wire */}
              {Array.from({ length: bulbsPerString }, (_, bi) => {
                const bulb = bulbs[(si * bulbsPerString + bi) % bulbs.length];
                const yPos = 10 + (bi / bulbsPerString) * 80;
                return (
                  <div
                    key={bi}
                    className={`absolute left-1/2 -translate-x-1/2 rounded-full ${
                      bulb.alt ? "string-bulb-alt" : "string-bulb"
                    }`}
                    style={{
                      top: `${yPos}%`,
                      width: 3 + (bi % 2),
                      height: 3 + (bi % 2),
                      background: "radial-gradient(circle, #F5E6C8, #D4B87C)",
                      boxShadow: "0 0 6px 2px rgba(212,184,124,0.35), 0 0 12px 4px rgba(212,184,124,0.15)",
                      "--duration": bulb.duration,
                      "--delay": bulb.delay,
                    } as React.CSSProperties}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  // "drape" variant — a hanging garland across the width, like real string lights
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* The wire/string itself — a gentle catenary curve */}
      <svg
        className="absolute top-[6%] left-0 w-full h-[20%]"
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M-20 30 Q150 90 300 50 Q450 10 500 60 Q550 110 700 50 Q850 -10 1020 40"
          stroke="rgba(212,184,124,0.15)"
          strokeWidth="1"
        />
      </svg>

      {/* Bulbs positioned along the curve */}
      {bulbs.map((bulb, i) => {
        // Position along the catenary
        const t = i / (count - 1);
        const x = 2 + t * 96;
        // Simulate catenary sag: y = base + sin-shaped droop
        const sag = Math.sin(t * Math.PI * 2.5 - 0.3) * 4 + Math.sin(t * Math.PI) * 3;
        const y = 5 + sag + (t < 0.5 ? t * 6 : (1 - t) * 6);
        const size = 3 + (i % 3);

        return (
          <div
            key={bulb.id}
            className={`absolute rounded-full ${bulb.alt ? "string-bulb-alt" : "string-bulb"}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: "radial-gradient(circle, #F5E6C8, #D4B87C)",
              boxShadow: `0 0 ${size * 2}px ${size}px rgba(212,184,124,0.3), 0 0 ${size * 4}px ${size * 2}px rgba(212,184,124,0.1)`,
              "--duration": bulb.duration,
              "--delay": bulb.delay,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway, Sacramento } from "next/font/google";
import { siteSettings } from "@/lib/siteSettings";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteSettings.brand_name} | Institut de beaut\u00e9`,
    template: `%s | ${siteSettings.brand_name}`,
  },
  description: siteSettings.site_description,
  icons: {
    icon: [{ url: "/logo2.png", type: "image/png" }],
    apple: [{ url: "/logo2.png", type: "image/png" }],
    shortcut: "/logo2.png",
  },
};

import Script from "next/script";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: siteSettings.brand_name,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteSettings.address_lines.join(", "),
      addressLocality: siteSettings.city || "Nice",
      addressCountry: "FR",
    },
    areaServed: siteSettings.city || "Nice",
    telephone: siteSettings.phone_display || undefined,
    priceRange: "$$",
  };

  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${raleway.variable} ${sacramento.variable} antialiased`}
      >
        <Script
          id="local-seo-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Aller au contenu
        </a>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Offers from "@/components/Offers";
import Prestations from "@/components/Prestations";
import BotanicalDivider from "@/components/BotanicalDivider";
import Gallery from "@/components/Gallery";
import TeamMessages from "@/components/TeamMessages";
import Booking from "@/components/Booking";
import Atelier from "@/components/Atelier";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";
import SplashScreen from "@/components/SplashScreen";

export default function Home() {
  return (
    <>
      <SplashScreen />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <section className="bg-cream-dark/20 py-8 border-b border-cream-dark/50 text-center px-4">
           <div className="max-w-4xl mx-auto">
             <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-emerald font-medium mb-3">Expertise Locale &mdash; Nice</p>
             <p className="font-serif text-charcoal/80 text-lg lg:text-xl leading-relaxed italic">
               &ldquo; Reconnu comme un sanctuaire de beaut&eacute; privil&eacute;gi&eacute; sur la C&ocirc;te d&apos;Azur, Maison Boh&egrave;me se d&eacute;marque par une combinaison rare d&apos;expertises en coiffure, esth&eacute;tique et dermographie. Chaque visite est pens&eacute;e comme un v&eacute;ritable rituel de r&eacute;g&eacute;n&eacute;ration. &rdquo;
             </p>
           </div>
        </section>
        <Offers />
        <TeamMessages />
        <BotanicalDivider variant="ornament" />
        <Prestations />
        <BotanicalDivider variant="pampa" />
        <Booking />
        <BotanicalDivider variant="minimal" />
        <Testimonials />
        <BotanicalDivider variant="minimal" />
        <Atelier />
        <BotanicalDivider variant="minimal" />
        <Gallery />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

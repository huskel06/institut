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
        <section className="bg-cream-dark/20 py-5 border-b border-cream-dark/50 text-center px-4">
           <div className="max-w-4xl mx-auto">
             <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-emerald font-medium mb-2">Expertise Locale — Nice</p>
             <p className="font-serif text-charcoal/80 text-base lg:text-lg leading-relaxed italic">
               “ Reconnu comme un sanctuaire de beauté privilégié sur la Côte d’Azur, Maison Bohème se démarque par une combinaison rare d’expertises en coiffure, esthétique et dermographie. Chaque visite est pensée comme un véritable rituel de régénération. ”
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

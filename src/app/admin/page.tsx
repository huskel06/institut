"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar, Users, ChevronLeft, Check, Clock,
  Trash2, Loader2, MessageCircle, Sparkles, Megaphone, Image as ImageIcon, Plus, X
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { useQuery, useMutation } from "convex/react";

import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import serviceCatalog from "../../../config/service-catalog.json";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  confirmed: { label: "Confirm\u00e9", color: "bg-emerald-pale text-emerald" },
  completed: { label: "Termin\u00e9", color: "bg-sage-light text-charcoal" },
  cancelled: { label: "Annul\u00e9", color: "bg-rose-pale text-rose" },
  no_show: { label: "Absent", color: "bg-cream-dark text-charcoal-light" },
};

type Tab = "agenda" | "clients" | "offers" | "team" | "gallery";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("agenda");
  const [dateFilter, setDateFilter] = useState(() => new Date().toISOString().split("T")[0]);

  // Convex Data - Agenda
  const reservations = useQuery(api.bookings.getBookingsByDate, { date: dateFilter });
  const updateStatus = useMutation(api.bookings.updateBookingStatus);
  const seedServices = useMutation(api.services.seedServices);

  // Convex Data - Offers
  const offersRaw = useQuery(api.offers.getAllOffers);
  const createOffer = useMutation(api.offers.createOffer);
  const updateOffer = useMutation(api.offers.updateOffer);
  const deleteOffer = useMutation(api.offers.deleteOffer);

  // Convex Data - Team
  const teamMessagesRaw = useQuery(api.team.getAllMessages);
  const createTeamMessage = useMutation(api.team.createMessage);
  const updateTeamMessage = useMutation(api.team.updateMessage);
  const deleteTeamMessage = useMutation(api.team.deleteMessage);

  // Convex Data - Gallery
  const photosRaw = useQuery(api.gallery.getAllPhotos);
  const generateUploadUrl = useMutation(api.gallery.generateUploadUrl);
  const sendImage = useMutation(api.gallery.sendImage);
  const deletePhoto = useMutation(api.gallery.deletePhoto);
  const updatePhoto = useMutation(api.gallery.updatePhoto);

  // Loading states
  const offers = offersRaw || [];
  const teamMessages = teamMessagesRaw || [];
  const photos = photosRaw || [];

  // Form states
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);


  const handleSeed = async () => {
    if (!confirm("Importer le catalogue de services vers Convex ?")) return;
    try {
      const formattedServices = serviceCatalog.map(s => ({
        serviceId: s.service_id,
        categoryKey: s.category_key,
        categoryLabel: s.category_label,
        serviceLabel: s.service_label,
        durationMinutes: s.duration_minutes,
        priceLabel: s.price_label,
        active: s.active
      }));
      await seedServices({ services: formattedServices });
      alert("Catalogue import\u00e9 avec succ\u00e8s !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'import : " + (e instanceof Error ? e.message : "Inconnue"));
    }
  };

  const handleStatusChange = async (id: Id<"bookings">, status: string) => {
    try {
      await updateStatus({ id, status });
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la mise \u00e0 jour du statut");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      await sendImage({ storageId });
      alert("Image envoy\u00e9e !");
    } catch (e) {
      console.error(e);
      alert("Erreur d'upload");
    } finally {
      setIsUploading(false);
    }
  };


  const handleSendSMS = async (id: string) => {
    alert("Simulation SMS : Rappel r\u00e9ussi pour " + id);
  };

  const shiftDate = (days: number) => {
    const d = new Date(dateFilter);
    d.setDate(d.getDate() + days);
    setDateFilter(d.toISOString().split("T")[0]);
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white/70 backdrop-blur-xl border-b border-cream-dark/30 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-xl text-charcoal">
              Maison <span className="text-emerald">Boh\u00e8me</span>
            </Link>
            <span className="hidden sm:block font-sans text-[10px] tracking-wider uppercase text-emerald bg-emerald-pale px-2 py-0.5 rounded-full">Admin</span>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={handleSeed}
              className="px-3 py-1.5 rounded-lg border border-gold/40 text-gold font-sans text-[10px] uppercase tracking-wider hover:bg-gold/5 transition-all"
            >
              Importer Catalogue
            </button>
             <div className="flex items-center gap-1">
              {([
                { key: "agenda" as Tab, icon: Calendar, label: "Agenda" },
                { key: "offers" as Tab, icon: Sparkles, label: "Offres" },
                { key: "team" as Tab, icon: Megaphone, label: "Note d'\u00e9quipe" },
                { key: "gallery" as Tab, icon: ImageIcon, label: "Galerie" },
                { key: "clients" as Tab, icon: Users, label: "Clients" },
              ]).map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-sans text-xs transition-all cursor-pointer ${
                    tab === key ? "bg-emerald text-white" : "text-charcoal-light hover:bg-cream-dark/50"
                  }`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {tab === "agenda" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => shiftDate(-1)}
                className="px-3 py-2 rounded-lg bg-white border border-charcoal/20 hover:border-emerald/40 transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <div className="text-center">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="font-serif text-xl text-charcoal bg-transparent text-center outline-none cursor-pointer"
                />
                <p className="font-sans text-xs text-charcoal/60 mt-1">
                  {new Date(dateFilter + "T00:00:00").toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>
              <button
                onClick={() => shiftDate(1)}
                className="px-3 py-2 rounded-lg bg-white border border-charcoal/20 hover:border-emerald/40 transition-colors cursor-pointer rotate-180"
              >
                <ChevronLeft size={14} />
              </button>
            </div>

            {reservations === undefined ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="animate-spin text-emerald" size={24} />
              </div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-16">
                <Calendar size={40} className="mx-auto text-cream-dark mb-4" />
                <p className="font-sans text-sm text-charcoal/60">Aucun rendez-vous ce jour</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((rdv) => {
                  const status = STATUS_LABELS[rdv.status || "confirmed"];
                  return (
                    <div
                      key={rdv._id}
                      className="bg-white/80 rounded-xl border border-cream-dark/40 p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex items-center gap-3 md:w-24">
                        <Clock size={14} className="text-gold shrink-0" />
                        <span className="font-sans text-lg font-medium text-charcoal">{rdv.time}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-sans text-sm font-medium text-charcoal">{rdv.serviceLabel}</span>
                        </div>
                        <div className="font-sans text-xs text-charcoal/80 flex items-center gap-1">
                          <Users size={11} />
                          {rdv.clientName} - {rdv.phone}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full font-sans text-[11px] font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <div className="flex items-center gap-1">
                        {rdv.status !== "completed" && rdv.status !== "cancelled" && (
                          <>
                            <button
                              onClick={() => handleSendSMS(rdv._id)}
                              className="p-2 rounded-lg hover:bg-gold/15 text-gold-light hover:text-gold transition-colors cursor-pointer"
                              title="Rappel SMS"
                            >
                              <MessageCircle size={14} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(rdv._id, "completed")}
                              className="p-2 rounded-lg hover:bg-emerald-pale text-emerald transition-colors cursor-pointer"
                              title="Termin\u00e9"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(rdv._id, "cancelled")}
                              className="p-2 rounded-lg hover:bg-rose-pale text-rose transition-colors cursor-pointer"
                              title="Annuler"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {tab === "offers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-charcoal">Offres Sp\u00e9ciales</h2>
              <button 
                onClick={() => setShowOfferForm(true)}
                className="flex items-center gap-2 bg-gold text-white px-4 py-2 rounded-xl text-sm font-sans hover:bg-gold-light transition-all cursor-pointer"
              >
                <Plus size={16} /> Nouvelle Offre
              </button>
            </div>
            
            <div className="grid gap-4">
              {offers.map((offer) => (
                <div key={offer._id} className="bg-white p-5 rounded-2xl border border-cream-dark/30 shadow-sm flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-charcoal">{offer.title}</h3>
                    <p className="font-sans text-sm text-charcoal/70 mt-1">{offer.description}</p>
                    <div className="flex gap-2 mt-3">
                       {offer.badge && <span className="bg-gold-pale text-gold px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-tighter">{offer.badge}</span>}
                       {offer.valid_until && <span className="text-charcoal/40 text-[10px] font-sans uppercase">Jusqu&apos;au {offer.valid_until}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateOffer({ ...offer, id: offer._id, active: !offer.active })}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${offer.active ? "text-emerald hover:bg-emerald-pale" : "text-charcoal-light hover:bg-cream-dark"}`}
                    >
                      <Check size={16} />
                    </button>
                    <button 
                      onClick={() => confirm("Supprimer ?") && deleteOffer({ id: offer._id })}
                      className="p-2 rounded-lg text-rose hover:bg-rose-pale transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showOfferForm && (
               <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                 <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-serif text-2xl text-charcoal">Cr\u00e9er une offre</h3>
                      <button onClick={() => setShowOfferForm(false)} className="text-charcoal/40 hover:text-charcoal cursor-pointer"><X size={24}/></button>
                    </div>
                    <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      await createOffer({
                        title: formData.get("title") as string,
                        description: formData.get("description") as string,
                        badge: (formData.get("badge") as string) || undefined,
                        valid_until: (formData.get("valid_until") as string) || undefined,
                      });
                      setShowOfferForm(false);
                    }}>
                      <input name="title" placeholder="Titre de l'offre" className="w-full bg-cream p-4 rounded-xl outline-none font-sans" required />
                      <textarea name="description" placeholder="Description" className="w-full bg-cream p-4 rounded-xl outline-none font-sans h-24" required />
                      <div className="grid grid-cols-2 gap-4">
                        <input name="badge" placeholder="Badge (ex: -20%)" className="bg-cream p-4 rounded-xl outline-none font-sans" />
                        <input name="valid_until" type="date" className="bg-cream p-4 rounded-xl outline-none font-sans" />
                      </div>
                      <button className="w-full bg-charcoal text-white py-4 rounded-xl font-sans font-medium hover:bg-charcoal/90 transition-all cursor-pointer">Publier</button>
                    </form>
                 </div>
               </div>
            )}
          </div>
        )}

        {tab === "team" && (
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-charcoal">Messages d&apos;équipe</h2>
                <button 
                  onClick={() => setShowTeamForm(true)}
                  className="flex items-center gap-2 bg-emerald text-white px-4 py-2 rounded-xl text-sm font-sans hover:bg-emerald-dark transition-all cursor-pointer"
                >
                  <Plus size={16} /> Nouveau Message
                </button>
              </div>

              <div className="grid gap-4">
                {teamMessages.map((msg) => (
                  <div key={msg._id} className="bg-white p-5 rounded-2xl border border-cream-dark/30 shadow-sm flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                         <span className="font-sans font-bold text-charcoal">{msg.staff_name}</span>
                         <span className="text-charcoal/40 font-sans text-xs">Du {msg.date_from} au {msg.date_to}</span>
                      </div>
                      <p className="font-sans text-sm text-charcoal/70 mt-2 italic">&quot;{msg.message}&quot;</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => updateTeamMessage({ ...msg, id: msg._id, active: !msg.active })}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${msg.active ? "text-emerald hover:bg-emerald-pale" : "text-charcoal-light hover:bg-cream-dark"}`}
                       >
                        <Check size={16} />
                       </button>
                       <button 
                        onClick={() => confirm("Supprimer ?") && deleteTeamMessage({ id: msg._id })}
                        className="p-2 rounded-lg text-rose hover:bg-rose-pale transition-colors cursor-pointer"
                       >
                        <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>

              {showTeamForm && (
                 <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                   <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-serif text-2xl text-charcoal">Note d&apos;équipe</h3>
                      <button onClick={() => setShowTeamForm(false)} className="text-charcoal/40 hover:text-charcoal cursor-pointer"><X size={24}/></button>
                    </div>
                    <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      await createTeamMessage({
                        staff_name: formData.get("staff_name") as string,
                        message: formData.get("message") as string,
                        date_from: formData.get("date_from") as string,
                        date_to: formData.get("date_to") as string,
                      });
                      setShowTeamForm(false);
                    }}>
                      <input name="staff_name" placeholder="Nom du membre" className="w-full bg-cream p-4 rounded-xl outline-none font-sans" required />
                      <textarea name="message" placeholder="Votre message" className="w-full bg-cream p-4 rounded-xl outline-none font-sans h-24" required />
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1 font-sans text-xs uppercase text-charcoal/50">Du <input name="date_from" type="date" className="bg-cream p-3 rounded-xl outline-none text-charcoal" required /></label>
                        <label className="flex flex-col gap-1 font-sans text-xs uppercase text-charcoal/50">Au <input name="date_to" type="date" className="bg-cream p-3 rounded-xl outline-none text-charcoal" required /></label>
                      </div>
                      <button className="w-full bg-emerald text-white py-4 rounded-xl font-sans font-medium hover:bg-emerald/90 transition-all cursor-pointer">Enregistrer</button>
                    </form>
                   </div>
                 </div>
              )}
           </div>
        )}

        {tab === "gallery" && (
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-charcoal">Galerie Photos</h2>
                <label className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-xl text-sm font-sans hover:bg-charcoal/90 transition-all cursor-pointer">
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} 
                  Ajouter une photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo._id} className="group relative aspect-square rounded-2xl overflow-hidden bg-cream-dark/20 border border-cream-dark/30 shadow-sm">
                    {photo.src && (
                      <Image 
                        src={photo.src} 
                        fill
                        className="object-cover transition-transform group-hover:scale-110" 
                        alt={photo.alt_text || photo.caption || ""} 
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                       <div className="flex items-center justify-between gap-1">
                          <button 
                            onClick={() => updatePhoto({ id: photo._id, active: !photo.active })}
                            className={`p-1.5 rounded-lg ${photo.active ? "text-emerald bg-emerald/10" : "text-white bg-white/10"}`}
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            onClick={() => confirm("Supprimer cette photo ?") && deletePhoto({ id: photo._id })}
                            className="p-1.5 rounded-lg text-rose bg-rose/10"
                          >
                            <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {tab === "clients" && (
           <div className="text-center py-16">
             <Users size={40} className="mx-auto text-cream-dark mb-4" />
             <p className="font-sans text-sm text-charcoal/60">Module Clients prochainement activ\u00e9 sur Convex</p>
           </div>
        )}

      </main>
    </div>
  );
}

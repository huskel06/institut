"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Scissors,
  Sparkles,
  Hand,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { bookingCategories, getServiceById } from "@/lib/serviceCatalog";
import { getHoursForDate, siteSettings } from "@/lib/siteSettings";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

const MONTHS_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const CATEGORY_ICONS = {
  coiffure: Scissors,
  esthetique: Sparkles,
  manucure: Hand,
} as const;

type Step = "category" | "service" | "date" | "info" | "confirm";

interface BookingData {
  categoryId: string;
  serviceId: string;
  date: Date | null;
  time: string;
  name: string;
  phone: string;
  consent: boolean;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatDateISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDuration(durationMinutes: number) {
  if (durationMinutes < 60) {
    return `${durationMinutes} min`;
  }

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h${String(minutes).padStart(2, "0")}`;
}

function isEmailJsConfigured() {
  return (
    EMAILJS_SERVICE_ID !== "" &&
    EMAILJS_TEMPLATE_ID !== "" &&
    EMAILJS_PUBLIC_KEY !== "" &&
    !EMAILJS_SERVICE_ID.startsWith("YOUR_") &&
    !EMAILJS_TEMPLATE_ID.startsWith("YOUR_") &&
    !EMAILJS_PUBLIC_KEY.startsWith("YOUR_")
  );
}

export default function Booking() {
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const consentInputRef = useRef<HTMLInputElement | null>(null);
  const [step, setStep] = useState<Step>("category");
  const [data, setData] = useState<BookingData>({
    categoryId: "",
    serviceId: "",
    date: null,
    time: "",
    name: "",
    phone: "",
    consent: false,
  });
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxReservableDate = new Date(today);
  maxReservableDate.setMonth(maxReservableDate.getMonth() + siteSettings.booking_window_months);

  const steps: Step[] = ["category", "service", "date", "info", "confirm"];
  const currentIdx = steps.indexOf(step);
  const goNext = () => setStep(steps[currentIdx + 1]);
  const goBack = () => setStep(steps[currentIdx - 1]);

  const selectedCategory = bookingCategories.find((category) => category.id === data.categoryId);
  const selectedService = getServiceById(data.serviceId);

  // Convex Integration
  const convexSlots = useQuery(api.bookings.getAvailableSlots, {
    date: data.date ? formatDateISO(data.date) : "",
    serviceId: data.serviceId || "",
  });

  const createBookingMutation = useMutation(api.bookings.createBooking);

  useEffect(() => {
    if (convexSlots !== undefined) {
      setAvailableSlots(convexSlots);
      setLoadingSlots(false);
    } else if (data.date && data.serviceId) {
      setLoadingSlots(true);
    }
  }, [convexSlots, data.date, data.serviceId]);

  function validateInfo() {
    const nextErrors: Record<string, string> = {};
    let focusTarget: HTMLInputElement | null = null;

    if (!data.name.trim()) {
      nextErrors.name = "Veuillez indiquer votre nom.";
      focusTarget = nameInputRef.current;
    }

    if (!/^[0-9+\s().-]{10,}$/.test(data.phone.trim())) {
      nextErrors.phone = "Le numéro de téléphone semble incomplet.";
      focusTarget = focusTarget ?? phoneInputRef.current;
    }

    if (!data.consent) {
      nextErrors.consent =
        "Merci de confirmer l'utilisation de vos données pour la réservation.";
      focusTarget = focusTarget ?? consentInputRef.current;
    }

    setErrors(nextErrors);

    if (focusTarget) {
      window.requestAnimationFrame(() => focusTarget?.focus());
    }

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateInfo() || !data.date || !selectedService || !selectedCategory) {
      return;
    }

    setSending(true);
    setSendError("");

    try {
      await createBookingMutation({
        clientName: data.name.trim(),
        phone: data.phone.trim(),
        categoryId: data.categoryId,
        serviceId: selectedService.service_id,
        serviceLabel: selectedService.service_label,
        date: formatDateISO(data.date),
        time: data.time,
        consent: data.consent,
      });

      if (isEmailJsConfigured()) {
        try {
          const { default: emailjs } = await import("@emailjs/browser");

          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              client_name: data.name.trim(),
              client_phone: data.phone.trim(),
              category: selectedCategory.label,
              service: selectedService.service_label,
              date: data.date.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              time: data.time,
            },
            EMAILJS_PUBLIC_KEY
          );
        } catch {
          console.warn("Booking saved, but email notification failed.");
        }
      }

      setSubmitted(true);
      goNext();
    } catch (e) {
      console.error(e);
      setSendError("Une difficulté technique empêche la confirmation pour l'instant.");
    } finally {
      setSending(false);
    }
  }

  function handleReset() {
    setData({
      categoryId: "",
      serviceId: "",
      date: null,
      time: "",
      name: "",
      phone: "",
      consent: false,
    });
    setStep("category");
    setSubmitted(false);
    setErrors({});
    setAvailableSlots([]);
    setSlotError("");
    setSendError("");
  }

  function renderCalendar() {
    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfMonth(calYear, calMonth);
    const cells: React.ReactNode[] = [];

    for (let index = 0; index < firstDay; index += 1) {
      cells.push(<div key={`empty-${index}`} />);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(calYear, calMonth, day);
      date.setHours(0, 0, 0, 0);

      const isPast = date < today;
      const isOpen = getHoursForDate(date) !== null;
      const isSelected = Boolean(data.date && isSameDay(data.date, date));
      const disabled = isPast || !isOpen || date > maxReservableDate;

      cells.push(
        <button
          key={day}
          disabled={disabled}
          onClick={() => {
            setData((prev) => ({ ...prev, date, time: "" }));
            setSendError("");
          }}
          className={`
            aspect-square rounded-full text-sm font-sans transition-all duration-200
            ${
              disabled
                ? "text-charcoal/20 cursor-not-allowed"
                : "hover:bg-gold/10 hover:text-gold cursor-pointer"
            }
            ${
              isSelected
                ? "!bg-gold text-white font-medium shadow-[0_2px_12px_rgba(184,150,90,0.3)]"
                : ""
            }
          `}
        >
          {day}
        </button>
      );
    }

    return cells;
  }

  function canGoNextMonth() {
    return new Date(calYear, calMonth + 1, 1) <= maxReservableDate;
  }

  function canGoPrevMonth() {
    return calYear > today.getFullYear() || calMonth > today.getMonth();
  }

  return (
    <section
      id="reservation"
      className="relative py-12 md:py-16"
      aria-labelledby="booking-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-rose-pale/10 to-cream pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-gold font-medium mb-4">
            Réservation
          </p>
          <h2
            id="booking-heading"
            className="font-serif text-5xl md:text-6xl font-light text-charcoal mb-4"
          >
            Réservez votre <span className="italic font-medium text-gold">instant</span>
          </h2>
          <div className="mx-auto w-12 h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent mt-4" />
        </motion.div>

        {!submitted ? (
          <div className="flex items-center justify-center gap-2 mb-10">
            {["Prestation", "Soin", "Date", "Coordonnées"].map((label, index) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans transition-all duration-300 ${
                    index <= currentIdx
                      ? "bg-gold text-white"
                      : "bg-cream-dark/50 text-charcoal-light/40"
                  }`}
                >
                  {index < currentIdx ? <Check size={14} /> : index + 1}
                </div>
                <span className="hidden sm:block font-sans text-xs text-charcoal/70">{label}</span>
                {index < 3 ? (
                  <div
                    className={`w-6 sm:w-10 h-[1px] transition-colors duration-300 ${
                      index < currentIdx ? "bg-gold/60" : "bg-cream-dark/40"
                    }`}
                  />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-cream-dark/40 p-6 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.06)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {step === "category" ? (
              <motion.div
                key="category"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-serif text-xl text-charcoal mb-6 text-center">
                  Choisissez votre prestation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {bookingCategories.map((category) => {
                    const Icon =
                      CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS] || Sparkles;
                    const isActive = data.categoryId === category.id;

                    return (
                      <button
                        type="button"
                        key={category.id}
                        onClick={() => {
                          setData((prev) => ({
                            ...prev,
                            categoryId: category.id,
                            serviceId: "",
                            date: null,
                            time: "",
                          }));
                          setAvailableSlots([]);
                          setSlotError("");
                          setSendError("");
                          goNext();
                        }}
                        className={`group flex flex-col items-center gap-3 p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                          isActive
                            ? "border-gold bg-gold/5 shadow-[0_2px_16px_rgba(184,150,90,0.12)]"
                            : "border-cream-dark/40 hover:border-gold/40 hover:bg-gold/[0.02]"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            isActive ? "bg-gold/10" : "bg-rose-pale/40 group-hover:bg-gold/10"
                          }`}
                        >
                          <Icon
                            size={20}
                            strokeWidth={1.5}
                            className={`transition-colors duration-300 ${
                              isActive ? "text-gold" : "text-charcoal/70 group-hover:text-gold"
                            }`}
                          />
                        </div>
                        <span className="font-sans text-sm font-medium tracking-wide text-charcoal">
                          {category.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}

            {step === "service" && selectedCategory ? (
              <motion.div
                key="service"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-serif text-xl text-charcoal mb-6 text-center">
                  Choisissez votre soin
                </h3>
                <div className="space-y-3">
                  {selectedCategory.services.map((service) => (
                    <button
                      type="button"
                      key={service.service_id}
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          serviceId: service.service_id,
                          date: null,
                          time: "",
                        }));
                        setAvailableSlots([]);
                        setSlotError("");
                        setSendError("");
                        goNext();
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer text-left ${
                        data.serviceId === service.service_id
                          ? "border-gold bg-gold/5"
                          : "border-cream-dark/40 hover:border-gold/40"
                      }`}
                    >
                      <div>
                        <p className="font-sans text-sm font-medium text-charcoal">
                          {service.service_label}
                        </p>
                        <p className="font-sans text-xs text-charcoal/70 mt-0.5">
                          {formatDuration(service.duration_minutes)}
                        </p>
                      </div>
                      <span className="font-sans text-xs text-gold font-medium">
                        {service.price_label}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={goBack}
                  className="mt-6 flex items-center gap-1 font-sans text-xs text-charcoal/80 hover:text-gold transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} /> Retour
                </button>
              </motion.div>
            ) : null}

            {step === "date" ? (
              <motion.div
                key="date"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-serif text-xl text-charcoal mb-6 text-center">
                  Choisissez la date et l'heure
                </h3>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (calMonth === 0) {
                          setCalMonth(11);
                          setCalYear((year) => year - 1);
                        } else {
                          setCalMonth((month) => month - 1);
                        }
                      }}
                      disabled={!canGoPrevMonth()}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gold/10 text-charcoal-light disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="font-serif text-lg text-charcoal">
                      {MONTHS_FR[calMonth]} {calYear}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (calMonth === 11) {
                          setCalMonth(0);
                          setCalYear((year) => year + 1);
                        } else {
                          setCalMonth((month) => month + 1);
                        }
                      }}
                      disabled={!canGoNextMonth()}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gold/10 text-charcoal-light disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((label) => (
                      <div
                        key={label}
                        className="text-center font-sans text-[10px] tracking-wider uppercase text-charcoal/80"
                      >
                        {label}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                </div>

                {data.date ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="font-sans text-xs text-charcoal/70 mb-3">
                      Créneaux proposés le{" "}
                      {data.date.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>

                    {loadingSlots ? (
                      <div
                        className="flex items-center justify-center py-4 gap-2 text-charcoal-light/40"
                        role="status"
                        aria-live="polite"
                      >
                        <Loader2 size={16} className="animate-spin" />
                        <span className="font-sans text-sm">Chargement...</span>
                      </div>
                    ) : slotError ? (
                      <p className="font-sans text-sm text-charcoal/80 text-center py-4" aria-live="polite">
                        {slotError}
                      </p>
                    ) : availableSlots.length === 0 ? (
                      <p className="font-sans text-sm text-charcoal/80 text-center py-4" aria-live="polite">
                        Aucun créneau disponible ce jour. Essayez une autre date.
                      </p>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => {
                              setData((prev) => ({ ...prev, time: slot }));
                              setSendError("");
                            }}
                            className={`py-2 rounded-lg font-sans text-sm transition-all duration-200 cursor-pointer ${
                              data.time === slot
                                ? "bg-gold text-white shadow-[0_2px_10px_rgba(184,150,90,0.25)]"
                                : "bg-cream-dark/30 text-charcoal hover:bg-gold/10 hover:text-gold"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : null}

                <div className="flex items-center justify-between mt-8">
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1 font-sans text-xs text-charcoal/80 hover:text-gold transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={14} /> Retour
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!data.date || !data.time}
                    className="flex items-center gap-1 px-6 py-2.5 rounded-full bg-gold text-white font-sans text-sm tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_4px_16px_rgba(184,150,90,0.3)] transition-all duration-300 cursor-pointer"
                  >
                    Continuer <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ) : null}

            {step === "info" ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-serif text-xl text-charcoal mb-6 text-center">
                  Vos coordonnées
                </h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="booking-name" className="flex items-center gap-2 font-sans text-xs text-charcoal/80 mb-1.5">
                      <User size={14} /> Nom complet
                    </label>
                    <input
                      ref={nameInputRef}
                      id="booking-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={data.name}
                      onChange={(event) => {
                        setData((prev) => ({ ...prev, name: event.target.value }));
                        setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      placeholder="Votre nom"
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "booking-name-error" : undefined}
                      className={`w-full px-4 py-3 rounded-xl border bg-white/50 font-sans text-sm text-charcoal placeholder:text-charcoal/25 outline-none transition-all duration-300 focus:border-gold/60 focus:shadow-[0_0_0_3px_rgba(184,150,90,0.08)] ${
                        errors.name ? "border-rose" : "border-charcoal/20"
                      }`}
                    />
                    {errors.name ? (
                      <p id="booking-name-error" className="font-sans text-xs text-rose mt-1">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="booking-phone" className="flex items-center gap-2 font-sans text-xs text-charcoal/80 mb-1.5">
                      <Phone size={14} /> Téléphone
                    </label>
                    <input
                      ref={phoneInputRef}
                      id="booking-phone"
                      name="tel"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      value={data.phone}
                      onChange={(event) => {
                        setData((prev) => ({ ...prev, phone: event.target.value }));
                        setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      placeholder="06 00 00 00 00"
                      aria-invalid={errors.phone ? "true" : "false"}
                      aria-describedby={errors.phone ? "booking-phone-error" : undefined}
                      className={`w-full px-4 py-3 rounded-xl border bg-white/50 font-sans text-sm text-charcoal placeholder:text-charcoal/25 outline-none transition-all duration-300 focus:border-gold/60 focus:shadow-[0_0_0_3px_rgba(184,150,90,0.08)] ${
                        errors.phone ? "border-rose" : "border-charcoal/20"
                      }`}
                    />
                    {errors.phone ? (
                      <p id="booking-phone-error" className="font-sans text-xs text-rose mt-1">
                        {errors.phone}
                      </p>
                    ) : null}
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5">
                        <input
                          ref={consentInputRef}
                          id="booking-consent"
                          type="checkbox"
                          checked={data.consent}
                          onChange={(event) => {
                            setData((prev) => ({ ...prev, consent: event.target.checked }));
                            setErrors((prev) => ({ ...prev, consent: "" }));
                          }}
                          className="peer sr-only"
                          aria-invalid={errors.consent ? "true" : "false"}
                          aria-describedby={errors.consent ? "booking-consent-error" : undefined}
                        />
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[rgba(184,150,90,0.85)] ${
                            data.consent
                              ? "bg-emerald border-emerald"
                              : "border-cream-dark/60 group-hover:border-gold/60"
                          }`}
                        >
                          {data.consent ? (
                            <Check size={12} className="text-white" strokeWidth={3} />
                          ) : null}
                        </div>
                      </div>
                      <span className="font-sans text-xs text-charcoal/80 leading-relaxed">
                        J'accepte que mes données (nom, téléphone) soient utilisées pour
                        gérer mon rendez-vous. Consultez notre{" "}
                        <a
                          href="/politique-confidentialite/"
                          className="text-emerald underline hover:text-gold transition-colors"
                        >
                          politique de confidentialité
                        </a>
                      </span>
                    </label>
                    {errors.consent ? (
                      <p id="booking-consent-error" className="font-sans text-xs text-rose mt-1">
                        {errors.consent}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-10">
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1 font-sans text-xs text-charcoal/80 hover:text-gold transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={14} /> Retour
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={sending}
                    className="flex items-center gap-2 px-8 py-3 rounded-full bg-gold text-white font-sans text-sm font-medium tracking-wide shadow-[0_4px_16px_rgba(184,150,90,0.25)] hover:shadow-[0_6px_20px_rgba(184,150,90,0.35)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Confirmation...
                      </>
                    ) : (
                      <>
                        Confirmer mon rendez-vous
                        <Sparkles size={16} />
                      </>
                    )}
                  </button>
                </div>
                {sendError ? (
                  <p className="font-sans text-xs text-rose text-center mt-4" aria-live="polite">
                    {sendError}
                  </p>
                ) : null}
              </motion.div>
            ) : null}

            {step === "confirm" ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={40} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-3xl text-charcoal mb-4">
                  Votre rendez-vous est <span className="text-emerald italic">confirmé</span>
                </h3>
                <p className="font-sans text-sm text-charcoal/70 max-w-sm mx-auto mb-8 leading-relaxed">
                  Merci {data.name.split(" ")[0]}, nous avons bien reçu votre réservation pour le{" "}
                  <span className="font-medium text-charcoal">
                    {data.date?.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                    })}{" "}
                    à {data.time}
                  </span>
                  .
                </p>
                <div className="bg-cream-dark/20 rounded-xl p-4 mb-10 text-left border border-cream-dark/30">
                  <p className="font-sans text-[10px] tracking-widest uppercase text-gold font-bold mb-2">
                    Récapitulatif
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-xs text-charcoal/80">Soin :</span>
                    <span className="font-sans text-xs font-medium text-charcoal">
                      {selectedService?.service_label}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="font-sans text-sm text-gold hover:text-charcoal transition-colors underline underline-offset-4 cursor-pointer"
                >
                  Réserver un autre soin
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

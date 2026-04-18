import rawSiteSettings from "../../config/site-settings.json";

export type BusinessDayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface BusinessHoursEntry {
  label: string;
  open: string;
  close: string;
}

export interface SiteSettings {
  brand_name: string;
  site_description: string;
  timezone: string;
  city: string | null;
  address_lines: string[];
  phone_display: string | null;
  phone_href: string | null;
  instagram_url: string | null;
  hours: Record<BusinessDayKey, BusinessHoursEntry | null>;
  slot_interval_minutes: number;
  booking_window_months: number;
  booking_note: string | null;
  contact_note: string | null;
  legal_identity: {
    entity_name: string;
    business_description: string;
    siret: string | null;
  };
  host: {
    name: string;
    address_lines: string[];
    website: string;
  };
}

export const siteSettings = rawSiteSettings as SiteSettings;

export const orderedBusinessDays: BusinessDayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const frenchBusinessDayLabels: Record<BusinessDayKey, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

const dayIndexMap: Record<number, BusinessDayKey> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export function getBusinessDayKey(date: Date): BusinessDayKey {
  return dayIndexMap[date.getDay()];
}

export function getHoursForDate(date: Date) {
  return siteSettings.hours[getBusinessDayKey(date)];
}

export function getBusinessDayLabel(dayKey: BusinessDayKey) {
  return siteSettings.hours[dayKey]?.label || frenchBusinessDayLabels[dayKey];
}

export function hasAnyPracticalContactInfo() {
  return (
    Boolean(siteSettings.phone_display && siteSettings.phone_href) ||
    siteSettings.address_lines.length > 0 ||
    Boolean(siteSettings.instagram_url)
  );
}

export function hasPhoneContact() {
  return Boolean(siteSettings.phone_display && siteSettings.phone_href);
}

export function hasAddressContact() {
  return siteSettings.address_lines.length > 0;
}

export function hasInstagramContact() {
  return Boolean(siteSettings.instagram_url);
}

export function formatFrenchTime(time: string) {
  const [hours = "0", minutes = "00"] = time.split(":");
  return `${Number(hours)}h${minutes}`;
}

export function formatBusinessHours(entry: BusinessHoursEntry | null) {
  if (!entry) {
    return "Ferme";
  }

  return `${formatFrenchTime(entry.open)} - ${formatFrenchTime(entry.close)}`;
}

export function getWhatsAppHref() {
  if (!siteSettings.phone_href) {
    return null;
  }

  const digits = siteSettings.phone_href.replace(/^tel:/, "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

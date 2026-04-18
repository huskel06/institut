import rawCatalog from "../../config/service-catalog.json";

export interface ServiceCatalogItem {
  service_id: string;
  category_key: string;
  category_label: string;
  service_label: string;
  duration_minutes: number;
  price_label: string;
  active: boolean;
}

export interface BookingCategory {
  id: string;
  label: string;
  services: ServiceCatalogItem[];
}

export const serviceCatalog = rawCatalog as ServiceCatalogItem[];

export const activeServices = serviceCatalog.filter((service) => service.active);

export const bookingCategories: BookingCategory[] = activeServices.reduce<BookingCategory[]>(
  (categories, service) => {
    const existingCategory = categories.find((category) => category.id === service.category_key);

    if (existingCategory) {
      existingCategory.services.push(service);
      return categories;
    }

    categories.push({
      id: service.category_key,
      label: service.category_label,
      services: [service],
    });

    return categories;
  },
  []
);

export function getServiceById(serviceId: string) {
  return activeServices.find((service) => service.service_id === serviceId);
}

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bookings: defineTable({
    clientName: v.string(),
    phone: v.string(),
    categoryId: v.string(),
    serviceId: v.string(),
    serviceLabel: v.string(),
    date: v.string(), // ISO date string
    time: v.string(),
    consent: v.boolean(),
    status: v.optional(v.string()), // e.g. "confirmed", "completed", "cancelled"
    createdAt: v.number(),
  }).index("by_date", ["date"]),
  
  services: defineTable({
    serviceId: v.string(),
    categoryKey: v.string(),
    categoryLabel: v.string(),
    serviceLabel: v.string(),
    durationMinutes: v.number(),
    priceLabel: v.string(),
    active: v.boolean(),
  }).index("by_service_id", ["serviceId"]),

  offers: defineTable({
    title: v.string(),
    description: v.string(),
    badge: v.optional(v.string()),
    valid_until: v.optional(v.string()),
    active: v.boolean(),
    createdAt: v.number(),
  }),

  team_messages: defineTable({
    staff_name: v.string(),
    message: v.string(),
    date_from: v.string(),
    date_to: v.string(),
    active: v.boolean(),
    createdAt: v.number(),
  }),

  gallery: defineTable({
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
    alt_text: v.optional(v.string()),
    sort_order: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
  }),
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getActiveServices = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("services")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

export const seedServices = mutation({
  args: {
    services: v.array(
      v.object({
        serviceId: v.string(),
        categoryKey: v.string(),
        categoryLabel: v.string(),
        serviceLabel: v.string(),
        durationMinutes: v.number(),
        priceLabel: v.string(),
        active: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Delete existing services first to avoid duplicates if re-seeding
    const existing = await ctx.db.query("services").collect();
    for (const service of existing) {
      await ctx.db.delete(service._id);
    }
    
    for (const service of args.services) {
      await ctx.db.insert("services", service);
    }
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getActiveOffers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("offers")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

export const getAllOffers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("offers").order("desc").collect();
  },
});

export const createOffer = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    badge: v.optional(v.string()),
    valid_until: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("offers", {
      ...args,
      active: true,
      createdAt: Date.now(),
    });
  },
});

export const updateOffer = mutation({
  args: {
    id: v.id("offers"),
    title: v.string(),
    description: v.string(),
    badge: v.optional(v.string()),
    valid_until: v.optional(v.string()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const deleteOffer = mutation({
  args: { id: v.id("offers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getActiveMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("team_messages")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

export const getAllMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("team_messages").order("desc").collect();
  },
});

export const createMessage = mutation({
  args: {
    staff_name: v.string(),
    message: v.string(),
    date_from: v.string(),
    date_to: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("team_messages", {
      ...args,
      active: true,
      createdAt: Date.now(),
    });
  },
});

export const updateMessage = mutation({
  args: {
    id: v.id("team_messages"),
    staff_name: v.string(),
    message: v.string(),
    date_from: v.string(),
    date_to: v.string(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const deleteMessage = mutation({
  args: { id: v.id("team_messages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

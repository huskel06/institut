import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createBooking = mutation({
  args: {
    clientName: v.string(),
    phone: v.string(),
    categoryId: v.string(),
    serviceId: v.string(),
    serviceLabel: v.string(),
    date: v.string(),
    time: v.string(),
    consent: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", {
      ...args,
      status: "confirmed",
      createdAt: Date.now(),
    });
  },
});

export const getBookingsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    // Basic check: we trust the client for now, but in production
    // we would check identity if this were sensitive
    return await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

export const getAllBookings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bookings").order("desc").collect();
  },
});

export const updateBookingStatus = mutation({
  args: { id: v.id("bookings"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const getAvailableSlots = query({
  args: { date: v.string(), serviceId: v.string() },
  handler: async (ctx, args) => {
    const allSlots = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
    ];

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();

    const bookedTimes = bookings.map((b) => b.time);
    return allSlots.filter((slot) => !bookedTimes.includes(slot));
  },
});

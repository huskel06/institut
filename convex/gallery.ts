import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendImage = mutation({
  args: {
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
    alt_text: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const lastPhoto = await ctx.db.query("gallery").order("desc").first();
    const sort_order = (lastPhoto?.sort_order ?? -1) + 1;

    await ctx.db.insert("gallery", {
      ...args,
      sort_order,
      active: true,
      createdAt: Date.now(),
    });
  },
});

export const getPhotos = query({
  args: {},
  handler: async (ctx) => {
    const photos = await ctx.db
      .query("gallery")
      .filter((q) => q.eq(q.field("active"), true))
      .order("desc")
      .collect();

    return Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        src: (await ctx.storage.getUrl(photo.storageId)) ?? "",
      }))
    );
  },
});

export const getAllPhotos = query({
  args: {},
  handler: async (ctx) => {
    const photos = await ctx.db.query("gallery").order("desc").collect();
    return Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        src: (await ctx.storage.getUrl(photo.storageId)) ?? "",
      }))
    );
  },
});

export const deletePhoto = mutation({
  args: { id: v.id("gallery") },
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.id);
    if (photo) {
      await ctx.db.delete(args.id);
      // Optional: Delete from storage too if you want to be thorough
      // await ctx.storage.delete(photo.storageId);
    }
  },
});

export const updatePhoto = mutation({
  args: {
    id: v.id("gallery"),
    caption: v.optional(v.string()),
    alt_text: v.optional(v.string()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

import type { Id } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { createdBy: v.id("users") },
  handler: async (ctx, { createdBy }) => {
    const id = await ctx.db.insert("sizings", { createdBy, revealed: false });
    return id;
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id as Id<"sizings">);
  },
});

export const revealAll = mutation({
  args: { sizingId: v.id("sizings") },
  handler: async (ctx, { sizingId }) => {
    await ctx.db.patch(sizingId, { revealed: true });
  },
});

export const hideAll = mutation({
  args: { sizingId: v.id("sizings") },
  handler: async (ctx, { sizingId }) => {
    await ctx.db.patch(sizingId, { revealed: false });
  },
});

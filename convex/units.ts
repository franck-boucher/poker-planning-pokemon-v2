import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUserIdAndNumber = query({
  args: { userId: v.id("users"), number: v.number() },
  handler: async (ctx, { userId, number }) => {
    return await ctx.db
      .query("units")
      .withIndex("by_userId_and_number", (q) =>
        q.eq("userId", userId).eq("number", number),
      )
      .unique();
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    number: v.number(),
    lvl: v.number(),
    shiny: v.boolean(),
  },
  handler: async (ctx, { userId, number, lvl, shiny }) => {
    const id = await ctx.db.insert("units", { userId, number, lvl, shiny });
    return id;
  },
});

export const getById = query({
  args: { id: v.id("units") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getAllByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return (
      await ctx.db
        .query("units")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect()
    ).sort((a, b) => a.number - b.number);
  },
});

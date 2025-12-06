import type { Id } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id as Id<"users">);
  },
});

export const create = mutation({
  handler: async (ctx) => {
    const id = await ctx.db.insert("users", {});
    return id;
  },
});

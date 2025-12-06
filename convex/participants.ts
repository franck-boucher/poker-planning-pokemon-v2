import type { Id } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBySizingId = query({
  args: { sizingId: v.id("sizings") },
  handler: async (ctx, { sizingId }) => {
    return await ctx.db
      .query("participants")
      .withIndex("by_sizingId", (q) => q.eq("sizingId", sizingId))
      .collect();
  },
});

export const add = mutation({
  args: {
    sizingId: v.id("sizings"),
    userId: v.id("users"),
    unit: v.id("units"),
  },
  handler: async (ctx, { sizingId, userId, unit }) => {
    const id = await ctx.db.insert("participants", {
      sizingId,
      userId,
      unit,
      vote: null,
    });
    return id;
  },
});

export const getBySizingIdAndUserId = query({
  args: { sizingId: v.string(), userId: v.string() },
  handler: async (ctx, { sizingId, userId }) => {
    return await ctx.db
      .query("participants")
      .withIndex("by_sizingId_and_userId", (q) =>
        q
          .eq("sizingId", sizingId as Id<"sizings">)
          .eq("userId", userId as Id<"users">),
      )
      .unique();
  },
});

export const setVote = mutation({
  args: {
    participantId: v.id("participants"),
    vote: v.nullable(v.string()),
  },
  handler: async (ctx, { participantId, vote }) => {
    await ctx.db.patch(participantId, { vote });
  },
});

export const clearVotesBySizingId = mutation({
  args: { sizingId: v.id("sizings") },
  handler: async (ctx, { sizingId }) => {
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_sizingId", (q) => q.eq("sizingId", sizingId))
      .collect();
    for (const participant of participants) {
      await ctx.db.patch(participant._id, { vote: null });
    }
  },
});

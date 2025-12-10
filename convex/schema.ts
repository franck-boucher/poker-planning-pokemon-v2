import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({}),

  sizings: defineTable({
    createdBy: v.id("users"),
    state: v.union(
      v.literal("hidden"),
      v.literal("revealed"),
      v.literal("countdown"),
    ),
  }),

  units: defineTable({
    userId: v.id("users"),
    number: v.number(),
    lvl: v.number(),
    shiny: v.boolean(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_number", ["userId", "number"]),

  participants: defineTable({
    sizingId: v.id("sizings"),
    userId: v.id("users"),
    unit: v.id("units"),
    vote: v.nullable(v.string()),
  })
    .index("by_sizingId", ["sizingId"])
    .index("by_sizingId_and_userId", ["sizingId", "userId"]),
});

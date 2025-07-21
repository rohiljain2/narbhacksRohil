import type { Auth } from "convex/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

export const getWeightEntries = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("progress"),
    _creationTime: v.number(),
    userId: v.string(),
    weight: v.number(),
    date: v.string(),
    notes: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const entries = await ctx.db
      .query("progress")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();

    return entries;
  },
});

export const saveWeightEntry = mutation({
  args: {
    weight: v.number(),
    date: v.string(),
    notes: v.optional(v.string()),
  },
  returns: v.id("progress"),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const entryId = await ctx.db.insert("progress", {
      userId,
      weight: args.weight,
      date: args.date,
      notes: args.notes,
    });

    return entryId;
  },
});

export const deleteWeightEntry = mutation({
  args: {
    entryId: v.id("progress"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const entry = await ctx.db.get(args.entryId);
    if (!entry) {
      throw new Error("Weight entry not found");
    }

    if (entry.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.entryId);
    return null;
  },
}); 
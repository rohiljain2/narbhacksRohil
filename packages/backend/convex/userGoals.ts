import type { Auth } from "convex/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

export const getUserGoals = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("userGoals"),
      _creationTime: v.number(),
      userId: v.string(),
      weeklyActivityGoal: v.number(),
      calorieGoal: v.optional(v.number()),
      weightGoal: v.optional(v.number()),
      updatedAt: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const goals = await ctx.db
      .query("userGoals")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    return goals || null;
  },
});

export const setUserGoals = mutation({
  args: {
    weeklyActivityGoal: v.optional(v.number()),
    calorieGoal: v.optional(v.number()),
    weightGoal: v.optional(v.number()),
  },
  returns: v.id("userGoals"),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if user already has goals
    const existingGoals = await ctx.db
      .query("userGoals")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    const updatedAt = new Date().toISOString();

    if (existingGoals) {
      // Update existing goals
      const updates: any = { updatedAt };
      if (args.weeklyActivityGoal !== undefined) {
        updates.weeklyActivityGoal = args.weeklyActivityGoal;
      }
      if (args.calorieGoal !== undefined) {
        updates.calorieGoal = args.calorieGoal;
      }
      if (args.weightGoal !== undefined) {
        updates.weightGoal = args.weightGoal;
      }

      await ctx.db.patch(existingGoals._id, updates);
      return existingGoals._id;
    } else {
      // Create new goals with defaults
      const goalsId = await ctx.db.insert("userGoals", {
        userId,
        weeklyActivityGoal: args.weeklyActivityGoal ?? 5, // Default to 5 days per week
        calorieGoal: args.calorieGoal,
        weightGoal: args.weightGoal,
        updatedAt,
      });

      return goalsId;
    }
  },
});

export const setWeeklyGoal = mutation({
  args: {
    weeklyActivityGoal: v.number(),
  },
  returns: v.id("userGoals"),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Validate goal is reasonable (1-7 days per week)
    if (args.weeklyActivityGoal < 1 || args.weeklyActivityGoal > 7) {
      throw new Error("Weekly activity goal must be between 1 and 7 days");
    }

    // Check if user already has goals
    const existingGoals = await ctx.db
      .query("userGoals")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    const updatedAt = new Date().toISOString();

    if (existingGoals) {
      // Update existing goals
      await ctx.db.patch(existingGoals._id, {
        weeklyActivityGoal: args.weeklyActivityGoal,
        updatedAt,
      });
      return existingGoals._id;
    } else {
      // Create new goals
      const goalsId = await ctx.db.insert("userGoals", {
        userId,
        weeklyActivityGoal: args.weeklyActivityGoal,
        updatedAt,
      });

      return goalsId;
    }
  },
}); 
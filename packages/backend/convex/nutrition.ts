import type { Auth } from "convex/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

export const getMeals = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("nutrition"),
    _creationTime: v.number(),
    userId: v.string(),
    name: v.string(),
    type: v.union(v.literal("breakfast"), v.literal("lunch"), v.literal("dinner"), v.literal("snack")),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    date: v.string(),
  })),
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const meals = await ctx.db
      .query("nutrition")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();

    return meals;
  },
});

export const saveMeal = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("breakfast"), v.literal("lunch"), v.literal("dinner"), v.literal("snack")),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    date: v.string(),
  },
  returns: v.id("nutrition"),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const mealId = await ctx.db.insert("nutrition", {
      userId,
      name: args.name,
      type: args.type,
      calories: args.calories,
      protein: args.protein,
      carbs: args.carbs,
      fat: args.fat,
      date: args.date,
    });

    return mealId;
  },
});

export const deleteMeal = mutation({
  args: {
    mealId: v.id("nutrition"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const meal = await ctx.db.get(args.mealId);
    if (!meal) {
      throw new Error("Meal not found");
    }

    if (meal.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.mealId);
    return null;
  },
}); 
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
  }),
  
  workouts: defineTable({
    userId: v.string(),
    name: v.string(),
    date: v.string(),
    exercises: v.array(v.object({
      id: v.string(),
      name: v.string(),
      sets: v.number(),
      reps: v.number(),
      weight: v.number(),
      completed: v.boolean(),
    })),
    completed: v.boolean(),
  }),

  nutrition: defineTable({
    userId: v.string(),
    name: v.string(),
    type: v.union(v.literal("breakfast"), v.literal("lunch"), v.literal("dinner"), v.literal("snack")),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    date: v.string(),
  }),

  progress: defineTable({
    userId: v.string(),
    weight: v.number(),
    date: v.string(),
    notes: v.optional(v.string()),
  }),

  userGoals: defineTable({
    userId: v.string(),
    weeklyActivityGoal: v.number(), // Number of days per week user wants to be active
    calorieGoal: v.optional(v.number()), // Daily calorie goal
    weightGoal: v.optional(v.number()), // Target weight
    updatedAt: v.string(),
  }),
});

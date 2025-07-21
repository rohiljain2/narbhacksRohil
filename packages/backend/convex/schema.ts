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
});

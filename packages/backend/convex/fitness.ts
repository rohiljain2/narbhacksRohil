import type { Auth } from "convex/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

export const getWorkouts = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("workouts"),
    _creationTime: v.number(),
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
  })),
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const workouts = await ctx.db
      .query("workouts")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();

    return workouts;
  },
});

export const saveWorkout = mutation({
  args: {
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
  },
  returns: v.id("workouts"),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const workoutId = await ctx.db.insert("workouts", {
      userId,
      name: args.name,
      date: args.date,
      exercises: args.exercises,
      completed: args.completed,
    });

    return workoutId;
  },
});

export const updateWorkout = mutation({
  args: {
    workoutId: v.id("workouts"),
    exercises: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      sets: v.number(),
      reps: v.number(),
      weight: v.number(),
      completed: v.boolean(),
    }))),
    completed: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const workout = await ctx.db.get(args.workoutId);
    if (!workout) {
      throw new Error("Workout not found");
    }

    if (workout.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const updates: any = {};
    if (args.exercises !== undefined) {
      updates.exercises = args.exercises;
    }
    if (args.completed !== undefined) {
      updates.completed = args.completed;
    }

    await ctx.db.patch(args.workoutId, updates);
    return null;
  },
});

export const deleteWorkout = mutation({
  args: {
    workoutId: v.id("workouts"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const workout = await ctx.db.get(args.workoutId);
    if (!workout) {
      throw new Error("Workout not found");
    }

    if (workout.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.workoutId);
    return null;
  },
}); 
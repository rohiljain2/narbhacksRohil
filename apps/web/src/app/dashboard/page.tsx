"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import Link from "next/link";
import { useState } from "react";

interface Workout {
  _id: string;
  _creationTime: number;
  userId: string;
  name: string;
  date: string;
  exercises: Array<{
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight: number;
    completed: boolean;
  }>;
  completed: boolean;
}

interface Meal {
  _id: string;
  _creationTime: number;
  userId: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

interface WeightEntry {
  _id: string;
  _creationTime: number;
  userId: string;
  weight: number;
  date: string;
  notes?: string;
}

interface UserGoals {
  _id: string;
  _creationTime: number;
  userId: string;
  weeklyActivityGoal: number;
  calorieGoal?: number;
  weightGoal?: number;
  updatedAt: string;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  // Fetch data from Convex
  const workouts = useQuery(
    api.fitness.getWorkouts,
    userId ? {} : "skip"
  ) as Workout[] | undefined || [];

  const meals = useQuery(
    api.nutrition.getMeals,
    userId ? {} : "skip"
  ) as Meal[] | undefined || [];

  const weightEntries = useQuery(
    api.progress.getWeightEntries,
    userId ? {} : "skip"
  ) as WeightEntry[] | undefined || [];

  const userGoals = useQuery(
    api.userGoals.getUserGoals,
    userId ? {} : "skip"
  ) as UserGoals | null | undefined;

  const setWeeklyGoalMutation = useMutation(api.userGoals.setWeeklyGoal);

  // State for goal setting UI
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [newWeeklyGoal, setNewWeeklyGoal] = useState(5);

  // Calculate metrics
  const today = new Date().toISOString().split('T')[0];
  
  // Today's completed workouts
  const todaysWorkouts = workouts.filter(workout => 
    workout.date === today && workout.completed
  ).length;

  // Weekly goal - count unique active days in the last 7 days
  const last7Days = Array.from({length: 7}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const activeDays = new Set();
  
  // Count days with completed workouts
  workouts.forEach(workout => {
    if (last7Days.includes(workout.date) && workout.completed) {
      activeDays.add(workout.date);
    }
  });
  
  // Count days with logged meals
  meals.forEach(meal => {
    if (last7Days.includes(meal.date)) {
      activeDays.add(meal.date);
    }
  });
  
  // Use user's custom goal or default to 5 days per week (for progress tracking)
  const weeklyActivityGoal = userGoals?.weeklyActivityGoal ?? 5;
  const weeklyGoalText = `${activeDays.size}/7`;
  const goalMet = activeDays.size >= weeklyActivityGoal;

  // Calories burned from this week's workouts
  const calculateCaloriesBurned = () => {
    const weekWorkouts = workouts.filter(workout => 
      last7Days.includes(workout.date) && workout.completed
    );

    let totalCaloriesBurned = 0;
    
    weekWorkouts.forEach(workout => {
      // Calculate calories based on completed exercises
      const completedExercises = workout.exercises.filter(ex => ex.completed);
      let workoutCalories = 0;
      
      completedExercises.forEach(exercise => {
        // Estimate calories per exercise based on sets, reps, and weight
        // Base calories per set (rough estimation)
        let caloriesPerSet = 15; // Base value
        
        // Adjust based on intensity (more weight = more calories)
        if (exercise.weight > 0) {
          caloriesPerSet += Math.min(exercise.weight * 0.3, 20); // Cap the bonus
        }
        
        // Adjust based on reps (more reps = more calories)
        caloriesPerSet += exercise.reps * 0.5;
        
        workoutCalories += caloriesPerSet * exercise.sets;
      });
      
      // Minimum calories per completed workout (even if no exercises marked complete)
      if (workoutCalories === 0 && completedExercises.length === 0 && workout.completed) {
        workoutCalories = 150; // Base calories for any completed workout
      }
      
      totalCaloriesBurned += workoutCalories;
    });
    
    return Math.round(totalCaloriesBurned);
  };

  const caloriesBurned = calculateCaloriesBurned();

  // Activity streak - consecutive days with workouts or meals
  const calculateStreak = () => {
    const activityDates = new Set<string>();
    
    workouts.forEach(workout => {
      if (workout.completed) {
        activityDates.add(workout.date);
      }
    });
    
    meals.forEach(meal => {
      activityDates.add(meal.date);
    });
    
    // Sort dates in descending order
    const sortedDates = Array.from(activityDates).sort().reverse();
    
    let streak = 0;
    const currentDate = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const activityDate = new Date(sortedDates[i]);
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (activityDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const activityStreak = calculateStreak();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not signed in</h1>
          <Link 
            href="/sign-in"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">FitPro AI</h1>
              <span className="text-sm text-gray-600">Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}!</span>
            </div>
            <SignOutButton>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Goal Setting Prompt for New Users */}
        {!userGoals && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900">Set Your Weekly Activity Goal</h3>
                <p className="text-sm text-blue-700">
                  Customize your fitness journey by setting a weekly activity goal that works for you!
                </p>
              </div>
              <button
                onClick={() => {
                  setNewWeeklyGoal(5);
                  setShowGoalSetting(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Set Goal
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Workouts</h3>
            <p className="text-3xl font-bold text-blue-600">{todaysWorkouts}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
              <button
                onClick={() => {
                  setNewWeeklyGoal(weeklyActivityGoal);
                  setShowGoalSetting(true);
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Edit Goal
              </button>
            </div>
            <p className={`text-3xl font-bold ${goalMet ? 'text-green-600' : 'text-blue-600'}`}>
              {weeklyGoalText}
            </p>
            <p className="text-sm text-gray-600">
              Goal: {weeklyActivityGoal} days {goalMet && '✓'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Calories Burned</h3>
            <p className="text-3xl font-bold text-orange-600">{caloriesBurned.toLocaleString()}</p>
            <p className="text-sm text-gray-600">This Week</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Streak</h3>
            <p className="text-3xl font-bold text-purple-600">{activityStreak}</p>
            <p className="text-sm text-gray-600">Days</p>
          </div>
        </div>

        {/* Fitness Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/workouts" className="group">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💪</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Workouts</h3>
                  <p className="text-sm text-gray-600">Track your exercises and routines</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/nutrition" className="group">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🥗</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">Nutrition</h3>
                  <p className="text-sm text-gray-600">Log meals and track macros</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/progress" className="group">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">Progress</h3>
                  <p className="text-sm text-gray-600">Track weight and see trends</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/ai-coach" className="group">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600">AI Coach</h3>
                  <p className="text-sm text-gray-600">Get personalized advice</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Goal Setting Modal */}
      {showGoalSetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Your Weekly Activity Goal</h3>
            <p className="text-sm text-gray-600 mb-4">
              How many days per week do you want to be active? (Active = completing workouts or logging meals)
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days per week (1-7)
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={newWeeklyGoal}
                onChange={(e) => setNewWeeklyGoal(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={async () => {
                  try {
                    await setWeeklyGoalMutation({ weeklyActivityGoal: newWeeklyGoal });
                    setShowGoalSetting(false);
                  } catch (error) {
                    console.error("Failed to save goal:", error);
                    alert("Failed to save goal. Please try again.");
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Save Goal
              </button>
              <button
                onClick={() => setShowGoalSetting(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
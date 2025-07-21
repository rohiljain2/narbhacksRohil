"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import Link from "next/link";

// Define the workout exercise type
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
}

// Define the workout type
interface Workout {
  _id: Id<"workouts">;
  _creationTime: number;
  userId: string;
  name: string;
  date: string;
  exercises: Exercise[];
  completed: boolean;
  createdAt: string;
}

export default function WorkoutsPage() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const workouts = useQuery(
    api.fitness.getWorkouts,
    userId ? {} : "skip"
  ) as Workout[] | undefined || [];

  const saveWorkout = useMutation(api.fitness.saveWorkout);
  const updateWorkout = useMutation(api.fitness.updateWorkout);
  const deleteWorkout = useMutation(api.fitness.deleteWorkout);

  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    exercises: [
      { id: "1", name: "Push-ups", sets: 3, reps: 10, weight: 0, completed: false },
    ],
  });

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/sign-in" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Sign In
        </Link>
      </div>
    );
  }

  const handleAddWorkout = async () => {
    if (newWorkout.name.trim() && newWorkout.exercises.every(ex => ex.name.trim())) {
      await saveWorkout({
        name: newWorkout.name,
        date: new Date().toISOString().split("T")[0],
        exercises: newWorkout.exercises,
        completed: false,
      });
      setNewWorkout({
        name: "",
        exercises: [
          { id: "1", name: "Push-ups", sets: 3, reps: 10, weight: 0, completed: false },
        ],
      });
      setShowAddWorkout(false);
    }
  };

  const handleDeleteWorkout = async (workoutId: Id<"workouts">) => {
    if (confirm("Are you sure you want to delete this workout? This action cannot be undone.")) {
      await deleteWorkout({ workoutId });
    }
  };

  const handleExerciseToggle = async (workoutId: Id<"workouts">, exerciseId: string, completed: boolean) => {
    const workout = workouts.find((w) => w._id === workoutId);
    if (!workout) return;

    const updatedExercises = workout.exercises.map((exercise) =>
      exercise.id === exerciseId ? { ...exercise, completed } : exercise
    );

    const allCompleted = updatedExercises.every((exercise) => exercise.completed);
    
    await updateWorkout({
      workoutId,
      exercises: updatedExercises,
      completed: allCompleted,
    });
  };

  const addExercise = () => {
    const newId = (newWorkout.exercises.length + 1).toString();
    setNewWorkout({
      ...newWorkout,
      exercises: [
        ...newWorkout.exercises,
        { id: newId, name: "", sets: 3, reps: 10, weight: 0, completed: false },
      ],
    });
  };

  const removeExercise = (exerciseId: string) => {
    if (newWorkout.exercises.length > 1) {
      setNewWorkout({
        ...newWorkout,
        exercises: newWorkout.exercises.filter((ex) => ex.id !== exerciseId),
      });
    }
  };

  const updateExercise = (exerciseId: string, field: string, value: string | number) => {
    setNewWorkout({
      ...newWorkout,
      exercises: newWorkout.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      ),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Workouts</h1>
            </div>
            <button
              onClick={() => setShowAddWorkout(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              + Add Workout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Workout Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Total Workouts</h3>
            <p className="text-3xl font-bold text-purple-600">{workouts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
            <p className="text-3xl font-bold text-green-600">
              {workouts.filter((w) => w.completed).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">In Progress</h3>
            <p className="text-3xl font-bold text-blue-600">
              {workouts.filter((w) => !w.completed).length}
            </p>
          </div>
        </div>

        {/* Workout List */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Your Workouts</h2>
          </div>
          <div className="p-6">
            {workouts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No workouts yet. Add your first workout!</p>
            ) : (
              <div className="space-y-6">
                {workouts.map((workout) => (
                  <div key={workout._id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
                        <p className="text-sm text-gray-600">{workout.date}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            workout.completed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {workout.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteWorkout(workout._id)}
                        className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete workout"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-3">
                      {workout.exercises.map((exercise) => (
                        <div key={exercise.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={exercise.completed}
                              onChange={(e) => handleExerciseToggle(workout._id, exercise.id, e.target.checked)}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                              <p className="text-sm text-gray-600">
                                {exercise.sets} sets × {exercise.reps} reps
                                {exercise.weight > 0 && ` @ ${exercise.weight}lbs`}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Workout Modal */}
      {showAddWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Workout</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                placeholder="Workout Name (e.g., Upper Body)"
                className="w-full p-3 border border-gray-300 rounded"
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Exercises:</h4>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    + Add Exercise
                  </button>
                </div>
                {newWorkout.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="p-3 bg-gray-50 rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Exercise {index + 1}</span>
                      {newWorkout.exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExercise(exercise.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => updateExercise(exercise.id, "name", e.target.value)}
                      placeholder="Exercise name (e.g., Push-ups)"
                      className="w-full p-2 text-sm border border-gray-300 rounded"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Sets</label>
                        <input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(exercise.id, "sets", parseInt(e.target.value) || 0)}
                          min="1"
                          className="w-full p-2 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Reps</label>
                        <input
                          type="number"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(exercise.id, "reps", parseInt(e.target.value) || 0)}
                          min="1"
                          className="w-full p-2 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Weight (lbs)</label>
                        <input
                          type="number"
                          value={exercise.weight}
                          onChange={(e) => updateExercise(exercise.id, "weight", parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-full p-2 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddWorkout}
                  disabled={!newWorkout.name.trim() || !newWorkout.exercises.every(ex => ex.name.trim())}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add Workout
                </button>
                <button
                  onClick={() => setShowAddWorkout(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
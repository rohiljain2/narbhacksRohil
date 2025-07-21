"use client";

import { useState } from "react";
import Link from "next/link";

interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

export default function NutritionPage() {
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: "1",
      name: "Oatmeal with Berries",
      type: "breakfast",
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 8,
      date: "2024-01-15"
    },
    {
      id: "2",
      name: "Grilled Chicken Salad",
      type: "lunch",
      calories: 450,
      protein: 35,
      carbs: 15,
      fat: 22,
      date: "2024-01-15"
    },
    {
      id: "3",
      name: "Salmon with Rice",
      type: "dinner",
      calories: 580,
      protein: 42,
      carbs: 55,
      fat: 18,
      date: "2024-01-15"
    }
  ]);

  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: "",
    type: "breakfast" as Meal["type"],
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  const todayMeals = meals.filter(meal => meal.date === new Date().toISOString().split('T')[0]);
  
  const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = todayMeals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = todayMeals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = todayMeals.reduce((sum, meal) => sum + meal.fat, 0);

  const addMeal = () => {
    if (newMeal.name.trim()) {
      const meal: Meal = {
        id: Date.now().toString(),
        ...newMeal,
        date: new Date().toISOString().split('T')[0]
      };
      setMeals([...meals, meal]);
      setNewMeal({
        name: "",
        type: "breakfast",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      });
      setShowAddMeal(false);
    }
  };

  const deleteMeal = (mealId: string) => {
    if (confirm("Are you sure you want to delete this meal? This action cannot be undone.")) {
      setMeals(meals.filter(meal => meal.id !== mealId));
    }
  };

  const getMealTypeColor = (type: Meal["type"]) => {
    switch (type) {
      case "breakfast": return "bg-yellow-100 text-yellow-800";
      case "lunch": return "bg-green-100 text-green-800";
      case "dinner": return "bg-blue-100 text-blue-800";
      case "snack": return "bg-purple-100 text-purple-800";
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Nutrition</h1>
            </div>
            <button
              onClick={() => setShowAddMeal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              + Log Meal
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Macro Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Calories</h3>
            <p className="text-3xl font-bold text-orange-600">{totalCalories}</p>
            <p className="text-sm text-gray-600">Goal: 2,000</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Protein</h3>
            <p className="text-3xl font-bold text-red-600">{totalProtein}g</p>
            <p className="text-sm text-gray-600">Goal: 150g</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Carbs</h3>
            <p className="text-3xl font-bold text-blue-600">{totalCarbs}g</p>
            <p className="text-sm text-gray-600">Goal: 200g</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Fat</h3>
            <p className="text-3xl font-bold text-yellow-600">{totalFat}g</p>
            <p className="text-sm text-gray-600">Goal: 65g</p>
          </div>
        </div>

        {/* Today's Meals */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Today's Meals</h2>
          </div>
          <div className="p-6">
            {todayMeals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No meals logged today. Add your first meal!</p>
            ) : (
              <div className="space-y-4">
                {todayMeals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getMealTypeColor(meal.type)}`}>
                        {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-900">{meal.name}</h3>
                        <p className="text-sm text-gray-600">
                          {meal.calories} cal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete meal"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Meals */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Meals</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {meals.slice(0, 5).map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getMealTypeColor(meal.type)}`}>
                      {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900">{meal.name}</h3>
                      <p className="text-sm text-gray-600">
                        {meal.calories} cal • {meal.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                    </div>
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete meal"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Meal Modal */}
        {showAddMeal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Log New Meal</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                  placeholder="Meal name..."
                  className="w-full p-3 border border-gray-300 rounded"
                />
                <select
                  value={newMeal.type}
                  onChange={(e) => setNewMeal({...newMeal, type: e.target.value as Meal["type"]})}
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Calories
                    </label>
                    <input
                      type="number"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({...newMeal, calories: parseInt(e.target.value) || 0})}
                      placeholder="e.g., 450"
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Total calories in this meal</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Protein (g)
                      </label>
                      <input
                        type="number"
                        value={newMeal.protein}
                        onChange={(e) => setNewMeal({...newMeal, protein: parseInt(e.target.value) || 0})}
                        placeholder="e.g., 25"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Grams of protein</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Carbs (g)
                      </label>
                      <input
                        type="number"
                        value={newMeal.carbs}
                        onChange={(e) => setNewMeal({...newMeal, carbs: parseInt(e.target.value) || 0})}
                        placeholder="e.g., 45"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Grams of carbohydrates</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Fat (g)
                      </label>
                      <input
                        type="number"
                        value={newMeal.fat}
                        onChange={(e) => setNewMeal({...newMeal, fat: parseInt(e.target.value) || 0})}
                        placeholder="e.g., 15"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Grams of fat</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={addMeal}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Log Meal
                  </button>
                  <button
                    onClick={() => setShowAddMeal(false)}
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
    </div>
  );
} 
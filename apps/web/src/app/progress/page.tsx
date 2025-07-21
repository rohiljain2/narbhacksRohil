"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import Link from "next/link";

interface WeightEntry {
  _id: Id<"progress">;
  _creationTime: number;
  userId: string;
  weight: number;
  date: string;
  notes?: string;
}

export default function ProgressPage() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const weightEntries = useQuery(
    api.progress.getWeightEntries,
    userId ? {} : "skip"
  ) as WeightEntry[] | undefined || [];

  const saveWeightEntry = useMutation(api.progress.saveWeightEntry);
  const deleteWeightEntryMutation = useMutation(api.progress.deleteWeightEntry);

  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState({ weight: 0, notes: "" });

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

  const addWeightEntry = async () => {
    if (newWeight.weight > 0) {
      await saveWeightEntry({
        weight: newWeight.weight,
        date: new Date().toISOString().split('T')[0],
        notes: newWeight.notes || undefined
      });
      setNewWeight({ weight: 0, notes: "" });
      setShowAddWeight(false);
    }
  };

  const handleDeleteWeightEntry = async (entryId: Id<"progress">) => {
    if (confirm("Are you sure you want to delete this weight entry? This action cannot be undone.")) {
      await deleteWeightEntryMutation({ entryId });
    }
  };

  const totalLoss = weightEntries.length > 1 
    ? weightEntries[0].weight - weightEntries[weightEntries.length - 1].weight 
    : 0;

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
              <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
            </div>
            <button
              onClick={() => setShowAddWeight(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              + Log Weight
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Current Weight</h3>
            <p className="text-3xl font-bold text-purple-600">
              {weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : 0} lbs
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Total Loss</h3>
            <p className="text-3xl font-bold text-green-600">
              {totalLoss > 0 ? `-${totalLoss}` : totalLoss} lbs
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Entries</h3>
            <p className="text-3xl font-bold text-blue-600">{weightEntries.length}</p>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Weight Progress</h2>
          </div>
          <div className="p-6">
            {weightEntries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No weight entries yet. Log your first weight!</p>
            ) : (
              <div className="space-y-4">
                {weightEntries.slice().reverse().map((entry) => (
                  <div key={entry._id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div>
                      <h3 className="font-medium text-gray-900">{entry.weight} lbs</h3>
                      <p className="text-sm text-gray-600">{entry.date}</p>
                      {entry.notes && <p className="text-sm text-gray-500">{entry.notes}</p>}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-600">
                        {weightEntries.indexOf(entry) > 0 && (
                          <span className={`px-2 py-1 rounded ${
                            entry.weight < weightEntries[weightEntries.indexOf(entry) - 1].weight
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.weight < weightEntries[weightEntries.indexOf(entry) - 1].weight ? '↓' : '↑'}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteWeightEntry(entry._id)}
                        className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete weight entry"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Weight Modal */}
      {showAddWeight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Log Weight</h3>
            <div className="space-y-4">
              <input
                type="number"
                value={newWeight.weight}
                onChange={(e) => setNewWeight({...newWeight, weight: parseFloat(e.target.value) || 0})}
                placeholder="Weight (lbs)"
                className="w-full p-3 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={newWeight.notes}
                onChange={(e) => setNewWeight({...newWeight, notes: e.target.value})}
                placeholder="Notes (optional)"
                className="w-full p-3 border border-gray-300 rounded"
              />
              <div className="flex space-x-3">
                <button
                  onClick={addWeightEntry}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Log Weight
                </button>
                <button
                  onClick={() => setShowAddWeight(false)}
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
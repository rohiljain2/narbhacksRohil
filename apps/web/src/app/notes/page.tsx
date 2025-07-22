"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import Link from "next/link";

// Define the note type
interface Note {
  _id: Id<"notes">;
  _creationTime: number;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NotesPage() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const notes = useQuery(
    api.notes.getNotes,
    userId ? {} : "skip"
  ) as Note[] | undefined || [];

  const createNote = useMutation(api.notes.createNote);
  const deleteNote = useMutation(api.notes.deleteNote);

  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
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

  const handleAddNote = async () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      await createNote({
        title: newNote.title,
        content: newNote.content,
        isSummary: false,
      });
      setNewNote({
        title: "",
        content: "",
      });
      setShowAddNote(false);
    }
  };

  const handleDeleteNote = async (noteId: Id<"notes">) => {
    if (confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      await deleteNote({ noteId });
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
              <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
            </div>
            <button
              onClick={() => setShowAddNote(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              + Add Note
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 text-lg">No notes yet. Create your first note!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{note.title}</h3>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                    title="Delete note"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Note</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Note Title"
                className="w-full p-3 border border-gray-300 rounded"
              />
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Note Content"
                rows={6}
                className="w-full p-3 border border-gray-300 rounded"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.title.trim() || !newNote.content.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add Note
                </button>
                <button
                  onClick={() => setShowAddNote(false)}
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

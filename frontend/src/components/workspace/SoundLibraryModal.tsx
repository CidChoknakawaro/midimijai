// frontend/src/components/workspace/SoundLibraryModal.tsx
import React, { useState } from "react";
import Modal from "../../components/shared/Modal";

const CATEGORIES = ["Keyboard/Synth", "Drums", "Bass", "Strings"];

interface SoundLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** called when user uploads or selects a sample File from the library */
  onImportSample: (file: File) => void;
}

export default function SoundLibraryModal({
  isOpen,
  onClose,
  onImportSample,
}: SoundLibraryModalProps) {
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch]     = useState("");

  if (!isOpen) return null;

  // dummy 12 items per category
  const items = category
    ? Array.from({ length: 12 }, (_, i) => `${category} Track ${i + 1}`)
    : CATEGORIES;

  return (
    <Modal onClose={() => { setCategory(null); onClose(); }}>
      <div className="w-[600px] p-4">
        {!category && <h3 className="text-xl font-semibold mb-4">Sound Library</h3>}
        <div className="flex items-center mb-4">
          {category && (
            <button
              onClick={() => setCategory(null)}
              className="mr-2 text-sm text-gray-600"
            >
              ← Back
            </button>
          )}
          <input
            type="text"
            placeholder={`Search ${category ?? ""}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
          />
        </div>

        {!category ? (
          <div className="grid grid-cols-3 gap-4">
            {items.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-center"
              >
                {cat}
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-80 overflow-auto">
            {items.map((name) => (
              <div
                key={name}
                className="flex justify-between items-center px-3 py-2 hover:bg-gray-50 rounded"
              >
                <span>{name}</span>
                <div className="space-x-2">
                  <button title="Preview">⟳</button>
                  <button title="Play">▶️</button>
                  <button title="Favorite">☆</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {category && (
          <div className="mt-4 flex justify-end space-x-2">
            <label className="px-4 py-2 bg-gray-200 rounded cursor-pointer">
              Upload Track
              <input
                type="file"
                accept=".mid"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onImportSample(f);
                }}
              />
            </label>
            <button
              onClick={() => {
                /* TODO: select highlighted item */
              }}
              className="px-4 py-2 bg-teal-500 text-white rounded"
            >
              Select Track
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

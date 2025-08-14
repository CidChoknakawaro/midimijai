import React, { useCallback, useMemo, useRef, useState } from "react";
import Modal from "../shared/Modal";

const CATEGORIES = ["Keyboard/Synth", "Drums", "Bass", "Strings"] as const;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  /** Upload/import a MIDI file into the current project */
  onImportSample: (file: File) => void;
};

export default function SoundLibraryModal({
  isOpen,
  onClose,
  onImportSample,
}: Props) {
  // ⚠️ All hooks are declared unconditionally (before any early return)
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClose = useCallback(() => {
    setCategory(null);
    onClose();
  }, [onClose]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) {
        onImportSample(f);
        // reset the input so the same file can be chosen again if needed
        e.target.value = "";
      }
    },
    [onImportSample]
  );

  const items = useMemo(() => {
    const pool = category
      ? Array.from({ length: 12 }, (_, i) => `${category} Track ${i + 1}`)
      : [...CATEGORIES];

    const q = search.trim().toLowerCase();
    return q ? pool.filter((x) => x.toLowerCase().includes(q)) : pool;
  }, [category, search]);

  // Early return AFTER hooks are defined so the hook order never changes
  if (!isOpen) return null;

  return (
    <Modal onClose={handleClose}>
      <div className="w-[600px] p-4">
        {!category && (
          <h3 className="text-xl font-semibold mb-4">Sound Library</h3>
        )}

        {/* Search + back */}
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

        {/* Grid / list */}
        {!category ? (
          <div className="grid grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
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

        {/* Bottom actions */}
        <div className="mt-4 flex justify-between items-center">
          {/* Hidden file input is always mounted -> no hook reordering issues */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".mid"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={openFilePicker}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Upload MIDI
          </button>

          {category && (
            <button
              onClick={() => {
                // (Optional) later: select highlighted item from the list
              }}
              className="px-4 py-2 bg-teal-500 text-white rounded"
            >
              Select Track
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

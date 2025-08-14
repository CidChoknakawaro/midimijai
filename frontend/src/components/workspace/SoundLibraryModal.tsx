// frontend/src/components/workspace/SoundLibraryModal.tsx
import React, { useRef } from "react";
import { publish } from "./midi-editor/core/editorBus";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SoundLibraryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const triggerPick = () => fileRef.current?.click();

  const handlePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Hand off to editor via event bus
    publish({ type: "IMPORT_SAMPLE", file });
    // reset & close
    e.target.value = "";
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-[720px] max-w-[90vw] rounded-lg bg-white shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Sound Library</h2>
          <button
            className="rounded px-2 py-1 text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Simple categories (placeholder UI) */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button className="h-14 rounded-md border hover:bg-gray-50">Keyboard/Synth</button>
          <button className="h-14 rounded-md border hover:bg-gray-50">Drums</button>
          <button className="h-14 rounded-md border hover:bg-gray-50">Bass</button>
          <button className="h-14 rounded-md border hover:bg-gray-50">Strings</button>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Import a custom audio sample to use as an instrument on the current track.
          </div>
          <button
            onClick={triggerPick}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Import sound
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handlePick}
          />
        </div>
      </div>
    </div>
  );
};

export default SoundLibraryModal;

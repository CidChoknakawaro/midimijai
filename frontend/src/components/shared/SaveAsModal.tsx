import React, { useEffect, useState } from "react";
import Modal from "./Modal";

interface SaveAsModalProps {
  isOpen: boolean;
  initialName: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
}

export default function SaveAsModal({
  isOpen,
  initialName,
  onSave,
  onCancel,
}: SaveAsModalProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  return (
    <Modal title="Save Project As…" onClose={onCancel}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-4"
      />
      <div className="flex justify-end space-x-2">
        <button onClick={onCancel} className="px-4 py-2">
          Cancel
        </button>
        <button
          onClick={() => onSave(name)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

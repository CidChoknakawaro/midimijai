import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { getAllProjects } from "../../services/projectService";

interface OpenProjectModalProps {
  isOpen: boolean;
  onSelect: (projectId: number) => void;
  onCancel: () => void;
}

export default function OpenProjectModal({
  isOpen,
  onSelect,
  onCancel,
}: OpenProjectModalProps) {
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getAllProjects()
      .then((list) =>
        setProjects(list.map((p: any) => ({ id: p.id, name: p.name })))
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal title="Open Project" onClose={onCancel}>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul className="max-h-60 overflow-auto space-y-2">
          {projects.map((proj) => (
            <li key={proj.id}>
              <button
                onClick={() => onSelect(proj.id)}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
              >
                {proj.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-end mt-4">
        <button onClick={onCancel} className="px-4 py-2">
          Cancel
        </button>
      </div>
    </Modal>
  );
}

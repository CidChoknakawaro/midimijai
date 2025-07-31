import React, { useState } from "react";
import { useProjects } from "../../hooks/useProjects";
import { useNavigate } from "react-router-dom";
import { exportProject } from "../../utils/exportProject";
import Modal from "../shared/Modal";

interface ProjectActionsProps {
  projectId: number;
  name: string;
  data: any;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({
  projectId,
  name,
  data,
}) => {
  const { addProject, renameProject } = useProjects();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newName, setNewName] = useState(name);

  // R → open rename
  const onRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRenameModal(true);
  };

  // confirm rename
  const onConfirmRename = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await renameProject(projectId, newName, data);
    setShowRenameModal(false);
    window.location.reload();
  };

  // d → duplicate
  const onDuplicateClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addProject(`${name} (Copy)`, JSON.parse(data));
    window.location.reload();
  };

  // E → edit (also navigates)
  // **E → Export**  
  const onExportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    exportProject(data, name);
  };

  return (
    <>
      <div className="flex space-x-2">
        <button
          title="Rename"
          onClick={onRenameClick}
          className="rounded-full border px-2 py-1"
        >
          R
        </button>
        <button
          title="Duplicate"
          onClick={onDuplicateClick}
          className="rounded-full border px-2 py-1"
        >
          d
        </button>
        <button
          title="Export"
          onClick={onExportClick}
          className="rounded-full border px-2 py-1"
        >
          E
        </button>
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <Modal onClose={() => setShowRenameModal(false)}>
          <h3>Rename Project</h3>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full mt-4 mb-4 p-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowRenameModal(false);
              }}
            >
              Cancel
            </button>
            <button onClick={onConfirmRename}>Rename</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProjectActions;

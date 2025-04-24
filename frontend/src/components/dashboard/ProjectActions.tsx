import React, { useState } from "react";
import { useProjects } from "../../hooks/useProjects";
import { useNavigate } from "react-router-dom";
import Modal from "../shared/Modal";

interface ProjectActionsProps {
  projectId: number;
  name: string;
  data: string;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ projectId, name, data }) => {
  const { addProject, removeProject, renameProject } = useProjects();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleEdit = () => {
    localStorage.setItem("activeProjectId", projectId.toString());
    navigate("/workspace");
  };

  const handleRename = async () => {
    await renameProject(projectId, newName, data);
    setShowRenameModal(false);
    window.location.reload();
  };

  const handleDelete = async () => {
    await removeProject(projectId);
    setShowDeleteModal(false);
    window.location.reload();
  };

  const handleDuplicate = async () => {
    await addProject(`${name} (Copy)`, data);
    window.location.reload();
  };

  return (
    <>
      <div className="flex space-x-2">
        <button title="Rename" onClick={() => setShowRenameModal(true)} className="rounded border px-2 py-1">R</button>
        <button title="Duplicate" onClick={handleDuplicate} className="rounded border px-2 py-1">d</button>
        <button title="Edit" onClick={handleEdit} className="rounded border px-2 py-1">E</button>
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <Modal onClose={() => setShowRenameModal(false)}>
          <h3>Rename Project</h3>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ width: "100%", marginTop: "1rem", marginBottom: "1rem", padding: "0.5rem" }}
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowRenameModal(false)}>Cancel</button>
            <button onClick={handleRename}>Rename</button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h3>Delete Project?</h3>
          <p>Are you sure you want to delete <strong>{name}</strong>?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button onClick={handleDelete} style={{ color: "red" }}>Delete</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProjectActions;

import React, { useState } from "react";
import ProjectActions from "./ProjectActions";
import { useProjects } from "../../hooks/useProjects";
import { useNavigate } from "react-router-dom";
import Modal from "../shared/Modal";

interface Project {
  id: number;
  name: string;
  created_at: string;
  duration: string;
  data: string;
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const { removeProject } = useProjects();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 1) Clicking the row → go to workspace
  const handleRowClick = () => {
    localStorage.setItem("activeProjectId", project.id.toString());
    navigate("/workspace");
  };

  // 2) Open the delete-confirm modal
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  // 3) Confirm deletion
  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await removeProject(project.id);
    setShowDeleteModal(false);
    window.location.reload();
  };

  return (
    <>
      <div
        onClick={handleRowClick}
        className="
          flex items-center justify-between
          gap-4
          border 
          rounded-full 
          px-4 py-2 mb-2
          whitespace-nowrap overflow-x-auto
          text-sm
          cursor-pointer
          hover:bg-gray-50
        "
      >
        {/* Delete button */}
        <button
          title="Delete"
          onClick={handleDeleteClick}
          className="rounded-full border px-2 py-1 font-bold"
        >
          D
        </button>

        {/* Name + Date */}
        <div className="flex-1 flex items-center gap-2">
          <span className="font-semibold">{project.name}</span>
          <span className="text-gray-700">
            {project.created_at.split("T")[0]}
          </span>
        </div>

        {/* R / d / E buttons */}
        <ProjectActions
          projectId={project.id}
          name={project.name}
          data={project.data}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h3>Delete Project?</h3>
          <p>
            Are you sure you want to delete <strong>{project.name}</strong>?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(false);
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              style={{ color: "red" }}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProjectCard;

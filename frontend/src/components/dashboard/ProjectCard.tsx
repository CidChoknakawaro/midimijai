import React, { useState } from "react";
import ProjectActions from "./ProjectActions";
import { useProjects } from "../../hooks/useProjects";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    await removeProject(project.id);
    setShowDeleteModal(false);
    window.location.reload();
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 border rounded-full px-4 py-2 mb-2 whitespace-nowrap overflow-x-auto text-sm">
        {/* D button opens delete modal */}
        <button
          title="Delete"
          onClick={() => setShowDeleteModal(true)}
          className="rounded-full border px-2 py-1 font-bold"
        >
          D
        </button>

        {/* Project name + date */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">{project.name}</span>
          <span className="text-gray-700">{project.created_at.split("T")[0]}</span>
        </div>

        {/* Duration */}
        <span className="text-gray-500">{project.duration}</span>

        {/* Actions */}
        <ProjectActions
          projectId={project.id}
          name={project.name}
          data={project.data}
        />
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h3>Delete Project?</h3>
          <p>
            Are you sure you want to delete <strong>{project.name}</strong>?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button onClick={handleDelete} style={{ color: "red" }}>Delete</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProjectCard;

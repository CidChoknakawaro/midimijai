import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../shared/Modal";
import { useProjects } from "../../hooks/useProjects";
import { exportProject } from "../../utils/exportProject";

type Project = {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  data?: any;
};

interface Props {
  projects: Project[];
}

const normalizeDataForDuplicate = (data: any) => {
  try {
    return typeof data === "string" ? JSON.parse(data) : data ?? {};
  } catch {
    return {};
  }
};

const normalizeDataForExport = (data: any) => {
  try {
    return typeof data === "string" ? data : JSON.stringify(data ?? {});
  } catch {
    return JSON.stringify({});
  }
};

const Row: React.FC<{ project: Project; onChanged: () => void }> = ({
  project,
  onChanged,
}) => {
  const navigate = useNavigate();
  const { removeProject, renameProject, addProject } = useProjects();

  const [showDelete, setShowDelete] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [newName, setNewName] = useState(project.name || "Untitled");

  const handleOpen = () => {
    localStorage.setItem("activeProjectId", String(project.id));
    navigate("/workspace");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDelete(true);
  };
  const confirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await removeProject(project.id);
    setShowDelete(false);
    onChanged();
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRename(true);
  };
  const confirmRename = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const data = normalizeDataForDuplicate(project.data);
    await renameProject(project.id, newName, data);
    setShowRename(false);
    onChanged();
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const data = normalizeDataForDuplicate(project.data);
    await addProject(`${project.name} (Copy)`, data);
    onChanged();
  };

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const json = normalizeDataForExport(project.data);
    exportProject(json, project.name || "project");
  };

  return (
    <>
      <div
        onClick={handleOpen}
        className="
          relative flex items-center justify-between
          px-5 h-12 rounded-xl
          bg-[#e9dcc9] shadow-[inset_0_2px_0_rgba(255,255,255,0.7),0_8px_16px_-8px_rgba(0,0,0,0.35)]
          border border-black/10 cursor-pointer
        "
      >
        {/* Left side: delete + name */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-full hover:brightness-110"
            title="Delete"
          >
            <img src="delete.png" alt="Delete" className="w-5 h-5" />
          </button>
          <span className="truncate font-medium text-[14px]">
            {project.name || "Untitled"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleRename} title="Rename">
            <img src="rename.png" alt="Rename" className="w-4 h-4" />
          </button>
          <button onClick={handleDuplicate} title="Duplicate">
            <img src="duplicate.png" alt="Duplicate" className="w-4 h-4" />
          </button>
          <button onClick={handleExport} title="Export">
            <img src="export.png" alt="Export" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showDelete && (
        <Modal onClose={() => setShowDelete(false)}>
          <h3 className="text-lg font-semibold mb-2">Delete Project?</h3>
          <p className="mb-4">
            Are you sure you want to delete <strong>{project.name}</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowDelete(false)}>Cancel</button>
            <button onClick={confirmDelete} style={{ color: "red" }}>
              Delete
            </button>
          </div>
        </Modal>
      )}

      {showRename && (
        <Modal onClose={() => setShowRename(false)}>
          <h3 className="text-lg font-semibold mb-2">Rename Project</h3>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full mt-2 mb-4 p-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowRename(false)}>Cancel</button>
            <button onClick={confirmRename}>Rename</button>
          </div>
        </Modal>
      )}
    </>
  );
};

const ProjectList: React.FC<Props> = ({ projects }) => {
  const forceRefresh = () => window.location.reload();

  return (
    <div
      className="overflow-y-auto px-6 py-3 rounded-[28px]"
      style={{
        maxHeight: "calc(100vh - 280px)",
        scrollbarColor: "#121633 #e9dcc9",
        scrollbarWidth: "thin",
      }}
    >
      {/* width cap + centered */}
      <div className="mx-auto w-[95%] max-w-[1200px]">
        <div className="space-y-3">
          {projects.length === 0 && (
            <div className="text-center text-black/60 py-8">No projects yet</div>
          )}
          {projects.map((p) => (
            <Row key={p.id} project={p} onChanged={forceRefresh} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
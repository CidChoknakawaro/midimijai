

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getProjectById } from "../services/projectService";
import WorkspaceNavBar from "../components/workspace/WorkspaceNavBar";
import AIGenerate from "../components/workspace/AIGenerate";
import AIModify from "../components/workspace/AIModify";
import AIStyleTransfer from "../components/workspace/AIStyleTransfer";
import MidiEditorCore from "../components/workspace/midi-editor/core/MidiEditorCore";
import LoadingSpinner from "../components/shared/LoadingSpinner";

interface Project {
  id: number;
  name: string;
  data: { bpm: number; tracks: any[] };
}

const WorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const idStr = localStorage.getItem("activeProjectId");
    if (!idStr) {
      toast.error("No active project selected");
      return navigate("/dashboard");
    }
    const id = parseInt(idStr, 10);

    getProjectById(id)
      .then((data) => setProject(data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load project");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <LoadingSpinner />;
  if (!project) return null;

  return (
    <div className="flex h-screen">
      {/* AI Sidebar */}
      <aside
        className={`
          relative flex-shrink-0 bg-gray-100 overflow-hidden
          transition-all duration-300
          ${sidebarOpen ? "w-64 p-4 space-y-4" : "w-8 p-1"}
        `}
      >
        {/* collapse/expand handle */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="
            absolute top-4 right-0
            -mr-4 p-1 bg-gray-100 border border-gray-300 rounded-full
            hover:bg-gray-200
          "
        >
          {sidebarOpen ? "<" : ">"}
        </button>

        {sidebarOpen && (
          <>
            <div className="bg-white rounded-lg p-4">
              <AIGenerate />
            </div>
            <div className="bg-white rounded-lg p-4">
              <AIModify />
            </div>
            <div className="bg-white rounded-lg p-4">
              <AIStyleTransfer />
            </div>
          </>
        )}
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col">
        <WorkspaceNavBar />

        <div className="flex-1 overflow-auto p-4">
          <h2 className="text-xl font-semibold mb-4">{project.name}</h2>
          <MidiEditorCore
            projectId={project.id}
            bpm={project.data.bpm}
            initialTracks={project.data.tracks}
            onSave={(bpm, tracks) => {
              // TODO: call updateProject(...) here
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;

import React, { useState, useEffect } from "react";
import WorkspaceNavBar from "../components/workspace/WorkspaceNavBar";
import AIGenerate from "../components/workspace/AIGenerate";
import AIModify from "../components/workspace/AIModify";
import AIStyleTransfer from "../components/workspace/AIStyleTransfer";
import MidiEditorCore from "../components/workspace/midi-editor/core/MidiEditorCore";
import { useProjects } from "../hooks/useProjects";

const WorkspacePage: React.FC = () => {
  const { projects } = useProjects();
  const [projectName, setProjectName] = useState<string>("");

  // read the activeProjectId set by the dashboard
  useEffect(() => {
    const activeId = localStorage.getItem("activeProjectId");
    if (activeId) {
      const proj = projects.find((p) => String(p.id) === activeId);
      setProjectName(proj?.name || "");
    }
  }, [projects]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Project Header */}
      <div className="px-6 py-4 bg-white border-b">
        <h1 className="text-2xl font-semibold">{projectName}</h1>
      </div>

      {/* DAW-style Top Bar */}
      <WorkspaceNavBar />

      {/* Main Content: AI tools on left, editor on right */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r bg-white p-4 overflow-y-auto">
          <AIGenerate />
          <AIModify />
          <AIStyleTransfer />
        </aside>
        <main className="flex-1 bg-gray-100 p-6 overflow-hidden">
          <MidiEditorCore />
        </main>
      </div>
    </div>
  );
};

export default WorkspacePage;

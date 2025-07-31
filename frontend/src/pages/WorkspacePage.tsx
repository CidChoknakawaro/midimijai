import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
} from "../services/projectService";
import { importMidiFile } from "../components/workspace/midi-editor/core/importMidi";
import { exportMidi } from "../components/workspace/midi-editor/core/exportMidi";

import WorkspaceNavBar from "../components/workspace/WorkspaceNavBar";
import AIGenerate from "../components/workspace/AIGenerate";
import AIModify from "../components/workspace/AIModify";
import AIStyleTransfer from "../components/workspace/AIStyleTransfer";
import MidiEditorCore from "../components/workspace/midi-editor/core/MidiEditorCore";
import LoadingSpinner from "../components/shared/LoadingSpinner";

import OpenProjectModal from "../components/shared/OpenProjectModal";
import SaveAsModal from "../components/shared/SaveAsModal";

interface Track {
  id: string;
  name: string;
  instrument: string;
  notes: any[];
}

interface Project {
  id: number;
  name: string;
  data: { bpm: number; tracks: Track[] };
}

const WorkspacePage: React.FC = () => {
  const navigate = useNavigate();

  // core state
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // modal state
  const [openOpenModal, setOpenOpenModal] = useState(false);
  const [openSaveAsModal, setOpenSaveAsModal] = useState(false);

  // 1) load project on mount
  useEffect(() => {
    const idStr = localStorage.getItem("activeProjectId");
    if (!idStr) {
      toast.error("No active project selected");
      navigate("/dashboard");
      return;
    }
    const id = parseInt(idStr, 10);

    getProjectById(id)
      .then((data) => setProject(data))
      .catch(() => {
        toast.error("Failed to load project");
        navigate("/dashboard");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <LoadingSpinner />;
  if (!project) return null;

  // 2) File menu handlers:

  // New: save current, create fresh, switch into it
  const handleNew = async () => {
    // save current, ignore errors
    try {
      await updateProject(
        project.id,
        project.name,
        { bpm: project.data.bpm, tracks: project.data.tracks }
      );
    } catch {}
    // create fresh
    const fresh = await createProject("Untitled Project", { bpm: 120, tracks: [] });
    localStorage.setItem("activeProjectId", fresh.id.toString());
    setProject(fresh);
    toast.success("New project created");
  };

  // Open: show modal
  const handleOpen = () => setOpenOpenModal(true);

  // When user picks in OpenProjectModal:
  const handleOpenSelect = async (newId: number) => {
    setOpenOpenModal(false);
    // save current
    try {
      await updateProject(
        project.id,
        project.name,
        { bpm: project.data.bpm, tracks: project.data.tracks }
      );
    } catch {}
    // load selected
    const newProj = await getProjectById(newId);
    localStorage.setItem("activeProjectId", newProj.id.toString());
    setProject(newProj);
    toast.success(`Opened "${newProj.name}"`);
  };

  // Save
  const handleSave = async () => {
    try {
      await updateProject(
        project.id,
        project.name,
        { bpm: project.data.bpm, tracks: project.data.tracks }
      );
      toast.success("Project saved");
    } catch {
      toast.error("Save failed");
    }
  };

  // Save As: show modal
  const handleSaveAs = () => setOpenSaveAsModal(true);

  // On SaveAsModal confirm:
  const handleSaveAsConfirm = async (newName: string) => {
    setOpenSaveAsModal(false);
    try {
      const copy = await createProject(newName, {
        bpm: project.data.bpm,
        tracks: project.data.tracks,
      });
      localStorage.setItem("activeProjectId", copy.id.toString());
      setProject(copy);
      toast.success("Project duplicated");
    } catch {
      toast.error("Duplicate failed");
    }
  };

  // Import MIDI
  const handleImportMidi = async (file: File) => {
    const imported = await importMidiFile(file);
    const newTrack: Track = {
      id: `imp-${Date.now()}`,
      name: file.name,
      instrument: `Imported: ${file.name}`,
      notes: imported.notes,
    };
    setProject({
      ...project,
      data: {
        bpm: project.data.bpm,
        tracks: [...project.data.tracks, newTrack],
      },
    });
    toast.success(`Imported ${file.name}`);
  };

  // Export MIDI: merge all notes
  const handleExportMidi = () => {
    const merged = project.data.tracks.flatMap((t) => t.notes);
    exportMidi(merged, project.data.bpm, `${project.name}.mid`);
  };

  // Export Stems: one file per track
  const handleExportStems = () => {
    project.data.tracks.forEach((t) => {
      exportMidi(t.notes, project.data.bpm, `${project.name}-${t.name}.mid`);
    });
    toast.success("Stems exported");
  };

  // Close Project
  const handleClose = () => {
    localStorage.removeItem("activeProjectId");
    navigate("/dashboard");
  };

  return (
    <>
      {/* Modals */}
      <OpenProjectModal
        isOpen={openOpenModal}
        onSelect={handleOpenSelect}
        onCancel={() => setOpenOpenModal(false)}
      />
      <SaveAsModal
        isOpen={openSaveAsModal}
        initialName={project.name}
        onSave={handleSaveAsConfirm}
        onCancel={() => setOpenSaveAsModal(false)}
      />

      {/* Workspace */}
      <div className="flex h-screen">
        <aside
          className={`
            relative flex-shrink-0 bg-gray-100 overflow-hidden
            transition-all duration-300
            ${sidebarOpen ? "w-64 p-4 space-y-4" : "w-8 p-1"}
          `}
        >
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="absolute top-4 right-0 -mr-4 p-1 bg-gray-100 border rounded-full hover:bg-gray-200"
          >
            {sidebarOpen ? "<" : ">"}
          </button>
          {sidebarOpen && (
            <>
              <div className="bg-white rounded-lg p-4"><AIGenerate /></div>
              <div className="bg-white rounded-lg p-4"><AIModify /></div>
              <div className="bg-white rounded-lg p-4"><AIStyleTransfer /></div>
            </>
          )}
        </aside>

        <div className="flex-1 flex flex-col">
          <WorkspaceNavBar
            onNew={handleNew}
            onOpen={handleOpen}
            onSave={handleSave}
            onSaveAs={handleSaveAs}
            onImportMidi={handleImportMidi}
            onExportMidi={handleExportMidi}
            onExportStems={handleExportStems}
            onClose={handleClose}
          />
          <div className="flex-1 overflow-auto p-4">
            <h2 className="text-xl font-semibold mb-4">{project.name}</h2>
            <MidiEditorCore
            key={project.id}
            projectId={project.id}
            bpm={project.data.bpm}
            initialTracks={project.data.tracks}
            // whenever the editor’s bpm or tracks change, push them into project state:
            onChange={(newBpm, newTracks) =>
              setProject({
                ...project,
                data: { bpm: newBpm, tracks: newTracks },
              })
            }
            // keep your Save button on the nav bar for persisting to the backend:
            onSave={() => handleSave()}
          />

          </div>
        </div>
      </div>
    </>
  );
};

export default WorkspacePage;

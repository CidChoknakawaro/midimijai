import React, { useMemo, useState } from "react";
import WorkspaceNavBar from "../components/workspace/WorkspaceNavBar";
import MidiEditorCore from "../components/workspace/midi-editor/core/MidiEditorCore";
import AIGenerate from "../components/workspace/AIGenerate";
import AIModify from "../components/workspace/AIModify";
import AIStyleTransfer from "../components/workspace/AIStyleTransfer";
import OpenProjectModal from "../components/shared/OpenProjectModal";
import SaveAsModal from "../components/shared/SaveAsModal";

import {
  createProject,
  getProjectById,
  updateProject,
} from "../services/projectService";

import { importMidiFile } from "../components/workspace/midi-editor/core/importMidi";
import { Midi } from "@tonejs/midi";

type Note = {
  id: string;
  pitch: number;
  time: number;
  duration: number;
  velocity: number;
};

type Track = {
  id: string;
  name: string;
  instrument: string;
  notes: Note[];
  customSoundUrl?: string;
};

type ProjectData = {
  bpm: number;
  tracks: Track[];
};

const DEFAULT_DATA: ProjectData = { bpm: 120, tracks: [] };

export default function WorkspacePage() {
  // Project identity
  const [projectId, setProjectId] = useState<number | null>(null);
  const [projectName, setProjectName] = useState<string>("Untitled Project");

  // Editor state (lifted here so File/AI panels can see it)
  const [bpm, setBpm] = useState<number>(DEFAULT_DATA.bpm);
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_DATA.tracks);

  // UI state
  const [openPicker, setOpenPicker] = useState(false);
  const [saveAsOpen, setSaveAsOpen] = useState(false);
  const [aiTab, setAiTab] = useState<"Generate" | "Modify" | "Style">(
    "Generate"
  );

  const hasProject = useMemo(() => projectId !== null, [projectId]);
  const dataForSave: ProjectData = useMemo(() => ({ bpm, tracks }), [bpm, tracks]);

  // ----- File actions -----
  const handleNew = async () => {
    setProjectId(null);
    setProjectName("Untitled Project");
    setBpm(120);
    setTracks([]);
  };

  const handleOpen = () => setOpenPicker(true);

  const handleOpenSelect = async (id: number) => {
    const proj = await getProjectById(id);
    setProjectId(proj.id);
    setProjectName(proj.name || "Untitled Project");
    const payload = (proj.data || DEFAULT_DATA) as ProjectData;
    setBpm(payload.bpm ?? 120);
    setTracks(payload.tracks ?? []);
    setOpenPicker(false);
  };

  const handleSave = async () => {
    if (!hasProject) {
      setSaveAsOpen(true);
      return;
    }
    await updateProject(projectId!, projectName, dataForSave);
  };

  const handleSaveAs = () => setSaveAsOpen(true);

  const handleSaveAsConfirm = async (newName: string) => {
    const created = await createProject(newName, dataForSave);
    setProjectId(created.id);
    setProjectName(newName);
    setSaveAsOpen(false);
  };

  const handleCloseProject = () => {
    setProjectId(null);
    setProjectName("Untitled Project");
    setBpm(120);
    setTracks([]);
  };

  const handleImportMidi = async (file: File) => {
    const imported = await importMidiFile(file);
    const newTrack: Track = {
      id: `t-${Date.now()}`,
      name: "Imported",
      instrument: "Piano",
      notes: imported.notes.map((n: any, i: number) => ({
        id: `${i}-${n.time}`,
        pitch: n.pitch,
        time: n.time,
        duration: n.duration,
        velocity: n.velocity,
      })),
    };
    setBpm(imported.bpm ?? bpm);
    setTracks((prev) => [...prev, newTrack]);
  };

  const handleExportMidi = () => {
    // Build multi-track MIDI from current state
    const midi = new Midi();
    midi.header.ppq = 480;
    midi.header.setTempo(bpm || 120);
    tracks.forEach((t) => {
      const tr = midi.addTrack();
      tr.name = t.name;
      t.notes.forEach((n) =>
        tr.addNote({
          midi: n.pitch,
          time: n.time,
          duration: n.duration,
          velocity: Math.min(Math.max(n.velocity / 127, 0), 1),
        })
      );
    });
    const bytes = midi.toArray();
    const blob = new Blob([bytes], { type: "audio/midi" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName || "project"}.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportStems = () => {
    alert("Export Stems is not implemented yet.");
  };

  // Editor -> page sync
  const handleEditorChange = (nextBpm: number, nextTracks: Track[]) => {
    setBpm(nextBpm);
    setTracks(nextTracks);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top nav / menus */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10">
        <WorkspaceNavBar
          onNew={handleNew}
          onOpen={handleOpen}
          onSave={handleSave}
          onSaveAs={handleSaveAs}
          onImportMidi={handleImportMidi}
          onExportMidi={handleExportMidi}
          onExportStems={handleExportStems}
          onClose={handleCloseProject}
          // Edit/Settings/MIDI Tools callbacks will be wired after we expose editor commands
          onUndo={() => {}}
          onRedo={() => {}}
          onCut={() => {}}
          onCopy={() => {}}
          onPaste={() => {}}
          onDelete={() => {}}
          onSelectAll={() => {}}
          onKeyScaleLock={() => {}}
          onAudioEngine={() => {}}
          onMidiInput={() => {}}
          onShortcuts={() => {}}
          onGridSettings={() => {}}
          onLatency={() => {}}
          onTranspose={() => {}}
          onVelocity={() => {}}
          onNoteLength={() => {}}
          onHumanize={() => {}}
          onArpeggiate={() => {}}
          onStrum={() => {}}
          onLegato={() => {}}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 pt-14 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-4 p-4">
          {/* LEFT: Editor (transport is rendered inside the editor) */}
          <div className="col-span-8 min-h-0">
            <div className="p-6 bg-white rounded-2xl shadow">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">
                  {projectName} {hasProject ? "" : "(unsaved)"}
                </h2>
                <p className="text-sm text-gray-500">
                  BPM: {bpm} • Tracks: {tracks.length}
                </p>
              </div>

              <MidiEditorCore
                projectId={projectId ?? -1}
                bpm={bpm}
                initialTracks={tracks}
                onChange={handleEditorChange}
                onSave={handleSave}
              />
            </div>
          </div>

          {/* RIGHT: AI tools */}
          <aside className="col-span-4 min-h-0 bg-white rounded-2xl shadow p-4 flex flex-col">
            <h3 className="text-xl font-semibold mb-3">AI Tools</h3>

            <div className="flex items-center space-x-2 mb-4">
              {(["Generate", "Modify", "Style"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setAiTab(t)}
                  className={`px-3 py-1 rounded ${
                    aiTab === t
                      ? "bg-teal-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto">
              {aiTab === "Generate" && <AIGenerate />}
              {aiTab === "Modify" && <AIModify />}
              {aiTab === "Style" && <AIStyleTransfer />}
            </div>
          </aside>
        </div>
      </div>

      {/* Modals */}
      <OpenProjectModal
        isOpen={openPicker}
        onSelect={handleOpenSelect}
        onCancel={() => setOpenPicker(false)}
      />
      <SaveAsModal
        isOpen={saveAsOpen}
        initialName={projectName}
        onSave={handleSaveAsConfirm}
        onCancel={() => setSaveAsOpen(false)}
      />
    </div>
  );
}

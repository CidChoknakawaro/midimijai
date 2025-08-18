import React, { useRef, useState } from "react";
import WorkspaceNavBar from "../components/workspace/WorkspaceNavBar";
import AIDock from "../components/workspace/AIDock";
import MidiEditorCore, { MidiEditorAPI, Track } from "../components/workspace/midi-editor/core/MidiEditorCore";
import { publish } from "../components/workspace/midi-editor/core/editorBus";

const PAGE_BG = "#fbf5ee"; 
const BEIGE   = "#e9dcc9";  

export default function WorkspacePage() {
  const editorRef = useRef<MidiEditorAPI | null>(null);
  const [projectId] = useState(1);
  const [bpm, setBpm] = useState(120);
  const [tracks, setTracks] = useState<Track[]>([
    { id: "t1", name: "Track 1", instrument: "Piano", notes: [] },
  ]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
      {/* Top nav */}
      <WorkspaceNavBar
        onNew={() => {}}
        onOpen={() => {}}
        onSave={() => {}}
        onSaveAs={() => {}}
        onImportMidi={() => {}}
        onExportMidi={() => publish({ type: "EXPORT_MIDI" })}
        onExportStems={() => {}}
        onClose={() => {}}
      />

      {/* Main area */}
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div
          className="
            relative grid grid-cols-1 lg:grid-cols-[1fr_360px]
            gap-4 lg:gap-6 rounded-[28px]
            shadow-[0_40px_80px_-28px_rgba(0,0,0,0.35)]
            border border-black/10
            p-3 sm:p-4 lg:p-5
          "
          style={{ 
            background: BEIGE,
            height: "calc(100vh - 100px)", 
          }}
        >
          {/* Editor plate */}
          <div className="rounded-2xl bg-white overflow-hidden border border-black/10">
            <MidiEditorCore
              ref={editorRef as any}
              projectId={projectId}
              bpm={bpm}
              initialTracks={tracks}
              onChange={(nextBpm, nextTracks) => {
                setBpm(nextBpm);
                setTracks(nextTracks);
              }}
              showTransport
            />
          </div>

          {/* AI dock */}
          <div className="lg:block min-h-0">
            <AIDock />
          </div>
        </div>
      </div>
    </div>
  );
}

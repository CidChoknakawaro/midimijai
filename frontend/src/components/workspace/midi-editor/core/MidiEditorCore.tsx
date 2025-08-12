// frontend/src/components/workspace/midi-editor/core/MidiEditorCore.tsx
import GlobalTransportBar from "../components/TransportBar/GlobalTransportBar";
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import TrackDashboard from "../components/TrackDashboard/TrackDashboard";
import TrackEditor, { TrackEditorAPI } from "../components/TrackEditor/TrackEditor";
import { TransportProvider } from "../core/TransportContext";

export interface Track {
  id: string;
  name: string;
  notes: any[];
  instrument: string;
  customSoundUrl?: string;
}

interface MidiEditorCoreProps {
  projectId: number;
  bpm: number;
  initialTracks: Track[];
  /** fire when user edits bpm or tracks */
  onChange: (bpm: number, tracks: Track[]) => void;
  onSave?: () => void;
  showTransport?: boolean;
}

export type MidiEditorAPI = {
  // Edit
  undo(): void;
  redo(): void;
  cut(): void;
  copy(): void;
  paste(): void;
  deleteSelection(): void;
  selectAll(): void;
  // MIDI tools
  transpose(semitones: number): void;
  velocityScale(mult: number): void;
  noteLengthScale(mult: number): void;
  humanize(amountMs?: number, velAmt?: number): void;
  arpeggiate(pattern?: "up" | "down" | "updown" | "random"): void;
  strum(ms?: number): void;
  legato(): void;
};

const MidiEditorCore = forwardRef<MidiEditorAPI, MidiEditorCoreProps>(({
  projectId,
  bpm: initialBpm,
  initialTracks = [],
  onChange,
  onSave,
  showTransport = true,
}, ref) => {
  const [bpm, setBpm] = useState(initialBpm);
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  useEffect(() => {
    setBpm(initialBpm);
    setTracks(initialTracks);
    setActiveTrackId(null);
  }, [projectId]);

  const editorRef = useRef<TrackEditorAPI | null>(null);

  // bubble changes
  const addNewTrack = () => {
    const id = `t-${Date.now()}`;
    const newTrack: Track = {
      id,
      name: `Track ${tracks.length + 1}`,
      instrument: "Piano",
      notes: [],
    };
    const next = [...tracks, newTrack];
    setTracks(next);
    onChange(bpm, next);
  };

  const updateTrack = (id: string, updates: Partial<Track>) => {
    const next = tracks.map(t => (t.id === id ? { ...t, ...updates } : t));
    setTracks(next);
    onChange(bpm, next);
  };

  const changeBpm = (newBpm: number) => {
    setBpm(newBpm);
    onChange(newBpm, tracks);
  };

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || null;

  // Expose commands (no-ops when dashboard view is open)
  useImperativeHandle(ref, () => ({
    undo:            () => editorRef.current?.undo?.(),
    redo:            () => editorRef.current?.redo?.(),
    cut:             () => editorRef.current?.cut?.(),
    copy:            () => editorRef.current?.copy?.(),
    paste:           () => editorRef.current?.paste?.(),
    deleteSelection: () => editorRef.current?.deleteSelection?.(),
    selectAll:       () => editorRef.current?.selectAll?.(),
    transpose:       (n)  => editorRef.current?.transpose?.(n),
    velocityScale:   (m)  => editorRef.current?.velocityScale?.(m),
    noteLengthScale: (m)  => editorRef.current?.noteLengthScale?.(m),
    humanize:        (a, v) => editorRef.current?.humanize?.(a, v),
    arpeggiate:      (p)  => editorRef.current?.arpeggiate?.(p),
    strum:           (ms) => editorRef.current?.strum?.(ms),
    legato:          ()   => editorRef.current?.legato?.(),
  }), []);

  return (
    <TransportProvider>
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {activeTrack ? (
            <TrackEditor
              ref={editorRef}
              track={activeTrack}
              updateTrack={(u) => updateTrack(activeTrack.id, u)}
              goBack={() => setActiveTrackId(null)}
            />
          ) : (
            <TrackDashboard
              tracks={tracks}
              onEditTrack={(id) => setActiveTrackId(id)}
              onAddTrack={addNewTrack}
              updateTrack={updateTrack}
            />
          )}
        </div>
        {showTransport && (
          <div className="px-6 py-3 border-t bg-gray-50">
            <GlobalTransportBar />
          </div>
        )}
      </div>
    </TransportProvider>
  );
});

export default MidiEditorCore;
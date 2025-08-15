// frontend/src/components/workspace/midi-editor/core/MidiEditorCore.tsx
import GlobalTransportBar from "../components/TransportBar/GlobalTransportBar";
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import TrackDashboard from "../components/TrackDashboard/TrackDashboard";
import TrackEditor, { TrackEditorAPI } from "../components/TrackEditor/TrackEditor";
import { TransportProvider } from "../core/TransportContext";

import { subscribe } from "./editorBus";
import { importMidiFile } from "./importMidi";
import { exportTrackToMidi, exportMultiTrackToMidi } from "./exportMidi";

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
  onChange: (bpm: number, tracks: Track[]) => void;
  onSave?: () => void;
  showTransport?: boolean;
}

export type MidiEditorAPI = {
  undo(): void;
  redo(): void;
  cut(): void;
  copy(): void;
  paste(): void;
  deleteSelection(): void;
  selectAll(): void;
  transpose(semitones: number): void;
  velocityScale(mult: number): void;
  noteLengthScale(mult: number): void;
  humanize(amountMs?: number, velAmt?: number): void;
  arpeggiate(pattern?: "up" | "down" | "updown" | "random"): void;
  strum(ms?: number): void;
  legato(): void;
  // optional helpers
  exportMidi?(): void;
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
  const editorRef = useRef<TrackEditorAPI | null>(null);

  useEffect(() => {
    setBpm(initialBpm);
    setTracks(initialTracks);
    setActiveTrackId(null);
  }, [projectId]);

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

  const deleteTrack = (id: string) => {
    const next = tracks.filter(t => t.id !== id);
    setTracks(next);
    onChange(bpm, next);
  };

  const changeBpm = (newBpm: number) => {
    setBpm(newBpm);
    onChange(newBpm, tracks);
  };

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || null;

  // -------- EDITOR BUS: Import/Export + Apply AI to track --------
  useEffect(() => {
    return subscribe(async (cmd) => {
      if (cmd.type === "IMPORT_MIDI_FILE") {
        const parsed = await importMidiFile(cmd.file);
        // If in track view, add to that track; otherwise create a new track
        if (activeTrack) {
          updateTrack(activeTrack.id, {
            notes: [...activeTrack.notes, ...parsed.notes],
          });
          if (parsed.bpm && parsed.bpm !== bpm) changeBpm(parsed.bpm);
        } else {
          const id = `t-${Date.now()}`;
          const next: Track = {
            id,
            name: "Imported",
            instrument: "Piano",
            notes: parsed.notes,
          };
          const tracksNext = [...tracks, next];
          setTracks(tracksNext);
          onChange(parsed.bpm || bpm, tracksNext);
        }
      } else if (cmd.type === "EXPORT_MIDI") {
        if (activeTrack) {
          exportTrackToMidi({
            notes: activeTrack.notes.map(n => ({
              midi: n.pitch, time: n.time, duration: n.duration, velocity: (n.velocity ?? 90) / 127
            })),
            bpm,
            filename: activeTrack.name || "track"
          });
        } else {
          exportMultiTrackToMidi({
            tracks: tracks.map(t => ({
              name: t.name,
              notes: t.notes.map(n => ({
                midi: n.pitch, time: n.time, duration: n.duration, velocity: (n.velocity ?? 90) / 127
              }))
            })),
            bpm,
            filename: "project"
          });
        }
      } else if (cmd.type === "APPLY_AI_TO_TRACK") {
        const dest = activeTrack
          ? activeTrack
          : (() => {
              // create a track if none selected
              const id = `t-${Date.now()}`;
              const t: Track = { id, name: "AI Track", instrument: "Piano", notes: [] };
              const tracksNext = [...tracks, t];
              setTracks(tracksNext);
              onChange(bpm, tracksNext);
              setActiveTrackId(id);
              return t;
            })();

        // append at the end of the destination track
        const endBeat = dest.notes.reduce((m, n) => Math.max(m, n.time + n.duration), 0);
        const shifted = cmd.notes.map(n => ({
          ...n,
          time: endBeat + n.time
        }));

        updateTrack(dest.id, { notes: [...dest.notes, ...shifted] });
        if (cmd.bpm && cmd.bpm !== bpm) changeBpm(cmd.bpm);
      }
    });
  }, [tracks, activeTrackId, bpm]); // eslint-disable-line

  // Expose commands
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
    exportMidi:      () => {
      // convenience if someone calls editorRef.current?.exportMidi?.()
      if (activeTrack) {
        exportTrackToMidi({
          notes: activeTrack.notes.map(n => ({
            midi: n.pitch, time: n.time, duration: n.duration, velocity: (n.velocity ?? 90) / 127
          })),
          bpm,
          filename: activeTrack.name || "track"
        });
      } else {
        exportMultiTrackToMidi({
          tracks: tracks.map(t => ({
            name: t.name,
            notes: t.notes.map(n => ({
              midi: n.pitch, time: n.time, duration: n.duration, velocity: (n.velocity ?? 90) / 127
            }))
          })),
          bpm,
          filename: "project"
        });
      }
    }
  }), [tracks, activeTrackId, bpm]);

  return (
    <TransportProvider>
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">
          {activeTrack ? (
            <div className="max-h-[420px] overflow-y-auto">
              <TrackEditor
                ref={editorRef}
                track={activeTrack}
                updateTrack={(u) => updateTrack(activeTrack.id, u)}
                goBack={() => setActiveTrackId(null)}
              />
            </div>
          ) : (
            <TrackDashboard
              tracks={tracks}
              onEditTrack={(id) => setActiveTrackId(id)}
              onAddTrack={addNewTrack}
              updateTrack={updateTrack}
              deleteTrack={deleteTrack}
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

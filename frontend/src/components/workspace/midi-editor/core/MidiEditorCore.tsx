import GlobalTransportBar from "../components/TransportBar/GlobalTransportBar";
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import TrackDashboard from "../components/TrackDashboard/TrackDashboard";
import TrackEditor, { TrackEditorAPI } from "../components/TrackEditor/TrackEditor";
import { TransportProvider } from "../core/TransportContext";

export interface Track {
  id: string;
  name: string;
  // IMPORTANT: editor expects notes shaped like { id, pitch, time, duration, velocity(0..127) }
  notes: Array<{ id?: string; pitch?: number; time?: number; duration?: number; velocity?: number }>;
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
};

const isFiniteNum = (v: any): v is number => Number.isFinite(Number(v));
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Convert AI notes ({midi,time,duration,velocity 0..1}) to editor notes ({id,pitch,time,duration,velocity 0..127}) */
function toEditorNotes(raw: any[], cap = 128) {
  if (!Array.isArray(raw)) return [];
  let counter = 0;
  return raw
    .map((n) => {
      const midi = clamp(Math.trunc(Number(n?.midi ?? n?.pitch ?? 60)), 0, 127);
      const time = isFiniteNum(n?.time) && n.time >= 0 ? Number(n.time) : 0;
      const duration = isFiniteNum(n?.duration) && n.duration > 0 ? Number(n.duration) : 0.5;
      const v = Number(n?.velocity);
      const vel127 = isFiniteNum(v) ? (v <= 1 ? Math.round(clamp(v, 0.05, 1) * 127) : clamp(Math.round(v), 1, 127)) : 108;

      // gently quantize duration to avoid micro-slices
      const q = [0.25, 0.5, 1.0];
      const qdur = q.reduce((best, val) => (Math.abs(val - duration) < Math.abs(best - duration) ? val : best), q[0]);

      const id = String(n?.id ?? `ai-${midi}@${time.toFixed(4)}#${counter++}`);
      return { id, pitch: midi, time, duration: qdur, velocity: vel127 };
    })
    .filter((n) => n.duration > 0 && n.time >= 0)
    .slice(0, cap);
}

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

  // Only reset when projectId changes (don’t bounce out of editor on every prop change)
  useEffect(() => {
    setBpm(initialBpm);
    setTracks(initialTracks);
    setActiveTrackId(null);
  }, [projectId]); // <-- not depending on initialTracks/initialBpm avoids the editor jump

  const editorRef = useRef<TrackEditorAPI | null>(null);

  const addNewTrack = () => {
    const id = `t-${Date.now()}`;
    const newTrack: Track = { id, name: `Track ${tracks.length + 1}`, instrument: "Piano", notes: [] };
    const next = [...tracks, newTrack];
    setTracks(next);
    onChange(bpm, next);
  };

  const updateTrack = (id: string, updates: Partial<Track>) => {
    const next = tracks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setTracks(next);
    onChange(bpm, next);
  };

  const deleteTrack = (id: string) => {
    const next = tracks.filter((t) => t.id !== id);
    setTracks(next);
    onChange(bpm, next);
  };

  const changeBpm = (newBpm: number) => {
    const safe = isFiniteNum(newBpm) ? clamp(Math.round(Number(newBpm)), 40, 400) : bpm;
    setBpm(safe);
    onChange(safe, tracks);
  };

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || null;

  useImperativeHandle(ref, () => ({
    undo: () => editorRef.current?.undo?.(),
    redo: () => editorRef.current?.redo?.(),
    cut: () => editorRef.current?.cut?.(),
    copy: () => editorRef.current?.copy?.(),
    paste: () => editorRef.current?.paste?.(),
    deleteSelection: () => editorRef.current?.deleteSelection?.(),
    selectAll: () => editorRef.current?.selectAll?.(),
    transpose: (n) => editorRef.current?.transpose?.(n),
    velocityScale: (m) => editorRef.current?.velocityScale?.(m),
    noteLengthScale: (m) => editorRef.current?.noteLengthScale?.(m),
    humanize: (a, v) => editorRef.current?.humanize?.(a, v),
    arpeggiate: (p) => editorRef.current?.arpeggiate?.(p),
    strum: (ms) => editorRef.current?.strum?.(ms),
    legato: () => editorRef.current?.legato?.(),
  }), []);

  /**
   * AI result ingress (from AIGenerate): sanitize + either replace active track or append a new track.
   * - If a track is selected -> REPLACE that track’s name/instrument/notes (keeps you in the editor)
   * - Otherwise -> APPEND as a new track (previous behavior)
   */
  useEffect(() => {
    const onAIGenerated = (e: Event) => {
      const ce = e as CustomEvent<any>;
      const payload = ce.detail as {
        bpm?: number;
        tracks?: Array<{ name?: string; instrument?: string; notes?: any[] }>;
      };
      if (!payload?.tracks?.length) return;

      // safe BPM
      const candBpm = Number(payload.bpm);
      const safeBpm =
        isFiniteNum(candBpm) && candBpm > 0 && candBpm < 400 ? Math.round(candBpm) : bpm || 120;

      // convert AI notes to editor format; cap to e.g. 96 so the editor stays snappy
      const editorNotes = toEditorNotes(payload.tracks[0].notes ?? [], 96);

      const name = (payload.tracks[0].name || "AI Track").toString().slice(0, 48);
      const instrument = (payload.tracks[0].instrument || "Piano").toString().slice(0, 24);

      if (activeTrack) {
        // REPLACE current/selected track
        const nextTracks = tracks.map((t) =>
          t.id === activeTrack.id ? { ...t, name, instrument, notes: editorNotes } : t
        );
        setTracks(nextTracks);
        setBpm(safeBpm);
        onChange(safeBpm, nextTracks);
        // keep editor open on this track
      } else {
        // APPEND as a new track
        const id = `ai-${Date.now()}`;
        const nextTrack: Track = { id, name, instrument, notes: editorNotes };
        const nextTracks = [...tracks, nextTrack];
        setTracks(nextTracks);
        setBpm(safeBpm);
        setActiveTrackId(id); // jump into it right away (optional; remove if you prefer staying on dashboard)
        onChange(safeBpm, nextTracks);
      }
    };

    window.addEventListener("ai-generated", onAIGenerated as EventListener);
    return () => window.removeEventListener("ai-generated", onAIGenerated as EventListener);
  }, [tracks, bpm, onChange, activeTrack]);

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

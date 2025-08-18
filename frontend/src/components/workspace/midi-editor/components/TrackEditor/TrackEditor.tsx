import React, { useContext, useEffect, useRef } from "react";
import PianoRoll from "../PianoRoll/PianoRoll";
import * as Tone from "tone";
import { exportMidi } from "../../core/exportMidi";
import { importMidiFile } from "../../core/importMidi";
import { getActiveNotesAtBeat } from "../../core/midiUtils";
import { TransportContext } from "../../core/TransportContext";
import { subscribe} from "../../core/editorBus";
import { ChevronLeft } from "lucide-react";
import type { EditorCommand } from "../../core/editorBus";

const MAX_BEAT = 63;
const BUILT_IN_INSTRUMENTS = ["Piano", "Synth", "AMSynth", "MembraneSynth"];

const PIANO_SAMPLE_URL = "/piano.mp3";
const PIANO_ROOT_MIDI = 67;

type Track = {
  id: string;
  name: string;
  notes: any[];
  instrument: string;
  customSoundUrl?: string;
};

type Props = {
  track: Track;
  updateTrack: (updates: Partial<Track>) => void;
  goBack: () => void;
};

// Normalize incoming AI notes to the editor's raw note shape
function normalizeIncomingEditorNotes(notes: any[]) {
  if (!Array.isArray(notes)) return [];
  return notes.map((n, idx) => {
    const pitch = Number.isFinite(n?.pitch) ? Math.trunc(n.pitch) : 60;
    const time = Number.isFinite(n?.time) ? Math.max(0, Number(n.time)) : 0;
    const dur  = Number.isFinite(n?.duration) ? Math.max(0.05, Number(n.duration)) : 0.5;
    const velocity = n?.velocity ?? n?.velocity127 ?? 96;
    return {
      id: String(n?.id ?? `ai-${pitch}@${time.toFixed(4)}#${idx}`),
      pitch,
      time,
      duration: dur,
      velocity,
    };
  });
}

const TrackEditor: React.FC<Props> = ({ track, updateTrack, goBack }) => {
  const {
    // transport
    bpm,
    isPlaying,
    playheadBeat,
    setPlayheadBeat,
    // global zoom/snap from context
    zoom,                 // 1 | 2 | 4  (1→1/4, 2→1/8, 4→1/16)
    setZoomLevel,         // (z) => void
    snapToGrid,           // boolean
    toggleSnap,           // () => void
  } = useContext(TransportContext);

  const playheadRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<any>(null);
  const redLineRef = useRef(playheadBeat);
  const animationRef = useRef<number | null>(null);
  const activeNotes = useRef<Set<string>>(new Set());

  // ✅ grid width now follows GLOBAL zoom
  const gridWidth = 40 * zoom;

  // Audio-timing reference
  const audioStartTimeRef = useRef<number | null>(null);
  const beatAtStartRef = useRef<number>(0);

  // ---------- synth init by instrument ----------
  useEffect(() => {
    if (synthRef.current) synthRef.current.dispose?.();
    if (track.instrument.startsWith("Imported:")) {
      synthRef.current = null;
    } else {
      switch (track.instrument) {
        case "Piano":
          // Use sample for Piano; no synth
          synthRef.current = null;
          break;
        case "Synth":
          synthRef.current = new Tone.Synth().toDestination();
          break;
        case "AMSynth":
          synthRef.current = new Tone.AMSynth().toDestination();
          break;
        case "MembraneSynth":
          synthRef.current = new Tone.MembraneSynth().toDestination();
          break;
        default:
          synthRef.current = new Tone.PolySynth().toDestination();
      }
    }
  }, [track.instrument]);

  // ---------- transport-driven animation ----------
  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = Math.max(now - lastTime, 0) / 1000;
      lastTime = now;

      if (isPlaying) {
        if (audioStartTimeRef.current === null) {
          audioStartTimeRef.current = Tone.now();
          beatAtStartRef.current = redLineRef.current;
        }
        const currentAudioTime = Tone.now();
        const elapsed = currentAudioTime - audioStartTimeRef.current;
        const beat = beatAtStartRef.current + (bpm / 60) * elapsed;

        redLineRef.current = beat;
        if (redLineRef.current >= MAX_BEAT) {
          redLineRef.current = 0;
          audioStartTimeRef.current = Tone.now();
          beatAtStartRef.current = 0;
          activeNotes.current.clear();
        }

        setPlayheadBeat(redLineRef.current);
        updatePlayhead(redLineRef.current);
        triggerNotesAt(redLineRef.current);
      } else {
        redLineRef.current = playheadBeat;
        updatePlayhead(playheadBeat);
        stopAllNotes();
        audioStartTimeRef.current = null;
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [isPlaying, bpm, playheadBeat, setPlayheadBeat]);

  // ---------- editorBus subscription + global cmd ----------
  useEffect(() => {
    const unsub = subscribe(async (cmd: EditorCommand) => {
      switch (cmd.type) {
        case "SET_ZOOM":
          setZoomLevel(cmd.value);
          break;
        case "TOGGLE_SNAP":
          toggleSnap();
          break;
        case "EXPORT_MIDI":
          exportMidi({ notes: track.notes, bpm, filename: track.name || "track" });
          break;
        case "IMPORT_MIDI_FILE": {
          const file = cmd.file;
          if (file) {
            const result = await importMidiFile(file);
            updateTrack({ notes: result.notes });
          }
          break;
        }
        case "APPLY_AI_TO_TRACK": {
          const incoming = normalizeIncomingEditorNotes((cmd as any).notes || []);
          if (!incoming.length) break;

          // append to this open track
          const merged = [...(track.notes || []), ...incoming];
          updateTrack({ notes: merged });
          break;
        }
        default:
          // other editor commands…
          break;
      }
    });

    // also listen to global 'cmd' in case AIGenerate fires it directly
    function onCmd(ev: Event) {
      const e = ev as CustomEvent;
      const detail = e.detail || {};
      if (detail.type !== "APPLY_AI_TO_TRACK") return;

      const incoming = normalizeIncomingEditorNotes(detail.notes || []);
      if (!incoming.length) return;

      const merged = [...(track.notes || []), ...incoming];
      updateTrack({ notes: merged });
    }
    window.addEventListener("cmd", onCmd as any);

    return () => {
      unsub();
      window.removeEventListener("cmd", onCmd as any);
    };
  }, [bpm, setZoomLevel, toggleSnap, track.notes, updateTrack]);

  // ---------- note trigger helpers ----------
  const triggerNotesAt = (beat: number) => {
    const nowActive = getActiveNotesAtBeat(track.notes, beat);

    nowActive.forEach((note) => {
      if (!activeNotes.current.has(note.id)) {
        const now = Tone.now();
        if (track.instrument.startsWith("Imported:") && track.customSoundUrl) {
          const durationSec = (note.duration / bpm) * 60;
          const player = new Tone.Player({
            url: track.customSoundUrl,
            playbackRate: Math.pow(2, (note.pitch - 60) / 12), // 60=C4
            autostart: true,
            onstop: () => player.dispose(),
          }).toDestination();
          setTimeout(() => player.stop(), durationSec * 1000);
        } else if (track.instrument === "Piano") {
          // Play built-in piano sample, pitch-shifted from its root (G)
          const durationSec = (note.duration / bpm) * 60;
          const rate = Math.pow(2, (note.pitch - PIANO_ROOT_MIDI) / 12);

          const player = new Tone.Player({
            url: PIANO_SAMPLE_URL,
            playbackRate: rate,
            autostart: true,
            onstop: () => player.dispose(),
          }).toDestination();

          setTimeout(() => player.stop(), durationSec * 1000);

        } else {
          const name = Tone.Frequency(note.pitch, "midi").toNote();
          const vel = (note.velocity ?? 90) / 127; 
          synthRef.current?.triggerAttack(name, now, vel);
        }
        activeNotes.current.add(note.id);
      }
    });

    activeNotes.current.forEach((id) => {
      const stillActive = nowActive.find((n) => n.id === id);
      if (!stillActive) {
        const note = track.notes.find((n) => n.id === id);
        if (note && !track.instrument.startsWith("Imported:")) {
          const name = Tone.Frequency(note.pitch, "midi").toNote();
          synthRef.current?.triggerRelease(name, Tone.now());
        }
        activeNotes.current.delete(id);
      }
    });
  };

  const stopAllNotes = () => {
    activeNotes.current.forEach((id) => {
      const note = track.notes.find((n) => n.id === id);
      if (note && !track.instrument.startsWith("Imported:")) {
        const name = Tone.Frequency(note.pitch, "midi").toNote();
        synthRef.current?.triggerRelease(name, Tone.now());
      }
    });
    activeNotes.current.clear();
  };

  const updatePlayhead = (beat: number) => {
    const left = beat * gridWidth;
    if (playheadRef.current) {
      playheadRef.current.style.left = `${left}px`;
    }
  };

  const scrubToBeat = (beat: number) => {
    redLineRef.current = beat;
    setPlayheadBeat(beat);
    updatePlayhead(beat);
  };

  return (
    <div style={{ padding: 10, overflowY: "auto" }}>
      <div className="px-4 py-3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Tracks</span>
          </button>

          <h2 className="text-xl font-semibold truncate">{track.name}</h2>
        </div>
      </div>

      <PianoRoll
        notes={track.notes}
        setNotes={(updated) => updateTrack({ notes: updated })}
        playheadRef={playheadRef}
        gridWidth={gridWidth}
        snapToGrid={snapToGrid}
        isPlaying={isPlaying}
        onPlayheadScrub={scrubToBeat}
      />
    </div>
  );
};

export default TrackEditor;

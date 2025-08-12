import React, { useContext, useEffect, useRef, useState } from "react";
import PianoRoll from "../PianoRoll/PianoRoll";
import * as Tone from "tone";
import { exportMidi } from "../../core/exportMidi";
import { importMidiFile } from "../../core/importMidi";
import { getActiveNotesAtBeat } from "../../core/midiUtils";
import { TransportContext } from "../../core/TransportContext";
import { subscribe, EditorCommand } from "../../core/editorBus";

const MAX_BEAT = 63;
const BUILT_IN_INSTRUMENTS = ["Piano", "Synth", "AMSynth", "MembraneSynth"];

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

const TrackEditor: React.FC<Props> = ({ track, updateTrack, goBack }) => {
  const { bpm, isPlaying, playheadBeat, setPlayheadBeat } =
    useContext(TransportContext);

  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 4>(1);
  const [snapToGrid, setSnapToGrid] = useState(true);

  const playheadRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<any>(null);
  const redLineRef = useRef(playheadBeat);
  const animationRef = useRef<number>();
  const activeNotes = useRef<Set<string>>(new Set());

  const gridWidth = 40 * zoomLevel;

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
          synthRef.current = new Tone.PolySynth().toDestination();
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

  // ---------- editorBus subscription ----------
  useEffect(() => {
    const unsub = subscribe(async (cmd: EditorCommand) => {
      switch (cmd.type) {
        case "SET_ZOOM":
          setZoomLevel(cmd.value);
          break;
        case "TOGGLE_SNAP":
          setSnapToGrid((s) => !s);
          break;
        case "EXPORT_MIDI":
          exportMidi(track.notes, bpm);
          break;
        case "IMPORT_MIDI_FILE": {
          const file = cmd.file;
          if (file) {
            const result = await importMidiFile(file);
            // If your import returns bpm, you can decide whether to update bpm via context elsewhere
            updateTrack({ notes: result.notes });
          }
          break;
        }

        // Tools — leave as stubs for now, or plug in your actual transforms:
        case "TRANSPOSE":
        case "VELOCITY":
        case "NOTE_LENGTH":
        case "HUMANIZE":
        case "ARPEGGIATE":
        case "STRUM":
        case "LEGATO":
        case "OPEN_AUDIO_ENGINE":
        case "OPEN_MIDI_INPUT":
        case "OPEN_SHORTCUTS":
        case "OPEN_GRID_SETTINGS":
        case "OPEN_LATENCY_SETTINGS":
        case "UNDO":
        case "REDO":
        case "CUT":
        case "COPY":
        case "PASTE":
        case "DELETE":
        case "SELECT_ALL":
          console.log("[editorBus] command received:", cmd.type);
          break;
      }
    });
    return unsub;
  }, [track.notes, bpm, updateTrack]);

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
            playbackRate: Math.pow(2, (note.pitch - 60) / 12),
            autostart: true,
            onstop: () => player.dispose(),
          }).toDestination();
          setTimeout(() => player.stop(), durationSec * 1000);
        } else {
          const name = Tone.Frequency(note.pitch, "midi").toNote();
          synthRef.current?.triggerAttack(name, now, note.velocity / 127);
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

  // ---------- UI helpers that remain local ----------
  const handleUploadSound = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const name = `Imported: ${file.name}`;
      updateTrack({ instrument: name, customSoundUrl: url });
    }
  };

  const testImportedSound = async () => {
    if (!track.instrument.startsWith("Imported:") || !track.customSoundUrl) return;
    const player = new Tone.Player(track.customSoundUrl).toDestination();
    await Tone.start();
    player.autostart = true;
  };

  return (
    <div style={{ padding: 10, overflowY: "auto" }}>
      <button onClick={goBack}>🔙 Back to Tracks</button>
      <h2>{track.name}</h2>

      <div style={{ display: "flex", gap: 20, marginBottom: 10, flexWrap: "wrap" }}>
        <div>
          <label><strong>Zoom:</strong></label>{" "}
          <select value={zoomLevel} onChange={(e) => setZoomLevel(Number(e.target.value) as 1|2|4)}>
            <option value={1}>1/4</option>
            <option value={2}>1/8</option>
            <option value={4}>1/16</option>
          </select>
        </div>

        <label>
          <input
            type="checkbox"
            checked={snapToGrid}
            onChange={(e) => setSnapToGrid(e.target.checked)}
          />{" "}
          Snap to Grid
        </label>

        <div>
          <label><strong>Instrument:</strong></label>{" "}
          <select
            value={track.instrument}
            onChange={(e) => updateTrack({ instrument: e.target.value })}
          >
            {BUILT_IN_INSTRUMENTS.map((inst) => (
              <option key={inst} value={inst}>{inst}</option>
            ))}
            {track.customSoundUrl && (
              <option value={track.instrument}>{track.instrument}</option>
            )}
          </select>
          <input
            type="file"
            accept=".mp3,.wav"
            onChange={handleUploadSound}
            style={{ marginLeft: 10 }}
          />
          {track.instrument.startsWith("Imported:") && track.customSoundUrl && (
            <button onClick={testImportedSound} style={{ marginLeft: 10 }}>
              🔊 Test Sound
            </button>
          )}
        </div>

        <div>
          <button onClick={() => exportMidi(track.notes, bpm)}>Export MIDI</button>{" "}
          <input
            type="file"
            accept=".mid"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const result = await importMidiFile(file);
                updateTrack({ notes: result.notes });
              }
            }}
          />
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

// src/components/workspace/midi-editor/components/TrackDashboard/TrackDashboard.tsx
import React, { useContext, useEffect, useRef, useState, memo, useMemo } from "react";
import * as Tone from "tone";
import { getActiveNotesAtBeat } from "../../core/midiUtils";
import { TransportContext } from "../../core/TransportContext";
import "./TrackDashboard.css";

export type Track = {
  id: string;
  name: string;
  notes: any[];
  instrument: string;
  customSoundUrl?: string;
};

type Props = {
  tracks: Track[];
  onEditTrack: (id: string) => void;
  onAddTrack: () => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  deleteTrack: (id: string) => void;
};

const MAX_BEAT = 63;
const NOTE_HEIGHT = 3;
const PITCH_RANGE: [number, number] = [36, 84];

const isFiniteNum = (v: any): v is number => Number.isFinite(Number(v));
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/**
 * Normalize a raw note (AI or editor) to the dashboard format:
 * { id, pitch (MIDI int), time (beats >=0), duration (beats > 0), velocity127 (0..127) }
 */
function normalizeNotes(notes: any[]): Array<{
  id: string;
  pitch: number;
  time: number;
  duration: number;
  velocity127: number;
}> {
  if (!Array.isArray(notes)) return [];
  return notes
    .map((n, idx) => {
      // support both shapes
      const pitch = isFiniteNum(n?.pitch) ? Math.trunc(n.pitch) :
                    isFiniteNum(n?.midi) ? Math.trunc(n.midi) : 60;
      const time = isFiniteNum(n?.time) && n.time >= 0 ? Number(n.time) : 0;
      const duration = isFiniteNum(n?.duration) && n.duration > 0 ? Number(n.duration) : 0.5;

      // velocity may be 0..127 or 0..1
      let v = n?.velocity;
      let velocity127 = 96;
      if (isFiniteNum(v)) {
        const num = Number(v);
        velocity127 = num <= 1 ? Math.round(clamp(num, 0.05, 1) * 127) : Math.round(clamp(num, 1, 127));
      }

      const id = String(n?.id ?? `${pitch}@${time.toFixed(4)}#${idx}`);
      return {
        id,
        pitch: clamp(pitch, 0, 127),
        time,
        duration: clamp(duration, 0.05, 16),
        velocity127: clamp(velocity127, 1, 127),
      };
    })
    .filter((n) => n.duration > 0 && n.time >= 0);
}

const TrackDashboard: React.FC<Props> = ({ tracks, onEditTrack, onAddTrack, deleteTrack }) => {
  const { bpm, isPlaying, playheadBeat, setPlayheadBeat } = useContext(TransportContext);

  const [muteMap, setMuteMap] = useState<Record<string, boolean>>({});
  const [soloMap, setSoloMap] = useState<Record<string, boolean>>({});
  const [volumeMap, setVolumeMap] = useState<Record<string, number>>({});
  const [panMap, setPanMap] = useState<Record<string, number>>({});
  const [redLineLeft, setRedLineLeft] = useState(0);

  const redLineBeatRef = useRef(playheadBeat);
  const animationRef = useRef<number>();
  const instrumentMap = useRef<Map<string, any>>(new Map());
  const activeNotesMap = useRef<Map<string, Set<string>>>(new Map());

  // Pre-normalize notes for all tracks so everything downstream is safe.
  const normalizedByTrackId = useMemo(() => {
    const map = new Map<string, ReturnType<typeof normalizeNotes>>();
    tracks.forEach((t) => map.set(t.id, normalizeNotes(t.notes)));
    return map;
  }, [tracks]);

  // Build instruments for current track list
  useEffect(() => {
    // dispose old
    instrumentMap.current.forEach((i) => i?.dispose?.());
    instrumentMap.current.clear();

    tracks.forEach((track) => {
      const vol0to100 = isFiniteNum(volumeMap[track.id]) ? Number(volumeMap[track.id]) : 100;
      const volDb = clamp(vol0to100, 0, 100) - 100; // 0..100 -> -100..0 dB

      const panVal = isFiniteNum(panMap[track.id]) ? clamp(Number(panMap[track.id]), -1, 1) : 0;

      const volume = new Tone.Volume(volDb).toDestination();
      const pan = new Tone.Panner(panVal).connect(volume);

      if (track.instrument?.startsWith("Imported:")) {
        instrumentMap.current.set(track.id, { synth: null, pan, volume });
      } else {
        let synth: any;
        switch (track.instrument) {
          case "Piano":         synth = new Tone.PolySynth().connect(pan); break;
          case "Synth":         synth = new Tone.Synth().connect(pan); break;
          case "AMSynth":       synth = new Tone.AMSynth().connect(pan); break;
          case "MembraneSynth": synth = new Tone.MembraneSynth().connect(pan); break;
          default:              synth = new Tone.PolySynth().connect(pan); break;
        }
        instrumentMap.current.set(track.id, { synth, pan, volume });
      }

      activeNotesMap.current.set(track.id, new Set());
    });

    return () => {
      instrumentMap.current.forEach((i) => {
        i?.synth?.dispose?.();
        i?.pan?.dispose?.();
        i?.volume?.dispose?.();
      });
    };
  }, [tracks, volumeMap, panMap]);

  // Timeline + playback driving
  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = Math.max(now - lastTime, 0) / 1000;
      lastTime = now;

      const safeBpm = isFiniteNum(bpm) && bpm > 0 ? bpm : 120;

      if (isPlaying) {
        const beatsMoved = (safeBpm / 60) * delta;
        redLineBeatRef.current += beatsMoved;
        if (redLineBeatRef.current >= MAX_BEAT) redLineBeatRef.current = 0;
        setPlayheadBeat(redLineBeatRef.current);
      } else {
        redLineBeatRef.current = playheadBeat;
        stopAllNotes();
      }

      setRedLineLeft(redLineBeatRef.current * 10);

      const soloed = Object.entries(soloMap)
        .filter(([, s]) => s)
        .map(([id]) => id);

      tracks.forEach((track) => {
        const muted = !!muteMap[track.id];
        const blockedBySolo = soloed.length > 0 && !soloMap[track.id];
        if (!muted && !blockedBySolo && isPlaying) {
          triggerTrackNotes(track, redLineBeatRef.current, normalizedByTrackId.get(track.id) || []);
        }
      });

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [isPlaying, bpm, tracks, muteMap, soloMap, playheadBeat, setPlayheadBeat, normalizedByTrackId]);

  const triggerTrackNotes = (track: Track, beat: number, safeNotes: ReturnType<typeof normalizeNotes>) => {
    const instruments = instrumentMap.current.get(track.id);
    const synth = instruments?.synth;

    // getActiveNotesAtBeat expects notes with at least { id, time, duration }
    const nowActive = getActiveNotesAtBeat(safeNotes, beat);
    const activeIds = activeNotesMap.current.get(track.id)!;

    nowActive.forEach((note: any) => {
      if (!activeIds.has(note.id)) {
        const now = Tone.now();

        if (track.instrument?.startsWith("Imported:")) {
          const url = track.customSoundUrl;
          if (!url) return;

          const safeBpm = isFiniteNum(bpm) && bpm > 0 ? bpm : 120;
          const durationSec = clamp((note.duration / safeBpm) * 60, 0.05, 30);

          const semis = note.pitch - 60; // treat 60 (C4) as root
          const rate = Math.pow(2, semis / 12);
          const playbackRate = isFiniteNum(rate) ? clamp(rate, 0.25, 4) : 1;

          const player = new Tone.Player({
            url,
            autostart: true,
            playbackRate,
            onstop: () => player.dispose(),
          }).connect(instruments.pan);

          // schedule stop so overlaps don’t pile up
          setTimeout(() => player.stop(), durationSec * 1000);
        } else if (synth) {
          const name = Tone.Frequency(note.pitch, "midi").toNote();
          const velNorm = clamp((note.velocity127 ?? 96) / 127, 0.05, 1);
          synth.triggerAttack(name, now, velNorm);
        }
        activeIds.add(note.id);
      }
    });

    // releases
    activeIds.forEach((id) => {
      const stillActive = nowActive.find((n: any) => n.id === id);
      if (!stillActive) {
        const note = safeNotes.find((n) => n.id === id);
        if (note && synth && !track.instrument?.startsWith("Imported:")) {
          const name = Tone.Frequency(note.pitch, "midi").toNote();
          synth.triggerRelease(name, Tone.now());
        }
        activeIds.delete(id);
      }
    });
  };

  const stopAllNotes = () => {
    tracks.forEach((track) => {
      const synth = instrumentMap.current.get(track.id)?.synth;
      const activeIds = activeNotesMap.current.get(track.id)!;
      const safeNotes = normalizedByTrackId.get(track.id) || [];

      activeIds.forEach((id) => {
        const note = safeNotes.find((n) => n.id === id);
        if (note && synth && !track.instrument?.startsWith("Imported:")) {
          const name = Tone.Frequency(note.pitch, "midi").toNote();
          synth.triggerRelease(name, Tone.now());
        }
      });
      activeIds.clear();
    });
  };

  const toggleMute = (id: string) => setMuteMap((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleSolo = (id: string) => setSoloMap((prev) => ({ ...prev, [id]: !prev[id] }));
  const setVolume = (id: string, v: number) => setVolumeMap((prev) => ({ ...prev, [id]: v }));
  const setPan = (id: string, v: number) => setPanMap((prev) => ({ ...prev, [id]: v }));

  const getTopFromPitch = (pitch: number) => {
    const [min, max] = PITCH_RANGE;
    return (max - pitch) * NOTE_HEIGHT;
    // if pitch outside range, it will clamp visually off-range, which is okay
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-timeline-wrapper">
        {tracks.map((track) => {
          const notes = normalizedByTrackId.get(track.id) || [];
          return (
            <div className="dashboard-track-row" key={track.id}>
              <div className="track-row-flex">
                {/* LEFT: compact dark controls */}
                <div className="track-controls ctrl-dark">
                  {/* Title → EDIT */}
                  <button
                    type="button"
                    className="ctrl-title"
                    onClick={() => onEditTrack(track.id)}
                    title="Open track editor"
                    aria-label={`Open ${track.name} in editor`}
                  >
                    {track.name}
                  </button>

                  {/* Instrument + Mute/Solo */}
                  <div className="instrument-line">
                    <span className="instrument-name">
                      {track.instrument || "Piano"}
                    </span>

                    {/* Mute toggle */}
                    <button
                      type="button"
                      className={`icon-btn ${muteMap[track.id] ? "active" : ""}`}
                      onClick={() => toggleMute(track.id)}
                      aria-pressed={!!muteMap[track.id]}
                      title={muteMap[track.id] ? "Unmute" : "Mute"}
                    >
                      <img
                        src={muteMap[track.id] ? "/not_mute.png" : "/mute.png"}
                        alt={muteMap[track.id] ? "Unmute" : "Mute"}
                        style={{ width: 16, height: 16 }}
                      />
                    </button>

                    {/* Solo toggle */}
                    <button
                      type="button"
                      className={`icon-btn ${soloMap[track.id] ? "active" : ""}`}
                      onClick={() => toggleSolo(track.id)}
                      aria-pressed={!!soloMap[track.id]}
                      title={soloMap[track.id] ? "Unsolo" : "Solo"}
                    >
                      <img
                        src="/speaker.png"
                        alt={soloMap[track.id] ? "Unsolo" : "Solo"}
                        style={{ width: 16, height: 16 }}
                      />
                    </button>

                    {/* Delete track */}
                    <button
                      type="button"
                      className="icon-btn delete-btn"
                      onClick={() => {
                        if (window.confirm(`Delete track "${track.name}"?`)) {
                          deleteTrack(track.id);
                        }
                      }}
                      title="Delete track"
                    >
                      <img
                        src="/delete-white.png"
                        alt="Delete"
                        style={{ width: 16, height: 16 }}
                      />
                    </button>
                  </div>

                  {/* Sliders */}
                  <div className="track-sliders">
                    <label className="slider-row">
                      <span>Volume</span>
                      <input
                        className="range volume"
                        type="range"
                        min={0}
                        max={100}
                        value={volumeMap[track.id] ?? 100}
                        onChange={(e) => setVolume(track.id, parseInt(e.target.value))}
                      />
                    </label>
                    <label className="slider-row">
                      <span>Pan</span>
                      <input
                        className="range pan"
                        type="range"
                        min={-1}
                        max={1}
                        step={0.01}
                        value={panMap[track.id] ?? 0}
                        onChange={(e) => setPan(track.id, parseFloat(e.target.value))}
                      />
                    </label>
                  </div>
                </div>

                {/* RIGHT: miniature timeline */}
                <div className="track-timeline">
                  <div className="mini-playhead" style={{ left: `${redLineLeft}px` }} />
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`timeline-cell ${i % 4 === 0 ? "bar" : ""}`}
                      style={{ left: i * 10 }}
                    />
                  ))}
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="mini-note"
                      style={{
                        left: `${note.time * 10}px`,
                        width: `${note.duration * 10}px`,
                        top: `${getTopFromPitch(note.pitch)}px`,
                        height: `${NOTE_HEIGHT}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <button
            type="button"
            className="add-track-row"
            onClick={onAddTrack}
            aria-label="Add track"
            title="Add track"
          >
            ＋
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(TrackDashboard);

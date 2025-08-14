// src/components/workspace/midi-editor/components/TrackDashboard/TrackDashboard.tsx
import React, { useContext, useEffect, useRef, useState, memo } from "react";
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

const TrackDashboard: React.FC<Props> = ({ tracks, onEditTrack, onAddTrack,deleteTrack}) => {
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

  // build instruments for current track list
  useEffect(() => {
    // dispose old
    instrumentMap.current.forEach(i => i?.dispose?.());
    instrumentMap.current.clear();

    tracks.forEach(track => {
      const volume = new Tone.Volume((volumeMap[track.id] ?? 100) - 100).toDestination();
      const pan = new Tone.Panner(panMap[track.id] ?? 0).connect(volume);

      if (track.instrument.startsWith("Imported:")) {
        instrumentMap.current.set(track.id, { synth: null, pan, volume });
      } else {
        let synth: any;
        switch (track.instrument) {
          case "Piano":           synth = new Tone.PolySynth().connect(pan); break;
          case "Synth":           synth = new Tone.Synth().connect(pan); break;
          case "AMSynth":         synth = new Tone.AMSynth().connect(pan); break;
          case "MembraneSynth":   synth = new Tone.MembraneSynth().connect(pan); break;
          default:                synth = new Tone.PolySynth().connect(pan); break;
        }
        instrumentMap.current.set(track.id, { synth, pan, volume });
      }

      activeNotesMap.current.set(track.id, new Set());
    });

    return () => {
      instrumentMap.current.forEach(i => {
        i?.synth?.dispose?.();
        i?.pan?.dispose?.();
        i?.volume?.dispose?.();
      });
    };
  }, [tracks, volumeMap, panMap]);

  // timeline + playback driving
  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = Math.max(now - lastTime, 0) / 1000;
      lastTime = now;

      if (isPlaying) {
        const beatsMoved = (bpm / 60) * delta;
        redLineBeatRef.current += beatsMoved;
        if (redLineBeatRef.current >= MAX_BEAT) redLineBeatRef.current = 0;
        setPlayheadBeat(redLineBeatRef.current);
      } else {
        redLineBeatRef.current = playheadBeat;
        stopAllNotes();
      }

      setRedLineLeft(redLineBeatRef.current * 10);

      const soloed = Object.entries(soloMap).filter(([, s]) => s).map(([id]) => id);
      tracks.forEach(track => {
        const muted = muteMap[track.id];
        const blockedBySolo = soloed.length > 0 && !soloMap[track.id];
        if (!muted && !blockedBySolo && isPlaying) {
          triggerTrackNotes(track, redLineBeatRef.current);
        }
      });

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [isPlaying, bpm, tracks, muteMap, soloMap, playheadBeat, setPlayheadBeat]);

  const triggerTrackNotes = (track: Track, beat: number) => {
    const instruments = instrumentMap.current.get(track.id);
    const synth = instruments?.synth;
    const nowActive = getActiveNotesAtBeat(track.notes, beat);
    const activeIds = activeNotesMap.current.get(track.id)!;

    nowActive.forEach(note => {
      if (!activeIds.has(note.id)) {
        const now = Tone.now();
        if (track.instrument.startsWith("Imported:")) {
          const url = track.customSoundUrl;
          if (!url) return;
          const durationSec = (note.duration / bpm) * 60;
          const player = new Tone.Player({
            url,
            playbackRate: Math.pow(2, (note.pitch - 60) / 12),
            autostart: true,
            onstop: () => player.dispose(),
          }).connect(instruments.pan);
          setTimeout(() => player.stop(), durationSec * 1000);
        } else if (synth) {
          const name = Tone.Frequency(note.pitch, "midi").toNote();
          synth.triggerAttack(name, now, note.velocity / 127);
        }
        activeIds.add(note.id);
      }
    });

    // releases
    activeIds.forEach(id => {
      const stillActive = nowActive.find(n => n.id === id);
      if (!stillActive) {
        const note = track.notes.find(n => n.id === id);
        if (note && synth && !track.instrument.startsWith("Imported:")) {
          const name = Tone.Frequency(note.pitch, "midi").toNote();
          synth.triggerRelease(name, Tone.now());
        }
        activeIds.delete(id);
      }
    });
  };

  const stopAllNotes = () => {
    tracks.forEach(track => {
      const synth = instrumentMap.current.get(track.id)?.synth;
      const activeIds = activeNotesMap.current.get(track.id)!;
      activeIds.forEach(id => {
        const note = track.notes.find(n => n.id === id);
        if (note && synth && !track.instrument.startsWith("Imported:")) {
          const name = Tone.Frequency(note.pitch, "midi").toNote();
          synth.triggerRelease(name, Tone.now());
        }
      });
      activeIds.clear();
    });
  };

  const toggleMute  = (id: string) => setMuteMap(prev  => ({ ...prev, [id]: !prev[id] }));
  const toggleSolo  = (id: string) => setSoloMap(prev  => ({ ...prev, [id]: !prev[id] }));
  const setVolume   = (id: string, v: number) => setVolumeMap(prev => ({ ...prev, [id]: v }));
  const setPan      = (id: string, v: number) => setPanMap(prev    => ({ ...prev, [id]: v }));

  const getTopFromPitch = (pitch: number) => {
    const [min, max] = PITCH_RANGE;
    return (max - pitch) * NOTE_HEIGHT;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-timeline-wrapper">
        {tracks.map((track) => (
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

                  <button
                    type="button"
                    className={`icon-btn ${muteMap[track.id] ? "active" : ""}`}
                    onClick={() => toggleMute(track.id)}
                    aria-pressed={!!muteMap[track.id]}
                    title={muteMap[track.id] ? "Unmute" : "Mute"}
                  >
                    🔊
                  </button>

                  <button
                    type="button"
                    className={`icon-btn ${soloMap[track.id] ? "active" : ""}`}
                    onClick={() => toggleSolo(track.id)}
                    aria-pressed={!!soloMap[track.id]}
                    title={soloMap[track.id] ? "Unsolo" : "Solo"}
                  >
                    🎧
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
                    🗑
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
                {track.notes.map((note) => (
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
        ))}
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

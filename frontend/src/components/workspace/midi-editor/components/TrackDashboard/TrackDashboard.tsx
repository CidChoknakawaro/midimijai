import React, { useContext, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { getActiveNotesAtBeat } from '../../core/midiUtils';
import { TransportContext } from '../../core/TransportContext';
import './TrackDashboard.css'

type Track = {
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
};

const MAX_BEAT = 63;
const NOTE_HEIGHT = 4;
const PITCH_RANGE = [36, 84];

const TrackDashboard: React.FC<Props> = ({ tracks, onEditTrack, onAddTrack }) => {
  const {
    bpm,
    isPlaying,
    playheadBeat,
    setPlayheadBeat,
  } = useContext(TransportContext);

  const [muteMap, setMuteMap] = useState<{ [trackId: string]: boolean }>({});
  const [soloMap, setSoloMap] = useState<{ [trackId: string]: boolean }>({});
  const [volumeMap, setVolumeMap] = useState<{ [trackId: string]: number }>({});
  const [panMap, setPanMap] = useState<{ [trackId: string]: number }>({});
  const [redLineLeft, setRedLineLeft] = useState(0);

  const redLineBeatRef = useRef(playheadBeat);
  const animationRef = useRef<number>();
  const instrumentMap = useRef<Map<string, any>>(new Map());
  const activeNotesMap = useRef<Map<string, Set<string>>>(new Map());

  useEffect(() => {
    instrumentMap.current.forEach(i => i?.dispose?.());
    instrumentMap.current.clear();

    tracks.forEach(track => {
      const volume = new Tone.Volume((volumeMap[track.id] ?? 100) - 100).toDestination();
      const pan = new Tone.Panner(panMap[track.id] ?? 0).connect(volume);

      if (track.instrument.startsWith('Imported:')) {
        instrumentMap.current.set(track.id, { synth: null, pan, volume });
      } else {
        let synth: any;
        switch (track.instrument) {
          case 'Piano': synth = new Tone.PolySynth().connect(pan); break;
          case 'Synth': synth = new Tone.Synth().connect(pan); break;
          case 'AMSynth': synth = new Tone.AMSynth().connect(pan); break;
          case 'MembraneSynth': synth = new Tone.MembraneSynth().connect(pan); break;
          default: synth = new Tone.PolySynth().connect(pan); break;
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

  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now: number) => {
      const deltaRaw = now - lastTime;
      const delta = Math.max(deltaRaw, 0) / 1000;
      lastTime = now;

      if (isPlaying) {
        const beatsMoved = (bpm / 60) * delta;
        redLineBeatRef.current += beatsMoved;
        if (redLineBeatRef.current >= MAX_BEAT) {
          redLineBeatRef.current = 0;
        }
        setPlayheadBeat(redLineBeatRef.current);
      } else {
        redLineBeatRef.current = playheadBeat;
        stopAllNotes();
      }

      setRedLineLeft(redLineBeatRef.current * 10);

      const soloedTracks = Object.entries(soloMap).filter(([_, s]) => s).map(([id]) => id);
      tracks.forEach(track => {
        const isMuted = muteMap[track.id];
        const isSoloed = soloedTracks.length > 0 && !soloMap[track.id];
        if (!isMuted && !isSoloed && isPlaying) {
          triggerTrackNotes(track, redLineBeatRef.current);
        }
      });

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [isPlaying, bpm, tracks, muteMap, soloMap, playheadBeat]);

  const triggerTrackNotes = (track: Track, beat: number) => {
    const instruments = instrumentMap.current.get(track.id);
    const synth = instruments?.synth;
    const nowActive = getActiveNotesAtBeat(track.notes, beat);
    const activeIds = activeNotesMap.current.get(track.id)!;

    nowActive.forEach(note => {
      if (!activeIds.has(note.id)) {
        const now = Tone.now();
        if (track.instrument.startsWith('Imported:')) {
          const url = track.customSoundUrl;
          if (!url) return;
          const durationSec = (note.duration / bpm) * 60;
          const player = new Tone.Player({
            url,
            playbackRate: Math.pow(2, (note.pitch - 60) / 12),
            autostart: true,
            onstop: () => player.dispose()
          }).connect(instruments.pan);
          setTimeout(() => player.stop(), durationSec * 1000);
        } else if (synth) {
          const name = Tone.Frequency(note.pitch, 'midi').toNote();
          synth.triggerAttack(name, now, note.velocity / 127);
        }
        activeIds.add(note.id);
      }
    });

    activeIds.forEach(id => {
      const stillActive = nowActive.find(n => n.id === id);
      if (!stillActive) {
        const note = track.notes.find(n => n.id === id);
        if (note && synth && !track.instrument.startsWith('Imported:')) {
          const name = Tone.Frequency(note.pitch, 'midi').toNote();
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
        if (note && synth && !track.instrument.startsWith('Imported:')) {
          const name = Tone.Frequency(note.pitch, 'midi').toNote();
          synth.triggerRelease(name, Tone.now());
        }
      });
      activeIds.clear();
    });
  };

  const toggleMute = (trackId: string) => {
    setMuteMap(prev => ({ ...prev, [trackId]: !prev[trackId] }));
  };

  const toggleSolo = (trackId: string) => {
    setSoloMap(prev => ({ ...prev, [trackId]: !prev[trackId] }));
  };

  const handleVolumeChange = (trackId: string, value: number) => {
    setVolumeMap(prev => ({ ...prev, [trackId]: value }));
  };

  const handlePanChange = (trackId: string, value: number) => {
    setPanMap(prev => ({ ...prev, [trackId]: value }));
  };

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
              <div className="track-controls">
                <div className="track-name">{track.name}</div>
                <div className="track-meta">
                  <span>{track.instrument}</span>
                  <button onClick={() => toggleMute(track.id)}>
                    {muteMap[track.id] ? '🔇' : '🔊'}
                  </button>
                  <button onClick={() => toggleSolo(track.id)}>
                    {soloMap[track.id] ? '🎧 Soloed' : '🎧'}
                  </button>
                  <button onClick={() => onEditTrack(track.id)}>🎹</button>
                </div>
                <div className="track-sliders">
                  <label>
                    Volume
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volumeMap[track.id] ?? 100}
                      onChange={(e) => handleVolumeChange(track.id, parseInt(e.target.value))}
                    />
                  </label>
                  <label>
                    Pan
                    <input
                      type="range"
                      min={-1}
                      max={1}
                      step={0.01}
                      value={panMap[track.id] ?? 0}
                      onChange={(e) => handlePanChange(track.id, parseFloat(e.target.value))}
                    />
                  </label>
                </div>
              </div>

              <div className="track-timeline">
                <div className="mini-playhead" style={{ left: `${redLineLeft}px` }} />
                {[...Array(64)].map((_, i) => (
                  <div className={`timeline-cell ${i % 4 === 0 ? 'bar' : ''}`} key={i} />
                ))}
                {track.notes.map(note => (
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
        <div className="add-track-row" onClick={onAddTrack}>＋</div>
      </div>
    </div>
  );
};

export default TrackDashboard;

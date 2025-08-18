import React, { createContext, useEffect, useState } from 'react';
import * as Tone from 'tone';

type ZoomLevel = 1 | 2 | 4;

type TransportCtx = {
  bpm: number;
  setBpm: (n: number) => void;

  isPlaying: boolean;
  handlePlay: () => Promise<void>;
  handlePause: () => void;
  returnToStart: () => void;

  playheadBeat: number;
  setPlayheadBeat: (n: number) => void;

  metronome: boolean;
  toggleMetronome: () => void;

  loop: boolean;
  toggleLoop: () => void;

  /** Global editor zoom (1→1/4, 2→1/8, 4→1/16) */
  zoom: ZoomLevel;
  setZoomLevel: (z: ZoomLevel) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;

  /** Global snap to grid */
  snapToGrid: boolean;
  setSnapToGrid: (v: boolean) => void;
  toggleSnap: () => void;
};

export const TransportContext = createContext<TransportCtx>(null as any);

export const TransportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadBeat, setPlayheadBeat] = useState(0);
  const [metronome, setMetronome] = useState(false);
  const [loop, setLoop] = useState(false);

  // ---- centralized zoom & snap ----
  const [zoom, setZoom] = useState<ZoomLevel>(1);
  const [snapToGrid, setSnapToGrid] = useState(true);

  const setZoomLevel = (z: ZoomLevel) => setZoom(z);
  const handleZoomIn  = () => setZoom((z) => (z === 1 ? 2 : z === 2 ? 4 : 4));
  const handleZoomOut = () => setZoom((z) => (z === 4 ? 2 : z === 2 ? 1 : 1));

  const handlePlay = async () => {
    await Tone.start();
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);
  const returnToStart = () => setPlayheadBeat(0);
  const toggleMetronome = () => setMetronome((prev) => !prev);
  const toggleSnap = () => setSnapToGrid((s) => !s);
  const toggleLoop = () => setLoop((prev) => !prev);

  useEffect(() => {
    let metronomeSynth: Tone.Synth | null = null;
    let intervalId: number | undefined;

    if (metronome && isPlaying) {
      metronomeSynth = new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.001, decay: 0.01, sustain: 0.1, release: 0.1 }
      }).toDestination();

      intervalId = Tone.Transport.scheduleRepeat((time) => {
        metronomeSynth?.triggerAttackRelease("C5", "8n", time);
      }, "4n");

      Tone.Transport.start();
    }

    return () => {
      if (intervalId !== undefined) Tone.Transport.clear(intervalId);
      metronomeSynth?.dispose();
    };
  }, [metronome, isPlaying]);

  return (
    <TransportContext.Provider
      value={{
        bpm, setBpm,
        isPlaying, handlePlay, handlePause, returnToStart,
        playheadBeat, setPlayheadBeat,
        metronome, toggleMetronome,
        loop, toggleLoop,
        zoom, setZoomLevel, handleZoomIn, handleZoomOut,
        snapToGrid, setSnapToGrid, toggleSnap,
      }}
    >
      {children}
    </TransportContext.Provider>
  );
};

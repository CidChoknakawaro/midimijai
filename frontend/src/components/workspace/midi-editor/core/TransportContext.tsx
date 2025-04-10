import React, { createContext, useEffect, useState } from 'react';
import * as Tone from 'tone';

export const TransportContext = createContext<any>(null);

export const TransportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadBeat, setPlayheadBeat] = useState(0);
  const [metronome, setMetronome] = useState(false);
  const [loop, setLoop] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handlePlay = async () => {
    await Tone.start();
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const returnToStart = () => {
    setPlayheadBeat(0);
  };

  const toggleMetronome = () => {
    setMetronome((prev) => !prev);
  };

  useEffect(() => {
    let metronomeSynth: Tone.Synth | null = null;
    let intervalId: number | string | undefined;

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
      if (intervalId !== undefined) {
        Tone.Transport.clear(intervalId);
      }
      metronomeSynth?.dispose();
    };
  }, [metronome, isPlaying]);

  return (
    <TransportContext.Provider
      value={{
        bpm,
        setBpm,
        isPlaying,
        handlePlay,
        handlePause,
        returnToStart,
        playheadBeat,
        setPlayheadBeat,
        metronome,
        toggleMetronome,
        loop,
        toggleLoop: () => setLoop((prev) => !prev),
        zoom,
        handleZoomIn: () => setZoom((z) => Math.min(z + 1, 4)),
        handleZoomOut: () => setZoom((z) => Math.max(z - 1, 1)),
      }}
    >
      {children}
    </TransportContext.Provider>
  );
};

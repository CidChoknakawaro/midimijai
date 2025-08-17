// src/components/workspace/midi-editor/audio/sampleVoice.ts
import * as Tone from "tone";

type Voice = {
  trigger: (midi: number, durationBeats: number, velocity?: number) => void;
  dispose: () => void;
};

const voices = new Map<string, Voice>();

const isFiniteNum = (v: any): v is number => Number.isFinite(Number(v));
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function getSampleVoice(
  trackId: string,
  sampleUrl: string,
  sampleRootMidi = 67
): Voice {
  const existing = voices.get(trackId);
  if (existing) return existing;

  const player = new Tone.Player({
    url: sampleUrl,
    autostart: false,
    loop: false,
    volume: -4,
  }).toDestination();

  const voice: Voice = {
    trigger: (midiIn, durationBeatsIn, velocityIn = 96) => {
      // Make sure AudioContext is started
      // (Your app should call Tone.start() on first user gesture.)
      const bpm = isFiniteNum(Tone.Transport.bpm?.value)
        ? Number(Tone.Transport.bpm.value)
        : 120;

      const midi = isFiniteNum(midiIn) ? clamp(Math.trunc(midiIn), 0, 127) : 60;
      const durationBeats = isFiniteNum(durationBeatsIn) && durationBeatsIn > 0
        ? durationBeatsIn
        : 0.5;
      const velNorm = clamp((isFiniteNum(velocityIn) ? velocityIn : 96) / 127, 0.05, 1);

      const playbackRate = Math.pow(2, (midi - sampleRootMidi) / 12);
      player.playbackRate = isFiniteNum(playbackRate) ? playbackRate : 1;

      // Use gainToDb safely
      const db = Tone.gainToDb(velNorm);
      if (isFiniteNum(db)) player.volume.value = db;

      player.start();

      // schedule a stop so overlaps don’t pile up
      const stopAt = Tone.now() + Math.max(0.05, (durationBeats * 60) / bpm);
      player.stop(stopAt);
    },
    dispose: () => {
      try { player.dispose(); } catch {}
      voices.delete(trackId);
    },
  };

  voices.set(trackId, voice);
  return voice;
}

export function disposeAllSampleVoices() {
  voices.forEach((v) => v.dispose());
  voices.clear();
}

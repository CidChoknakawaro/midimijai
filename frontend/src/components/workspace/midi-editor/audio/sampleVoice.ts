import * as Tone from "tone";

/**
 * Simple per-track sample voice.
 * - Uses Tone.Player for /public/piano.mp3 (root G4 = 67).
 * - Pitch shift via playbackRate = 2^((midi - root)/12).
 * - One Player per track id, reused across triggers.
 */

type Voice = {
  trigger: (midi: number, durationBeats: number, velocity?: number) => void;
  dispose: () => void;
};

const voices = new Map<string, Voice>();

export function getSampleVoice(trackId: string, sampleUrl: string, sampleRootMidi = 67): Voice {
  const existing = voices.get(trackId);
  if (existing) return existing;

  const player = new Tone.Player({
    url: sampleUrl,
    autostart: false,
    loop: false,
    volume: -4,
  }).toDestination();

  const voice: Voice = {
    trigger: (midi, durationBeats, velocity = 96) => {
      // Ensure audio unlocked
      // (Tone.start() should already be called from your container)
      const playbackRate = Math.pow(2, (midi - sampleRootMidi) / 12);
      const durSec = (durationBeats * Tone.Transport.bpm.value) / Tone.Transport.bpm.value; // caller passes beats; we'll just let player stop itself
      player.playbackRate = playbackRate;
      player.volume.value = Tone.gainToDb(Math.min(1, Math.max(0.05, velocity / 127)));
      // We retrigger by restarting a fresh buffer each time.
      player.start();
      // optional: schedule a stop to avoid tails stacking
      const stopAt = Tone.now() + Math.max(0.05, (durationBeats * 60) / (Tone.Transport.bpm.value || 120));
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

/** Dispose all sample voices (e.g., on unmount) */
export function disposeAllSampleVoices() {
  voices.forEach((v) => v.dispose());
  voices.clear();
}

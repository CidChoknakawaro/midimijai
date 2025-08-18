// src/utils/previewPlayer.ts
import * as Tone from "tone";

export type PlainNote = {
  pitch: number;      // MIDI (0-127)
  time: number;       // beats
  duration: number;   // beats
  velocity?: number;  // 0..127
};

export type PreviewHandle = {
  stop: () => void;
  isStopped: () => boolean;
};

const activeById = new Map<string, PreviewHandle>();

/**
 * Plays a small set of notes using a private PolySynth.
 * - Uses Tone.now() + setTimeout scheduling (doesn't start Tone.Transport)
 * - Stops any previous preview for the same clip id
 */
export function playPreview(
  clipId: string,
  notes: PlainNote[],
  bpm: number,
  onEnded?: () => void
): PreviewHandle {
  // stop any existing preview for this clip
  activeById.get(clipId)?.stop();

  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    volume: -6,
    envelope: { attack: 0.005, decay: 0.1, sustain: 0.2, release: 0.2 },
  }).toDestination();

  const msPerBeat = 60000 / bpm;
  const timeouts: number[] = [];
  let stopped = false;

  // schedule notes against the wall clock
  notes.forEach((n) => {
    const whenMs = n.time * msPerBeat;
    const durSec = (n.duration * msPerBeat) / 1000;
    const vel = Math.min(1, Math.max(0, (n.velocity ?? 90) / 127));

    const id = window.setTimeout(() => {
      if (stopped) return;
      const hz = Tone.Frequency(n.pitch, "midi").toFrequency();
      synth.triggerAttackRelease(hz, durSec, undefined, vel);
    }, Math.max(0, whenMs));
    timeouts.push(id);
  });

  // auto-stop after clip length
  const endBeat = notes.reduce((m, n) => Math.max(m, n.time + n.duration), 0);
  const endId = window.setTimeout(() => {
    if (stopped) return;
    stopped = true;
    synth.dispose();
    onEnded?.();
    activeById.delete(clipId);
  }, Math.max(0, endBeat * msPerBeat + 50));
  timeouts.push(endId);

  const handle: PreviewHandle = {
    stop: () => {
      if (stopped) return;
      stopped = true;
      timeouts.forEach(clearTimeout);
      synth.releaseAll();
      synth.dispose();
      onEnded?.();
      activeById.delete(clipId);
    },
    isStopped: () => stopped,
  };

  activeById.set(clipId, handle);
  return handle;
}

/** Stop ALL running previews (e.g., when leaving the page) */
export function stopAllPreviews() {
  activeById.forEach((h) => h.stop());
  activeById.clear();
}

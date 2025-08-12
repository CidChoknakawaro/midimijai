// src/components/workspace/midi-editor/core/exportMidi.ts
import { Midi } from "@tonejs/midi";

/**
 * Export a single track's notes to a downloadable .mid file.
 */
export function exportTrackToMidi(
  opts: {
    notes: Array<{ midi: number; time: number; duration: number; velocity?: number }>;
    bpm?: number;
    filename?: string;
  }
) {
  const { notes, bpm = 120, filename = "track" } = opts;

  const midi = new Midi();
  midi.header.ppq = 480;
  midi.header.setTempo(bpm);

  const track = midi.addTrack();
  notes.forEach(n => {
    track.addNote({
      midi: n.midi,
      time: n.time,
      duration: n.duration,
      velocity: n.velocity ?? 0.8,
    });
  });

  const bytes = midi.toArray();
  const blob = new Blob([bytes], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.mid`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export multiple tracks to a single multi‑track .mid file.
 */
export function exportMultiTrackToMidi(
  opts: {
    tracks: Array<{
      name?: string;
      notes: Array<{ midi: number; time: number; duration: number; velocity?: number }>;
    }>;
    bpm?: number;
    filename?: string;
  }
) {
  const { tracks, bpm = 120, filename = "project" } = opts;

  const midi = new Midi();
  midi.header.ppq = 480;
  midi.header.setTempo(bpm);

  tracks.forEach(t => {
    const tr = midi.addTrack();
    if (t.name) tr.name = t.name;
    t.notes.forEach(n => {
      tr.addNote({
        midi: n.midi,
        time: n.time,
        duration: n.duration,
        velocity: n.velocity ?? 0.8,
      });
    });
  });

  const bytes = midi.toArray();
  const blob = new Blob([bytes], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.mid`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Optional: maintain backward compatibility if other code imported `exportMidi`
export const exportMidi = exportTrackToMidi;

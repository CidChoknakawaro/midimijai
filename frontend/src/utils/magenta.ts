// src/utils/magenta.ts
import * as mm from "@magenta/music";

let rnn: mm.MusicRNN | null = null;

// Basic_rnn is fast and decent for short melodic ideas.
// Other checkpoints: look at @magenta/music docs if you want different flavors.
const RNN_URL = "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn";

export async function ensureRNN() {
  if (!rnn) {
    rnn = new mm.MusicRNN(RNN_URL);
    await rnn.initialize();
  }
  return rnn!;
}

export type GeneratedClip = {
  id: string;
  notes: Array<{ id: string; pitch: number; time: number; duration: number; velocity: number }>;
  totalBeats: number;
};

// Convert a Magenta NoteSequence into your note shape (beats as time)
function toEditorNotes(ns: mm.INoteSequence): GeneratedClip {
  // Tone grid in your editor uses beats; Magenta NoteSequence uses totalTime in seconds with tempo metadata.
  const bpm = ns.tempos?.[0]?.qpm ?? 120;
  const secPerBeat = 60 / bpm;

  const out = (ns.notes || []).map((n, i) => {
    const startBeat = (n.startTime ?? 0) / secPerBeat;
    const endBeat = (n.endTime ?? 0) / secPerBeat;
    return {
      id: `g-${i}-${n.pitch}-${startBeat.toFixed(3)}`,
      pitch: n.pitch,
      time: startBeat,
      duration: Math.max(0.125, endBeat - startBeat),
      velocity: Math.round((n.velocity ?? 80)),
    };
  });

  const totalBeats = ((ns.totalTime ?? 0) / secPerBeat) || (out.reduce((m, n) => Math.max(m, n.time + n.duration), 0));
  return { id: `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`, notes: out, totalBeats };
}

/**
 * Generate N melodic ideas using Magenta MusicRNN.
 * @param bars   How many bars to expand to (assuming 4/4)
 * @param bpm    QPM for the sequence (Magenta uses qpm)
 * @param temperature  randomness 0.2..1.5
 * @param count  number of ideas
 */
export async function generateMelodies({ bars, bpm, temperature, count = 3 }: {
  bars: number; bpm: number; temperature: number; count?: number;
}): Promise<GeneratedClip[]> {
  const model = await ensureRNN();

  // Start seed: a simple single C note; RNN will expand.
  const seed: mm.INoteSequence = mm.sequences.quantizeNoteSequence({
    notes: [{ pitch: 60, startTime: 0, endTime: 0.4, velocity: 90 }],
    tempos: [{ qpm: bpm }],
    totalTime: 0.5
  }, 4);

  // total quantized steps: bars * 4 beats * 4 steps/beat (16th notes)
  const steps = bars * 16;

  const outputs: mm.INoteSequence[] = [];
  for (let i = 0; i < count; i++) {
    const sample = await model.continueSequence(seed, steps, temperature, undefined);
    // de-quantize back to seconds with tempo
    sample.tempos = [{ qpm: bpm }];
    outputs.push(sample);
  }

  return outputs.map(toEditorNotes);
}

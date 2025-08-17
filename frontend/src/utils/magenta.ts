import { ensureMagentaLoaded } from "./loadMagenta";

export type GenNote = { pitch: number; time: number; duration: number; velocity?: number };
export type GeneratedClip = { id: string; notes: GenNote[]; totalBeats: number };

const clampBeat = (v: number) => Math.max(0, Math.round(v * 64) / 64); // 1/64 beat grid
const secsToBeats = (s: number, bpm: number) => (s * bpm) / 60;

/**
 * Robustly convert a Magenta NoteSequence to our {pitch,time,duration,velocity} in BEATS.
 * Handles BOTH:
 *  - quantized notes: quantizedStartStep / quantizedEndStep (common when seed is quantized)
 *  - time-based notes: startTime / endTime (seconds)
 */
function fromMagentaSequence(seq: any, bpm: number): GenNote[] {
  const notes = Array.isArray(seq?.notes) ? seq.notes : [];
  const spq = Number(seq?.quantizationInfo?.stepsPerQuarter) || 4;

  const out: GenNote[] = notes.map((n: any) => {
    const hasSteps =
      Number.isFinite(n?.quantizedStartStep) && Number.isFinite(n?.quantizedEndStep);

    let t0Beats: number;
    let t1Beats: number;

    if (hasSteps) {
      // Convert steps -> beats (quarter note = 1 beat)
      const s0 = Number(n.quantizedStartStep);
      const s1 = Number(n.quantizedEndStep);
      t0Beats = clampBeat(s0 / spq);
      t1Beats = clampBeat(s1 / spq);
    } else {
      // Fallback to seconds -> beats
      const st = Number.isFinite(n?.startTime) ? Number(n.startTime)
               : Number.isFinite(n?.start_time) ? Number(n.start_time)
               : 0;
      const et = Number.isFinite(n?.endTime) ? Number(n.endTime)
               : Number.isFinite(n?.end_time) ? Number(n.end_time)
               : 0;
      t0Beats = clampBeat(secsToBeats(st, bpm));
      t1Beats = clampBeat(secsToBeats(et, bpm));
    }

    const durBeats = Math.max(0.125, t1Beats - t0Beats); // at least a 1/8 beat so you can see/hear it

    return {
      pitch: Number.isFinite(n?.pitch) ? Number(n.pitch)
           : Number.isFinite(n?.midi)  ? Number(n.midi)
           : 60,
      time: t0Beats,
      duration: durBeats,
      velocity: Math.round(((Number.isFinite(n?.velocity) ? Number(n.velocity) : 0.8)) * 127),
    };
  });

  return out
    .filter((n) => n.duration > 0)
    .sort((a, b) => a.time - b.time);
}

export async function generateMelodies(opts: {
  bars?: number;
  bpm?: number;
  temperature?: number;
  count?: number;
} = {}): Promise<GeneratedClip[]> {
  const { bars = 8, bpm = 120, temperature = 1.0, count = 1 } = opts;

  await ensureMagentaLoaded();
  const mm: any = (window as any).mm;
  if (!mm) throw new Error("@magenta/music failed to load");

  // Melody RNN, no chords arg
  const model = new mm.MusicRNN(
    "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn"
  );
  await model.initialize();

  const spq = 4;                // steps per quarter (16th note grid)
  const steps = bars * 4 * spq; // bars * beatsPerBar * spq

  // Non-empty seed improves stability across TFJS backends
  const seedUnquantized = {
    notes: [{ pitch: 60, startTime: 0, endTime: 0.5 }],
    totalTime: 0.5,
    tempos: [{ qpm: bpm }],
  };
  const seed = mm.sequences.quantizeNoteSequence(seedUnquantized, spq);

  const out: GeneratedClip[] = [];
  for (let i = 0; i < count; i++) {
    const seq = await model.continueSequence(seed, steps, temperature);
    // Provide tempo for time-based fallback paths
    seq.tempos = [{ qpm: bpm }];

    const notes = fromMagentaSequence(seq, bpm);
    const totalBeats = notes.reduce((m, n) => Math.max(m, n.time + n.duration), 0);
    out.push({ id: `magenta-${Date.now()}-${i}`, notes, totalBeats });
  }
  return out;
}

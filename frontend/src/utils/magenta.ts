// src/utils/magenta.ts
export type GenNote = { pitch: number; time: number; duration: number; velocity?: number };
export type GeneratedClip = { id: string; notes: GenNote[]; totalBeats: number };

const clampBeat = (v: number) => Math.max(0, Math.round(v * 64) / 64); // 1/16 = 0.25, but keep some finesse

const secsToBeats = (s: number, bpm: number) => (s * bpm) / 60;

function fromMagentaSequence(seq: any, bpm: number): GenNote[] {
  // Magenta NoteSequence times are in *seconds*
  const notes: GenNote[] = (seq.notes || []).map((n: any) => {
    const timeB = clampBeat(secsToBeats(n.startTime ?? n.start_time ?? 0, bpm));
    const endB  = clampBeat(secsToBeats(n.endTime   ?? n.end_time   ?? 0, bpm));
    const durB  = Math.max(0.25, endB - timeB); // never shorter than a 1/16
    return {
      pitch: n.pitch ?? n.midi,
      time: timeB,
      duration: durB,
      velocity: Math.round((n.velocity ?? 0.8) * 127),
    };
  });
  return notes.sort((a, b) => a.time - b.time);
}

function simpleFallbackGenerator(bars: number, bpm: number, temperature = 0.9): GenNote[] {
  // 4/4: 4 beats/bar, 1/8 or 1/4 lengths
  const totalBeats = bars * 4;
  const notes: GenNote[] = [];
  let t = 0;
  let root = 60 + Math.round((Math.random() - 0.5) * 6); // around C4
  while (t < totalBeats) {
    const dur = Math.random() < 0.7 ? 0.5 : 1;       // 1/8 or 1/4 beats
    const step = Math.round((Math.random() - 0.5) * (temperature > 1 ? 6 : 4));
    root = Math.min(84, Math.max(48, root + step));
    notes.push({ pitch: root, time: clampBeat(t), duration: dur, velocity: 96 });
    t += dur;
  }
  return notes;
}

export async function generateMelodies(opts: {
  bars: number; bpm: number; temperature: number; count: number;
}): Promise<GeneratedClip[]> {
  const { bars = 8, bpm = 120, temperature = 0.9, count = 3 } = opts;

  // If @magenta/music is available on window, use it; else fallback
  const hasMagenta = typeof (window as any).mm !== "undefined";
  const out: GeneratedClip[] = [];

  for (let i = 0; i < count; i++) {
    let notes: GenNote[] = [];

    if (hasMagenta) {
      try {
        const mm: any = (window as any).mm;
        // Melody RNN small, steps are quantized; set qpm=bpm so seconds map correctly
        const model = new mm.MusicRNN(
          "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn"
        );
        await model.initialize();

        const stepsPerQuarter = 4; // 1/16th quantization
        const steps = bars * 4 * stepsPerQuarter;

        const seed: any = mm.sequences.quantizeNoteSequence(
          { notes: [], totalTime: 0, tempos: [{ qpm: bpm }] },
          stepsPerQuarter
        );

        const r = await model.continueSequence(seed, steps, temperature, [60]);
        r.tempos = [{ qpm: bpm }]; // make sure qpm is set
        notes = fromMagentaSequence(r, bpm);
      } catch (e) {
        console.warn("Magenta generation failed, falling back:", e);
        notes = simpleFallbackGenerator(bars, bpm, temperature);
      }
    } else {
      notes = simpleFallbackGenerator(bars, bpm, temperature);
    }

    const totalBeats = notes.reduce((m, n) => Math.max(m, n.time + n.duration), 0);
    out.push({ id: `gen-${Date.now()}-${i}`, notes, totalBeats });
  }

  return out;
}

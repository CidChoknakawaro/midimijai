import React, { useMemo, useState } from "react";
import { generateMelodies } from "../../utils/magenta";

type Note = { pitch: number; time: number; duration: number; velocity?: number };
type Candidate = { id: string; notes: Note[]; totalBeats: number; bpm: number };

export default function AIGenerate() {
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [cands, setCands] = useState<Candidate[]>([]);
  const [log, setLog] = useState("");

  // Basic prompt parsing (very light): find bars/bpm if user typed them
  const parsed = useMemo(() => {
    const bars = /(\d+)\s*bars?/i.exec(prompt)?.[1];
    const bpm = /(\d+)\s*bpm/i.exec(prompt)?.[1];
    return {
      bars: bars ? Math.max(1, Math.min(64, parseInt(bars))) : 8,
      bpm: bpm ? Math.max(40, Math.min(220, parseInt(bpm))) : 120,
      temperature: 1.05,
    };
  }, [prompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setLog("Please describe the melody first.");
      return;
    }
    setBusy(true);
    setLog("Generating 3 ideas with Magenta…");
    try {
      const { bars, bpm, temperature } = parsed;
      const clips = await generateMelodies({ bars, bpm, temperature, count: 3 });
      const next: Candidate[] = clips.map((clip) => ({
        id: clip.id,
        notes: clip.notes,
        totalBeats: Math.max(clip.totalBeats, bars * 4), // ensure at least the bar length
        bpm,
      }));
      setCands(next);
      setLog(`Generated ${next.length} ideas. Click “Add to Track” on the one you like.`);
    } catch (e: any) {
      setCands([]);
      setLog(`Magenta error: ${e?.message || String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  const handleClear = () => {
    setCands([]);
    setLog("");
  };

  const addCandidateToTrack = (cand: Candidate) => {
    if (!cand?.notes?.length) return;
    window.dispatchEvent(
      new CustomEvent("cmd", {
        detail: {
          type: "APPLY_AI_TO_TRACK",
          notes: cand.notes,
          bpm: cand.bpm,
        },
      })
    );
    setLog(`Added ${cand.notes.length} notes to track (bpm ${cand.bpm}).`);
  };

  return (
    <div className="space-y-3">
      {/* pill input (matches your AIModify style) */}
      <div className="rounded-full bg-white px-4 py-2 border border-black/10 shadow-inner">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe a melody: 'uplifting lofi in C major, 8 bars, 95 bpm'"
          className="w-full outline-none text-[14px] placeholder-black/40"
        />
      </div>

      {/* buttons row */}
      <div className="flex items-center gap-4">
        <button
          disabled={busy}
          onClick={handleGenerate}
          className="px-2 py-1.5 bg-[#ff6a2a] text-black font-semibold rounded shadow
                     hover:brightness-105 active:translate-y-[1px] disabled:opacity-60"
          style={{ border: "1px solid rgba(0,0,0,.12)" }}
        >
          Generate 3
        </button>

        <button
          disabled={busy || cands.length === 0}
          onClick={handleClear}
          className="px-2 py-1.5 bg-[#ff6a2a] text-black font-semibold rounded shadow
                     hover:brightness-105 active:translate-y-[1px] disabled:opacity-60"
          style={{ border: "1px solid rgba(0,0,0,.12)" }}
        >
          Clear
        </button>
      </div>

      {/* results card area */}
      <div className="rounded-[16px] border border-black/10 bg-white/95">
        <div className="p-3 space-y-3">
          {cands.length === 0 ? (
            <div className="text-center text-black/50 py-6 text-sm">
              Your generated ideas will appear here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cands.map((c, idx) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-black/10 bg-white shadow-sm p-3 flex flex-col gap-2"
                >
                  <div className="text-sm font-semibold">Idea {idx + 1}</div>
                  <div className="text-xs text-black/60">
                    {c.notes.length} notes • ~{Math.round(c.totalBeats)} beats • {c.bpm} bpm
                  </div>

                  {/* mini timeline placeholder (visual only) */}
                  <div className="h-16 rounded border border-black/10 bg-white/70 overflow-hidden relative">
                    {/* simple density bars (no heavy canvas) */}
                    <div className="absolute inset-0 p-1 flex gap-1">
                      {Array.from({ length: 12 }).map((_, i) => {
                        const slice = c.notes.filter(
                          (n) =>
                            n.time >= (i * c.totalBeats) / 12 &&
                            n.time < ((i + 1) * c.totalBeats) / 12
                        ).length;
                        const h = Math.min(100, (slice / Math.max(1, c.notes.length)) * 100);
                        return (
                          <div key={i} className="flex-1 flex items-end">
                            <div
                              className="w-full rounded"
                              style={{ height: `${h}%`, border: "1px solid rgba(0,0,0,.06)", background: "rgba(0,0,0,.08)" }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={busy}
                      onClick={() => addCandidateToTrack(c)}
                      className="px-2 py-1.5 text-sm bg-black text-white rounded shadow hover:brightness-110 active:translate-y-[1px] disabled:opacity-60"
                    >
                      Add to Track
                    </button>
                    {/* In case you later want a preview without adding:
                    <button
                      disabled={busy}
                      onClick={() => previewCandidate(c)}
                      className="px-2 py-1.5 text-sm border rounded hover:bg-black/[.03]"
                    >
                      Audition
                    </button>
                    */}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-[11px] text-black/50">{log}</div>
        </div>
      </div>
    </div>
  );
}

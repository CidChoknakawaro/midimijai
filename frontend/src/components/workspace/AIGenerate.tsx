import React, { useState } from "react";
import { analyzePromptToJSON } from "../../services/hfService";
import { generateMelodies, GeneratedClip } from "../../utils/magenta";
import { publish } from "./midi-editor/core/editorBus";

export default function AIGenerate() {
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [analysis, setAnalysis] = useState<null | {
    genre: string; mood: string; bpm: number; bars: number; temperature: number; key: string;
  }>(null);
  const [clips, setClips] = useState<GeneratedClip[]>([]);

  const run = async () => {
    setBusy(true);
    try {
      const a = await analyzePromptToJSON(prompt || "chill lofi, 8 bars");
      setAnalysis(a);
      const outs = await generateMelodies({
        bars: a.bars,
        bpm: a.bpm,
        temperature: a.temperature,
        count: 3
      });
      setClips(outs);
    } finally {
      setBusy(false);
    }
  };

  const addClipToTrack = (clip: GeneratedClip) => {
    publish({ type: "APPLY_AI_TO_TRACK", notes: clip.notes, bpm: analysis?.bpm });
  };

  return (
    <div className="space-y-3">
      {/* pill input */}
      <div className="rounded-full bg-white px-4 py-2 border border-black/10 shadow-inner">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Generate Chord Progression..."
          className="w-full outline-none text-[14px] placeholder-black/40"
        />
      </div>

      {/* buttons row */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {/* (optional) add real suggestions later */}}
          disabled={busy}
          className="px-2 py-1.5 bg-[#ff6a2a] text-black font-semibold rounded shadow
                     hover:brightness-105 active:translate-y-[1px] disabled:opacity-60"
          style={{ border: "1px solid rgba(0,0,0,.12)" }}
        >
          Suggestions
        </button>
        <button
          onClick={run}
          disabled={busy}
          className="px-2 py-1.5 bg-[#ff6a2a] text.black font-semibold rounded shadow
                     hover:brightness-105 active:translate-y-[1px] disabled:opacity-60"
          style={{ border: "1px solid rgba(0,0,0,.12)" }}
        >
          {busy ? "Generating…" : "Generate"}
        </button>
      </div>

      {/* results card area */}
      <div
        className="rounded-[16px] border border-black/10 bg-white/95"
        style={{ minHeight: 220 }}
      >
        <div className="p-3 space-y-3">
          {analysis && (
            <div className="text-xs text-black/70">
              <strong>Analysis:</strong> {analysis.genre} / {analysis.mood} — {analysis.bpm} BPM, {analysis.bars} bars, temp {analysis.temperature.toFixed(2)}, key {analysis.key}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {clips.map((c, i) => (
              <div key={c.id} className="p-3 border rounded bg-white shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Idea {i + 1}</div>
                  <div className="text-xs text-black/60">
                    {c.totalBeats.toFixed(1)} beats
                  </div>
                </div>
                <div className="text-xs text-black/70 mb-2">
                  {c.notes.slice(0, 10).map(n => n.pitch).join(", ")}{c.notes.length > 10 ? "…" : ""}
                </div>
                <button
                  onClick={() => addClipToTrack(c)}
                  className="px-3 py-1 rounded bg-black text-white text-sm"
                >
                  Add to Track
                </button>
              </div>
            ))}

            {!clips.length && (
              <div className="text-center text-black/50 py-6 text-sm">
                Your ideas will appear here after you generate.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

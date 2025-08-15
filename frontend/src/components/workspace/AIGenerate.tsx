import React, { useEffect, useRef, useState } from "react";
import { analyzePromptToJSON } from "../../services/hfService";
import { generateMelodies, GeneratedClip } from "../../utils/magenta";
import { publish } from "./midi-editor/core/editorBus";
import { playPreview, stopAllPreviews } from "../../utils/previewPlayer";

export default function AIGenerate() {
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [analysis, setAnalysis] = useState<null | {
    genre: string; mood: string; bpm: number; bars: number; temperature: number; key: string;
  }>(null);
  const [clips, setClips] = useState<GeneratedClip[]>([]);
  // track playing clipIds -> boolean
  const [playing, setPlaying] = useState<Record<string, boolean>>({});
  // keep handles so we can stop on toggle
  const handlesRef = useRef<Record<string, ReturnType<typeof playPreview>>>({});

  useEffect(() => {
    // stop any running previews if the component unmounts
    return () => stopAllPreviews();
  }, []);

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
      setPlaying({}); // reset playing states
    } finally {
      setBusy(false);
    }
  };

  const addClipToTrack = (clip: GeneratedClip) => {
    const notesWithIds = clip.notes.map((n, i) => ({
      id: n.id ?? `gen-${clip.id}-${i}`,
      ...n,
    }));
    publish({ type: "APPLY_AI_TO_TRACK", notes: notesWithIds, bpm: analysis?.bpm });
  };

  const togglePreview = (clip: GeneratedClip) => {
    const id = clip.id;
    const currentlyOn = !!playing[id];

    // stop
    if (currentlyOn) {
      handlesRef.current[id]?.stop();
      setPlaying((p) => ({ ...p, [id]: false }));
      return;
    }

    // (optional) stop others if you want only one at a time:
    // Object.keys(handlesRef.current).forEach(k => handlesRef.current[k]?.stop());
    // setPlaying({});

    // start
    const handle = playPreview(id, clip.notes.map(n => ({
      pitch: n.pitch, time: n.time, duration: n.duration, velocity: n.velocity
    })), analysis?.bpm || 120, () => {
      // when auto-ended
      setPlaying((p) => ({ ...p, [id]: false }));
    });

    handlesRef.current[id] = handle;
    setPlaying((p) => ({ ...p, [id]: true }));
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
          onClick={() => {/* could add suggestions later */}}
          disabled={busy}
          className="px-4 py-1.5 bg-[#ff6a2a] text-black font-semibold rounded shadow
                     hover:brightness-105 active:translate-y-[1px] disabled:opacity-60"
          style={{ border: "1px solid rgba(0,0,0,.12)" }}
        >
          Suggestions
        </button>
        <button
          onClick={run}
          disabled={busy}
          className="px-4 py-1.5 bg-[#ff6a2a] text-black font-semibold rounded shadow
                     hover:brightness-105 active:translate-y-[1px] disabled:opacity-60"
          style={{ border: "1px solid rgba(0,0,0,.12)" }}
        >
          {busy ? "Generating…" : "Generate"}
        </button>
      </div>

      {/* results card area */}
      <div
        className="rounded-[16px] border border-black/10 bg-white/95 overflow-x-hidden"
        style={{ minHeight: 220 }}
      >
        <div className="p-3 space-y-3">
          {analysis && (
            <div className="text-xs text-black/70 break-words">
              <strong>Analysis:</strong> {analysis.genre} / {analysis.mood} —{" "}
              {analysis.bpm} BPM, {analysis.bars} bars, temp{" "}
              {analysis.temperature.toFixed(2)}, key {analysis.key}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {clips.map((c, i) => {
              const isOn = !!playing[c.id];
              return (
                <div key={c.id} className="p-3 border rounded bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Idea {i + 1}</div>
                    <div className="text-xs text-black/60">
                      {c.totalBeats.toFixed(1)} beats
                    </div>
                  </div>

                  <div className="text-xs text-black/70 mb-3 break-words">
                    {c.notes.slice(0, 12).map(n => n.pitch).join(", ")}{c.notes.length > 12 ? "…" : ""}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePreview(c)}
                      className={`px-3 py-1 rounded text-white text-sm ${isOn ? "bg-red-600" : "bg-black"}`}
                      title={isOn ? "Stop preview" : "Play preview"}
                    >
                      {isOn ? "Stop" : "Play"}
                    </button>

                    <button
                      onClick={() => addClipToTrack(c)}
                      className="px-3 py-1 rounded bg-black text-white text-sm"
                    >
                      Add to Track
                    </button>
                  </div>
                </div>
              );
            })}

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

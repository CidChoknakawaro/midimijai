import React, { useState } from "react";

export default function AIModify() {
  const [prompt, setPrompt] = useState("");
  const [busy] = useState(false);

  return (
    <div className="space-y-3">
      {/* pill input */}
      <div className="rounded-full bg-white px-4 py-2 border border-black/10 shadow-inner">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Make this jazzier…"
          className="w-full outline-none text-[14px] placeholder-black/40"
        />
      </div>

      {/* buttons row (visual only) */}
      <div className="flex items-center gap-4">
        <button
          disabled={busy}
          className="px-2 py-1.5 bg-[#ff6a2a] text-black font-semibold rounded shadow
                     hover:brightness-105 active:translate-y-[1px] disabled:opacity-60"
          style={{ border: "1px solid rgba(0,0,0,.12)" }}
        >
          Suggestions
        </button>
        <button
          disabled={busy}
          className="px-2 py-1.5 bg-[#ff6a2a] text-black font-semibold rounded shadow
                     hover:brightness-105 active:translate-y-[1px] disabled:opacity-60"
          style={{ border: "1px solid rgba(0,0,0,.12)" }}
        >
          Modify
        </button>
      </div>

      {/* results card area */}
      <div
        className="rounded-[16px] border border-black/10 bg-white/95"
        style={{ minHeight: 220 }}
      >
        <div className="p-3 space-y-3">
          <div className="text-center text-black/50 py-6 text-sm">
            Your modified ideas will appear here (UI only for now).
          </div>
        </div>
      </div>
    </div>
  );
}

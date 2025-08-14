import React, { useState } from "react";
import AIGenerate from "./AIGenerate";
import AIModify from "./AIModify";
import AIStyleTransfer from "./AIStyleTransfer";

type Tab = "Generate" | "Modify" | "Style";

const ORANGE = "#ff5200";

export default function AIDock() {
  const [tab, setTab] = useState<Tab>("Generate");
  const [open, setOpen] = useState(true);

  return (
    <aside
      className="
        relative h-full
        transition-all duration-300
      "
      style={{ width: open ? 360 : 40 }}
    >
      {/* slide handle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          absolute -left-3 top-1/2 -translate-y-1/2
          w-7 h-10 rounded-full
          shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)]
          border border-black/10
          text-black
          flex items-center justify-center
          z-10
        "
        style={{ background: ORANGE }}
        title={open ? "Collapse" : "Expand"}
      >
        {open ? "›" : "‹"}
      </button>

      {/* dock body */}
      <div
        className="
          h-full rounded-[22px]
          shadow-[0_40px_60px_-26px_rgba(0,0,0,0.45)]
          border border-black/10
          flex flex-col
          overflow-hidden
        "
        style={{ background: ORANGE }}
      >
        {/* inner plate */}
        <div className="m-3 rounded-[18px] bg-white/92 border border-black/10 flex-1 flex flex-col overflow-hidden">
          {/* tabs */}
          <div className="px-3 pt-3 pb-2 flex items-center gap-2">
            {(["Generate", "Style", "Modify"] as Tab[]).map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={
                    "px-3 py-1 rounded-full text-sm border " +
                    (active
                      ? "bg-white text-black border-black/20 shadow"
                      : "bg-transparent text-black/80 hover:bg-white/70 border-black/10")
                  }
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* header */}
          <div className="px-4 pb-2 text-center text-[18px] font-semibold">
            AI Generate
          </div>

          {/* content area */}
          <div className="px-3 pb-3 flex-1 overflow-auto">
            {tab === "Generate" && <AIGenerate />}
            {tab === "Modify" && <AIModify />}
            {tab === "Style" && <AIStyleTransfer />}
          </div>
        </div>
      </div>
    </aside>
  );
}

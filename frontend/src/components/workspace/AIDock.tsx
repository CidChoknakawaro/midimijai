import React, { useState } from "react";
import AIGenerate from "./AIGenerate";
import AIModify from "./AIModify";
import AIStyleTransfer from "./AIStyleTransfer";

type Tab = "Generate" | "Style" | "Modify";

const ORANGE_START = "#ff6a2a";
const ORANGE_END   = "#ffa37a";
const BEIGE        = "#e9dcc9";

export default function AIDock() {
  const [tab, setTab] = useState<Tab>("Generate");
  const [open, setOpen] = useState(true);

  return (
    <aside
      className="
        relative h-full min-h-0
        overflow-hidden
        transition-all duration-300
      "
      style={{ width: open ? 360 : 40 }}
    >
      {/* slide handle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="
          absolute -left-4 top-1/2 -translate-y-1/2
          w-8 h-12 rounded-full text-black
          flex items-center justify-center z-10
          shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)]
          border border-black/10
        "
        style={{ background: ORANGE_START }}
        title={open ? "Collapse" : "Expand"}
      >
        {open ? "›" : "‹"}
      </button>

      {/* outer orange gradient frame */}
      <div
        className="
          h-full rounded-[28px] p-3
          shadow-[0_40px_60px_-26px_rgba(0,0,0,0.45)]
          border border-black/10
          flex flex-col overflow-hidden
        "
        style={{ background: `linear-gradient(180deg, ${ORANGE_START}, ${ORANGE_END})` }}
      >
        {/* inner beige plate */}
        <div
          className="
            flex-1 m-2 rounded-[18px] p-0 overflow-hidden
            border border-black/10
            flex flex-col
          "
          style={{ background: BEIGE }}
        >
          {/* top tabs — white with orange separators and active underline */}
          <div className="flex">
            {(["Generate", "Style", "Modify"] as Tab[]).map((t, i, arr) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`
                    flex-1 py-3 text-[15px] font-semibold
                    ${active ? "text-[#121633]" : "text-black/80"}
                    bg-white
                    relative
                  `}
                  style={{
                    borderRight:
                      i < arr.length - 1 ? "4px solid " + ORANGE_START : "none",
                    boxShadow: active ? "inset 0 -4px 0 " + ORANGE_START : "none",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* padded content surface (beige inset with subtle inner glow) */}
          <div
            className="flex-1 px-5 pb-5 pt-4 overflow-auto"
            style={{
              background:
                "radial-gradient(70% 90% at 50% 0%, rgba(255,255,255,0.55), rgba(255,255,255,0) 60%)",
            }}
          >
            <div
              className="
                rounded-[18px] p-4 border border-black/10
                bg-white/90 shadow-[0_24px_40px_-20px_rgba(0,0,0,0.30)]
              "
            >
              <div className="text-center text-[22px] font-bold text-[#121633] mb-3">
                AI {tab}
              </div>

              <div className="px-3 pb-3 flex-1 overflow-auto overflow-x-hidden text-sm">
                {tab === "Generate" && <AIGenerate />}
                {tab === "Modify" && <AIModify />}
                {tab === "Style" && <AIStyleTransfer />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

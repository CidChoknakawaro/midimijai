import React, { useState } from "react";

const steps = [
  { title: "Step 1: Type a prompt",        description: "Describe mood or style; AI drafts your MIDI idea." },
  { title: "Step 2: Refine in the editor",  description: "Edit notes, timing, and dynamics with precise tools." },
  { title: "Step 3: Assign custom sounds",  description: "Swap instruments or upload your own samples." },
  { title: "Step 4: Export",                description: "Download as .mid and use in any DAW." },
];

const BEIGE = "#dcc7af";

const StepGuide: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* LEFT: Taller video box aligned with step list height */}
        <div
          className="rounded-[40px] p-3 shadow-[0_50px_80px_-20px_rgba(0,0,0,0.30)] flex-1"
          style={{ background: BEIGE, alignSelf: "stretch" }}
        >
          <div className="relative rounded-[28px] bg-white border border-black/10 overflow-hidden h-full">
            <div className="absolute inset-0 flex items-center justify-center text-black/50">
              [Demo clip area]
            </div>
          </div>
        </div>

        {/* RIGHT: Title above steps */}
        <div className="flex flex-col h-full">
          <h2 className="mb-8 leading-[1.05]">
            <span className="block text-[42px] sm:text-[56px] font-semibold text-black">
              Step <span className="font-normal">by step</span>
            </span>
            <span className="block -mt-2 text-[56px] sm:text-[72px] font-extrabold text-[#ff5200]">
              Guide
            </span>
          </h2>

          <div className="space-y-5 flex-1">
            {steps.map((s, i) => {
              const open = i === openIndex;
              return (
                <div
                  key={s.title}
                  className="rounded-2xl bg-white shadow-[0_26px_40px_-16px_rgba(0,0,0,0.20)] border border-black/10 overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between text-left px-6 py-5"
                    onClick={() => setOpenIndex(open ? -1 : i)}
                  >
                    <span className="text-[20px] font-semibold text-black">{s.title}</span>
                    <span className="text-xl text-black/80 select-none">{open ? "▲" : "▼"}</span>
                  </button>
                  {open && (
                    <div className="px-6 pb-6 -mt-1 text-[15px] text-black/70">
                      {s.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default StepGuide;

import React, { useState } from "react";

const features = [
  {
    title: "AI-powered MIDI generation",
    description:
      "Generate unique melodies, chord progressions, and rhythms instantly with AI. Just type a prompt or select a style, and let MIDIMIJAI do the rest.",
  },
  {
    title: "Deep MIDI editing",
    description:
      "Manually fine-tune every MIDI note with powerful editing tools. Change timing, note length, velocity, or add advanced musical techniques.",
  },
  {
    title: "Import and edit multiple MIDI files",
    description:
      "Load multiple MIDI files into the workspace, edit them side by side, and create a seamless composition.",
  },
  {
    title: "Assign custom sound libraries",
    description:
      "Use your own samples and virtual instruments . Assign custom sounds to tracks for more control over your MIDI compositions.",
  },
];

const FeatureList: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      {/* Title */}
<h2 className="mb-10 leading-none">
  {/* Line 1: "What  can" */}
  <div className="flex items-end gap-4">
    <span className="font-extrabold text-[56px] sm:text-[72px] text-black">What</span>
    <span className="text-[40px] sm:text-[52px] text-black/80">can</span>
  </div>

  {/* Line 2: "MIDIMIJAI  do?" with tilted question mark */}
  <div className="flex items-center gap-3 mt-1">
    <span className="font-extrabold text-[#ff5200] text-[64px] sm:text-[84px] tracking-tight">
      MIDIMIJAI
    </span>
    <span className="font-extrabold text-black text-[56px] sm:text-[72px]">do</span>
    <span className="-rotate-12 inline-block font-extrabold text-black text-[68px] sm:text-[84px] leading-none">
      ?
    </span>
  </div>
</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: accordion */}
        <div className="space-y-4">
          {features.map((f, i) => {
            const open = i === openIndex;
            return (
              <div
                key={f.title}
                className="bg-white border border-black/10 rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between text-left px-5 py-4"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                >
                  <span className="font-semibold text-[17px]">{f.title}</span>
                  <span className="text-xl select-none">{open ? "▲" : "▼"}</span>
                </button>
                {open && (
                  <div className="px-5 pb-5 -mt-1 text-[15px] text-black/70">
                    {f.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: big rounded beige “border” with an inner white video well */}
        <div className="relative">
          {/* Beige border card (acts like the Figma blob) */}
          <div className="
              relative
              w-full
              rounded-[48px]
              bg-[#decab2]
              shadow-[0_30px_60px_rgba(0,0,0,0.18)]
              px-6 sm:px-8
              pt-6 sm:pt-8
              pb-4
            ">
            {/* Inner white well with 16:9 aspect, rounded to reveal the beige border */}
            <div className="relative w-full rounded-[36px] bg-white border border-black/10 overflow-hidden">
              {/* 16:9 aspect box */}
              <div className="pt-[56.25%]" />
              {/* Place video/iframe absolutely on top of the aspect box */}
              <div className="absolute inset-0 flex items-center justify-center text-sm text-black/50">
                {/* TODO: replace this with your <video> or <iframe> */}
                [Demo clip area]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureList;

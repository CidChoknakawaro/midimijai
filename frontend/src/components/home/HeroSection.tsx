import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  // tones shared by band/plate/curve (prevents seams)
  const BEIGE = "#dcc7af";
  const PLATE = "#e8dccb";

  return (
    <section className="relative w-full overflow-visible">
      {/* Full‑bleed beige band */}
      <div className="relative w-full" style={{ background: BEIGE }}>
        {/* Top‑right controls */}
        <div className="absolute right-6 top-6 flex flex-col items-end gap-3 z-10">
          {/* Black text on orange per your request */}
          <button
            onClick={() => navigate("/auth")}
            className="px-5 py-2.5 text-sm sm:text-base font-medium bg-[#F44E1A] border border-black hover:brightness-110 active:translate-y-px transition"
          >
            Log in
          </button>
        </div>

        {/* Centered content */}
        <div className="flex flex-col items-center justify-center text-center px-6 sm:px-8 pt-10 sm:pt-12 pb-16">
          {/* Logo */}
          <img
            src="/MIDIMIJAI-LOGO.png"
            alt="MIDIMIJAI"
            className="h-[260px] sm:h-[320px] lg:h-[360px] select-none mb-6 mx-auto"
            draggable={false}
          />

          {/* Tagline plate with visible white glow */}
          <div
            className="rounded-xl px-10 sm:px-12 py-4 mx-auto plate-glow"
            style={{ background: PLATE }}
          >
            <p className="text-[18px] sm:text-[20px] leading-relaxed text-[#3a2a20] font-medium text-glow-white">
              Create, edit, and transform MIDI like never before with AI. Deeply customizable
              <br />
              and easy to use for producers, musicians, and beginners.
            </p>
          </div>

          {/* CTA — black text */}
          <button
            onClick={() => navigate("/auth")}
            className="
              mt-8
              inline-flex items-center justify-center
              h-14 px-14
              bg-[#F44E1A] text-black text-[20px]
              hover:brightness-110 active:translate-y-px transition
            "
          >
            Start now
          </button>
        </div>

        {/* Deep curved bottom uses same BEIGE */}
        <div className="relative w-full h-[110px]" style={{ background: BEIGE }}>
          <svg
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <rect x="0" y="0" width="100" height="20" fill={BEIGE} />
            <path d="M0,0 C25,28 75,28 100,0 L100,20 L0,20 Z" fill={BEIGE} />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
      {/* Logo tiny (top-left corner like figma) */}
      <img
        src="/MIDIMIJAI-LOGO.png"
        alt="MIDIMIJAI"
        className="h-5 w-auto"
      />

      <div className="flex items-center gap-2 sm:gap-3">
        <button className="text-xs sm:text-[12px] border border-[#1b1b1b] rounded-md px-3 py-1 bg-white/60">
          EN / TH
        </button>
        <button
          onClick={() => navigate("/auth")}
          className="text-xs sm:text-[12px] border border-[#1b1b1b] rounded-md px-3 py-1 bg-white/60"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

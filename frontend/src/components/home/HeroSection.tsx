import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); // ✅ grab token from useAuth

  const handleStartNow = () => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center text-center py-20 bg-gray-100 px-4">
      <h1 className="text-6xl font-extrabold">MIDIMIJAI</h1>
      <p className="text-lg text-gray-600 max-w-xl mt-3">
        Create, edit, and transform MIDI like never before with AI. Deeply customizable and easy to use for producers, musicians, and beginners.
      </p>
      <button
        onClick={handleStartNow}
        className="mt-6 px-8 py-3 bg-[#17B9C6] text-white rounded text-lg font-bold"
      >
        Start Now
      </button>
    </section>
  );
};

export default HeroSection;

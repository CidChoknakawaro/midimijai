import React from "react";

interface SubmitButtonProps {
  text: string;
  onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        w-full mt-4 h-11 rounded-md
        bg-[#ff5200] text-black font-semibold
        border border-black/20
        shadow-[0_16px_30px_-10px_rgba(255,82,0,0.45)]
        hover:brightness-110 active:translate-y-[1px] transition
      "
    >
      {text}
    </button>
  );
};

export default SubmitButton;

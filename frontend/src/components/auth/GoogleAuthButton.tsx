import React from "react";

const GoogleAuthButton: React.FC = () => {
  return (
    <button
      className="
        w-full h-11 mt-3 rounded-md
        bg-white text-black font-medium
        border border.black/20
        hover:bg-black/5 transition
      "
      type="button"
    >
      Continue with Google
    </button>
  );
};

export default GoogleAuthButton;

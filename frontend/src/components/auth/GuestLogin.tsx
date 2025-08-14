import React from "react";

const GuestLogin: React.FC = () => {
  return (
    <button
      className="
        w-full h-11 mt-3 rounded-md
        bg-black/20 text-black font-medium
        hover:bg-black/25 transition
      "
      type="button"
    >
      Continue as Guest
    </button>
  );
};

export default GuestLogin;

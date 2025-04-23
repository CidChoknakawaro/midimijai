import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/auth");
  };

  return (
    <nav className="w-full p-4 bg-gray-900 text-white flex justify-between items-center px-8">
      <button className="border px-3 py-1 rounded">EN | TH</button>
      <button onClick={handleLoginClick} className="p-2 border border-white rounded">
        Login
      </button>
    </nav>
  );
};

export default Navbar;

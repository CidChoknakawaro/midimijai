import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full p-4 bg-gray-900 text-white flex justify-between items-center px-8">
      {/* Left Side: Language Switch */}
      <button className="border px-3 py-1 rounded">EN | TH</button>

      {/* Right Side: Login Button */}
      <button className="p-2 border border-white rounded">Login</button>
    </nav>
  );
};

export default Navbar;
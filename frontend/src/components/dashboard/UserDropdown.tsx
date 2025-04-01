import React, { useState } from "react";

const UserDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="border rounded-full px-3 py-2 bg-cyan-300"
      >
        Username ▼
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
          <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">
            Switch Account
          </button>
          <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
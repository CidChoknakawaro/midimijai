import React, { useState, useRef, useEffect } from "react";

const UserDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="min-w-[190px] px-5 py-3 rounded-md text-white flex items-center justify-between"
        style={{ background: "#000" }}
      >
        <span>Username</span>
        <span className="ml-3">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg overflow-hidden">
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Switch account
          </button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

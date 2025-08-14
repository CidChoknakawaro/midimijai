import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <div
    className="w-full"
    style={{ background: "#ff4e1a" }}
  >
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search"
      className="w-full bg-transparent placeholder-black/90 text-black
                 px-5 py-3 text-[18px] focus:outline-none"
    />
  </div>
);

export default SearchBar;

import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Search projects…"
    value={value}
    onChange={e => onChange(e.target.value)}
    className="
      w-full
      px-4 py-2
      rounded-full
      border border-gray-300
      bg-gray-100
      focus:outline-none focus:ring-2 focus:ring-teal-400
      text-sm
    "
  />
);

export default SearchBar;

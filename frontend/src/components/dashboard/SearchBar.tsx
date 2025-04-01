import React from "react";

const SearchBar: React.FC = () => {
  return (
    <input
      type="text"
      placeholder="Search"
      className="border rounded px-4 py-2 w-full"
    />
  );
};

export default SearchBar;
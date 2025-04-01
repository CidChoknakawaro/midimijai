import React from "react";

const SortDropdown: React.FC = () => {
  return (
    <select className="border rounded px-2 py-1">
      <option value="created">Created</option>
      <option value="name">Name</option>
      <option value="modified">Modified</option>
    </select>
  );
};

export default SortDropdown;
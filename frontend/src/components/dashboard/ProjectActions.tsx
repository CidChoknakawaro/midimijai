import React from "react";

const ProjectActions: React.FC = () => {
  return (
    <div className="flex space-x-2">
      <button title="Rename" className="rounded border px-2 py-1">R</button>
      <button title="Duplicate" className="rounded border px-2 py-1">d</button>
      <button title="Edit" className="rounded border px-2 py-1">E</button>
    </div>
  );
};

export default ProjectActions;
import React from "react";
import { useProjects } from "../../hooks/useProjects";

const NewProjectButton: React.FC = () => {
  const { addProject } = useProjects();

  const handleClick = async () => {
    const name = "Untitled Project";
    const data = JSON.stringify({ notes: [], bpm: 120 });
    await addProject(name, data);
    window.location.reload(); 
  };

  return (
    <button
      onClick={handleClick}
      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
    >
      + New Project
    </button>
  );
};

export default NewProjectButton;

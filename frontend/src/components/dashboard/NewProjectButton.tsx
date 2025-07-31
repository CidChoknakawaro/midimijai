import React from "react";
import { Plus } from "lucide-react";
import { useProjects } from "../../hooks/useProjects";

const NewProjectButton: React.FC = () => {
  const { addProject } = useProjects();

  const handleClick = async () => {
    const name = "Untitled Project";
    const data = { notes: [], bpm: 120 };
    await addProject(name, data);
    window.location.reload();
  };

  return (
    <button
      onClick={handleClick}
      className="
        flex items-center space-x-2
        px-6 py-3
        bg-teal-400 hover:bg-teal-500
        text-black font-semibold
        rounded-full shadow
        text-sm
      "
    >
      <div className="bg-white rounded-full p-1">
        <Plus className="w-4 h-4" />
      </div>
      <span>Create new project</span>
    </button>
  );
};

export default NewProjectButton;

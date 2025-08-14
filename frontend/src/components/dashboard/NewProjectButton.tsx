import React from "react";
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
        inline-flex items-center justify-center
        h-14 px-10
        text-black text-lg
        hover:brightness-110 active:translate-y-px transition
      "
      style={{ background: "#ff4e1a" }}
    >
      <span className="text-2xl mr-3">＋</span>
      Create new project
    </button>
  );
};

export default NewProjectButton;

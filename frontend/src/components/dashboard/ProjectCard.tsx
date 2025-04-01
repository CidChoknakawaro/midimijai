import React from "react";
import ProjectActions from "./ProjectActions";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  duration: string;
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="border rounded p-3 flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <div className="rounded-full border px-2 py-1">D</div>
        <div>
          <p className="font-medium">{project.name}</p>
          <p className="text-xs">{project.duration}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p>{project.createdAt}</p>
        <p>{project.duration}</p>
        <ProjectActions />
      </div>
    </div>
  );
};

export default ProjectCard;
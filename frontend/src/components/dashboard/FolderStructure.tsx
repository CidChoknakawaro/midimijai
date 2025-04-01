import React, { useState } from "react";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  duration: string;
  folderId?: string | null;
}

interface Folder {
  id: string;
  name: string;
}

interface FolderStructureProps {
  projects: Project[];
  folders: Folder[];
}

const FolderStructure: React.FC<FolderStructureProps> = ({ projects, folders }) => {
  const [openFolders, setOpenFolders] = useState<string[]>([]);

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev =>
      prev.includes(folderId) ? prev.filter(id => id !== folderId) : [...prev, folderId]
    );
  };

  const renderProjectList = (filteredProjects: Project[]) =>
    filteredProjects.map(project => (
      <ProjectCard key={project.id} project={project} />
    ));

  const uncategorizedProjects = projects.filter(p => !p.folderId);

  return (
    <div className="space-y-4">
      {/* Unfoldered projects */}
      {uncategorizedProjects.length > 0 && (
        <div className="space-y-2">{renderProjectList(uncategorizedProjects)}</div>
      )}

      {/* Foldered projects */}
      {folders.map(folder => {
        const folderProjects = projects.filter(p => p.folderId === folder.id);
        const isOpen = openFolders.includes(folder.id);

        return (
          <div key={folder.id} className="border rounded p-2">
            <button
              className="font-semibold mb-2"
              onClick={() => toggleFolder(folder.id)}
            >
              {folder.name} {isOpen ? "▲" : "▼"}
            </button>

            {isOpen && (
              <div className="ml-4 space-y-2">
                {folderProjects.length > 0
                  ? renderProjectList(folderProjects)
                  : <p className="text-sm text-gray-500">No projects in this folder</p>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FolderStructure;
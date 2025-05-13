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
  // mark these optional at the type level, too
  projects?: Project[];
  folders?: Folder[];
}

const FolderStructure: React.FC<FolderStructureProps> = ({
  projects = [],   // ← default to empty array
  folders = []     // ← default to empty array
}) => {
  const [openFolders, setOpenFolders] = useState<string[]>([]);

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const renderProjectList = (list: Project[]) =>
    list.map(project => (
      <ProjectCard key={project.id} project={project} />
    ));

  const uncategorized = projects.filter(p => !p.folderId);

  return (
    <div className="space-y-4">
      {uncategorized.length > 0 && (
        <div className="space-y-2">{renderProjectList(uncategorized)}</div>
      )}

      {folders.map(folder => {
        const inThis = projects.filter(p => p.folderId === folder.id);
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
                {inThis.length > 0
                  ? renderProjectList(inThis)
                  : <p className="text-sm text-gray-500">No projects</p>
                }
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FolderStructure;

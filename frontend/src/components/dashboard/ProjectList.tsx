import React from "react";
import FolderStructure from "./FolderStructure";

const mockProjects = [
  { id: "1", name: "Untitled", createdAt: "21/03/2025", duration: "00:00", folderId: null },
  { id: "2", name: "Untitled", createdAt: "21/03/2025", duration: "00:00", folderId: "f1" },
];

const mockFolders = [
  { id: "f1", name: "Folder A" },
  { id: "f2", name: "Folder B" },
];

const ProjectList: React.FC = () => {
  return <FolderStructure projects={mockProjects} folders={mockFolders} />;
};

export default ProjectList;
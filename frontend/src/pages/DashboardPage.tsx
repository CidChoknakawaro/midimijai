import React from "react";
import FolderStructure from "../components/dashboard/FolderStructure";
import NewProjectButton from "../components/dashboard/NewProjectButton";
import NewFolderButton from "../components/dashboard/NewFolderButton";
import SearchBar from "../components/dashboard/SearchBar";
import SortDropdown from "../components/dashboard/SortDropdown";
import UserDropdown from "../components/dashboard/UserDropdown";

const DashboardPage: React.FC = () => {
  const mockProjects = [
    { id: "p1", name: "Untitled", createdAt: "21/03/2025", duration: "00:00", folderId: null },
    { id: "p2", name: "Untitled", createdAt: "21/03/2025", duration: "00:00", folderId: "f1" },
    { id: "p3", name: "Untitled", createdAt: "21/03/2025", duration: "00:00", folderId: "f1" },
    { id: "p4", name: "Untitled", createdAt: "21/03/2025", duration: "00:00", folderId: "f2" },
  ];

  const mockFolders = [
    { id: "f1", name: "Folder A" },
    { id: "f2", name: "Folder B" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <SearchBar />
          <SortDropdown />
        </div>
        <UserDropdown />
      </div>

      <FolderStructure projects={mockProjects} folders={mockFolders} />

      <div className="flex justify-center gap-6 mt-8">
        <NewProjectButton />
        <NewFolderButton />
      </div>
    </div>
  );
};

export default DashboardPage;
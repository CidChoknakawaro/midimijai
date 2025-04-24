import React from "react";
import FolderStructure from "../components/dashboard/FolderStructure";
import NewProjectButton from "../components/dashboard/NewProjectButton";
import NewFolderButton from "../components/dashboard/NewFolderButton";
import SearchBar from "../components/dashboard/SearchBar";
import SortDropdown from "../components/dashboard/SortDropdown";
import UserDropdown from "../components/dashboard/UserDropdown";
import { useProjects } from "../hooks/useProjects";

const DashboardPage: React.FC = () => {
  const { projects, loading, error } = useProjects();

  // Folders will be manually handled later — for now we assume flat layout
  const folders = []; // Placeholder if you're not using folder grouping yet

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <SearchBar />
          <SortDropdown />
        </div>
        <UserDropdown />
      </div>

      {/* Show loading/error states */}
      {loading && <p className="text-gray-600">Loading projects...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Inject live projects */}
      <FolderStructure projects={projects} folders={folders} />

      <div className="flex justify-center gap-6 mt-8">
        <NewProjectButton />
        <NewFolderButton />
      </div>
    </div>
  );
};

export default DashboardPage;
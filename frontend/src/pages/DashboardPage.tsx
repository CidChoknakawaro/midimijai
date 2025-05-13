import React, { useState, useMemo } from "react";
import SortTabs, { SortKey } from "../components/dashboard/SortTabs";
import SearchBar from "../components/dashboard/SearchBar";
import UserDropdown from "../components/dashboard/UserDropdown";
import FolderStructure from "../components/dashboard/FolderStructure";
import NewProjectButton from "../components/dashboard/NewProjectButton";
import NewFolderButton from "../components/dashboard/NewFolderButton";
import { useProjects } from "../hooks/useProjects";

const DashboardPage: React.FC = () => {
  const { projects = [], folders = [], loading, error } = useProjects();

  const [sortOption, setSortOption] = useState<SortKey>("custom");
  const [searchTerm, setSearchTerm] = useState("");

  const sortedProjects = useMemo(() => {
    const copy = projects.slice();

    // filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      copy = copy.filter((p) => p.name.toLowerCase().includes(q));
    }

    // sort
    switch (sortOption) {
      case "created":
        return copy.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "custom":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case "modified":
        return copy.sort(
          (a, b) =>
            new Date(b.modified_at!).getTime() - new Date(a.modified_at!).getTime()
        );
      default:
        return copy;
    }
  }, [projects, sortOption, searchTerm]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <div className="flex items-center space-x-6">
          <SortTabs selected={sortOption} onSelect={setSortOption} />
          <button className="p-2 rounded-full hover:bg-gray-100">
            {/* Hamburger icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-8">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>


        <UserDropdown />
      </div>

      {/* Main Panel */}
      <div className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="p-6 bg-white rounded-2xl shadow-lg">
          {loading && <p className="text-gray-500 text-center">Loading projects…</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <FolderStructure projects={sortedProjects} folders={folders} />
        </div>
      </div>

      {/* Bottom CTAs */}
      <div className="flex justify-center items-center px-8 py-6 bg-white shadow">
        <NewProjectButton />
        <NewFolderButton />
      </div>
    </div>
  );
};

export default DashboardPage;

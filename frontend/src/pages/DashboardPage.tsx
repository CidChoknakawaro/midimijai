import React, { useMemo, useState } from "react";
import SortTabs, { SortKey } from "../components/dashboard/SortTabs";
import SearchBar from "../components/dashboard/SearchBar";
import UserDropdown from "../components/dashboard/UserDropdown";
import ProjectList from "../components/dashboard/ProjectList";
import NewProjectButton from "../components/dashboard/NewProjectButton";
import { useProjects } from "../hooks/useProjects";

const PAGE_BG = "#fbf5ee";       // off‑white
const BEIGE   = "#e9dcc9";       // panel fill

const DashboardPage: React.FC = () => {
  const { projects = [], loading, error } = useProjects();

  const [sortOption, setSortOption] = useState<SortKey>("created");
  const [searchTerm, setSearchTerm] = useState("");

  const sortedProjects = useMemo(() => {
    let copy = projects.slice();

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      copy = copy.filter((p: any) => p.name?.toLowerCase().includes(q));
    }

    switch (sortOption) {
      case "created":
        return copy.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "name":
        return copy.sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));
      case "modified":
        return copy.sort(
          (a: any, b: any) =>
            new Date(b.updated_at || b.modified_at || b.created_at).getTime() -
            new Date(a.updated_at || a.modified_at || a.created_at).getTime()
        );
      default:
        return copy;
    }
  }, [projects, sortOption, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
      {/* Top bar */}
      <div className="w-full flex items-center gap-4 px-5 sm:px-6 pt-4">
        <SortTabs selected={sortOption} onSelect={setSortOption} />
        <div className="flex-1">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        <UserDropdown />
      </div>

      {/* Main panel */}
      <div className="px-5 sm:px-6 py-5">
        <div
          className="mx-auto w-full max-w-[1000px] rounded-[28px]"
          style={{ background: BEIGE }}
        >
          {loading && <p className="text-center text-black/60">Loading projects…</p>}
          {error && <p className="text-center text-red-500">{String(error)}</p>}
          {!loading && !error && (
            <ProjectList projects={sortedProjects} />
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pb-8 flex items-center justify-center">
        <NewProjectButton />
      </div>
    </div>
  );
};

export default DashboardPage;

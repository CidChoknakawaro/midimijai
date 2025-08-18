import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import SortTabs from "../components/dashboard/SortTabs";
import SearchBar from "../components/dashboard/SearchBar";
import UserDropdown from "../components/dashboard/UserDropdown";
import ProjectList from "../components/dashboard/ProjectList";
import NewProjectButton from "../components/dashboard/NewProjectButton";
import { useProjects } from "../hooks/useProjects";
const PAGE_BG = "#fbf5ee";
const BEIGE = "#e9dcc9";
const DashboardPage = () => {
    const { projects = [], loading, error } = useProjects();
    const [sortOption, setSortOption] = useState("created");
    const [searchTerm, setSearchTerm] = useState("");
    const sortedProjects = useMemo(() => {
        let copy = projects.slice();
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            copy = copy.filter((p) => p.name?.toLowerCase().includes(q));
        }
        switch (sortOption) {
            case "created":
                return copy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            case "name":
                return copy.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
            case "modified":
                return copy.sort((a, b) => new Date(b.updated_at || b.modified_at || b.created_at).getTime() -
                    new Date(a.updated_at || a.modified_at || a.created_at).getTime());
            default:
                return copy;
        }
    }, [projects, sortOption, searchTerm]);
    return (_jsxs("div", { className: "min-h-screen flex flex-col", style: { background: PAGE_BG }, children: [_jsxs("div", { className: "w-full flex items-center gap-4 px-5 sm:px-6 pt-4", children: [_jsx(SortTabs, { selected: sortOption, onSelect: setSortOption }), _jsx("div", { className: "flex-1", children: _jsx(SearchBar, { value: searchTerm, onChange: setSearchTerm }) }), _jsx(UserDropdown, {})] }), _jsx("div", { className: "px-5 sm:px-6 py-5", children: _jsxs("div", { className: "mx-auto w-full max-w-[1000px] rounded-[28px]", style: { background: BEIGE }, children: [loading && _jsx("p", { className: "text-center text-black/60", children: "Loading projects\u2026" }), error && _jsx("p", { className: "text-center text-red-500", children: String(error) }), !loading && !error && (_jsx(ProjectList, { projects: sortedProjects }))] }) }), _jsx("div", { className: "pb-8 flex items-center justify-center", children: _jsx(NewProjectButton, {}) })] }));
};
export default DashboardPage;

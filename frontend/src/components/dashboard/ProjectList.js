import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../shared/Modal";
import { useProjects } from "../../hooks/useProjects";
import { exportProject } from "../../utils/exportProject";
const normalizeDataForDuplicate = (data) => {
    try {
        return typeof data === "string" ? JSON.parse(data) : data ?? {};
    }
    catch {
        return {};
    }
};
const normalizeDataForExport = (data) => {
    try {
        return typeof data === "string" ? data : JSON.stringify(data ?? {});
    }
    catch {
        return JSON.stringify({});
    }
};
const Row = ({ project, onChanged, }) => {
    const navigate = useNavigate();
    const { removeProject, renameProject, addProject } = useProjects();
    const [showDelete, setShowDelete] = useState(false);
    const [showRename, setShowRename] = useState(false);
    const [newName, setNewName] = useState(project.name || "Untitled");
    const handleOpen = () => {
        localStorage.setItem("activeProjectId", String(project.id));
        navigate("/workspace");
    };
    const handleDelete = (e) => {
        e.stopPropagation();
        setShowDelete(true);
    };
    const confirmDelete = async (e) => {
        e.stopPropagation();
        await removeProject(project.id);
        setShowDelete(false);
        onChanged();
    };
    const handleRename = (e) => {
        e.stopPropagation();
        setShowRename(true);
    };
    const confirmRename = async (e) => {
        e.stopPropagation();
        const data = normalizeDataForDuplicate(project.data);
        await renameProject(project.id, newName, data);
        setShowRename(false);
        onChanged();
    };
    const handleDuplicate = async (e) => {
        e.stopPropagation();
        const data = normalizeDataForDuplicate(project.data);
        await addProject(`${project.name} (Copy)`, data);
        onChanged();
    };
    const handleExport = (e) => {
        e.stopPropagation();
        const json = normalizeDataForExport(project.data);
        exportProject(json, project.name || "project");
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { onClick: handleOpen, className: "\r\n          relative flex items-center justify-between\r\n          px-5 h-12 rounded-xl\r\n          bg-[#e9dcc9] shadow-[inset_0_2px_0_rgba(255,255,255,0.7),0_8px_16px_-8px_rgba(0,0,0,0.35)]\r\n          border border-black/10 cursor-pointer\r\n        ", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: handleDelete, className: "p-1.5 rounded-full hover:brightness-110", title: "Delete", children: _jsx("img", { src: "delete.png", alt: "Delete", className: "w-5 h-5" }) }), _jsx("span", { className: "truncate font-medium text-[14px]", children: project.name || "Untitled" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: handleRename, title: "Rename", children: _jsx("img", { src: "rename.png", alt: "Rename", className: "w-4 h-4" }) }), _jsx("button", { onClick: handleDuplicate, title: "Duplicate", children: _jsx("img", { src: "duplicate.png", alt: "Duplicate", className: "w-4 h-4" }) }), _jsx("button", { onClick: handleExport, title: "Export", children: _jsx("img", { src: "export.png", alt: "Export", className: "w-4 h-4" }) })] })] }), showDelete && (_jsxs(Modal, { onClose: () => setShowDelete(false), children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Delete Project?" }), _jsxs("p", { className: "mb-4", children: ["Are you sure you want to delete ", _jsx("strong", { children: project.name }), "?"] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: () => setShowDelete(false), children: "Cancel" }), _jsx("button", { onClick: confirmDelete, style: { color: "red" }, children: "Delete" })] })] })), showRename && (_jsxs(Modal, { onClose: () => setShowRename(false), children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Rename Project" }), _jsx("input", { type: "text", value: newName, onChange: (e) => setNewName(e.target.value), className: "w-full mt-2 mb-4 p-2 border rounded" }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: () => setShowRename(false), children: "Cancel" }), _jsx("button", { onClick: confirmRename, children: "Rename" })] })] }))] }));
};
const ProjectList = ({ projects }) => {
    const forceRefresh = () => window.location.reload();
    return (_jsx("div", { className: "overflow-y-auto px-6 py-3 rounded-[28px]", style: {
            maxHeight: "calc(100vh - 280px)",
            scrollbarColor: "#121633 #e9dcc9",
            scrollbarWidth: "thin",
        }, children: _jsx("div", { className: "mx-auto w-[95%] max-w-[1200px]", children: _jsxs("div", { className: "space-y-3", children: [projects.length === 0 && (_jsx("div", { className: "text-center text-black/60 py-8", children: "No projects yet" })), projects.map((p) => (_jsx(Row, { project: p, onChanged: forceRefresh }, p.id)))] }) }) }));
};
export default ProjectList;

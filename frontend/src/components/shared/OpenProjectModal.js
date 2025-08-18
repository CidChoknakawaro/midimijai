import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { getAllProjects } from "../../services/projectService";
export default function OpenProjectModal({ isOpen, onSelect, onCancel, }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!isOpen)
            return;
        setLoading(true);
        getAllProjects()
            .then((list) => setProjects(list.map((p) => ({ id: p.id, name: p.name }))))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [isOpen]);
    if (!isOpen)
        return null;
    return (_jsxs(Modal, { title: "Open Project", onClose: onCancel, children: [loading ? (_jsx("p", { children: "Loading\u2026" })) : (_jsx("ul", { className: "max-h-60 overflow-auto space-y-2", children: projects.map((proj) => (_jsx("li", { children: _jsx("button", { onClick: () => onSelect(proj.id), className: "w-full text-left px-3 py-2 rounded hover:bg-gray-100", children: proj.name }) }, proj.id))) })), _jsx("div", { className: "flex justify-end mt-4", children: _jsx("button", { onClick: onCancel, className: "px-4 py-2", children: "Cancel" }) })] }));
}

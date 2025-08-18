import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useProjects } from "../../hooks/useProjects";
const NewProjectButton = () => {
    const { addProject } = useProjects();
    const handleClick = async () => {
        const name = "Untitled Project";
        const data = { notes: [], bpm: 120 };
        await addProject(name, data);
        window.location.reload();
    };
    return (_jsxs("button", { onClick: handleClick, className: "\r\n        inline-flex items-center justify-center\r\n        h-14 px-10\r\n        text-black text-lg\r\n        hover:brightness-110 active:translate-y-px transition\r\n      ", style: { background: "#ff4e1a" }, children: [_jsx("span", { className: "text-2xl mr-3", children: "\uFF0B" }), "Create new project"] }));
};
export default NewProjectButton;

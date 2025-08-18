import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Chip = ({ active, onClick, children }) => (_jsx("button", { onClick: onClick, className: `px-4 h-9 rounded-full text-sm tracking-wide transition
      ${active ? "bg-[#121633] text-white shadow" : "bg-[#121633] text-white/80 hover:text-white"}`, style: { boxShadow: active ? "0 8px 18px -8px rgba(0,0,0,.45)" : undefined }, children: children }));
const SortTabs = ({ selected, onSelect }) => {
    return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Chip, { active: selected === "created", onClick: () => onSelect("created"), children: "Created" }), _jsx(Chip, { active: selected === "name", onClick: () => onSelect("name"), children: "Name" }), _jsx(Chip, { active: selected === "modified", onClick: () => onSelect("modified"), children: "Modified" })] }));
};
export default SortTabs;

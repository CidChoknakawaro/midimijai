import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import AIGenerate from "./AIGenerate";
import AIModify from "./AIModify";
import AIStyleTransfer from "./AIStyleTransfer";
const TABS = ["Generate", "Modify", "Style"];
export default function AIToolsPanel() {
    const [tab, setTab] = useState("Generate");
    return (_jsxs("div", { className: "w-full", children: [_jsx("div", { className: "flex gap-2 mb-3", children: TABS.map((t) => (_jsx("button", { onClick: () => setTab(t), className: `px-3 py-1 rounded ${tab === t ? "bg-teal-500 text-white" : "bg-gray-100"}`, children: t }, t))) }), _jsxs("div", { className: "space-y-4", children: [tab === "Generate" && _jsx(AIGenerate, {}), tab === "Modify" && _jsx(AIModify, {}), tab === "Style" && _jsx(AIStyleTransfer, {})] })] }));
}

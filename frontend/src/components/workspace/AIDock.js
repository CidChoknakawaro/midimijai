import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import AIGenerate from "./AIGenerate";
import AIModify from "./AIModify";
import AIStyleTransfer from "./AIStyleTransfer";
const ORANGE_START = "#ff6a2a";
const ORANGE_END = "#ffa37a";
const BEIGE = "#e9dcc9";
export default function AIDock() {
    const [tab, setTab] = useState("Generate");
    const [open, setOpen] = useState(true);
    return (_jsxs("aside", { className: "\r\n        relative h-full min-h-0\r\n        overflow-hidden\r\n        transition-all duration-300\r\n      ", style: { width: open ? 360 : 40 }, children: [_jsx("button", { onClick: () => setOpen(v => !v), className: "\r\n          absolute -left-4 top-1/2 -translate-y-1/2\r\n          w-8 h-12 rounded-full text-black\r\n          flex items-center justify-center z-10\r\n          shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)]\r\n          border border-black/10\r\n        ", style: { background: ORANGE_START }, title: open ? "Collapse" : "Expand", children: open ? "›" : "‹" }), _jsx("div", { className: "\r\n          h-full rounded-[28px] p-3\r\n          shadow-[0_40px_60px_-26px_rgba(0,0,0,0.45)]\r\n          border border-black/10\r\n          flex flex-col overflow-hidden\r\n        ", style: { background: `linear-gradient(180deg, ${ORANGE_START}, ${ORANGE_END})` }, children: _jsxs("div", { className: "\r\n            flex-1 m-2 rounded-[18px] p-0 overflow-hidden\r\n            border border-black/10\r\n            flex flex-col\r\n          ", style: { background: BEIGE }, children: [_jsx("div", { className: "flex", children: ["Generate", "Style", "Modify"].map((t, i, arr) => {
                                const active = tab === t;
                                return (_jsx("button", { onClick: () => setTab(t), className: `
                    flex-1 py-3 text-[15px] font-semibold
                    ${active ? "text-[#121633]" : "text-black/80"}
                    bg-white
                    relative
                  `, style: {
                                        borderRight: i < arr.length - 1 ? "4px solid " + ORANGE_START : "none",
                                        boxShadow: active ? "inset 0 -4px 0 " + ORANGE_START : "none",
                                    }, children: t }, t));
                            }) }), _jsx("div", { className: "flex-1 px-5 pb-5 pt-4 overflow-auto", style: {
                                background: "radial-gradient(70% 90% at 50% 0%, rgba(255,255,255,0.55), rgba(255,255,255,0) 60%)",
                            }, children: _jsxs("div", { className: "\r\n                rounded-[18px] p-4 border border-black/10\r\n                bg-white/90 shadow-[0_24px_40px_-20px_rgba(0,0,0,0.30)]\r\n              ", children: [_jsxs("div", { className: "text-center text-[22px] font-bold text-[#121633] mb-3", children: ["AI ", tab] }), _jsxs("div", { className: "px-3 pb-3 flex-1 overflow-auto overflow-x-hidden text-sm", children: [tab === "Generate" && _jsx(AIGenerate, {}), tab === "Modify" && _jsx(AIModify, {}), tab === "Style" && _jsx(AIStyleTransfer, {})] })] }) })] }) })] }));
}

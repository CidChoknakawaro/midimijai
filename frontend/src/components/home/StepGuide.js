import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const steps = [
    { title: "Step 1: Type a prompt", description: "Describe mood or style; AI drafts your MIDI idea." },
    { title: "Step 2: Refine in the editor", description: "Edit notes, timing, and dynamics with precise tools." },
    { title: "Step 3: Assign custom sounds", description: "Swap instruments or upload your own samples." },
    { title: "Step 4: Export", description: "Download as .mid and use in any DAW." },
];
const BEIGE = "#dcc7af";
const StepGuide = () => {
    const [openIndex, setOpenIndex] = useState(0);
    return (_jsx("section", { className: "relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 items-start", children: [_jsx("div", { className: "rounded-[40px] p-3 shadow-[0_50px_80px_-20px_rgba(0,0,0,0.30)] flex-1", style: { background: BEIGE, alignSelf: "stretch" }, children: _jsx("div", { className: "relative rounded-[28px] bg-white border border-black/10 overflow-hidden h-full", children: _jsx("div", { className: "absolute inset-0 flex items-center justify-center text-black/50", children: "[Demo clip area]" }) }) }), _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("h2", { className: "mb-8 leading-[1.05]", children: [_jsxs("span", { className: "block text-[42px] sm:text-[56px] font-semibold text-black", children: ["Step ", _jsx("span", { className: "font-normal", children: "by step" })] }), _jsx("span", { className: "block -mt-2 text-[56px] sm:text-[72px] font-extrabold text-[#ff5200]", children: "Guide" })] }), _jsx("div", { className: "space-y-5 flex-1", children: steps.map((s, i) => {
                                const open = i === openIndex;
                                return (_jsxs("div", { className: "rounded-2xl bg-white shadow-[0_26px_40px_-16px_rgba(0,0,0,0.20)] border border-black/10 overflow-hidden", children: [_jsxs("button", { className: "w-full flex items-center justify-between text-left px-6 py-5", onClick: () => setOpenIndex(open ? -1 : i), children: [_jsx("span", { className: "text-[20px] font-semibold text-black", children: s.title }), _jsx("span", { className: "text-xl text-black/80 select-none", children: open ? "▲" : "▼" })] }), open && (_jsx("div", { className: "px-6 pb-6 -mt-1 text-[15px] text-black/70", children: s.description }))] }, s.title));
                            }) })] })] }) }));
};
export default StepGuide;

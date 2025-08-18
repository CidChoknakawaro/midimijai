import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const features = [
    {
        title: "AI-powered MIDI generation",
        description: "Generate unique melodies, chord progressions, and rhythms instantly with AI. Just type a prompt or select a style, and let MIDIMIJAI do the rest.",
    },
    {
        title: "Deep MIDI editing",
        description: "Manually fine-tune every MIDI note with powerful editing tools. Change timing, note length, velocity, or add advanced musical techniques.",
    },
    {
        title: "Import and edit multiple MIDI files",
        description: "Load multiple MIDI files into the workspace, edit them side by side, and create a seamless composition.",
    },
    {
        title: "Assign custom sound libraries",
        description: "Use your own samples and virtual instruments . Assign custom sounds to tracks for more control over your MIDI compositions.",
    },
];
const FeatureList = () => {
    const [openIndex, setOpenIndex] = useState(0);
    return (_jsxs("section", { className: "px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14", children: [_jsxs("h2", { className: "mb-10 leading-none", children: [_jsxs("div", { className: "flex items-end gap-4", children: [_jsx("span", { className: "font-extrabold text-[56px] sm:text-[72px] text-black", children: "What" }), _jsx("span", { className: "text-[40px] sm:text-[52px] text-black/80", children: "can" })] }), _jsxs("div", { className: "flex items-center gap-3 mt-1", children: [_jsx("span", { className: "font-extrabold text-[#ff5200] text-[64px] sm:text-[84px] tracking-tight", children: "MIDIMIJAI" }), _jsx("span", { className: "font-extrabold text-black text-[56px] sm:text-[72px]", children: "do" }), _jsx("span", { className: "-rotate-12 inline-block font-extrabold text-black text-[68px] sm:text-[84px] leading-none", children: "?" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-start", children: [_jsx("div", { className: "space-y-4", children: features.map((f, i) => {
                            const open = i === openIndex;
                            return (_jsxs("div", { className: "bg-white border border-black/10 rounded-xl shadow-sm overflow-hidden", children: [_jsxs("button", { className: "w-full flex items-center justify-between text-left px-5 py-4", onClick: () => setOpenIndex(open ? -1 : i), children: [_jsx("span", { className: "font-semibold text-[17px]", children: f.title }), _jsx("span", { className: "text-xl select-none", children: open ? "▲" : "▼" })] }), open && (_jsx("div", { className: "px-5 pb-5 -mt-1 text-[15px] text-black/70", children: f.description }))] }, f.title));
                        }) }), _jsx("div", { className: "relative", children: _jsx("div", { className: "\r\n              relative\r\n              w-full\r\n              rounded-[48px]\r\n              bg-[#decab2]\r\n              shadow-[0_30px_60px_rgba(0,0,0,0.18)]\r\n              px-6 sm:px-8\r\n              pt-6 sm:pt-8\r\n              pb-4\r\n            ", children: _jsxs("div", { className: "relative w-full rounded-[36px] bg-white border border-black/10 overflow-hidden", children: [_jsx("div", { className: "pt-[56.25%]" }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center text-sm text-black/50", children: "[Demo clip area]" })] }) }) })] })] }));
};
export default FeatureList;

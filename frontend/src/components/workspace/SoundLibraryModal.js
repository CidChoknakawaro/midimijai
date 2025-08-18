import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// frontend/src/components/workspace/SoundLibraryModal.tsx
import { useRef } from "react";
import { publish } from "./midi-editor/core/editorBus";
const SoundLibraryModal = ({ isOpen, onClose }) => {
    const fileRef = useRef(null);
    if (!isOpen)
        return null;
    const triggerPick = () => fileRef.current?.click();
    const handlePick = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        // Hand off to editor via event bus
        publish({ type: "IMPORT_SAMPLE", file });
        // reset & close
        e.target.value = "";
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/20", children: _jsxs("div", { className: "w-[720px] max-w-[90vw] rounded-lg bg-white shadow-xl p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Sound Library" }), _jsx("button", { className: "rounded px-2 py-1 text-gray-600 hover:bg-gray-100", onClick: onClose, children: "\u00D7" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3 mb-6", children: [_jsx("button", { className: "h-14 rounded-md border hover:bg-gray-50", children: "Keyboard/Synth" }), _jsx("button", { className: "h-14 rounded-md border hover:bg-gray-50", children: "Drums" }), _jsx("button", { className: "h-14 rounded-md border hover:bg-gray-50", children: "Bass" }), _jsx("button", { className: "h-14 rounded-md border hover:bg-gray-50", children: "Strings" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-sm text-gray-500", children: "Import a custom audio sample to use as an instrument on the current track." }), _jsx("button", { onClick: triggerPick, className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50", children: "Import sound" }), _jsx("input", { ref: fileRef, type: "file", accept: "audio/*", className: "hidden", onChange: handlePick })] })] }) }));
};
export default SoundLibraryModal;

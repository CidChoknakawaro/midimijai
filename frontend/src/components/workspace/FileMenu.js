import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function FileMenu({ onSelect, onNew, onOpen, onSave, onSaveAs, onImportMidi, onExportMidi, onExportStems, onClose, canUseTrackActions, }) {
    // default to true if not provided
    const canUse = canUseTrackActions !== false;
    const items = [
        { label: "New Project", shortcut: "Ctrl+N", action: onNew },
        { label: "Open Project…", shortcut: "Ctrl+O", action: onOpen },
        { separator: true },
        { label: "Save", shortcut: "Ctrl+S", action: onSave },
        { label: "Save As…", shortcut: "Ctrl+Shift+S", action: onSaveAs },
        { separator: true },
        {
            label: "Import MIDI",
            disabled: !canUse,
            action: () => {
                if (!canUse)
                    return;
                const inp = document.createElement("input");
                inp.type = "file";
                inp.accept = ".mid";
                inp.onchange = () => {
                    if (inp.files?.[0])
                        onImportMidi(inp.files[0]);
                };
                inp.click();
            },
        },
        {
            label: "Export MIDI",
            disabled: !canUse,
            action: () => {
                if (!canUse)
                    return;
                onExportMidi();
            },
        },
        { label: "Export Stems", action: onExportStems },
        { separator: true },
        { label: "Close Project", action: onClose },
    ];
    return (_jsx("div", { className: "absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50", children: items.map((item, i) => "separator" in item ? (_jsx("div", { className: "border-t border-gray-200 my-1" }, `sep-${i}`)) : (_jsxs("button", { onClick: () => {
                if (item.disabled)
                    return;
                item.action();
                onSelect();
            }, disabled: item.disabled, className: "flex justify-between w-full px-4 py-2 text-sm focus:outline-none " +
                (item.disabled
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"), children: [_jsx("span", { children: item.label }), item.shortcut && (_jsx("span", { className: "text-xs text-gray-400", children: item.shortcut }))] }, item.label))) }));
}

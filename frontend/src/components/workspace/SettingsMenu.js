import { jsx as _jsx } from "react/jsx-runtime";
const SettingsMenu = ({ onSelect, onKeyScaleLock, onAudioEngine, onMidiInput, onShortcuts, onGridSettings, onLatency, }) => {
    const items = [
        { label: "Key / Scale Lock…", action: onKeyScaleLock },
        { label: "Audio Engine…", action: onAudioEngine },
        { label: "MIDI Input…", action: onMidiInput },
        { separator: true },
        { label: "Editor Shortcuts", action: onShortcuts },
        { label: "Grid / Snap", action: onGridSettings },
        { label: "Latency / Buffer", action: onLatency },
    ];
    return (_jsx("div", { className: "mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg", children: items.map((item, i) => "separator" in item ? (_jsx("div", { className: "border-t border-gray-200 my-1" }, i)) : (_jsx("button", { onClick: () => {
                item.action();
                onSelect();
            }, className: "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: item.label }, item.label))) }));
};
export default SettingsMenu;

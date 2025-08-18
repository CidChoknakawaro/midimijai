import { jsx as _jsx } from "react/jsx-runtime";
const MIDIToolsMenu = ({ onSelect, onTranspose, onVelocity, onNoteLength, onHumanize, onArpeggiate, onStrum, onLegato, }) => {
    const items = [
        { label: "Transpose", action: onTranspose },
        { label: "Velocity Control", action: onVelocity },
        { label: "Note Length Adjust", action: onNoteLength },
        { separator: true },
        { label: "Humanization", action: onHumanize },
        { label: "Arpeggiator", action: onArpeggiate },
        { label: "Strumming Effect", action: onStrum },
        { label: "Legato/Portamento", action: onLegato },
    ];
    return (_jsx("div", { className: "mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg", children: items.map((item, i) => "separator" in item ? (_jsx("div", { className: "border-t border-gray-200 my-1" }, i)) : (_jsx("button", { onClick: () => {
                item.action();
                onSelect();
            }, className: "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: item.label }, item.label))) }));
};
export default MIDIToolsMenu;

import React from "react";

interface MIDIToolsMenuProps {
  onSelect: () => void;
}

export default function MIDIToolsMenu({ onSelect }: MIDIToolsMenuProps) {
  const items = [
    { label: "Transpose", action: () => {/* TODO */} },
    { label: "Velocity Control",action: () => {/* TODO */} },
    { separator: true },
    { label: "Note Length Adjust", action: () => {/* TODO */} },
    { label: "Humanization", action: () => {/* TODO */} },
    { separator: true },
    { label: "Arpeggiator", action: () => {/* TODO */} },
    { label: "Strumming Effect", action: () => {/* TODO */} },
    { label: "Legato/Portamento", action: () => {/* TODO */} },
  ] as const;

  return (
    <div
      className="
        absolute left-0 top-full mt-1
        w-56 bg-white
        border border-gray-200
        rounded-md shadow-lg z-50
      "
    >
      {items.map((item, i) =>
        "separator" in item ? (
          <div key={i} className="border-t border-gray-200 my-1" />
        ) : (
          <button
            key={item.label}
            onClick={() => {
              item.action();
              onSelect();
            }}
            className="
              flex justify-between w-full
              px-4 py-2 text-sm text-gray-700
              hover:bg-gray-100 focus:outline-none
            "
          >
            <span>{item.label}</span>
            {item.shortcut && (
              <span className="text-xs text-gray-400">{item.shortcut}</span>
            )}
          </button>
        )
      )}
    </div>
  );
}

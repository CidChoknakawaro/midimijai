import React from "react";

interface FileMenuProps {
  onSelect: () => void;
}

export default function FileMenu({ onSelect }: FileMenuProps) {
  const items = [
    { label: "New Project", shortcut: "Ctrl+N", action: () => {/* TODO */} },
    { label: "Open Project…", shortcut: "Ctrl+O", action: () => {/* TODO */} },
    { separator: true },
    { label: "Save", shortcut: "Ctrl+S", action: () => {/* TODO */} },
    { label: "Save As…", shortcut: "Ctrl+Shift+S", action: () => {/* TODO */} },
    { separator: true },
    { label: "Import MIDI", action: () => {/* TODO */} },
    { label: "Export MIDI", action: () => {/* TODO */} },
    { label: "Export Stems", action: () => {/* TODO */} },
    { separator: true },
    { label: "Close Project", action: () => {/* TODO */} },
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

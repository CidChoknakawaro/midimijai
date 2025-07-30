import React from "react";

interface EditMenuProps {
  onSelect: () => void;
}

export default function EditMenu({ onSelect }: EditMenuProps) {
  const items = [
    { label: "Undo", shortcut: "Ctrl+Z", action: () => {/* TODO */} },
    { label: "Redo", shortcut: "Ctrl+Y", action: () => {/* TODO */} },
    { separator: true },
    { label: "Cut", shortcut: "Ctrl+X", action: () => {/* TODO */} },
    { label: "Copy", shortcut: "Ctrl+C", action: () => {/* TODO */} },
    { label: "Paste", shortcut: "Ctrl+V", action: () => {/* TODO */} },
    { label: "Delete", action: () => {/* TODO */} },
    { separator: true },
    { label: "Select All", shortcut: "Ctrl+A", action: () => {/* TODO */} },
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

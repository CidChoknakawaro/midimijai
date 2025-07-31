import React from "react";

interface FileMenuProps {
  onSelect: () => void;                // closes the dropdown
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onImportMidi: (file: File) => void;
  onExportMidi: () => void;
  onExportStems: () => void;
  onClose: () => void;
}

export default function FileMenu({
  onSelect,
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onImportMidi,
  onExportMidi,
  onExportStems,
  onClose,
}: FileMenuProps) {
  const items = [
    { label: "New Project",    shortcut: "Ctrl+N",       action: onNew },
    { label: "Open Project…",  shortcut: "Ctrl+O",       action: onOpen },
    { separator: true },
    { label: "Save",           shortcut: "Ctrl+S",       action: onSave },
    { label: "Save As…",       shortcut: "Ctrl+Shift+S", action: onSaveAs },
    { separator: true },
    {
      label: "Import MIDI",
      action: () => {
        const inp = document.createElement("input");
        inp.type = "file";
        inp.accept = ".mid";
        inp.onchange = () => {
          if (inp.files?.[0]) onImportMidi(inp.files[0]);
        };
        inp.click();
      },
    },
    { label: "Export MIDI",    action: onExportMidi },
    { label: "Export Stems",   action: onExportStems },
    { separator: true },
    { label: "Close Project",  action: onClose },
  ] as const;

  return (
    <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
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
            className="flex justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <span>{item.label}</span>
            {"shortcut" in item && item.shortcut && (
              <span className="text-xs text-gray-400">{item.shortcut}</span>
            )}
          </button>
        )
      )}
    </div>
  );
}

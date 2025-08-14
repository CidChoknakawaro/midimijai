// src/components/workspace/FileMenu.tsx
import React from "react";

type MenuItem =
  | { separator: true }
  | {
      label: string;
      action: () => void;
      shortcut?: string;
      disabled?: boolean;
    };

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

  /** If false, Import/Export MIDI are disabled (e.g., not in Track Editor). */
  canUseTrackActions?: boolean;
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
  canUseTrackActions,
}: FileMenuProps) {
  // default to true if not provided
  const canUse = canUseTrackActions !== false;

  const items: MenuItem[] = [
    { label: "New Project",    shortcut: "Ctrl+N",       action: onNew },
    { label: "Open Project…",  shortcut: "Ctrl+O",       action: onOpen },
    { separator: true },
    { label: "Save",           shortcut: "Ctrl+S",       action: onSave },
    { label: "Save As…",       shortcut: "Ctrl+Shift+S", action: onSaveAs },
    { separator: true },
    {
      label: "Import MIDI",
      disabled: !canUse,
      action: () => {
        if (!canUse) return;
        const inp = document.createElement("input");
        inp.type = "file";
        inp.accept = ".mid";
        inp.onchange = () => {
          if (inp.files?.[0]) onImportMidi(inp.files[0]);
        };
        inp.click();
      },
    },
    {
      label: "Export MIDI",
      disabled: !canUse,
      action: () => {
        if (!canUse) return;
        onExportMidi();
      },
    },
    { label: "Export Stems", action: onExportStems },
    { separator: true },
    { label: "Close Project", action: onClose },
  ];

  return (
    <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
      {items.map((item, i) =>
        "separator" in item ? (
          <div key={`sep-${i}`} className="border-t border-gray-200 my-1" />
        ) : (
          <button
            key={item.label}
            onClick={() => {
              if (item.disabled) return;
              item.action();
              onSelect();
            }}
            disabled={item.disabled}
            className={
              "flex justify-between w-full px-4 py-2 text-sm focus:outline-none " +
              (item.disabled
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100")
            }
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

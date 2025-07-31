// frontend/src/components/workspace/EditMenu.tsx
import React from "react";

interface EditMenuProps {
  onSelect: () => void;   // close dropdown
  onUndo: () => void;
  onRedo: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
}

const EditMenu: React.FC<EditMenuProps> = ({
  onSelect,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onDelete,
  onSelectAll,
}) => {
  const items = [
    { label: "Undo",        shortcut: "Ctrl+Z",  action: onUndo },
    { label: "Redo",        shortcut: "Ctrl+Y",  action: onRedo },
    { separator: true },
    { label: "Cut",         shortcut: "Ctrl+X",  action: onCut },
    { label: "Copy",        shortcut: "Ctrl+C",  action: onCopy },
    { label: "Paste",       shortcut: "Ctrl+V",  action: onPaste },
    { label: "Delete",                       action: onDelete },
    { separator: true },
    { label: "Select All",  shortcut: "Ctrl+A",  action: onSelectAll },
  ] as const;

  return (
    <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
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
            className="flex justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
};

export default EditMenu;

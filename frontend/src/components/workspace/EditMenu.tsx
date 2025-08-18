import React from "react";

type Item =
  | { separator: true }
  | { label: string; action: () => void; shortcut?: string };

type Props = {
  onUndo: () => void;
  onRedo: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
};

const EditMenu: React.FC<Props> = ({
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onDelete,
  onSelectAll,
}) => {
  const items: Item[] = [
    { label: "Undo", action: onUndo, shortcut: "Ctrl+Z" },
    { label: "Redo", action: onRedo, shortcut: "Ctrl+Y" },
    { separator: true },
    { label: "Cut", action: onCut, shortcut: "Ctrl+X" },
    { label: "Copy", action: onCopy, shortcut: "Ctrl+C" },
    { label: "Paste", action: onPaste, shortcut: "Ctrl+V" },
    { label: "Delete", action: onDelete },
    { separator: true },
    { label: "Select All", action: onSelectAll, shortcut: "Ctrl+A" },
  ];

  return (
    <div className="rounded-md border border-gray-200 bg-white shadow">
      {items.map((item, i) =>
        "separator" in item ? (
          <div key={`sep-${i}`} className="my-1 border-t" />
        ) : (
          <button
            key={item.label}
            onClick={item.action}
            className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-gray-50"
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

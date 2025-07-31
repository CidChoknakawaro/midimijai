// frontend/src/components/workspace/MIDIToolsMenu.tsx
import React from "react";

interface MIDIToolsMenuProps {
  onSelect: () => void;
  onTranspose: () => void;
  onVelocity: () => void;
  onNoteLength: () => void;
  onHumanize: () => void;
  onArpeggiate: () => void;
  onStrum: () => void;
  onLegato: () => void;
}

const MIDIToolsMenu: React.FC<MIDIToolsMenuProps> = ({
  onSelect,
  onTranspose,
  onVelocity,
  onNoteLength,
  onHumanize,
  onArpeggiate,
  onStrum,
  onLegato,
}) => {
  const items = [
    { label: "Transpose",          action: onTranspose },
    { label: "Velocity Control",   action: onVelocity },
    { label: "Note Length Adjust", action: onNoteLength },
    { separator: true },
    { label: "Humanization",       action: onHumanize },
    { label: "Arpeggiator",        action: onArpeggiate },
    { label: "Strumming Effect",   action: onStrum },
    { label: "Legato/Portamento",  action: onLegato },
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
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
};

export default MIDIToolsMenu;

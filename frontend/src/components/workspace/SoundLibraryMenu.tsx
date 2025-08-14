// frontend/src/components/workspace/SoundLibraryMenu.tsx
import React from "react";

interface SoundLibraryMenuProps {
  onSelect: () => void;      // close dropdown
  onUploadSound: () => void; // open modal
}

const SoundLibraryMenu: React.FC<SoundLibraryMenuProps> = ({
  onSelect,
  onUploadSound,
}) => {
  const items = [
    { label: "Import sound…", action: onUploadSound },
  ] as const;

  return (
    <div className="mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
      {items.map((item) => (
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
      ))}
    </div>
  );
};

export default SoundLibraryMenu;

import React from "react";

interface SettingsMenuProps {
  onSelect: () => void;

  // Callbacks provided by the navbar / page
  onKeyScaleLock?: () => void;
  onAudioEngine?: () => void;
  onMidiInput?: () => void;
  onShortcuts?: () => void;
  onGridSettings?: () => void; // you said “Return to Start” shouldn’t be here, so we keep only grid, etc.
  onLatency?: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  onSelect,
  onKeyScaleLock,
  onAudioEngine,
  onMidiInput,
  onShortcuts,
  onGridSettings,
  onLatency,
}) => {
  const items: { label: string; onClick?: () => void; separator?: boolean }[] = [
    { label: "Key/Scale Lock", onClick: onKeyScaleLock },
    { label: "Audio Engine", onClick: onAudioEngine },
    { label: "MIDI Input", onClick: onMidiInput },
    { label: "Shortcuts", onClick: onShortcuts },
    { label: "Grid Settings", onClick: onGridSettings },
    { label: "Latency", onClick: onLatency },
  ];

  return (
    <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
      {items.map((item) =>
        item.separator ? (
          <div key={item.label} className="border-t border-gray-200 my-1" />
        ) : (
          <button
            key={item.label}
            onClick={() => {
              item.onClick?.();
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

export default SettingsMenu;

// frontend/src/components/workspace/SettingsMenu.tsx
import React from "react";

interface SettingsMenuProps {
  onSelect: () => void;
  onKeyScaleLock: () => void;
  onAudioEngine: () => void;
  onMidiInput: () => void;
  onShortcuts: () => void;
  onGridSettings: () => void;
  onLatency: () => void;
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
  const items = [
    { label: "Key / Scale Lock…", action: onKeyScaleLock },
    { label: "Audio Engine…",     action: onAudioEngine },
    { label: "MIDI Input…",       action: onMidiInput },
    { separator: true },
    { label: "Editor Shortcuts",  action: onShortcuts },
    { label: "Grid / Snap",       action: onGridSettings },
    { label: "Latency / Buffer",  action: onLatency },
  ] as const;

  return (
    <div className="mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
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

export default SettingsMenu;

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
    { label: "Key/Scale Lock",          action: onKeyScaleLock },
    { separator: true },
    { label: "Audio Engine Settings",   action: onAudioEngine },
    { label: "MIDI Input Settings",     action: onMidiInput },
    { label: "Keyboard Shortcuts",      action: onShortcuts },
    { label: "Grid Settings",           action: onGridSettings },
    { label: "MIDI Latency Compensation", action: onLatency },
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

export default SettingsMenu;

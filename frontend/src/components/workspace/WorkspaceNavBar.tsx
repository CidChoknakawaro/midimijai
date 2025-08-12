import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

import FileMenu from "./FileMenu";
import EditMenu from "./EditMenu";
import SoundLibraryModal from "./SoundLibraryModal";
import SettingsMenu from "./SettingsMenu";
import MIDIToolsMenu from "./MIDIToolsMenu";
import { publish } from "./midi-editor/core/editorBus";

const TABS = ["File", "Edit", "Sound Library", "Settings", "MIDI Tools"] as const;
type Tab = typeof TABS[number];

interface WorkspaceNavBarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onImportMidi: (file: File) => void;
  onExportMidi: () => void;
  onExportStems: () => void;
  onClose: () => void;
}

const WorkspaceNavBar: React.FC<WorkspaceNavBarProps> = ({
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onImportMidi,
  onExportMidi,
  onExportStems,
  onClose,
}) => {
  const [openDropdown, setOpenDropdown] = useState<Tab | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const toggle = (tab: Tab) => {
    if (tab === "Sound Library") {
      setLibraryOpen((v) => !v);
      return;
    }
    setOpenDropdown((prev) => (prev === tab ? null : tab));
  };

  return (
    <div ref={ref} className="relative bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center space-x-4">
          <button className="p-1 hover:bg-gray-100 rounded" onClick={() => window.history.back()}>
            <ChevronLeft size={20} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded" onClick={() => window.history.forward()}>
            <ChevronRight size={20} />
          </button>

          <nav className="flex space-x-6 ml-4">
            {TABS.map((tab) => (
              <div key={tab} className="relative">
                <button
                  onClick={() => toggle(tab)}
                  className={`pb-2 text-sm ${
                    openDropdown === tab
                      ? "border-b-2 border-teal-500 font-medium"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {tab}
                </button>

                {openDropdown === "File" && tab === "File" && (
                  <FileMenu
                    onSelect={() => setOpenDropdown(null)}
                    onNew={onNew}
                    onOpen={onOpen}
                    onSave={onSave}
                    onSaveAs={onSaveAs}
                    onImportMidi={onImportMidi}
                    onExportMidi={onExportMidi}
                    onExportStems={onExportStems}
                    onClose={onClose}
                  />
                )}

                {openDropdown === "Edit" && tab === "Edit" && (
                  <EditMenu
                    onSelect={() => setOpenDropdown(null)}
                    onUndo={() => publish({ type: "UNDO" })}
                    onRedo={() => publish({ type: "REDO" })}
                    onCut={() => publish({ type: "CUT" })}
                    onCopy={() => publish({ type: "COPY" })}
                    onPaste={() => publish({ type: "PASTE" })}
                    onDelete={() => publish({ type: "DELETE" })}
                    onSelectAll={() => publish({ type: "SELECT_ALL" })}
                  />
                )}

                {openDropdown === "Settings" && tab === "Settings" && (
                  <SettingsMenu
                    onSelect={() => setOpenDropdown(null)}
                    onKeyScaleLock={() => publish({ type: "OPEN_GRID_SETTINGS" })}
                    onAudioEngine={() => publish({ type: "OPEN_AUDIO_ENGINE" })}
                    onMidiInput={() => publish({ type: "OPEN_MIDI_INPUT" })}
                    onShortcuts={() => publish({ type: "OPEN_SHORTCUTS" })}
                    onGridSettings={() => publish({ type: "TOGGLE_SNAP" })}
                    onLatency={() => publish({ type: "OPEN_LATENCY_SETTINGS" })}
                  />
                )}

                {openDropdown === "MIDI Tools" && tab === "MIDI Tools" && (
                  <MIDIToolsMenu
                    onSelect={() => setOpenDropdown(null)}
                    onTranspose={() => publish({ type: "TRANSPOSE" })}
                    onVelocity={() => publish({ type: "VELOCITY" })}
                    onNoteLength={() => publish({ type: "NOTE_LENGTH" })}
                    onHumanize={() => publish({ type: "HUMANIZE" })}
                    onArpeggiate={() => publish({ type: "ARPEGGIATE" })}
                    onStrum={() => publish({ type: "STRUM" })}
                    onLegato={() => publish({ type: "LEGATO" })}
                  />
                )}
              </div>
            ))}
          </nav>
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => setLibraryOpen(true)}>
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Sound Library Modal */}
      <SoundLibraryModal
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onImportSample={onImportMidi}
      />
    </div>
  );
};

export default WorkspaceNavBar;

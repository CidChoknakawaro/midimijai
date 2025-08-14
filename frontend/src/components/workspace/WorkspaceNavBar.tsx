import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

import FileMenu from "./FileMenu";
import EditMenu from "./EditMenu";
import SoundLibraryMenu from "./SoundLibraryMenu";
import SettingsMenu from "./SettingsMenu";
import MIDIToolsMenu from "./MIDIToolsMenu";
import SoundLibraryModal from "./SoundLibraryModal";
import { publish } from "./midi-editor/core/editorBus";

const TABS = ["File", "Edit", "Sound Library", "Settings", "MIDI Tools"] as const;
type Tab = typeof TABS[number];

type Props = {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onImportMidi: (file: File) => void;
  onExportMidi: () => void;
  onExportStems: () => void;
  onClose: () => void;
};

const WorkspaceNavBar: React.FC<Props> = ({
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

  // Close dropdowns on outside click
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
    setOpenDropdown((prev) => (prev === tab ? null : tab));
  };

  return (
    <div ref={ref} className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Top row */}
      <div className="flex items-center justify-between px-6 h-12">
        <div className="flex items-center gap-4">
          {/* Nav history */}
          <button className="p-1 hover:bg-gray-100 rounded" onClick={() => window.history.back()}>
            <ChevronLeft size={20} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded" onClick={() => window.history.forward()}>
            <ChevronRight size={20} />
          </button>

          {/* Tabs */}
          <nav className="flex gap-6 ml-4">
            {TABS.map((tab) => (
              <div key={tab} className="relative">
                <button
                  onClick={() => toggle(tab)}
                  className={`pb-[10px] text-sm ${
                    openDropdown === tab
                      ? "border-b-2 border-teal-500 font-medium"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {tab}
                </button>

                {/* File */}
                {openDropdown === "File" && tab === "File" && (
                  <div className="absolute left-0 top-full z-30">
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
                  </div>
                )}

                {/* Edit */}
                {openDropdown === "Edit" && tab === "Edit" && (
                  <div className="absolute left-0 top-full z-30">
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
                  </div>
                )}

                {/* Sound Library -> dropdown (opens modal on "Upload sound…") */}
                {openDropdown === "Sound Library" && tab === "Sound Library" && (
                  <div className="absolute left-0 top-full z-30">
                    <SoundLibraryMenu
                      onSelect={() => setOpenDropdown(null)}
                      onUploadSound={() => {
                        setOpenDropdown(null);
                        setLibraryOpen(true);
                      }}
                    />
                  </div>
                )}

                {/* Settings */}
                {openDropdown === "Settings" && tab === "Settings" && (
                  <div className="absolute left-0 top-full z-30">
                    <SettingsMenu
                      onSelect={() => setOpenDropdown(null)}
                      onKeyScaleLock={() => publish({ type: "OPEN_GRID_SETTINGS" })}
                      onAudioEngine={() => publish({ type: "OPEN_AUDIO_ENGINE" })}
                      onMidiInput={() => publish({ type: "OPEN_MIDI_INPUT" })}
                      onShortcuts={() => publish({ type: "OPEN_SHORTCUTS" })}
                      onGridSettings={() => publish({ type: "TOGGLE_SNAP" })}
                      onLatency={() => publish({ type: "OPEN_LATENCY_SETTINGS" })}
                    />
                  </div>
                )}

                {/* MIDI Tools */}
                {openDropdown === "MIDI Tools" && tab === "MIDI Tools" && (
                  <div className="absolute left-0 top-full z-30">
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
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Help placeholder */}
        <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => setLibraryOpen(true)}>
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Sound Library Modal (upload flow) */}
      <SoundLibraryModal
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onImportSample={onImportMidi}
      />
    </div>
  );
};

export default WorkspaceNavBar;

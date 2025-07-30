import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

import FileMenu from "./FileMenu";
import EditMenu from "./EditMenu";
import SoundLibraryModal from "./SoundLibraryModal";
import SettingsMenu from "./SettingsMenu";
import MIDIToolsMenu from "./MIDIToolsMenu";

const TABS = ["File", "Edit", "Sound Library", "Settings", "MIDI Tools"] as const;
type Tab = typeof TABS[number];

const WorkspaceNavBar: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<Tab | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close any open dropdown if you click outside
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
      {/* Top row */}
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center space-x-4">
          <button className="p-1 hover:bg-gray-100 rounded" onClick={() => {/* back */}}>
            <ChevronLeft size={20} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded" onClick={() => {/* forward */}}>
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

                {/* mount only the list under each tab */}
                {openDropdown === "File" && tab === "File" && (
                  <FileMenu onSelect={() => setOpenDropdown(null)} />
                )}
                {openDropdown === "Edit" && tab === "Edit" && (
                  <EditMenu onSelect={() => setOpenDropdown(null)} />
                )}
                {openDropdown === "Settings" && tab === "Settings" && (
                  <SettingsMenu onSelect={() => setOpenDropdown(null)} />
                )}
                {openDropdown === "MIDI Tools" && tab === "MIDI Tools" && (
                  <MIDIToolsMenu onSelect={() => setOpenDropdown(null)} />
                )}
              </div>
            ))}
          </nav>
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-full">
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Sound Library is a modal */}
      <SoundLibraryModal isOpen={libraryOpen} onClose={() => setLibraryOpen(false)} />
    </div>
  );
};

export default WorkspaceNavBar;

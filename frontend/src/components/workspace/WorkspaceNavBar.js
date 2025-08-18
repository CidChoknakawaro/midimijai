import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import FileMenu from "./FileMenu";
import EditMenu from "./EditMenu";
import SoundLibraryMenu from "./SoundLibraryMenu";
import SettingsMenu from "./SettingsMenu";
import MIDIToolsMenu from "./MIDIToolsMenu";
import SoundLibraryModal from "./SoundLibraryModal";
import { publish } from "./midi-editor/core/editorBus";
const TABS = ["File", "Edit", "Sound Library", "Settings", "MIDI Tools"];
const WorkspaceNavBar = ({ onNew, onOpen, onSave, onSaveAs, onImportMidi, onExportMidi, onExportStems, onClose, }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [libraryOpen, setLibraryOpen] = useState(false);
    const ref = useRef(null);
    // Close dropdowns on outside click
    useEffect(() => {
        const onClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);
    const toggle = (tab) => {
        setOpenDropdown((prev) => (prev === tab ? null : tab));
    };
    return (_jsxs("div", { ref: ref, className: "w-full rounded-lg px-4 py-2 flex items-center justify-between shadow-sm", style: {
            backgroundColor: "#E9DCC9",
            borderRadius: "10px",
            height: "40px"
        }, children: [_jsxs("div", { className: "flex items-center justify-between px-6 h-12", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { className: "p-1 hover:bg-gray-100 rounded", onClick: () => window.history.back(), children: _jsx(ChevronLeft, { size: 20 }) }), _jsx("button", { className: "p-1 hover:bg-gray-100 rounded", onClick: () => window.history.forward(), children: _jsx(ChevronRight, { size: 20 }) }), _jsx("nav", { className: "flex gap-6 ml-4", children: TABS.map((tab) => (_jsxs("div", { className: "relative", children: [_jsx("button", { onClick: () => toggle(tab), className: `pb-[10px] text-sm ${openDropdown === tab
                                                ? "border-b-2 border-teal-500 font-medium"
                                                : "text-gray-600 hover:text-black"}`, children: tab }), openDropdown === "File" && tab === "File" && (_jsx("div", { className: "absolute left-0 top-full z-30", children: _jsx(FileMenu, { onSelect: () => setOpenDropdown(null), onNew: onNew, onOpen: onOpen, onSave: onSave, onSaveAs: onSaveAs, 
                                                // Import MIDI -> publish to editor
                                                onImportMidi: (file) => {
                                                    publish({ type: "IMPORT_MIDI_FILE", file });
                                                    // still bubble if caller cares
                                                    onImportMidi?.(file);
                                                }, 
                                                // Export MIDI -> publish to editor
                                                onExportMidi: () => {
                                                    publish({ type: "EXPORT_MIDI" });
                                                    onExportMidi?.();
                                                }, onExportStems: onExportStems, onClose: onClose }) })), openDropdown === "Edit" && tab === "Edit" && (_jsx("div", { className: "absolute left-0 top-full z-30", children: _jsx(EditMenu, { onUndo: () => publish({ type: "UNDO" }), onRedo: () => publish({ type: "REDO" }), onCut: () => publish({ type: "CUT" }), onCopy: () => publish({ type: "COPY" }), onPaste: () => publish({ type: "PASTE" }), onDelete: () => publish({ type: "DELETE" }), onSelectAll: () => publish({ type: "SELECT_ALL" }) }) })), openDropdown === "Sound Library" && tab === "Sound Library" && (_jsx("div", { className: "absolute left-0 top-full z-30", children: _jsx(SoundLibraryMenu, { onSelect: () => setOpenDropdown(null), onUploadSound: () => {
                                                    setOpenDropdown(null);
                                                    setLibraryOpen(true);
                                                } }) })), openDropdown === "Settings" && tab === "Settings" && (_jsx("div", { className: "absolute left-0 top-full z-30", children: _jsx(SettingsMenu, { onSelect: () => setOpenDropdown(null), onKeyScaleLock: () => publish({ type: "OPEN_GRID_SETTINGS" }), onAudioEngine: () => publish({ type: "OPEN_AUDIO_ENGINE" }), onMidiInput: () => publish({ type: "OPEN_MIDI_INPUT" }), onShortcuts: () => publish({ type: "OPEN_SHORTCUTS" }), onGridSettings: () => publish({ type: "TOGGLE_SNAP" }), onLatency: () => publish({ type: "OPEN_LATENCY_SETTINGS" }) }) })), openDropdown === "MIDI Tools" && tab === "MIDI Tools" && (_jsx("div", { className: "absolute left-0 top-full z-30", children: _jsx(MIDIToolsMenu, { onSelect: () => setOpenDropdown(null), onTranspose: () => publish({ type: "TRANSPOSE" }), onVelocity: () => publish({ type: "VELOCITY" }), onNoteLength: () => publish({ type: "NOTE_LENGTH" }), onHumanize: () => publish({ type: "HUMANIZE" }), onArpeggiate: () => publish({ type: "ARPEGGIATE" }), onStrum: () => publish({ type: "STRUM" }), onLegato: () => publish({ type: "LEGATO" }) }) }))] }, tab))) })] }), _jsx("button", { className: "p-2 hover:bg-gray-100 rounded-full", onClick: () => setLibraryOpen(true), children: _jsx(HelpCircle, { size: 20 }) })] }), _jsx(SoundLibraryModal, { isOpen: libraryOpen, onClose: () => setLibraryOpen(false) })] }));
};
export default WorkspaceNavBar;

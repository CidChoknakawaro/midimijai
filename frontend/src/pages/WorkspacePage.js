import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import WorkspaceNavBar from "../components/workspace/WorkspaceNavBar";
import AIDock from "../components/workspace/AIDock";
import MidiEditorCore from "../components/workspace/midi-editor/core/MidiEditorCore";
import { publish } from "../components/workspace/midi-editor/core/editorBus";
const PAGE_BG = "#fbf5ee";
const BEIGE = "#e9dcc9";
export default function WorkspacePage() {
    const editorRef = useRef(null);
    const [projectId] = useState(1);
    const [bpm, setBpm] = useState(120);
    const [tracks, setTracks] = useState([
        { id: "t1", name: "Track 1", instrument: "Piano", notes: [] },
    ]);
    return (_jsxs("div", { className: "min-h-screen flex flex-col", style: { background: PAGE_BG }, children: [_jsx(WorkspaceNavBar, { onNew: () => { }, onOpen: () => { }, onSave: () => { }, onSaveAs: () => { }, onImportMidi: () => { }, onExportMidi: () => publish({ type: "EXPORT_MIDI" }), onExportStems: () => { }, onClose: () => { } }), _jsx("div", { className: "flex-1 px-4 sm:px-6 py-4", children: _jsxs("div", { className: "\r\n            relative grid grid-cols-1 lg:grid-cols-[1fr_360px]\r\n            gap-4 lg:gap-6 rounded-[28px]\r\n            shadow-[0_40px_80px_-28px_rgba(0,0,0,0.35)]\r\n            border border-black/10\r\n            p-3 sm:p-4 lg:p-5\r\n          ", style: {
                        background: BEIGE,
                        height: "calc(100vh - 100px)",
                    }, children: [_jsx("div", { className: "rounded-2xl bg-white overflow-hidden border border-black/10", children: _jsx(MidiEditorCore, { ref: editorRef, projectId: projectId, bpm: bpm, initialTracks: tracks, onChange: (nextBpm, nextTracks) => {
                                    setBpm(nextBpm);
                                    setTracks(nextTracks);
                                }, showTransport: true }) }), _jsx("div", { className: "lg:block min-h-0", children: _jsx(AIDock, {}) })] }) })] }));
}

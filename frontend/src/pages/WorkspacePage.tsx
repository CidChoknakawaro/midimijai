import React from "react";
import WorkspaceNavbar from "../components/workspace/WorkspaceNavBar";
import AIGenerate from "../components/workspace/AIGenerate";
import AIModify from "../components/workspace/AIModify";
import AIStyleTransfer from "../components/workspace/AIStyleTransfer";
import MidiEditorCore from "../components/workspace/midi-editor/core/MidiEditorCore"; // your full MIDI editor

const WorkspacePage: React.FC = () => {
  return (
    <div
      className="workspace-page"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {/* Top Menu Bar */}
      <WorkspaceNavbar />

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Sidebar: AI Tools */}
        <div
          style={{
            width: "300px",
            padding: "1rem",
            borderRight: "1px solid #ccc",
            overflowY: "auto",
          }}
        >
          <AIGenerate />
          <AIModify />
          <AIStyleTransfer />
        </div>

        {/* Right Side: Full MIDI Editor */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <MidiEditorCore />
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;

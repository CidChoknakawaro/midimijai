import React, { useState } from "react";
import TrackDashboard from "../components/TrackDashboard/TrackDashboard";
import TrackEditor from "../components/TrackEditor/TrackEditor";
import GlobalTransportBar from "../components/TransportBar/GlobalTransportBar";
import { TransportProvider } from "../core/TransportContext";

type Track = {
  id: string;
  name: string;
  notes: any[];
  instrument: string;
  customSoundUrl?: string;
};

const MidiEditorCore: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  const addNewTrack = () => {
    const id = Date.now().toString();
    setTracks((prev) => [
      ...prev,
      {
        id,
        name: `Track ${prev.length + 1}`,
        notes: [],
        instrument: "Piano",
      },
    ]);
  };

  const updateTrack = (id: string, updates: Partial<Track>) => {
    setTracks((prev) =>
      prev.map((track) => (track.id === id ? { ...track, ...updates } : track))
    );
  };

  const activeTrack = tracks.find((t) => t.id === activeTrackId);

  return (
    <TransportProvider>
      <div
        className="w-full"
        style={{
          height: "660px", // increased to show ~3 tracks
          display: "flex",
          flexDirection: "column",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #ccc",
        }}
      >
        {/* MIDI Editor Box */}
        <div
          style={{
            height: "600px", // expanded
            overflowY: "auto", // scrollable if too many tracks
          }}
        >
          {activeTrack ? (
            <TrackEditor
              track={activeTrack}
              updateTrack={(updates) => updateTrack(activeTrack.id, updates)}
              goBack={() => setActiveTrackId(null)}
            />
          ) : (
            <TrackDashboard
              tracks={tracks}
              onEditTrack={(id) => setActiveTrackId(id)}
              onAddTrack={addNewTrack}
              updateTrack={updateTrack}
            />
          )}
        </div>

        {/* Global Transport Bar */}
        <div
          style={{
            height: "60px",
            borderTop: "1px solid #ccc",
            padding: "8px 16px",
            background: "#f8f8f8",
          }}
        >
          <GlobalTransportBar />
        </div>
      </div>
    </TransportProvider>
  );
};

export default MidiEditorCore;

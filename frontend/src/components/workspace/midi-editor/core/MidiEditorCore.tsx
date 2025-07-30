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
      { id, name: `Track ${prev.length + 1}`, notes: [], instrument: "Piano" },
    ]);
  };
  const updateTrack = (id: string, updates: Partial<Track>) =>
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

  const activeTrack = tracks.find((t) => t.id === activeTrackId);

  return (
    <TransportProvider>
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {activeTrack ? (
            <TrackEditor
              track={activeTrack}
              updateTrack={(u) => updateTrack(activeTrack.id, u)}
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
        <div className="px-6 py-3 border-t bg-gray-50">
          <GlobalTransportBar />
        </div>
      </div>
    </TransportProvider>
  );
};

export default MidiEditorCore;

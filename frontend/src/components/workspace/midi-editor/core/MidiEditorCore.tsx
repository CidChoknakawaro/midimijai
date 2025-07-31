// frontend/src/components/workspace/midi-editor/core/MidiEditorCore.tsx

import React, { useState, useEffect } from "react";
import TrackDashboard from "../components/TrackDashboard/TrackDashboard";
import TrackEditor    from "../components/TrackEditor/TrackEditor";
import GlobalTransportBar from "../components/TransportBar/GlobalTransportBar";
import { TransportProvider } from "../core/TransportContext";

export interface Track {
  id: string;
  name: string;
  notes: any[];
  instrument: string;
  customSoundUrl?: string;
}

interface MidiEditorCoreProps {
  projectId: number;
  bpm: number;
  initialTracks: Track[];
  /** fire when user edits bpm or tracks */
  onChange: (bpm: number, tracks: Track[]) => void;
  onSave?: () => void;
}

const MidiEditorCore: React.FC<MidiEditorCoreProps> = ({
  projectId,
  bpm: initialBpm,
  initialTracks = [],
  onChange,
  onSave,
}) => {
  // local state
  const [bpm, setBpm]       = useState(initialBpm);
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  // 1) reset WHEN projectId truly changes:
  useEffect(() => {
    setBpm(initialBpm);
    setTracks(initialTracks);
    setActiveTrackId(null);
  }, [projectId]);

  // 2) handlers now manually call onChange:

  const addNewTrack = () => {
    const id = Date.now().toString();
    const newTrack: Track = {
      id,
      name: `Track ${tracks.length + 1}`,
      notes: [],
      instrument: "Piano",
    };
    const updated = [...tracks, newTrack];
    setTracks(updated);
    onChange(bpm, updated);
  };

  const updateTrack = (id: string, updates: Partial<Track>) => {
    const updated = tracks.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    setTracks(updated);
    onChange(bpm, updated);
  };

  const changeBpm = (newBpm: number) => {
    setBpm(newBpm);
    onChange(newBpm, tracks);
  };

  // locate which track is open
  const activeTrack = tracks.find((t) => t.id === activeTrackId) || null;

  return (
    <TransportProvider bpm={bpm}>
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
          <GlobalTransportBar
            bpm={bpm}
            setBpm={changeBpm}
            onSave={onSave}
          />
        </div>
      </div>
    </TransportProvider>
  );
};

export default MidiEditorCore;

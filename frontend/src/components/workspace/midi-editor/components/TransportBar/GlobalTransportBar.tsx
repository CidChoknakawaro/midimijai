import React, { useContext } from "react";
import { TransportContext } from "../../core/TransportContext";
import "./GlobalTransportBar.css";

export default function GlobalTransportBar() {
  const {
    bpm, setBpm,
    isPlaying, handlePlay, handlePause, returnToStart,
    zoom, setZoomLevel, handleZoomIn, handleZoomOut,
    snapToGrid, toggleSnap,
  } = useContext(TransportContext);

  return (
    <div className="transport-bar">
      {/* Return to start */}
      <button onClick={returnToStart} aria-label="Return to start" title="Return to start">
        <img src="/Return.png" alt="Return" width={20} height={20} />
      </button>

      {/* Play / Pause */}
      {isPlaying ? (
        <button onClick={handlePause} aria-label="Pause" title="Pause">
          <img src="/Pause.png" alt="Pause" width={20} height={20} />
        </button>
      ) : (
        <button onClick={handlePlay} aria-label="Play" title="Play">
          <img src="/Play.png" alt="Play" width={20} height={20} />
        </button>
      )}

      {/* BPM */}
      <span style={{ marginLeft: 12 }}>BPM</span>
      <input
        type="range"
        min={40}
        max={220}
        value={bpm}
        onChange={(e) => setBpm(parseInt(e.target.value))}
      />
      <span>{bpm}</span>

      {/* Zoom (global) */}
      <button onClick={handleZoomOut} aria-label="Zoom out" title="Zoom out">−</button>
      <span>Zoom</span>
      <select
        value={zoom}
        onChange={(e) => setZoomLevel(Number(e.target.value) as 1 | 2 | 4)}
        className="px-2 py-1 border rounded-md text-sm"
      >
        <option value={1}>1/4</option>
        <option value={2}>1/8</option>
        <option value={4}>1/16</option>
      </select>
      <button onClick={handleZoomIn} aria-label="Zoom in" title="Zoom in">＋</button>

      {/* Snap (global) */}
      <label style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 12 }}>
        <input type="checkbox" checked={snapToGrid} onChange={toggleSnap} />
        Snap
      </label>
    </div>
  );
}

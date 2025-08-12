import './GlobalTransportBar.css'

import React, { useContext } from "react";
import { TransportContext } from "../../core/TransportContext";

type Props = {
  bpm?: number;
  setBpm?: (n: number) => void;
  onSave?: () => void;
};

const GlobalTransportBar: React.FC<Props> = ({ bpm, setBpm, onSave }) => {
  const ctx = useContext(TransportContext);

  const effectiveBpm  = bpm    ?? ctx?.bpm ?? 120;
  const changeBpm     = setBpm ?? ctx?.setBpm ?? (() => {});
  const isPlaying     = ctx?.isPlaying;
  const play          = ctx?.handlePlay;
  const pause         = ctx?.handlePause;
  const toStart       = ctx?.returnToStart;
  const metronome     = ctx?.metronome;
  const toggleMetro   = ctx?.toggleMetronome;
  const zoomIn        = ctx?.handleZoomIn;
  const zoomOut       = ctx?.handleZoomOut;

  return (
    <div className="transport-bar">
      <button onClick={toStart}>⏮️</button>
      {isPlaying ? (
        <button onClick={pause}>⏸️</button>
      ) : (
        <button onClick={play}>▶️</button>
      )}
      <input
        type="range"
        min={40}
        max={240}
        value={effectiveBpm}
        onChange={(e) => changeBpm(parseInt(e.target.value, 10))}
      />
      <span>{effectiveBpm} BPM</span>
      <button onClick={toggleMetro}>{metronome ? "🎵 On" : "🎵 Off"}</button>
      <button onClick={zoomOut}>🔍−</button>
      <button onClick={zoomIn}>🔍＋</button>
      {onSave && <button onClick={onSave}>💾</button>}
    </div>
  );
};

export default GlobalTransportBar;
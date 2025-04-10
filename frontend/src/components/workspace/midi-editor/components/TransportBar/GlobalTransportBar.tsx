import React, { useContext } from 'react';
import { TransportContext } from '../../core/TransportContext';
import './GlobalTransportBar.css'

const GlobalTransportBar: React.FC = () => {
  const {
    bpm,
    setBpm,
    isPlaying,
    handlePlay,
    handlePause,
    returnToStart,
    toggleMetronome,
    metronome,
    handleZoomIn,
    handleZoomOut,
  } = useContext(TransportContext);

  return (
    <div style={{
      border: '2px solid black',
      padding: 10,
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10
    }}>
      <span>–</span>
      <input type="range" min={30} max={300} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
      <span>+</span>

      <button onClick={toggleMetronome}>
        {metronome ? '🎵 On' : '🎵 Off'}
      </button>
      <button onClick={handlePause}>⏸</button>
      <button onClick={handlePlay}>▶</button>
      <button onClick={returnToStart}>⏮</button>

      <span>🔍–</span>
      <button onClick={handleZoomOut}>-</button>
      <button onClick={handleZoomIn}>+</button>
      <span>🔍+</span>
    </div>
  );
};

export default GlobalTransportBar;

import React from 'react';

const TRACK_COUNT = 4;
const BAR_COUNT = 71;

const MIDIGrid: React.FC = () => {
  return (
    <div style={{ overflow: 'auto' }}>
      {Array.from({ length: TRACK_COUNT }).map((_, row) => (
        <div key={row} style={{ display: 'flex', height: '40px' }}>
          {Array.from({ length: BAR_COUNT }).map((_, col) => (
            <div
              key={col}
              style={{
                width: '40px',
                height: '100%',
                border: '1px solid #eee',
              }}
            >
              {/* future: note block here */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MIDIGrid;
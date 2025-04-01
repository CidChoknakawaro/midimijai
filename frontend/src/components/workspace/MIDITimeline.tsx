import React from 'react';

const MIDITimeline: React.FC = () => {
  const bars = Array.from({ length: 71 }, (_, i) => i); // 0 to 70

  return (
    <div style={{ display: 'flex', borderBottom: '1px solid black' }}>
      {bars.map((num) => (
        <div
          key={num}
          style={{
            width: '40px',
            textAlign: 'center',
            fontSize: '12px',
            borderRight: '1px solid #ccc',
          }}
        >
          {num}
        </div>
      ))}
    </div>
  );
};

export default MIDITimeline;
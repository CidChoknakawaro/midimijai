import React from 'react';
import Dropdown from '../shared/Dropdown';

const MIDIToolsMenu: React.FC = () => {
  const options = [
    'Transpose',
    'Velocity Control',
    'Note Length Adjust',
    'Humanization',
    'Arpeggiator',
    'Strumming Effect',
    'Legato/Portamento',
  ];

  return <Dropdown label="MIDI Tools" options={options} />;
};

export default MIDIToolsMenu;
import React from 'react';
import Dropdown from '../shared/Dropdown';

const SettingsMenu: React.FC = () => {
  const options = [
    'Key/Scale Lock',
    'Audio Engine Settings',
    'MIDI Input Settings',
    'Keyboard Shortcuts',
    'Grid Settings',
    'MIDI Latency Compensation',
  ];

  return <Dropdown label="Settings" options={options} />;
};

export default SettingsMenu;
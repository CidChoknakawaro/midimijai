import React from 'react';
import Dropdown from '../shared/Dropdown';

const FileMenu: React.FC = () => {
  const options = [
    'New Project',
    'Open Project',
    'Save',
    'Save As',
    'Import MIDI',
    'Export MIDI',
    'Export Stems',
    'Close Project',
  ];

  return <Dropdown label="File" options={options} />;
};

export default FileMenu;
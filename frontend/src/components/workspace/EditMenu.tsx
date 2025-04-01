import React from 'react';
import Dropdown from '../shared/Dropdown';

const EditMenu: React.FC = () => {
  const options = [
    'Cut',
    'Copy',
    'Paste',
    'Delete',
    'Select All',
    'Quantize',
    'Find & Replace Notes',
  ];

  return <Dropdown label="Edit" options={options} />;
};

export default EditMenu;
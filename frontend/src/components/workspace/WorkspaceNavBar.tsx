import React, { useState } from 'react';
import FileMenu from './FileMenu';
import EditMenu from './EditMenu';
import SettingsMenu from './SettingsMenu';
import MIDIToolsMenu from './MIDIToolsMenu';
import SoundLibraryModal from './SoundLibraryModal';

const WorkspaceNavBar: React.FC = () => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  return (
    <>
      <nav className="workspace-navbar" style={{ display: 'flex', gap: '1rem' }}>
        <FileMenu />
        <EditMenu />
        <button onClick={() => setIsLibraryOpen(true)}>Sound Library</button>
        <SettingsMenu />
        <MIDIToolsMenu />
      </nav>
      <SoundLibraryModal isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
    </>
  );
};

export default WorkspaceNavBar;
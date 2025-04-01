import React from 'react';
import WorkspaceNavbar from '../components/workspace/WorkspaceNavBar';
import AIGenerate from '../components/workspace/AIGenerate';
import AIModify from '../components/workspace/AIModify';
import AIStyleTransfer from '../components/workspace/AIStyleTransfer';
import MIDITimeline from '../components/workspace/MIDITimeline';
import Tracklist from '../components/workspace/Tracklist';
import MIDIControls from '../components/workspace/MIDIControls';
import MIDIGrid from '../components/workspace/MIDIGrid';
import TransportControls from '../components/workspace/TransportControls';

const WorkspacePage: React.FC = () => {
  return (
    <div className="workspace-page">
      <WorkspaceNavbar />
      <div className="workspace-content">
        <div className="workspace-main">
          <div className="ai-panel">
            <AIGenerate />
            <AIModify />
            <AIStyleTransfer />
          </div>
          <div className="midi-panel">
            <MIDITimeline />
            <Tracklist />
            <MIDIGrid />
            <MIDIControls />
            <TransportControls />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;

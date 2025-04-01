import React from 'react';

const AIGenerate: React.FC = () => {
  return (
    <div className="ai-generate">
      <h3>AI Generate</h3>
      <input type="text" placeholder="Generate Chord Progression..." />
      <div>
        <button>Suggestions</button>
        <button>Generate</button>
      </div>
    </div>
  );
};

export default AIGenerate;
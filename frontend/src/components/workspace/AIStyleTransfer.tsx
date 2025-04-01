import React from 'react';

const AIStyleTransfer: React.FC = () => {
  return (
    <div className="ai-style">
      <h3>AI Style</h3>
      <input type="text" placeholder="Change the style to Lo-Fi..." />
      <div>
        <button>Suggestions</button>
        <button>Style</button>
      </div>
    </div>
  );
};

export default AIStyleTransfer;
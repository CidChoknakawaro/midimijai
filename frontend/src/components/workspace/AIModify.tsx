import React from 'react';

const AIModify: React.FC = () => {
  return (
    <div className="ai-modify">
      <h3>AI Modify</h3>
      <input type="text" placeholder="Make this jazzier..." />
      <div>
        <button>Suggestions</button>
        <button>Modify</button>
      </div>
    </div>
  );
};

export default AIModify;
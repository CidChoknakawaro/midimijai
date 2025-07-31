// frontend/src/components/workspace/AIStyleTransfer.tsx
import React, { useState } from "react";
import { postAIGenerate } from "../../services/aiService";

export default function AIStyleTransfer() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleSuggestions = async () => {
    setLoading(true);
    try {
      const resp = await postAIGenerate({ prompt, mode: "style-suggest" });
      setOutput(resp.suggestions.join("\n"));
    } finally {
      setLoading(false);
    }
  };

  const handleStyle = async () => {
    setLoading(true);
    try {
      const resp = await postAIGenerate({ prompt, mode: "style" });
      setOutput("Styled MIDI – open track to view.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-lg font-semibold">AI Style</h4>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Change style to Lo-Fi…"
        className="w-full px-3 py-2 border rounded"
      />
      <div className="flex space-x-2">
        <button
          onClick={handleSuggestions}
          disabled={loading}
          className="flex-1 px-3 py-1 bg-orange-400 text-white rounded"
        >
          Suggestions
        </button>
        <button
          onClick={handleStyle}
          disabled={loading}
          className="flex-1 px-3 py-1 bg-orange-400 text-white rounded"
        >
          Style
        </button>
      </div>
      <textarea
        readOnly
        value={output}
        className="w-full h-24 p-2 border rounded resize-none"
      />
    </div>
  );
}

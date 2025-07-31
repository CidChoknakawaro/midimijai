// frontend/src/components/workspace/AIGenerate.tsx
import React, { useState } from "react";
import { postAIGenerate } from "../../services/aiService";

export default function AIGenerate() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleSuggestions = async () => {
    setLoading(true);
    try {
      const resp = await postAIGenerate({ prompt, mode: "suggest" });
      setOutput(resp.suggestions.join("\n"));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const resp = await postAIGenerate({ prompt, mode: "generate" });
      // you’ll likely call onChange / addTrack with resp.midi
      setOutput("Generated MIDI – open track to view.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-lg font-semibold">AI Generate</h4>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Generate chord progression…"
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
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 px-3 py-1 bg-orange-400 text-white rounded"
        >
          Generate
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

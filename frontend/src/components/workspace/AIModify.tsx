import React, { useState } from "react";
import { postAIGenerate } from "../../services/aiService";

export default function AIModify() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleSuggestions = async () => {
    setLoading(true);
    try {
      const resp = await postAIGenerate({ prompt, mode: "modify-suggest" });
      setOutput((resp.suggestions || []).join("\n"));
    } finally {
      setLoading(false);
    }
  };

  const handleModify = async () => {
    setLoading(true);
    try {
      const resp = await postAIGenerate({ prompt, mode: "modify" });
      // For now, backend returns {data} shaped like project
      setOutput(resp.data ? "Modified data generated" : "No data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-lg font-semibold">AI Modify</h4>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Make this jazzier…"
        className="w-full px-3 py-2 border rounded"
      />
      <div className="flex space-x-2">
        <button onClick={handleSuggestions} disabled={loading} className="flex-1 px-3 py-1 bg-orange-400 text-white rounded">
          Suggestions
        </button>
        <button onClick={handleModify} disabled={loading} className="flex-1 px-3 py-1 bg-orange-400 text-white rounded">
          Modify
        </button>
      </div>
      <textarea readOnly value={output} className="w-full h-24 p-2 border rounded resize-none" />
    </div>
  );
}

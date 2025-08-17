import React, { useState } from "react";
import { postAIGenerate } from "../../services/aiService";

export default function AIGenerate() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string>("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setLog("Generating…");
    try {
      const resp = await postAIGenerate({
        prompt,
        mode: "generate",
        length_beats: 64,
      });
      if (resp?.data) {
        const count = resp.data?.tracks?.[0]?.notes?.length || 0;
        window.dispatchEvent(new CustomEvent("ai-generated", { detail: resp.data }));
        setLog(`OK: Inserted "${resp.data.tracks?.[0]?.name || "AI Track"}" with ${count} notes`);
      } else {
        setLog("No data returned.");
      }
    } catch (e: any) {
      setLog(`Error: ${e?.response?.data?.detail || e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggest = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setLog("Suggesting…");
    try {
      const resp = await postAIGenerate({ prompt, mode: "suggest" });
      const s = (resp.suggestions || []).join("\n");
      setLog(s || "No suggestions.");
    } catch (e: any) {
      setLog(`Error: ${e?.response?.data?.detail || e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-lg font-semibold">AI Generate</h4>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., 'lofi hiphop, warm Rhodes chords, mellow, slow'"
        className="w-full h-20 px-3 py-2 border rounded resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 px-3 py-1 bg-orange-500 text-white rounded"
        >
          Generate Track
        </button>
        <button
          onClick={handleSuggest}
          disabled={loading}
          className="px-3 py-1 bg-gray-800 text-white rounded"
        >
          Suggestions
        </button>
      </div>
      <textarea
        readOnly
        value={log}
        className="w-full h-24 p-2 border rounded resize-none"
      />
    </div>
  );
}

import React, { useState } from "react";
import AIGenerate from "./AIGenerate";
import AIModify from "./AIModify";
import AIStyleTransfer from "./AIStyleTransfer";

const TABS = ["Generate", "Modify", "Style"] as const;
type Tab = typeof TABS[number];

export default function AIToolsPanel() {
  const [tab, setTab] = useState<Tab>("Generate");

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded ${tab === t ? "bg-teal-500 text-white" : "bg-gray-100"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {tab === "Generate" && <AIGenerate />}
        {tab === "Modify" && <AIModify />}
        {tab === "Style" && <AIStyleTransfer />}
      </div>
    </div>
  );
}

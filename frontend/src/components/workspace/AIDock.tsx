import React, { useState } from "react";
import AIGenerate from "./AIGenerate";
import AIModify from "./AIModify";
import AIStyleTransfer from "./AIStyleTransfer";

type Tab = "Generate" | "Modify" | "Style";

export default function AIDock() {
  const [tab, setTab] = useState<Tab>("Generate");

  return (
    <aside className="w-full lg:w-96 border-l bg-white">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-semibold">AI Tools</h3>
        <div className="flex gap-2">
          {(["Generate", "Modify", "Style"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-2 py-1 text-xs rounded ${
                tab === t ? "bg-teal-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {tab === "Generate" && <AIGenerate />}
        {tab === "Modify" && <AIModify />}
        {tab === "Style" && <AIStyleTransfer />}
      </div>
    </aside>
  );
}

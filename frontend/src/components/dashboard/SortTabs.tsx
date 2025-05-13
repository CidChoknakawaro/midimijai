import React from "react";

export type SortKey = "created" | "custom" | "modified";

interface SortTabsProps {
  selected: SortKey;
  onSelect: (key: SortKey) => void;
}

const SortTabs: React.FC<SortTabsProps> = ({ selected, onSelect }) => (
  <div className="flex space-x-2">
    {(["created", "custom", "modified"] as SortKey[]).map((key) => (
      <button
        key={key}
        onClick={() => onSelect(key)}
        className={
          "px-3 py-1 rounded-full text-sm " +
          (selected === key
            ? "bg-gray-200 font-semibold"
            : "hover:bg-gray-100")
        }
      >
        {key.charAt(0).toUpperCase() + key.slice(1)}
      </button>
    ))}
  </div>
);

export default SortTabs;
